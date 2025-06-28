import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { IncomingForm } from 'formidable';
import fs from 'fs';
import { hetznerS3Client, HETZNER_BUCKET_NAME, generateFileKey } from '../src/lib/hetznerStorage.js';

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
      await hetznerS3Client.send(new PutObjectCommand({
        Bucket: HETZNER_BUCKET_NAME,
        Key: fileKey,
        Body: fileBuffer,
        ContentType: fileObj.mimetype || 'application/octet-stream',
      }));

      return res.status(200).json({
        success: true,
        fileKey,
        publicUrl: `https://serenidad.hel1.your-objectstorage.com/${HETZNER_BUCKET_NAME}/${fileKey}`,
      });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to upload to Hetzner', details: error });
    }
  });
} 