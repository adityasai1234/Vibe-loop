-- Create songs table
CREATE TABLE IF NOT EXISTS songs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  artist VARCHAR(255) NOT NULL,
  genre VARCHAR(100),
  file_url TEXT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  duration INTEGER, -- in seconds
  file_size INTEGER, -- in bytes
  user_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_songs_user_id ON songs(user_id);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_songs_created_at ON songs(created_at DESC);

-- Enable Row Level Security
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to see only their own songs
CREATE POLICY "Users can view own songs" ON songs
  FOR SELECT USING (auth.uid()::text = user_id);

-- Create policy to allow users to insert their own songs
CREATE POLICY "Users can insert own songs" ON songs
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Create policy to allow users to update their own songs
CREATE POLICY "Users can update own songs" ON songs
  FOR UPDATE USING (auth.uid()::text = user_id);

-- Create policy to allow users to delete their own songs
CREATE POLICY "Users can delete own songs" ON songs
  FOR DELETE USING (auth.uid()::text = user_id);

-- Create storage bucket for media files (run this in Supabase dashboard)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true);

-- Create storage policy for media bucket
-- CREATE POLICY "Users can upload media" ON storage.objects
--   FOR INSERT WITH CHECK (bucket_id = 'media' AND auth.uid()::text = (storage.foldername(name))[1]);

-- CREATE POLICY "Users can view media" ON storage.objects
--   FOR SELECT USING (bucket_id = 'media');

-- CREATE POLICY "Users can update own media" ON storage.objects
--   FOR UPDATE USING (bucket_id = 'media' AND auth.uid()::text = (storage.foldername(name))[1]);

-- CREATE POLICY "Users can delete own media" ON storage.objects
--   FOR DELETE USING (bucket_id = 'media' AND auth.uid()::text = (storage.foldername(name))[1]);
