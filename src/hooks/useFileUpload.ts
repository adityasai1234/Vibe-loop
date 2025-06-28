/* Supabase storage logic commented out. Use Hetzner upload instead. */

// import { useState, ChangeEvent } from 'react';
// import { supabase } from '../lib/supabaseClient';
//
// const BUCKET = 'media';               // storage bucket
// const ALLOWED = ['audio/mpeg', 'audio/mp3', 'video/mp4'];
// const MAX_MB  = 100;                  // 100 MB
//
// type UploadState =
//   | { phase: 'idle' }
//   | { phase: 'uploading'; pct: number }
//   | { phase: 'done'; url: string }
//   | { phase: 'error'; msg: string };
//
// export function useFileUpload() {
//   const [state, setState] = useState<UploadState>({ phase: 'idle' });
//
//   async function onChange(e: ChangeEvent<HTMLInputElement>) {
//     const file = e.target.files?.[0];
//     if (!file) return;
//
//     /* 0️⃣ basic client-side validation */
//     if (!ALLOWED.includes(file.type)) {
//       return setState({ phase: 'error', msg: 'Only MP3 or MP4 files allowed.' });
//     }
//     if (file.size > MAX_MB * 1_000_000) {
//       return setState({ phase: 'error', msg: `Max ${MAX_MB} MB.` });
//     }
//
//     const filePath = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
//
//     /* 1️⃣ upload bytes to Storage */
//     setState({ phase: 'uploading', pct: 0 });
//     const { data: up, error: upErr } = await supabase
//       .storage
//       .from(BUCKET)
//       .upload(filePath, file, {
//         contentType: file.type,
//         onUploadProgress: (ev: ProgressEvent) => {
//           const pct = Math.round((ev.loaded / (ev.total || 1)) * 100);
//           setState({ phase: 'uploading', pct });
//         }
//       } as any); // Temporarily cast to any to bypass type issues with onUploadProgress
//
//     if (upErr) {
//       return setState({ phase: 'error', msg: upErr.message });
//     }
//
//     /* 2️⃣ insert metadata row (owner_id nullable for anon) */
//     const { error: insertErr } = await supabase
//       .from('media_files')
//       .insert({
//         owner_id: (await supabase.auth.getSession()).data?.session?.user?.id ?? null,
//         bucket:    BUCKET,
//         path:      filePath,
//         file_name: file.name,
//         size_bytes: file.size,
//         inserted_at: new Date().toISOString()
//       });
//
//     if (insertErr) {
//       return setState({ phase: 'error', msg: insertErr.message });
//     }
//
//     /* 3️⃣ get public URL for playback */
//     const { data: pub } = supabase
//       .storage
//       .from(BUCKET)
//       .getPublicUrl(filePath);
//
//     setState({ phase: 'done', url: pub.publicUrl });
//   }
//
//   return { state, onChange };
// } 

export const supabase = {
  auth: {
    onAuthStateChange: () => {},
    getSession: async () => ({ data: { session: null }, error: null }),
    signInWithPassword: async () => { throw new Error('Supabase disabled'); },
    signUp: async () => { throw new Error('Supabase disabled'); },
    signOut: async () => {},
  },
  from: () => ({
    select: () => ({ data: null, error: 'Supabase disabled' }),
    insert: () => ({ data: null, error: 'Supabase disabled' }),
  }),
}; 