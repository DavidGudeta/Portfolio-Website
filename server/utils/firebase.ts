import { initializeApp, cert, ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import firebaseConfig from '../../firebase-applet-config.json' assert { type: 'json' };

// Note: In AI Studio, we typically don't have a service account key file.
// We'll try to initialize with the project ID if possible, or use the client SDK.
// For now, we'll assume we can initialize with the project ID.

let app;
try {
  // Prioritize explicit configuration from firebase-applet-config.json
  // This helps avoid "aud" claim mismatches when the token project differs from the ambient environment project
  console.log('Firebase: Initializing with explicit Project ID:', firebaseConfig.projectId);
  app = initializeApp({
    projectId: firebaseConfig.projectId,
  });
} catch (error) {
  // If already initialized (common in hot-reload or similar), or if the previous attempt failed
  console.log('Firebase: Explicit initialization failed or already exists, attempting to get existing app or default:', error);
  try {
    // Try to get default app
    app = initializeApp();
  } catch (e) {
    // If all else fails
    console.log('Firebase: Could not initialize app. Check configuration.');
    throw e;
  }
}

const dbId = firebaseConfig.firestoreDatabaseId || '(default)';
console.log('Firebase: Using Project ID:', firebaseConfig.projectId);
console.log('Firebase: Using Database ID:', dbId);
export const db = getFirestore(app, dbId);
export const auth = getAuth(app);
