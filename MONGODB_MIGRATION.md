# MongoDB Migration Guide

This document outlines the changes made to migrate from Supabase PostgreSQL to MongoDB while maintaining Supabase Storage for file uploads.

## Key Changes Made

### 1. Database Layer (`lib/mongodb.ts`)
- **New**: MongoDB connection setup with proper connection pooling
- **Purpose**: Establishes connection to MongoDB Atlas or local MongoDB instance
- **Features**: Development/production environment handling, connection reuse

### 2. Data Models (`lib/models/song.ts`)
- **Changed**: Song interface updated for MongoDB ObjectId
- **Added**: Transform functions to convert MongoDB documents to frontend-compatible format
- **Key differences**: 
  - Uses `_id` (ObjectId) instead of `id` (UUID)
  - Date fields are proper Date objects instead of strings
  - Added transformation layer for API responses

### 3. Service Layer (`lib/services/song-service.ts`)
- **New**: Complete service layer for song CRUD operations
- **Purpose**: Abstracts MongoDB operations from API routes
- **Methods**:
  - `createSong()`: Insert new song document
  - `getSongsByUserId()`: Paginated song retrieval
  - `getSongById()`: Single song retrieval
  - `updateSong()`: Update song metadata
  - `deleteSong()`: Remove song document

### 4. Authentication (`lib/auth.ts`)
- **Changed**: Updated to use MongoDB adapter for BetterAuth
- **Removed**: PostgreSQL connection string dependency
- **Added**: MongoDB adapter configuration

### 5. API Routes (`app/api/songs/`)
- **Modified**: All API routes updated to use SongService instead of direct Supabase queries
- **Maintained**: File upload to Supabase Storage (unchanged)
- **Enhanced**: Better error handling and validation

### 6. Frontend Components
- **Updated**: Song interfaces to handle MongoDB ObjectId format
- **Added**: Proper type handling for Date objects vs strings
- **Maintained**: All UI functionality and styling

## MongoDB Schema

### Songs Collection
\`\`\`javascript
{
  _id: ObjectId,
  title: String (required),
  artist: String (required),
  genre: String (optional),
  file_url: String (required),
  file_name: String (required),
  duration: Number (optional, in seconds),
  file_size: Number (required, in bytes),
  user_id: String (required),
  created_at: Date (required),
  updated_at: Date (required)
}
\`\`\`

### Indexes Created
- `user_id`: For efficient user-specific queries
- `created_at`: For sorting by creation date
- `title, artist`: Text search capabilities

## Environment Variables

### New Required Variables
\`\`\`env
MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/musicapp?retryWrites=true&w=majority"
\`\`\`

### Removed Variables
- `DATABASE_URL` (PostgreSQL connection)
- `POSTGRES_*` variables

### Maintained Variables
- All Supabase variables (for file storage)
- BetterAuth variables
- File size and bucket configurations

## Deployment Considerations

### Vercel Configuration
- No changes needed to `vercel.json`
- MongoDB connection works seamlessly with Vercel's serverless functions
- Connection pooling handled automatically

### Performance Optimizations
- Connection reuse in development and production
- Proper indexing for common queries
- Efficient pagination implementation

## Migration Steps

1. **Set up MongoDB Atlas** (or local MongoDB)
2. **Update environment variables** with MongoDB connection string
3. **Run seed script** to create indexes: `node scripts/seed-mongodb.js`
4. **Deploy updated code** to Vercel
5. **Test all functionality** (auth, upload, CRUD operations)

## Benefits of MongoDB Migration

1. **Flexible Schema**: Easier to add new fields without migrations
2. **Better Performance**: Optimized for document-based operations
3. **Scalability**: Better horizontal scaling capabilities
4. **JSON Native**: Natural fit for JavaScript/TypeScript applications
5. **Atlas Integration**: Excellent cloud database service

## Maintained Features

- ✅ BetterAuth authentication
- ✅ Supabase Storage for file uploads
- ✅ All CRUD operations
- ✅ Pagination
- ✅ File size validation
- ✅ Responsive UI
- ✅ Dark/light theme
- ✅ Audio player functionality
- ✅ Vercel deployment compatibility
