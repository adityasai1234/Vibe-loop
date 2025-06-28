import React from 'react';

export const DebugEnv: React.FC = () => {
  const envVars = {
    // Supabase variables (these should be available)
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'SET' : 'MISSING',
    VITE_STORAGE_BUCKET: import.meta.env.VITE_STORAGE_BUCKET,
    VITE_MAX_FILE_SIZE: import.meta.env.VITE_MAX_FILE_SIZE,
    
    // Hetzner variables (these are server-side only)
    HETZNER_ACCESS_KEY: 'SERVER_SIDE_ONLY',
    HETZNER_SECRET_KEY: 'SERVER_SIDE_ONLY',
    HETZNER_ENDPOINT: 'SERVER_SIDE_ONLY',
    HETZNER_BUCKET_NAME: 'SERVER_SIDE_ONLY',
    HETZNER_REGION: 'SERVER_SIDE_ONLY',
    
    // Environment info
    NODE_ENV: import.meta.env.NODE_ENV,
    DEV: import.meta.env.DEV,
    PROD: import.meta.env.PROD,
    HOSTNAME: window.location.hostname,
  };

  const handleUpload = async (file, userId) => {
    const formData = new FormData();
    formData.append('file', file); // file: File object from <input>
    if (userId) formData.append('userId', userId);

    const res = await fetch('/api/upload-and-store', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (data.success) {
      alert('Upload successful! Public URL: ' + data.publicUrl);
      // Optionally, refresh your audio list here
    } else {
      alert('Upload failed: ' + (data.error || 'Unknown error'));
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Environment Variables Debug</h3>
      <pre className="text-sm bg-white p-2 rounded border overflow-auto max-h-64">
        {JSON.stringify(envVars, null, 2)}
      </pre>
      <p className="text-xs text-gray-600 mt-2">
        Note: Hetzner variables are server-side only and not exposed to the browser for security.
      </p>
    </div>
  );
}; 