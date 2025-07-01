import { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// S3 Client configuration
const s3Client = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
})

const BUCKET_NAME = process.env.S3_BUCKET_NAME!

export interface Song {
  id: string
  title: string
  artist: string
  audioUrl: string
  likes: number
  uploadedAt: string
}

export interface SongMetadata {
  title: string
  artist: string
  likes: number
  uploadedAt: string
}

// Upload audio file to S3
export async function uploadAudioFile(
  songId: string,
  file: Buffer,
  contentType: string = 'audio/mpeg'
): Promise<string> {
  const key = `audio/${songId}.mp3`
  
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: file,
    ContentType: contentType,
  })

  await s3Client.send(command)
  return key
}

// Store song metadata as JSON file in S3
export async function storeSongMetadata(songId: string, metadata: SongMetadata): Promise<void> {
  const key = `metadata/${songId}.json`
  
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: JSON.stringify(metadata),
    ContentType: 'application/json',
  })

  await s3Client.send(command)
}

// Get song metadata from S3
export async function getSongMetadata(songId: string): Promise<SongMetadata | null> {
  try {
    const key = `metadata/${songId}.json`
    
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })

    const response = await s3Client.send(command)
    const body = await response.Body?.transformToString()
    
    return body ? JSON.parse(body) : null
  } catch (error) {
    console.error('Error getting metadata:', error)
    return null
  }
}

// Get signed URL for audio streaming
export async function getAudioUrl(songId: string): Promise<string> {
  const key = `audio/${songId}.mp3`
  
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  })

  // URL expires in 1 hour
  return await getSignedUrl(s3Client, command, { expiresIn: 3600 })
}

// List all songs with metadata
export async function getAllSongs(): Promise<Song[]> {
  try {
    // List all metadata files
    const listCommand = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: 'metadata/',
    })

    const response = await s3Client.send(listCommand)
    const objects = response.Contents || []

    // If no objects found, return empty array (this is normal for new buckets)
    if (!objects.length) {
      return []
    }

    const songs: Song[] = []

    for (const object of objects) {
      if (object.Key && object.Key.endsWith('.json')) {
        const songId = object.Key.replace('metadata/', '').replace('.json', '')
        
        const metadata = await getSongMetadata(songId)
        
        if (metadata) {
          try {
            const audioUrl = await getAudioUrl(songId)
            songs.push({
              id: songId,
              title: metadata.title,
              artist: metadata.artist,
              audioUrl,
              likes: metadata.likes,
              uploadedAt: metadata.uploadedAt,
            })
          } catch (audioError) {
            console.warn(`Could not get audio URL for song ${songId}:`, audioError)
          }
        }
      }
    }
    
    // Sort by upload date (newest first)
    return songs.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
  } catch (error: any) {
    // Handle the case where bucket is empty or metadata prefix doesn't exist
    if (error.name === 'NoSuchKey' || error.Code === 'NoSuchKey') {
      return []
    }
    console.error('Error listing songs:', error)
    return []
  }
}

// Update song likes
export async function updateSongLikes(songId: string, likes: number): Promise<void> {
  const metadata = await getSongMetadata(songId)
  if (metadata) {
    metadata.likes = likes
    await storeSongMetadata(songId, metadata)
  }
}

// Delete song and its metadata
export async function deleteSong(songId: string): Promise<void> {
  const audioKey = `audio/${songId}.mp3`
  const metadataKey = `metadata/${songId}.json`

  await Promise.all([
    s3Client.send(new DeleteObjectCommand({ Bucket: BUCKET_NAME, Key: audioKey })),
    s3Client.send(new DeleteObjectCommand({ Bucket: BUCKET_NAME, Key: metadataKey }))
  ])
}

// Generate unique song ID
export function generateSongId(): string {
  return `song_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Store mood log as JSON file in S3
export async function storeMoodLog(log: { emoji: string; text: string; time: string }): Promise<void> {
  const id = `mood_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const key = `mood-logs/${id}.json`;
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: JSON.stringify(log),
    ContentType: 'application/json',
  });
  await s3Client.send(command);
}

// List all mood logs from S3
export async function getAllMoodLogs(): Promise<{emoji: string, text: string, time: string}[]> {
  try {
    const listCommand = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: 'mood-logs/',
    });
    const response = await s3Client.send(listCommand);
    const objects = response.Contents || [];
    if (!objects.length) return [];
    const logs: {emoji: string, text: string, time: string}[] = [];
    for (const object of objects) {
      if (object.Key && object.Key.endsWith('.json')) {
        const getCommand = new GetObjectCommand({
          Bucket: BUCKET_NAME,
          Key: object.Key,
        });
        const res = await s3Client.send(getCommand);
        const body = await res.Body?.transformToString();
        if (body) {
          try {
            logs.push(JSON.parse(body));
          } catch {}
        }
      }
    }
    // Sort by time (newest first)
    return logs.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
  } catch (error) {
    console.error('Error listing mood logs:', error);
    return [];
  }
} 