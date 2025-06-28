import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { IncomingForm } from 'formidable';
import fs from 'fs';
import { hetznerS3Client, HETZNER_BUCKET_NAME, generateFileKey } from '../src/lib/hetznerStorage.js';
import { createClient } from '@supabase/supabase-js';

export const config = { api: { bodyParser: false } };

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check if the request is JSON for manual URL insert
  if (req.headers['content-type'] && req.headers['content-type'].includes('application/json')) {
    try {
      const body = await new Promise<any>((resolve, reject) => {
        let data = '';
        req.on('data', chunk => { data += chunk; });
        req.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        });
        req.on('error', reject);
      });
      const { public_url, file_name, user_id } = body;
      if (!public_url || !file_name) {
        return res.status(400).json({ error: 'public_url and file_name are required' });
      }
      const { data, error: dbError } = await supabase
        .from('audio_files')
        .insert([{
          user_id: user_id || null,
          file_name,
          public_url,
          uploaded_at: new Date().toISOString(),
        }])
        .select();
      if (dbError) {
        return res.status(500).json({ error: 'Failed to store in Supabase', details: dbError.message });
      }
      return res.status(200).json({ success: true, db: data });
    } catch (error) {
      return res.status(400).json({ error: 'Invalid JSON body', details: error instanceof Error ? error.message : error });
    }
  }

  const form = new IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'Error parsing form data' });

    const file = files.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    const fileObj = Array.isArray(file) ? file[0] : file;
    const fileName = fileObj.originalFilename || fileObj.newFilename || 'uploaded-file';
    const userId = Array.isArray(fields.userId) ? fields.userId[0] : fields.userId;
    const fileKey = generateFileKey(fileName, userId);
    const fileBuffer = await fs.promises.readFile(fileObj.filepath);

    try {
      // Upload to Hetzner
      await hetznerS3Client.send(new PutObjectCommand({
        Bucket: HETZNER_BUCKET_NAME,
        Key: fileKey,
        Body: fileBuffer,
        ContentType: fileObj.mimetype || 'application/octet-stream',
      }));

      const publicUrl = `https://serenidad.hel1.your-objectstorage.com/${HETZNER_BUCKET_NAME}/${fileKey}`;

      // Store in Supabase
      const { data, error: dbError } = await supabase
        .from('audio_files')
        .insert([{
          user_id: userId,
          file_name: fileName,
          public_url: publicUrl,
          uploaded_at: new Date().toISOString(),
        }])
        .select();

      if (dbError) {
        return res.status(500).json({ error: 'Failed to store in Supabase', details: dbError.message });
      }

      return res.status(200).json({
        success: true,
        fileKey,
        publicUrl,
        db: data,
      });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to upload or store', details: error });
    }
  });
} 