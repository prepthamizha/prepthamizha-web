// Firebase web app for project exammaster-50309 (the same project the Android app and
// the backend's firebase-admin use, so the backend accepts these ID tokens).
// Values come from VITE_FIREBASE_* — local .env (git-ignored) or, in CI, GitHub
// repository variables (see .github/workflows/deploy.yml). They are public client
// config, not secrets.
import { initializeApp } from 'firebase/app';
import {
  getAuth, GoogleAuthProvider, signInWithPopup, signOut,
  browserLocalPersistence, setPersistence,
} from 'firebase/auth';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Without apiKey/authDomain/appId the SDK cannot sign in; the login screen says so.
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.appId,
);

const app = isFirebaseConfigured ? initializeApp(firebaseConfig) : null;
export const auth = app ? getAuth(app) : null;

// Stay signed in across reloads and browser restarts (the default, made explicit).
if (auth) setPersistence(auth, browserLocalPersistence).catch(() => {});

const provider = new GoogleAuthProvider();
// Always show the account chooser, like the app's GoogleSignin.signOut() before signIn().
provider.setCustomParameters({ prompt: 'select_account' });

export const signInWithGoogle = () => {
  if (!auth) throw new Error('Firebase is not configured (VITE_FIREBASE_* missing).');
  return signInWithPopup(auth, provider);
};

export const signOutUser = () => (auth ? signOut(auth) : Promise.resolve());
