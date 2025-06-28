import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ListBucketsCommand } from '@aws-sdk/client-s3';
import { hetznerS3Client, HETZNER_BUCKET_NAME } from '../src/lib/hetznerStorage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('Test Hetzner API route called');
  
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Testing Hetzner connection...');
    
    // Test basic connection by listing buckets
    const listBucketsCommand = new ListBucketsCommand({});
    const result = await hetznerS3Client.send(listBucketsCommand);
    
    console.log('Hetzner connection successful:', result);
    
    return res.status(200).json({
      success: true,
      message: 'Hetzner connection successful',
      bucketName: HETZNER_BUCKET_NAME,
      buckets: result.Buckets?.map(bucket => bucket.Name) || [],
      owner: result.Owner?.DisplayName || 'Unknown'
    });

  } catch (error) {
    console.error('Hetzner test error:', error);
    return res.status(500).json({ 
      error: 'Failed to connect to Hetzner',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 