const http = require('http');
const { Server } = require('socket.io');

// Create HTTP server
const server = http.createServer();

// Create Socket.io server
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Store active rooms and players
const rooms = new Map();

// Sample texts for typing
const sampleTexts = [
  "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the English alphabet at least once.",
  "Programming is the process of creating a set of instructions that tell a computer how to perform a task.",
  "The Internet is a global system of interconnected computer networks that use the standard Internet protocol suite to link devices worldwide.",
  "Typing speed is typically measured in words per minute (WPM). The average typing speed is around 40 WPM.",
];

// Get a random text
function getRandomText() {
  const randomIndex = Math.floor(Math.random() * sampleTexts.length);
  return sampleTexts[randomIndex];
}

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  // Create a new room
  socket.on('create-room', () => {
    const roomId = generateRoomId();
    
    // Create room data
    rooms.set(roomId, {
      host: socket.id,
      players: [{ id: socket.id, name: 'Host', wpm: 0, progress: 0, ready: false }],
      gameStarted: false,
      text: getRandomText(),
    });
    
    // Join the room
    socket.join(roomId);
    
    // Send room info to the client
    socket.emit('room-created', { roomId, isHost: true });
    
    console.log(`Room created: ${roomId}`);
  });
  
  // Join an existing room
  socket.on('join-room', ({ roomId, playerName }) => {
    const room = rooms.get(roomId);
    
    if (!room) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }
    
    if (room.gameStarted) {
      socket.emit('error', { message: 'Game already in progress' });
      return;
    }
    
    // Add player to the room
    room.players.push({
      id: socket.id,
      name: playerName || `Player ${room.players.length + 1}`,
      wpm: 0,
      progress: 0,
      ready: false,
    });
    
    // Join the room
    socket.join(roomId);
    
    // Send room info to the client
    socket.emit('room-joined', {
      roomId,
      isHost: false,
      players: room.players,
      text: room.text,
    });
    
    // Notify other players
    socket.to(roomId).emit('player-joined', {
      players: room.players,
    });
    
    console.log(`Player ${socket.id} joined room: ${roomId}`);
  });
  
  // Player ready status
  socket.on('player-ready', ({ roomId, ready }) => {
    const room = rooms.get(roomId);
    
    if (!room) return;
    
    // Update player ready status
    const player = room.players.find(p => p.id === socket.id);
    if (player) {
      player.ready = ready;
    }
    
    // Notify all players in the room
    io.to(roomId).emit('players-updated', {
      players: room.players,
    });
    
    // Check if all players are ready
    const allReady = room.players.every(p => p.ready);
    if (allReady && room.players.length >= 2) {
      // Start countdown
      io.to(roomId).emit('game-countdown', { countdown: 3 });
      
      // Start the game after countdown
      setTimeout(() => {
        room.gameStarted = true;
        io.to(roomId).emit('game-started', { text: room.text });
      }, 3000);
    }
  });
  
  // Update player progress
  socket.on('update-progress', ({ roomId, progress, wpm }) => {
    const room = rooms.get(roomId);
    
    if (!room || !room.gameStarted) return;
    
    // Update player progress
    const player = room.players.find(p => p.id === socket.id);
    if (player) {
      player.progress = progress;
      player.wpm = wpm;
    }
    
    // Notify all players in the room
    io.to(roomId).emit('progress-updated', {
      players: room.players,
    });
    
    // Check if player has completed the text
    if (progress === 100) {
      // Notify all players that this player has finished
      io.to(roomId).emit('player-finished', {
        playerId: socket.id,
        playerName: player.name,
        wpm,
      });
      
      // Check if all players have finished
      const allFinished = room.players.every(p => p.progress === 100);
      if (allFinished) {
        // End the game
        io.to(roomId).emit('game-over', {
          players: room.players.sort((a, b) => b.wpm - a.wpm), // Sort by WPM
        });
        
        // Reset the room
        room.gameStarted = false;
        room.players.forEach(p => {
          p.progress = 0;
          p.wpm = 0;
          p.ready = false;
        });
      }
    }
  });
  
  // Leave room
  socket.on('leave-room', ({ roomId }) => {
    leaveRoom(socket, roomId);
  });
  
  // Disconnect handler
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    
    // Find and leave all rooms the user is in
    for (const [roomId, room] of rooms.entries()) {
      if (room.players.some(p => p.id === socket.id)) {
        leaveRoom(socket, roomId);
      }
    }
  });
});

// Helper function to handle leaving a room
function leaveRoom(socket, roomId) {
  const room = rooms.get(roomId);
  
  if (!room) return;
  
  // Remove player from the room
  room.players = room.players.filter(p => p.id !== socket.id);
  
  // Leave the room
  socket.leave(roomId);
  
  // If the room is empty, delete it
  if (room.players.length === 0) {
    rooms.delete(roomId);
    console.log(`Room deleted: ${roomId}`);
    return;
  }
  
  // If the host left, assign a new host
  if (room.host === socket.id) {
    room.host = room.players[0].id;
  }
  
  // Notify remaining players
  io.to(roomId).emit('player-left', {
    players: room.players,
    newHost: room.host,
  });
  
  console.log(`Player ${socket.id} left room: ${roomId}`);
}

// Generate a random room ID
function generateRoomId() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Socket.io server running on port ${PORT}`);
}); 