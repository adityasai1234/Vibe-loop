import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { storeSongMetadata, type SongMetadata } from "@/lib/s3-service"

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const songId = params.id
    const { title, artist } = await request.json()

    if (!title || !artist) {
      return NextResponse.json({ 
        error: "title and artist are required" 
      }, { status: 400 })
    }

    // Store metadata
    const metadata: SongMetadata = {
      title,
      artist,
      likes: 0,
      uploadedAt: new Date().toISOString(),
    }

    await storeSongMetadata(songId, metadata)

    return NextResponse.json({ 
      message: "Song upload completed successfully", 
      songId 
    })

  } catch (error) {
    console.error('Error completing upload:', error)
    return NextResponse.json({ 
      error: `Failed to complete upload: ${error instanceof Error ? error.message : 'Unknown error'}` 
    }, { status: 500 })
  }
} 