# Upload Setup Guide

## Overview
This application now supports file uploads to Hetzner Cloud Storage. Uploads are stored in your Hetzner bucket and can be accessed via public URLs.

## Storage Configuration

### Environment Variables
The following environment variables are configured in `env_temp.txt`:

```
VITE_STORAGE_BUCKET=media
VITE_MAX_FILE_SIZE=5242880
HETZNER_ACCESS_KEY=1BY6DNARWDPSQT4DXA18
HETZNER_SECRET_KEY=ieGy5o6biNPCc09iKbE55sPe01JywW8u5pFpnk8J
HETZNER_ENDPOINT=https://serenidad.hel1.your-objectstorage.com
HETZNER_BUCKET_NAME=serenidad
HETZNER_REGION=eu-central-1
VITE_API_BASE_URL=https://vibe-loop-2.onrender.com
```

## Where Files Are Stored

### Development Mode
- **Files**: Uploaded to Hetzner Cloud Storage (bucket: `serenidad`)
- **Metadata**: Stored in memory (resets on server restart)
- **URLs**: `https://serenidad.hel1.your-objectstorage.com/serenidad/uploads/{filename}`

### Production Mode
- **Files**: Uploaded to Hetzner Cloud Storage (bucket: `serenidad`)
- **Metadata**: Stored in Supabase database (`audio_files` table)
- **URLs**: `https://serenidad.hel1.your-objectstorage.com/serenidad/uploads/{filename}`

## File Structure in Hetzner
```
serenidad/
├── uploads/
│   ├── {timestamp}-{randomId}-{filename}.mp3
│   ├── {timestamp}-{randomId}-{filename}.mp4
│   └── ...
└── users/
    └── {userId}/
        ├── {timestamp}-{randomId}-{filename}.mp3
        └── ...
```

## How to Start Development

1. **Start both servers** (recommended):
   ```bash
   npm run start-dev
   ```

2. **Or start them separately**:
   ```bash
   # Terminal 1: Start API server
   npm run dev-server
   
   # Terminal 2: Start Vite dev server
   npm run dev
   ```

## Upload Process

1. **Select File**: Drag & drop or click to browse
2. **Click Upload**: Files are uploaded to Hetzner Cloud Storage
3. **Storage**: File is stored in the `serenidad` bucket
4. **Access**: File is accessible via public URL
5. **Display**: File appears in the songs list on the home page

## Supported File Types
- Audio: MP3, WAV, FLAC
- Video: MP4, WebM
- Maximum size: 50MB

## API Endpoints

### Development (localhost:3001)
- `GET /api/uploads` - List all songs
- `POST /api/upload-to-hetzner` - Upload file to Hetzner

### Production (https://vibe-loop-2.onrender.com)
- `GET /api/uploads` - List all songs
- `POST /api/upload-to-hetzner` - Upload file to Hetzner

## Troubleshooting

### Upload Fails
1. Check Hetzner credentials in `env_temp.txt`
2. Verify bucket name is correct
3. Check file size (max 50MB)
4. Ensure file type is supported

### Files Not Appearing
1. Check browser console for errors
2. Verify API server is running
3. Check network tab for failed requests

### Development Server Issues
1. Make sure both servers are running
2. Check port 3001 is available
3. Verify Vite proxy configuration

## Security Notes
- Hetzner credentials are server-side only
- Files are publicly accessible via URLs
- Consider implementing authentication for production use 