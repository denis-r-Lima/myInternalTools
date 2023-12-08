import getCredentials from "@/lib/firebase/credentials";
import getDB from "@/lib/firebase/database";
import * as admin from "firebase-admin";
import { NextRequest } from "next/server";

type GymType = {
  days: { exercises: { name: string; weight: number; set: string }[] }[];
};

export async function GET(request: NextRequest) {
  connectFirebaseAdmin();
  const token = request.headers.get("token");

  if (!token) return new Response("User not authenticated!", { status: 401 });

  const user = await checkToken(token);

  if (!user) return new Response("User not authenticated!", { status: 401 });

  const db = getDB();
  const ref = db.collection("gym").doc(user);
  try {
    const doc = await ref.get();
    if (!doc.exists) {
      const initialData: GymType = {
        days: [],
      };
      await ref.set(initialData);
      return new Response(JSON.stringify(initialData), { status: 200 });
    } else {
      const data = doc.data();
      return new Response(JSON.stringify(data), { status: 200 });
    }
  } catch (e) {
    console.error(e);
    return new Response("Collection not found!", { status: 404 });
  }
}

export async function PUT(request: Request) {
  connectFirebaseAdmin();
  const { data } = await request.json();
  const token = request.headers.get("token");
  if (!token) return new Response("User not authenticated!", { status: 401 });

  const user = await checkToken(token);

  if (!user) return new Response("User not authenticated!", { status: 401 });

  const db = getDB();
  const ref = db.collection("gym").doc(user);
  try {
    await ref.set(data);
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (e) {
    console.error(e);
    return new Response("Collection not found!", { status: 404 });
  }
}

// export async function DELETE(request: Request) {
//   console.log(request.method);
//   return new Response("", { status: 200 });
// }

async function checkToken(token: string): Promise<string | null> {
  if (!token) return null;
  try {
    const user = await admin.auth().verifyIdToken(token);
    if (!user) return null;
    return user.uid;
  } catch (error) {
    console.log({ error });
    return null;
  }
}

function connectFirebaseAdmin() {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(getCredentials()),
    });
  }
  return admin;
}
