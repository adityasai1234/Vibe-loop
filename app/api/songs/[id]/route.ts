import { type NextRequest, NextResponse } from "next/server"
import { addUserLikeToSong, hasUserLikedSong, getSongMetadata } from "@/lib/s3-service"
import { auth } from '@clerk/nextjs/server';

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

    // Get userId from Clerk
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get current metadata
    const metadata = await getSongMetadata(songId)
    if (!metadata) {
      return NextResponse.json({ error: 'Song not found' }, { status: 404 })
    }

    // Check if user already liked
    const alreadyLiked = await hasUserLikedSong(songId, userId);
    if (alreadyLiked) {
      return NextResponse.json({ error: 'You have already liked this song.' }, { status: 400 });
    }

    // Add like
    const newLikes = await addUserLikeToSong(songId, userId);

    return NextResponse.json({ 
      message: 'Song liked successfully',
      likes: newLikes 
    })
  } catch (error) {
    console.error('Error updating song:', error)
    return NextResponse.json({ error: 'Failed to update song' }, { status: 500 })
  }
} 