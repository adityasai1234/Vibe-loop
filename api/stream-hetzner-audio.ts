import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { hetznerS3Client, HETZNER_BUCKET_NAME } from '../src/lib/hetznerStorage.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { key } = req.query;
  if (!key || typeof key !== 'string') {
    return res.status(400).send('Missing or invalid key');
  }

  try {
    const command = new GetObjectCommand({
      Bucket: HETZNER_BUCKET_NAME,
      Key: key,
    });
    const data = await hetznerS3Client.send(command);

    // Set headers for streaming
    res.setHeader('Content-Type', data.ContentType || 'audio/mpeg');
    if (data.ContentLength) {
      res.setHeader('Content-Length', data.ContentLength.toString());
    }
    res.setHeader('Accept-Ranges', 'bytes');

    // Pipe the stream to the response
    if (data.Body) {
      (data.Body as any).pipe(res);
    } else {
      res.status(404).send('File not found');
    }
  } catch (error) {
    console.error('Error streaming audio:', error);
    res.status(500).send('Failed to stream audio');
  }
} 