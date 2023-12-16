import getCredentials from "@/lib/firebase/credentials";
import getDB from "@/lib/firebase/database";
import * as admin from "firebase-admin";
import { NextRequest } from "next/server";

type GymType = {
  days: {
    exercises: {
      name: string;
      weight: number;
      set: string;
      id: string;
      gifUrl: string;
      instructions: string;
    }[];
  }[];
};

export async function GET(request: NextRequest) {
  connectFirebaseAdmin();
  const token = request.headers.get("token");

  if (!token) return new Response("User not authenticated!", { status: 401 });

  const user = await checkToken(token);

  if (!user) return new Response("User not authenticated!", { status: 401 });

  const url = `https://exercisedb.p.rapidapi.com/exercises?limit=1400`;
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": process.env.NEXT_PUBLIC_X_RAPIDAPI_KEY as string,
      "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
    },
  };
  try {
    const response = await fetch(url, options);
    const result: {
      name: string;
      id: string;
      gifUrl: string;
      instructions: string[];
    }[] = await response.json();

    const db = getDB();
    const ref = db.collection("gym").doc(user);
    try {
      const doc = await ref.get();
      const data = doc.data();
      if (!data) throw new Error("");

      const temp: GymType = {
        days: data.days.map(
          (d: {
            exercises: {
              name: string;
              weight: number;
              set: string;
              id: string;
              gifUrl: string;
              instructions: string;
            }[];
          }) => {
            const t = {
              exercises: d.exercises.map((e) => {
                const tempFromDb = result.filter((r) => r.name === e.name);
                const a: {
                  name: string;
                  weight: number;
                  set: string;
                  id: string;
                  gifUrl: string;
                  instructions: string;
                } = {
                  ...e,
                  gifUrl: tempFromDb[0].gifUrl,
                };
                return a;
              }),
            };
            return t;
          }
        ),
      };
      ref.set(temp);

      return new Response(JSON.stringify(temp), { status: 200 });
    } catch (e) {
      console.error(e);
      return new Response("Collection not found!", { status: 404 });
    }
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify(error), { status: 403 });
  }
}

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
