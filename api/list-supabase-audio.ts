import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { data, error } = await supabase
    .from('audio_files')
    .select('*')
    .order('uploaded_at', { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  return res.status(200).json({ success: true, files: data });
} 