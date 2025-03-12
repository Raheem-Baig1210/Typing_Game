const { spawn } = require('child_process');
const path = require('path');

// Start the Next.js app
const nextApp = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true,
});

// Start the Socket.io server
const socketServer = spawn('npm', ['run', 'server'], {
  stdio: 'inherit',
  shell: true,
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('Shutting down...');
  nextApp.kill('SIGINT');
  socketServer.kill('SIGINT');
  process.exit(0);
});

console.log('TypeMaster is running!');
console.log('Next.js app: http://localhost:3000');
console.log('Socket.io server: http://localhost:3001');
console.log('Press Ctrl+C to stop both servers.'); 