import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { 
  getAllSongs, 
  uploadAudioFile, 
  storeSongMetadata, 
  generateSongId,
  type SongMetadata 
} from "@/lib/s3-service"

export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const songs = await getAllSongs()
    return NextResponse.json({ songs })
  } catch (error) {
    console.error('Error fetching songs:', error)
    return NextResponse.json({ error: 'Failed to fetch songs' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check content length to prevent memory issues
    const contentLength = request.headers.get('content-length')
    if (contentLength) {
      const size = parseInt(contentLength, 10)
      const maxSize = 20 * 1024 * 1024 // 20MB
      if (size > maxSize) {
        return NextResponse.json({ 
          error: `File too large. Maximum size is 20MB. Received: ${(size / 1024 / 1024).toFixed(2)}MB` 
        }, { status: 413 })
      }
    }

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

    // Validate file size again after parsing
    const maxSize = 20 * 1024 * 1024 // 20MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: `File too large. Maximum size is 20MB. Received: ${(file.size / 1024 / 1024).toFixed(2)}MB` 
      }, { status: 413 })
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
