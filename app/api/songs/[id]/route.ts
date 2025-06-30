import { type NextRequest, NextResponse } from "next/server"
import { SongService } from "@/lib/services/song-service"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const { title, artist, genre } = body
    const song = await SongService.updateSong(id, { title, artist, genre })
    return NextResponse.json(song)
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    // Get song details first
    const song = await SongService.getSongByIdForDeletion(id)
    if (!song) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 })
    }
    // Delete song from MongoDB
    const deleted = await SongService.deleteSong(id)
    if (!deleted) {
      return NextResponse.json({ error: "Failed to delete song" }, { status: 500 })
    }
    return NextResponse.json({ message: "Song deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
