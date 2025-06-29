import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = "mongodb+srv://AdityaBaktha:ManjushaB18@cluster0.8eatq1k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, {
  serverApi: ServerApiVersion.v1
});

async function run() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ Connection failed:", err);
  } finally {
    await client.close();
  }
}

run(); 