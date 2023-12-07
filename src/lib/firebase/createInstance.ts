import * as firebase from "firebase/app";
import { getAuth } from "firebase/auth";

let app: firebase.FirebaseApp;

const firebaseCredentials = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
// if a Firebase instance doesn't exist, create one
if (!firebase.getApps().length) {
  app = firebase.initializeApp(firebaseCredentials);
} else {
  app = firebase.getApp();
}

export const auth = getAuth(app);
export default app;
