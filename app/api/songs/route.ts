import { type NextRequest, NextResponse } from "next/server"
import { 
  getAllSongs, 
  uploadAudioFile, 
  storeSongMetadata, 
  generateSongId,
  type SongMetadata 
} from "@/lib/s3-service"

export async function GET() {
  try {
    const songs = await getAllSongs()
    return NextResponse.json({ songs })
  } catch (error) {
    console.error('Error fetching songs:', error)
    return NextResponse.json({ error: 'Failed to fetch songs' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const title = formData.get("title") as string
    const artist = formData.get("artist") as string

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    if (!title || !artist) {
      return NextResponse.json({ error: "Title and artist are required" }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('audio/')) {
      return NextResponse.json({ error: "File must be an audio file" }, { status: 400 })
    }

    // Generate unique song ID
    const songId = generateSongId()

    // Convert file to buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer())

    // Upload audio file to S3
    await uploadAudioFile(songId, fileBuffer, file.type)

    // Store metadata
    const metadata: SongMetadata = {
      title,
      artist,
      likes: 0,
      uploadedAt: new Date().toISOString(),
    }

    await storeSongMetadata(songId, metadata)

    return NextResponse.json({ 
      message: "Song uploaded successfully", 
      songId 
    })
  } catch (error) {
    console.error('Error uploading song:', error)
    return NextResponse.json({ 
      error: `Failed to upload song: ${error instanceof Error ? error.message : 'Unknown error'}` 
    }, { status: 500 })
  }
}
