'use client';

import { useState, useEffect } from 'react';
import TypingGame from '@/components/TypingGame';
import MultiplayerProgress from '@/components/MultiplayerProgress';
import Link from 'next/link';
import { FaArrowLeft, FaUsers, FaCopy, FaCheck } from 'react-icons/fa';
import { motion } from 'framer-motion';
import socketClient, { Player } from '@/lib/socketClient';
import { useGameStore } from '@/lib/store';

export default function MultiplayerModePage() {
  const [roomId, setRoomId] = useState('');
  const [joinRoomId, setJoinRoomId] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [copied, setCopied] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isHost, setIsHost] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState('');
  
  const { wpm, position, currentText } = useGameStore();
  
  // Connect to socket server when component mounts
  useEffect(() => {
    socketClient.connect();
    
    // Set up socket event listeners
    socketClient.on('room-created', (data) => {
      setRoomId(data.roomId);
      setIsHost(data.isHost);
    });
    
    socketClient.on('room-joined', (data) => {
      setRoomId(data.roomId);
      setIsHost(data.isHost);
      setPlayers(data.players);
      useGameStore.setState({ currentText: data.text });
    });
    
    socketClient.on('player-joined', (data) => {
      setPlayers(data.players);
    });
    
    socketClient.on('players-updated', (data) => {
      setPlayers(data.players);
    });
    
    socketClient.on('game-countdown', () => {
      // Countdown will be handled by the TypingGame component
    });
    
    socketClient.on('game-started', (data) => {
      useGameStore.setState({ currentText: data.text });
      setGameStarted(true);
    });
    
    socketClient.on('progress-updated', (data) => {
      setPlayers(data.players);
    });
    
    socketClient.on('player-finished', () => {
      // This will be handled by the TypingGame component
    });
    
    socketClient.on('game-over', (data) => {
      setPlayers(data.players);
      setGameStarted(false);
      setIsReady(false);
    });
    
    socketClient.on('player-left', (data) => {
      setPlayers(data.players);
      if (data.newHost === socketClient.socket?.id) {
        setIsHost(true);
      }
    });
    
    socketClient.on('error', (data) => {
      setError(data.message);
      setTimeout(() => setError(''), 3000);
    });
    
    // Clean up event listeners when component unmounts
    return () => {
      if (roomId) {
        socketClient.leaveRoom(roomId);
      }
      
      socketClient.off('room-created');
      socketClient.off('room-joined');
      socketClient.off('player-joined');
      socketClient.off('players-updated');
      socketClient.off('game-countdown');
      socketClient.off('game-started');
      socketClient.off('progress-updated');
      socketClient.off('player-finished');
      socketClient.off('game-over');
      socketClient.off('player-left');
      socketClient.off('error');
      
      socketClient.disconnect();
    };
  }, []);
  
  // Update progress when typing
  useEffect(() => {
    if (gameStarted && roomId && currentText) {
      const progress = Math.round((position / currentText.length) * 100);
      socketClient.updateProgress(roomId, progress, wpm);
    }
  }, [position, wpm, gameStarted, roomId, currentText]);
  
  const handleCreateRoom = () => {
    if (!playerName.trim()) {
      setError('Please enter your name');
      setTimeout(() => setError(''), 3000);
      return;
    }
    
    socketClient.createRoom();
  };
  
  const handleJoinRoom = () => {
    if (!playerName.trim()) {
      setError('Please enter your name');
      setTimeout(() => setError(''), 3000);
      return;
    }
    
    if (!joinRoomId.trim()) {
      setError('Please enter a room ID');
      setTimeout(() => setError(''), 3000);
      return;
    }
    
    socketClient.joinRoom(joinRoomId.trim(), playerName);
  };
  
  const handleToggleReady = () => {
    if (!roomId) return;
    
    const newReadyState = !isReady;
    setIsReady(newReadyState);
    socketClient.setReady(roomId, newReadyState);
  };
  
  const handleCopyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  const renderLobby = () => {
    return (
      <div className="mb-8 bg-white dark:bg-dark-100 p-6 rounded-lg shadow">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md">
            {error}
          </div>
        )}
        
        {!roomId ? (
          <div>
            <h2 className="text-2xl font-bold mb-4">Join Multiplayer Game</h2>
            
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="playerName">
                Your Name
              </label>
              <input
                id="playerName"
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="input w-full"
                placeholder="Enter your name"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Create a Room</h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn btn-primary w-full"
                  onClick={handleCreateRoom}
                >
                  Create Room
                </motion.button>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Join a Room</h3>
                <div className="flex">
                  <input
                    type="text"
                    value={joinRoomId}
                    onChange={(e) => setJoinRoomId(e.target.value)}
                    className="input rounded-r-none"
                    placeholder="Enter Room ID"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-r-md h-10"
                    onClick={handleJoinRoom}
                  >
                    Join
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold mb-4">Multiplayer Lobby</h2>
            
            <div className="mb-6">
              <p className="text-gray-600 dark:text-gray-400 mb-2">Room ID:</p>
              <div className="flex items-center">
                <div className="bg-gray-100 dark:bg-dark-200 px-4 py-2 rounded-l-md font-mono text-lg">
                  {roomId}
                </div>
                <button
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-r-md"
                  onClick={handleCopyRoomId}
                >
                  {copied ? <FaCheck /> : <FaCopy />}
                </button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Share this code with friends to let them join your game.
              </p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Players</h3>
              <div className="space-y-2">
                {players.map((player) => (
                  <div
                    key={player.id}
                    className="bg-gray-50 dark:bg-dark-200 p-3 rounded-md flex justify-between items-center"
                  >
                    <div className="flex items-center">
                      <FaUsers className="text-gray-500 mr-2" />
                      <span>{player.name}</span>
                      {player.id === socketClient.socket?.id && (
                        <span className="ml-2 text-xs bg-primary-100 text-primary-800 px-2 py-0.5 rounded-full">
                          You
                        </span>
                      )}
                      {player.id === players[0]?.id && isHost && (
                        <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                          Host
                        </span>
                      )}
                    </div>
                    <div className="flex items-center">
                      {player.ready && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full mr-2">
                          Ready
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`btn ${isReady ? 'bg-green-600 hover:bg-green-700' : 'btn-primary'} w-full md:w-auto`}
                onClick={handleToggleReady}
              >
                {isReady ? 'Ready!' : 'Mark as Ready'}
              </motion.button>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-primary-600 hover:text-primary-700">
          <FaArrowLeft className="mr-2" /> Back to Home
        </Link>
      </div>
      
      {!gameStarted ? (
        renderLobby()
      ) : (
        <>
          <MultiplayerProgress 
            players={players} 
            currentPlayerId={socketClient.socket?.id || ''} 
          />
          <TypingGame mode="multiplayer" />
        </>
      )}
    </div>
  );
} 