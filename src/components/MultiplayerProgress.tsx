'use client';

import { motion } from 'framer-motion';
import { Player } from '@/lib/socketClient';
import { FaTrophy, FaUser, FaFlag } from 'react-icons/fa';

interface MultiplayerProgressProps {
  players: Player[];
  currentPlayerId: string;
}

export default function MultiplayerProgress({ players, currentPlayerId }: MultiplayerProgressProps) {
  // Sort players by progress (highest first)
  const sortedPlayers = [...players].sort((a, b) => b.progress - a.progress);
  
  return (
    <div className="multiplayer-progress mb-8">
      <h3 className="text-lg font-semibold mb-4">Race Progress</h3>
      
      <div className="space-y-4">
        {sortedPlayers.map((player, index) => {
          const isCurrentPlayer = player.id === currentPlayerId;
          
          return (
            <div
              key={player.id}
              className={`relative ${isCurrentPlayer ? 'border-2 border-primary-500' : 'border border-gray-200 dark:border-gray-700'} rounded-lg p-4`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isCurrentPlayer ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'}`}>
                    {index === 0 ? (
                      <FaTrophy className="text-yellow-500" />
                    ) : (
                      <FaUser />
                    )}
                  </div>
                  <span className={`ml-2 font-medium ${isCurrentPlayer ? 'text-primary-600 dark:text-primary-400' : ''}`}>
                    {player.name} {isCurrentPlayer && '(You)'}
                  </span>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {player.wpm > 0 ? `${player.wpm} WPM` : ''}
                </div>
              </div>
              
              <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${player.progress}%` }}
                  transition={{ duration: 0.5 }}
                  className={`h-full ${isCurrentPlayer ? 'bg-primary-500' : 'bg-secondary-500'}`}
                />
              </div>
              
              {player.progress === 100 && (
                <div className="absolute right-2 top-2">
                  <FaFlag className="text-green-500" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
} 