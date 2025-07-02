CREATE TABLE IF NOT EXISTS public.liked_songs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    song_id TEXT NOT NULL,
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    cover_url TEXT,
    url TEXT NOT NULL,
    duration INTEGER,
    album TEXT,
    genre TEXT,
    mood TEXT[],
    release_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, song_id)
);

ALTER TABLE public.liked_songs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own liked songs"
    ON public.liked_songs
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own liked songs"
    ON public.liked_songs
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own liked songs"
    ON public.liked_songs
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own liked songs"
    ON public.liked_songs
    FOR DELETE
    USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.liked_songs
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX IF NOT EXISTS liked_songs_user_id_idx ON public.liked_songs(user_id);
CREATE INDEX IF NOT EXISTS liked_songs_song_id_idx ON public.liked_songs(song_id); 