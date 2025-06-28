import { S3Client } from '@aws-sdk/client-s3';

const requiredEnvVars = {
  HETZNER_ACCESS_KEY: process.env.HETZNER_ACCESS_KEY,
  HETZNER_SECRET_KEY: process.env.HETZNER_SECRET_KEY,
  HETZNER_ENDPOINT: process.env.HETZNER_ENDPOINT,
  HETZNER_BUCKET_NAME: process.env.HETZNER_BUCKET_NAME,
  HETZNER_REGION: process.env.HETZNER_REGION,
};

console.log('Environment variables check:', {
  HETZNER_ACCESS_KEY: requiredEnvVars.HETZNER_ACCESS_KEY ? 'SET' : 'MISSING',
  HETZNER_SECRET_KEY: requiredEnvVars.HETZNER_SECRET_KEY ? 'SET' : 'MISSING',
  HETZNER_ENDPOINT: requiredEnvVars.HETZNER_ENDPOINT,
  HETZNER_BUCKET_NAME: requiredEnvVars.HETZNER_BUCKET_NAME,
  HETZNER_REGION: requiredEnvVars.HETZNER_REGION,
});

const missingVars = Object.entries(requiredEnvVars)
  .filter(([_, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  console.error('Missing environment variables:', missingVars);
  throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
}

export const hetznerS3Client = new S3Client({
  endpoint: requiredEnvVars.HETZNER_ENDPOINT!,
  region: requiredEnvVars.HETZNER_REGION!,
  credentials: {
    accessKeyId: requiredEnvVars.HETZNER_ACCESS_KEY!,
    secretAccessKey: requiredEnvVars.HETZNER_SECRET_KEY!,
  },
  forcePathStyle: true
});

export const HETZNER_BUCKET_NAME = requiredEnvVars.HETZNER_BUCKET_NAME!;

export const getHetznerPublicUrl = (fileKey: string): string => {
  return `${requiredEnvVars.HETZNER_ENDPOINT}/${HETZNER_BUCKET_NAME}/${fileKey}`;
};

export const generateFileKey = (fileName: string, userId?: string): string => {
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 15);
  const extension = fileName.split('.').pop();
  const baseName = fileName.replace(/\.[^/.]+$/, '');
  
  if (userId) {
    return `users/${userId}/${timestamp}-${randomId}-${baseName}.${extension}`;
  }
  
  return `uploads/${timestamp}-${randomId}-${baseName}.${extension}`;
}; 