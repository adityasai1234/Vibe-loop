import { ObjectId } from "mongodb"
import { getSongsCollection } from "@/lib/mongodb"
import { type Song, type SongInput, type SongUpdate, transformSong } from "@/lib/models/song"

export class SongService {
  static async createSong(songData: SongInput): Promise<Song & { id: string }> {
    const collection = await getSongsCollection()

    const song = {
      ...songData,
      created_at: new Date(),
      updated_at: new Date(),
    }

    const result = await collection.insertOne(song)
    const createdSong = await collection.findOne({ _id: result.insertedId })

    if (!createdSong) {
      throw new Error("Failed to create song")
    }

    return transformSong(createdSong)
  }

  static async getSongsByUserId(
    userId: string,
    page = 1,
    limit = 10,
  ): Promise<{ songs: (Song & { id: string })[]; total: number }> {
    const collection = await getSongsCollection()
    const skip = (page - 1) * limit

    const [songs, total] = await Promise.all([
      collection.find({ user_id: userId }).sort({ created_at: -1 }).skip(skip).limit(limit).toArray(),
      collection.countDocuments({ user_id: userId }),
    ])

    return {
      songs: songs.map(transformSong),
      total,
    }
  }

  static async getSongById(songId: string, userId: string): Promise<(Song & { id: string }) | null> {
    const collection = await getSongsCollection()

    if (!ObjectId.isValid(songId)) {
      return null
    }

    const song = await collection.findOne({
      _id: new ObjectId(songId),
      user_id: userId,
    })

    return song ? transformSong(song) : null
  }

  static async updateSong(
    songId: string,
    userId: string,
    updateData: SongUpdate,
  ): Promise<(Song & { id: string }) | null> {
    const collection = await getSongsCollection()

    if (!ObjectId.isValid(songId)) {
      return null
    }

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(songId), user_id: userId },
      { $set: { ...updateData, updated_at: new Date() } },
      { returnDocument: "after" },
    )

    return result ? transformSong(result) : null
  }

  static async deleteSong(songId: string, userId: string): Promise<boolean> {
    const collection = await getSongsCollection()

    if (!ObjectId.isValid(songId)) {
      return false
    }

    const result = await collection.deleteOne({
      _id: new ObjectId(songId),
      user_id: userId,
    })

    return result.deletedCount === 1
  }

  static async getSongByIdForDeletion(songId: string, userId: string): Promise<Song | null> {
    const collection = await getSongsCollection()

    if (!ObjectId.isValid(songId)) {
      return null
    }

    const song = await collection.findOne({
      _id: new ObjectId(songId),
      user_id: userId,
    })

    return song as Song | null
  }
}
