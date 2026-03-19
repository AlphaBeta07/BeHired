import admin from "firebase-admin";

if (!admin.apps.length) {
  try {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (!raw) throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY is not set in .env");

    const parsed = JSON.parse(raw);
    if (parsed.private_key) {
      parsed.private_key = parsed.private_key.replace(/\\n/g, "\n");
    }

    admin.initializeApp({
      credential: admin.credential.cert(parsed as admin.ServiceAccount),
      databaseURL: process.env.VITE_FIREBASE_DATABASE_URL,
    });

    console.log("[Firebase Admin] Initialized with Realtime DB ✅");
  } catch (err: any) {
    console.error("[Firebase Admin] Initialization FAILED ❌:", err.message);
  }
}

// Realtime Database helper — returns a ref at the given path
export function rtdbRef(path: string) {
  return admin.database().ref(path);
}

// Helpers for common CRUD operations on Realtime DB
export async function rtdbGet(path: string): Promise<any> {
  const snap = await admin.database().ref(path).get();
  return snap.exists() ? snap.val() : null;
}

export async function rtdbSet(path: string, data: any): Promise<void> {
  await admin.database().ref(path).set(data);
}

export async function rtdbUpdate(path: string, data: any): Promise<void> {
  await admin.database().ref(path).update(data);
}

export async function rtdbPush(path: string, data: any): Promise<string> {
  const ref = await admin.database().ref(path).push(data);
  return ref.key!;
}

export async function rtdbDelete(path: string): Promise<void> {
  await admin.database().ref(path).remove();
}

export async function rtdbQuery(path: string, field: string, value: any): Promise<Record<string, any>> {
  // Fetch all records and filter in-memory — avoids needing .indexOn rules in Firebase
  const snap = await admin.database().ref(path).get();
  if (!snap.exists()) return {};
  
  const all: Record<string, any> = snap.val();
  const result: Record<string, any> = {};
  for (const [key, entry] of Object.entries(all)) {
    if ((entry as any)[field] === value) {
      result[key] = entry;
    }
  }
  return result;
}

export const adminAuth = admin.apps.length ? admin.auth() : null as any;
