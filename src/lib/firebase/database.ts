import * as admin from "firebase-admin/app";
import {
  getFirestore,
  Timestamp,
  FieldValue,
  Filter,
} from "firebase-admin/firestore";
import getCredentials from "./credentials";

function connectFirebaseAdmin() {
  const apps = admin.getApps();
  if (!apps.length) {
    admin.initializeApp({
      credential: admin.cert(getCredentials()),
    });
  }
  return admin;
}

export default function getDB() {
  const ad = connectFirebaseAdmin();
  const db = getFirestore();
  return db;
}
