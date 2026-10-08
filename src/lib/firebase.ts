import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export const auth = getAuth(app);

// Initial connection verification test
export async function verifyFirestoreConnection(): Promise<{ connected: boolean; message?: string }> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return { connected: true };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.includes('the client is offline')) {
      console.warn('Firestore offline check:', msg);
      return { connected: false, message: 'Client is offline' };
    }
    // Permissions or non-existent document is normal for a test probe
    return { connected: true };
  }
}

verifyFirestoreConnection().catch(() => {});
