import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { IncomingForm } from 'formidable';
import fs from 'fs';

// Use the exact Hetzner configuration provided by the user
const s3Client = new S3Client({
  endpoint: 'https://serenidad.hel1.your-objectstorage.com',
  region: 'eu-central-1',
  credentials: {
    accessKeyId: '1BY6DNARWDPSQT4DXA18',
    secretAccessKey: 'ieGy5o6biNPCc09iKbE55sPe01JywW8u5pFpnk8J'
  },
  forcePathStyle: true
});

const BUCKET_NAME = 'serenidad';

const generateFileKey = (fileName: string, userId?: string): string => {
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 15);
  const extension = fileName.split('.').pop();
  const baseName = fileName.replace(/\.[^/.]+$/, '');
  
  if (userId) {
    return `users/${userId}/${timestamp}-${randomId}-${baseName}.${extension}`;
  }
  
  return `uploads/${timestamp}-${randomId}-${baseName}.${extension}`;
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = new IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: 'Error parsing form data' });
    }

    const file = files.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // formidable v2+ returns file as array if multiple: handle both
    const fileObj = Array.isArray(file) ? file[0] : file;
    const fileName = fileObj.originalFilename || fileObj.newFilename || 'uploaded-file';
    const userId = Array.isArray(fields.userId)
      ? fields.userId[0]
      : fields.userId;
    const fileKey = generateFileKey(fileName, userId);

    const fileBuffer = await fs.promises.readFile(fileObj.filepath);

    try {
      await s3Client.send(new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileKey,
        Body: fileBuffer,
        ContentType: fileObj.mimetype || 'application/octet-stream',
      }));

      // Construct the public URL correctly
      const publicUrl = `https://serenidad.hel1.your-objectstorage.com/${BUCKET_NAME}/${fileKey}`;
      
      console.log('✅ File uploaded to Hetzner:', {
        fileKey,
        publicUrl,
        bucket: BUCKET_NAME
      });

      return res.status(200).json({
        success: true,
        fileKey,
        publicUrl: publicUrl,
      });
    } catch (error) {
      console.error('❌ Hetzner upload error:', error);
      return res.status(500).json({ error: 'Failed to upload to Hetzner', details: error });
    }
  });
} 