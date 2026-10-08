import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase.ts';
import { getSupabaseClient, SUPABASE_PROJECT_URL } from './supabase.ts';
import { StoredScan, BattleRecord, UserSession } from '../types/analysis.ts';

const AUDIT_SCANS_COLLECTION = 'auditScans';
const BATTLES_COLLECTION = 'battleRecords';
const RESCUE_PROGRESS_COLLECTION = 'rescueProgress';
const USERS_COLLECTION = 'users';

const LOCAL_STORAGE_SCANS_KEY = 'roast_rescue_scans_v2';
const LOCAL_STORAGE_BATTLES_KEY = 'roast_rescue_battles_v2';

// 1. Audit Scans persistence
export async function saveScanToDatabase(scan: StoredScan, userId = 'anonymous'): Promise<boolean> {
  // Always update local cache first for instant UI response
  try {
    const localData = getLocalScans();
    const updated = [
      { ...scan, syncedToCloud: true },
      ...localData.filter((s) => s.id !== scan.id && s.username.toLowerCase() !== scan.username.toLowerCase()),
    ].slice(0, 40);
    localStorage.setItem(LOCAL_STORAGE_SCANS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Local cache error:', err);
  }

  // Attempt Supabase persistence
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase.from('audit_scans').upsert(
        {
          id: scan.id,
          username: scan.username,
          avatar_url: scan.avatarUrl || `https://github.com/${scan.username}.png`,
          score: scan.score,
          grade: scan.grade,
          headline_roast: scan.headlineRoast || '',
          scanned_at: scan.scannedAt || new Date().toISOString(),
          user_id: userId,
          is_public: true,
          notes: scan.notes || '',
          tags: scan.tags || [],
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      );
      if (!error) {
        console.log(`Saved scan for @${scan.username} to Supabase (${SUPABASE_PROJECT_URL})`);
      }
    } catch (sbErr) {
      console.warn('Supabase save error:', sbErr);
    }
  }

  // Persist to Cloud Firestore
  try {
    const docRef = doc(db, AUDIT_SCANS_COLLECTION, scan.id);
    await setDoc(
      docRef,
      {
        id: scan.id,
        username: scan.username,
        avatarUrl: scan.avatarUrl || `https://github.com/${scan.username}.png`,
        score: scan.score,
        grade: scan.grade,
        headlineRoast: scan.headlineRoast || '',
        scannedAt: scan.scannedAt || new Date().toISOString(),
        userId: userId,
        isPublic: true,
        notes: scan.notes || '',
        tags: scan.tags || [],
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    markLocalScanSynced(scan.id);
    return true;
  } catch (error) {
    console.error('Failed to save scan to Firestore:', error);
    return false;
  }
}

export async function fetchScansFromDatabase(limitCount = 30): Promise<StoredScan[]> {
  // First try Supabase if configured
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('audit_scans')
        .select('*')
        .order('scanned_at', { ascending: false })
        .limit(limitCount);

      if (!error && Array.isArray(data) && data.length > 0) {
        const mapped: StoredScan[] = data.map((d) => ({
          id: d.id,
          username: d.username,
          avatarUrl: d.avatar_url || `https://github.com/${d.username}.png`,
          score: Number(d.score) || 0,
          grade: d.grade || 'Needs Work',
          scannedAt: d.scanned_at || new Date().toISOString(),
          headlineRoast: d.headline_roast || undefined,
          notes: d.notes || '',
          tags: Array.isArray(d.tags) ? d.tags : [],
          syncedToCloud: true,
        }));
        try {
          localStorage.setItem(LOCAL_STORAGE_SCANS_KEY, JSON.stringify(mapped));
        } catch {
          // Ignore
        }
        return mapped;
      }
    } catch (sbErr) {
      console.warn('Supabase fetch error, continuing to Firestore:', sbErr);
    }
  }

  // Next query Cloud Firestore
  try {
    const colRef = collection(db, AUDIT_SCANS_COLLECTION);
    const q = query(colRef, orderBy('scannedAt', 'desc'), limit(limitCount));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const scans: StoredScan[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        scans.push({
          id: data.id || docSnap.id,
          username: data.username,
          avatarUrl: data.avatarUrl || `https://github.com/${data.username}.png`,
          score: Number(data.score) || 0,
          grade: data.grade || 'Needs Work',
          scannedAt: data.scannedAt || new Date().toISOString(),
          headlineRoast: data.headlineRoast || undefined,
          notes: data.notes || '',
          tags: Array.isArray(data.tags) ? data.tags : [],
          syncedToCloud: true,
        });
      });

      try {
        localStorage.setItem(LOCAL_STORAGE_SCANS_KEY, JSON.stringify(scans));
      } catch {
        // Ignore
      }
      return scans;
    }
  } catch (error) {
    console.warn('Firestore fetch query fallback to local storage:', error);
  }

  return getLocalScans();
}

export async function deleteScanFromDatabase(id: string): Promise<boolean> {
  // Update local storage
  try {
    const localData = getLocalScans().filter((s) => s.id !== id);
    localStorage.setItem(LOCAL_STORAGE_SCANS_KEY, JSON.stringify(localData));
  } catch {
    // Ignore
  }

  // Delete from Supabase
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('audit_scans').delete().eq('id', id);
    } catch (sbErr) {
      console.warn('Supabase delete error:', sbErr);
    }
  }

  // Delete from Firestore
  try {
    const docRef = doc(db, AUDIT_SCANS_COLLECTION, id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error deleting document from Firestore:', error);
    return false;
  }
}

export async function updateScanNotesAndTags(
  id: string,
  notes: string,
  tags: string[]
): Promise<boolean> {
  // Local cache update
  try {
    const localData = getLocalScans().map((s) => (s.id === id ? { ...s, notes, tags } : s));
    localStorage.setItem(LOCAL_STORAGE_SCANS_KEY, JSON.stringify(localData));
  } catch {
    // Ignore
  }

  // Update Supabase
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase
        .from('audit_scans')
        .update({ notes, tags, updated_at: new Date().toISOString() })
        .eq('id', id);
    } catch (sbErr) {
      console.warn('Supabase update error:', sbErr);
    }
  }

  // Update Firestore
  try {
    const docRef = doc(db, AUDIT_SCANS_COLLECTION, id);
    await setDoc(docRef, { notes, tags, updatedAt: serverTimestamp() }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error updating scan in Firestore:', error);
    return false;
  }
}

// 2. Roast Battles persistence
export async function saveBattleToDatabase(battle: BattleRecord): Promise<boolean> {
  try {
    const localBattles = getLocalBattles();
    localStorage.setItem(
      LOCAL_STORAGE_BATTLES_KEY,
      JSON.stringify([battle, ...localBattles.filter((b) => b.id !== battle.id)].slice(0, 20))
    );
  } catch {
    // Ignore
  }

  // Save to Supabase
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('battle_records').upsert({
        id: battle.id,
        user_a: battle.userA,
        user_b: battle.userB,
        score_a: battle.scoreA,
        score_b: battle.scoreB,
        winner: battle.winner,
        verdict: battle.verdict,
        created_at: battle.createdAt,
      });
    } catch (sbErr) {
      console.warn('Supabase battle save error:', sbErr);
    }
  }

  try {
    const docRef = doc(db, BATTLES_COLLECTION, battle.id);
    await setDoc(docRef, battle, { merge: true });
    return true;
  } catch (error) {
    console.error('Failed to save battle to Firestore:', error);
    return false;
  }
}

// 3. User profile persistence
export async function saveUserProfileToDatabase(user: UserSession): Promise<boolean> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('user_profiles').upsert({
        uid: user.username,
        username: user.username,
        name: user.name,
        email: user.email || '',
        avatar_url: user.avatarUrl,
        provider: user.provider || 'demo',
        last_login_at: new Date().toISOString(),
      });
    } catch (sbErr) {
      console.warn('Supabase user save error:', sbErr);
    }
  }

  try {
    const docRef = doc(db, USERS_COLLECTION, user.username.toLowerCase());
    await setDoc(
      docRef,
      {
        uid: user.username,
        username: user.username,
        name: user.name,
        email: user.email || '',
        avatarUrl: user.avatarUrl,
        provider: user.provider || 'demo',
        lastLoginAt: new Date().toISOString(),
      },
      { merge: true }
    );
    return true;
  } catch (err) {
    console.error('Failed to save user profile to Firestore:', err);
    return false;
  }
}

// 4. Rescue Progress persistence
export async function saveRescueProgressToDatabase(
  username: string,
  completedIds: string[],
  userId = 'anonymous'
): Promise<boolean> {
  const docId = `progress-${username.toLowerCase()}`;
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('rescue_progress').upsert({
        id: docId,
        username,
        user_id: userId,
        completed_item_ids: completedIds,
        updated_at: new Date().toISOString(),
      });
    } catch (sbErr) {
      console.warn('Supabase progress save error:', sbErr);
    }
  }

  try {
    const docRef = doc(db, RESCUE_PROGRESS_COLLECTION, docId);
    await setDoc(
      docRef,
      {
        id: docId,
        username,
        userId,
        completedItemIds: completedIds,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    return true;
  } catch (err) {
    console.error('Failed to save rescue progress to Firestore:', err);
    return false;
  }
}

// Local storage helper utilities
function getLocalScans(): StoredScan[] {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_SCANS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function markLocalScanSynced(id: string) {
  try {
    const local = getLocalScans().map((s) => (s.id === id ? { ...s, syncedToCloud: true } : s));
    localStorage.setItem(LOCAL_STORAGE_SCANS_KEY, JSON.stringify(local));
  } catch {
    // Ignore
  }
}

function getLocalBattles(): BattleRecord[] {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_BATTLES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}
