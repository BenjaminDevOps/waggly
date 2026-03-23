import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'YOUR_FIREBASE_API_KEY',
  authDomain: 'waggly-app.firebaseapp.com',
  projectId: 'waggly-app',
  storageBucket: 'waggly-app.appspot.com',
  messagingSenderId: '000000000000',
  appId: '1:000000000000:web:0000000000000000',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
