import getCredentials from "@/lib/firebase/credentials";
import * as admin from "firebase-admin";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  connectFirebaseAdmin();
  const token = request.headers.get("token");
  const val = request.nextUrl.searchParams.get("target");

  if (!token) return new Response("User not authenticated!", { status: 401 });

  const user = await checkToken(token);

  if (!user) return new Response("User not authenticated!", { status: 401 });

  const url = `https://exercisedb.p.rapidapi.com/exercises/target/${val}?limit=300`;
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": process.env.NEXT_PUBLIC_X_RAPIDAPI_KEY as string,
      "X-RapidAPI-Host": "exercisedb.p.rapidapi.com",
    },
  };
  try {
    const response = await fetch(url, options);
    const result = await response.json();
    return new Response(JSON.stringify(result), { status: 200 });
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
