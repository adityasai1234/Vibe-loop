import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { S3Client } from "@aws-sdk/client-s3"
import { generateSongId } from "@/lib/s3-service"

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

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { fileName, fileType, title, artist } = await request.json()

    if (!fileName || !fileType || !title || !artist) {
      return NextResponse.json({ 
        error: "fileName, fileType, title, and artist are required" 
      }, { status: 400 })
    }

    // Validate file type
    if (!fileType.startsWith('audio/')) {
      return NextResponse.json({ error: "File must be an audio file" }, { status: 400 })
    }

    // Generate unique song ID
    const songId = generateSongId()
    const key = `audio/${songId}.mp3`

    // Create presigned URL for upload
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: fileType,
    })

    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 }) // 1 hour

    return NextResponse.json({
      presignedUrl,
      songId,
      key,
      uploadUrl: `/api/songs/${songId}/complete`,
      metadata: { title, artist }
    })

  } catch (error) {
    console.error('Error generating presigned URL:', error)
    return NextResponse.json({ 
      error: `Failed to generate upload URL: ${error instanceof Error ? error.message : 'Unknown error'}` 
    }, { status: 500 })
  }
} 