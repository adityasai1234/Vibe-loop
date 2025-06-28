import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ListObjectsV2Command } from '@aws-sdk/client-s3';
import { hetznerS3Client, HETZNER_BUCKET_NAME, getHetznerPublicUrl } from '../src/lib/hetznerStorage.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('List Hetzner files API route called:', req.method, req.url);
  
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

  // Set prefix to 'users/' by default to list all user-uploaded files
  const prefix = 'users/';
  const limit = typeof req.query.limit === 'string' ? req.query.limit : '50';

  try {
    console.log('Listing files from Hetzner with prefix:', prefix, 'limit:', limit);

    const listObjectsCommand = new ListObjectsV2Command({
      Bucket: HETZNER_BUCKET_NAME,
      Prefix: prefix,
      MaxKeys: parseInt(limit) || 50,
    });

    const result = await hetznerS3Client.send(listObjectsCommand);
    
    console.log('Hetzner list result:', {
      bucket: HETZNER_BUCKET_NAME,
      fileCount: result.Contents?.length || 0,
      isTruncated: result.IsTruncated,
    });

    // Filter and format the files
    const files = (result.Contents || [])
      .filter(obj => obj.Key && obj.Size && obj.Size > 0) // Only include actual files, not directories
      .map(obj => {
        const fileName = obj.Key!.split('/').pop() || '';
        const fileExtension = fileName.split('.').pop()?.toLowerCase() || '';
        const isAudio = ['mp3', 'wav', 'flac', 'm4a', 'aac'].includes(fileExtension);
        const isVideo = ['mp4', 'webm', 'avi', 'mov'].includes(fileExtension);
        
        return {
          key: obj.Key,
          fileName,
          fileExtension,
          size: obj.Size,
          lastModified: obj.LastModified,
          publicUrl: getHetznerPublicUrl(obj.Key!),
          isAudio,
          isVideo,
          contentType: isAudio ? 'audio' : isVideo ? 'video' : 'unknown',
        };
      })
      .filter(file => file.isAudio || file.isVideo) // Only include audio/video files
      .sort((a, b) => {
        // newest first
        if (a.lastModified && b.lastModified) {
          return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
        }
        return 0;
      });

    const responseData = {
      success: true,
      files,
      totalCount: files.length,
      bucket: HETZNER_BUCKET_NAME,
      prefix,
    };

    console.log('Sending response with', files.length, 'files');
    return res.status(200).json(responseData);

  } catch (error: any) {
    // Handle Hetzner's 404 "NoSuchKey" as an empty list
    if (error.Code === 'NoSuchKey' || error.$metadata?.httpStatusCode === 404) {
      return res.status(200).json({
        success: true,
        files: [],
        totalCount: 0,
        bucket: HETZNER_BUCKET_NAME,
        prefix,
      });
    }
    console.error('Hetzner list files error:', error);
    return res.status(500).json({
      error: 'Failed to list files from Hetzner',
      details: error instanceof Error ? error.stack || error.message : String(error),
    });
  }
} 