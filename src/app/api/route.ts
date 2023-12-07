import getDB from "@/lib/firebase/database";
import { auth } from "firebase-admin";
import { NextRequest } from "next/server";

type HabitType = {
  habitList: {
    habits: {
      habit: string;
      complete: { [year: string]: { [month: string]: number } };
    }[];
    perfectDays: number;
  };
  today: { date: string; habits: string[] };
};

export async function GET(request: NextRequest) {
  const token = request.headers.get("token");

  if (!token) return new Response("User not authenticated!", { status: 401 });

  const user = await checkToken(token);
  console.log(user);

  if (!user) return new Response("User not authenticated!", { status: 401 });

  const db = getDB();
  const ref = db.collection("habits").doc(`${user}2`);
  try {
    const doc = await ref.get();
    if (!doc.exists) {
      const initialData: HabitType = {
        habitList: { habits: [], perfectDays: 0 },
        today: { date: "0-0-0", habits: [] },
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
  const { data } = await request.json();
  const token = request.headers.get("token");
  if (!token) return new Response("User not authenticated!", { status: 401 });

  const user = await checkToken(token);

  if (!user) return new Response("User not authenticated!", { status: 401 });

  const db = getDB();
  const ref = db.collection("habits").doc(`${user}2`);
  try {
    await ref.set(data);
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (e) {
    console.error(e);
    return new Response("Collection not found!", { status: 404 });
  }
}

export async function DELETE(request: Request) {
  console.log(request.method);
  return new Response("", { status: 200 });
}

async function checkToken(token: string): Promise<string | null> {
  if (!token) return null;
  try {
    const user = await auth().verifyIdToken(token);
    if (!user) return null;
    return user.uid;
  } catch (error) {
    return null;
  }
}
