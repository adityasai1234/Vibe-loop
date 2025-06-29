import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting development environment...');

// Start the API server
const apiServer = spawn('node', ['dev-server.js'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
});

// Wait a bit for the API server to start
setTimeout(() => {
  // Start the Vite dev server
  const viteServer = spawn('npm', ['run', 'dev'], {
    cwd: __dirname,
    stdio: 'inherit',
    shell: true
  });

  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down development servers...');
    apiServer.kill();
    viteServer.kill();
    process.exit(0);
  });

  viteServer.on('close', (code) => {
    console.log(`Vite server exited with code ${code}`);
    apiServer.kill();
    process.exit(code);
  });
}, 2000);

apiServer.on('close', (code) => {
  console.log(`API server exited with code ${code}`);
  process.exit(code);
}); 