import type { ObjectId } from "mongodb"

export interface Song {
  _id?: ObjectId
  title: string
  artist: string
  genre?: string
  file_url: string
  file_name: string
  duration?: number // in seconds
  file_size: number // in bytes
  user_id: string
  created_at: Date
  updated_at: Date
}

export interface SongInput {
  title: string
  artist: string
  genre?: string
  file_url: string
  file_name: string
  duration?: number
  file_size: number
  user_id: string
}

export interface SongUpdate {
  title?: string
  artist?: string
  genre?: string
  updated_at: Date
}

// Transform MongoDB document to frontend-compatible format
export function transformSong(song: any): Song & { id: string } {
  return {
    ...song,
    id: song._id.toString(),
    _id: song._id.toString(),
    created_at: song.created_at,
    updated_at: song.updated_at,
  }
}
