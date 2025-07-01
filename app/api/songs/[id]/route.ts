import { type NextRequest, NextResponse } from "next/server"
import { updateSongLikes, getSongMetadata } from "@/lib/s3-service"

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const songId = params.id
    const { action } = await request.json()

    if (action !== 'like') {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    // Get current metadata
    const metadata = await getSongMetadata(songId)
    if (!metadata) {
      return NextResponse.json({ error: 'Song not found' }, { status: 404 })
    }

    // Increment likes
    const newLikes = metadata.likes + 1
    await updateSongLikes(songId, newLikes)

    return NextResponse.json({ 
      message: 'Song liked successfully',
      likes: newLikes 
    })
  } catch (error) {
    console.error('Error updating song:', error)
    return NextResponse.json({ error: 'Failed to update song' }, { status: 500 })
  }
} 