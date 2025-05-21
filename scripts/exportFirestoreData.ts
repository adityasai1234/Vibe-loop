import admin from "firebase-admin";
import fs from "fs/promises";

admin.initializeApp();                   // uses GOOGLE_APPLICATION_CREDENTIALS

async function run(uid: string) {
  const db = admin.firestore();
  const moods = await db
    .collection("users")
    .doc(uid)
    .collection("moodHistory")
    .get();
  const data = moods.docs.map(d => d.data());

  await fs.mkdir("analytics/raw", { recursive: true });
  await fs.writeFile(
    `analytics/raw/${uid}.json`,
    JSON.stringify(data, null, 2)
  );
  console.log("✅  Exported", data.length, "records for", uid);
}

run(process.argv[2] ?? "").catch(console.error);