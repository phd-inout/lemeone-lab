#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const path = require('path');
const os = require('os');

console.log('🚀 Starting Lemeone-lab 2.0 Local Engine...');

const appDir = path.resolve(__dirname, '..');

// 1. Check GEMINI_API_KEY
if (!process.env.GEMINI_API_KEY) {
  console.log('\n⚠️  WARNING: GEMINI_API_KEY is not set in your environment.');
  console.log('   The simulation requires Gemini to generate events.');
  console.log('   Please export GEMINI_API_KEY="your-key" and run again, or set it in .env.local.\n');
}

// 2. Initialize Database
console.log('📦 Initializing local SQLite database...');
try {
  execSync('npx prisma db push', { cwd: appDir, stdio: 'inherit' });
} catch (e) {
  console.error('❌ Failed to initialize database.');
  process.exit(1);
}

// 3. Start Next.js Server
console.log('🌐 Starting local server...');
const server = spawn('npm', ['run', 'dev'], { cwd: appDir, stdio: 'inherit' });

// 4. Open browser after a short delay
setTimeout(() => {
  const url = 'http://localhost:3000';
  console.log(`\n✨ Lemeone-lab is running at ${url}\n`);
  const openCmd = os.platform() === 'win32' ? 'start' : os.platform() === 'darwin' ? 'open' : 'xdg-open';
  try {
    execSync(`${openCmd} ${url}`);
  } catch (e) {}
}, 3000);

server.on('close', (code) => {
  process.exit(code);
});
