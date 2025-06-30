import { type NextRequest, NextResponse } from "next/server"
import { getSongsCollection } from "@/lib/mongodb"
import { transformSong } from "@/lib/models/song"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit
    const collection = await getSongsCollection()
    const [songs, total] = await Promise.all([
      collection.find({}).sort({ created_at: -1 }).skip(skip).limit(limit).toArray(),
      collection.countDocuments({}),
    ])
    return NextResponse.json({
      songs: songs.map(transformSong),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }
    // Add logic to handle file upload and song creation
    // For now, just return a placeholder
    return NextResponse.json({ message: "Song uploaded (placeholder)" })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}
