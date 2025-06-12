// Utility to safely log environment variables
export const logEnvVars = () => {
  const envVars = {
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
    supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY?.slice(0, 8) + '...', // Only log first 8 chars
    storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
    maxFileSize: import.meta.env.VITE_MAX_FILE_SIZE,
  };
  
  console.log('Environment Variables:', envVars);
  return envVars;
};

// Validate required environment variables
export const validateEnvVars = () => {
  const required = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    'VITE_STORAGE_BUCKET',
  ];

  const missing = required.filter(key => !import.meta.env[key]);
  
  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing);
    return false;
  }
  
  return true;
}; 