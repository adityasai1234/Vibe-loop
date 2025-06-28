import React, { useEffect, useState } from 'react';

export const HomePage: React.FC = () => {
  const [audioFiles, setAudioFiles] = useState<{ url: string, name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/list-supabase-audio');
        const data = await res.json();
        if (!data.success) throw new Error(data.error || 'Failed to load files');
        // Only show audio files with a public_url
        const files = data.files
          .filter((file: any) => file.public_url)
          .map((file: any) => ({
            url: file.public_url,
            name: file.file_name,
          }));
        setAudioFiles(files);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchFiles();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Your Uploaded Audio Files</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {audioFiles.map((file, idx) => (
          <div key={file.url} className="rounded-lg overflow-hidden shadow-md p-4 bg-white dark:bg-secondary-900">
            <p className="mb-2 font-semibold truncate">{file.name || `Audio File ${idx + 1}`}</p>
            <audio controls src={file.url} className="w-full" />
            <a href={file.url} target="_blank" rel="noopener noreferrer" className="block mt-2 text-blue-600 dark:text-blue-400 text-xs">
              Open in new tab
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}; 
