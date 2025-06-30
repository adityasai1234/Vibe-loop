// Run this script to seed your MongoDB database with sample data
// Usage: node scripts/seed-mongodb.js

const { MongoClient } = require("mongodb")

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017"
const DATABASE_NAME = "musicapp"

async function seedDatabase() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db(DATABASE_NAME)

    // Create indexes for better performance
    const songsCollection = db.collection("songs")

    // Create indexes
    await songsCollection.createIndex({ user_id: 1 })
    await songsCollection.createIndex({ created_at: -1 })
    await songsCollection.createIndex({ title: "text", artist: "text" })

    console.log("Indexes created successfully")

    // Sample songs data (you can customize this)
    const sampleSongs = [
      {
        title: "Sample Song 1",
        artist: "Sample Artist 1",
        genre: "Pop",
        file_url: "https://example.com/sample1.mp3",
        file_name: "sample1.mp3",
        duration: 180,
        file_size: 3500000,
        user_id: "sample-user-id",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        title: "Sample Song 2",
        artist: "Sample Artist 2",
        genre: "Rock",
        file_url: "https://example.com/sample2.mp3",
        file_name: "sample2.mp3",
        duration: 240,
        file_size: 4200000,
        user_id: "sample-user-id",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]

    // Insert sample songs (optional - remove if you don't want sample data)
    // await songsCollection.insertMany(sampleSongs)
    // console.log('Sample songs inserted')

    console.log("Database seeded successfully!")
  } catch (error) {
    console.error("Error seeding database:", error)
  } finally {
    await client.close()
  }
}

seedDatabase()
