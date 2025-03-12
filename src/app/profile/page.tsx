'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaUser, FaTrophy, FaChartLine, FaClock, FaCalendarAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface TypingStats {
  highestWpm: number;
  averageWpm: number;
  gamesPlayed: number;
  totalTimePlayed: number;
  lastPlayed: string | null;
}

interface GameHistory {
  id: string;
  gameMode: string;
  wpm: number;
  accuracy: number;
  textLength: number;
  duration: number;
  completedAt: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [typingStats, setTypingStats] = useState<TypingStats | null>(null);
  const [gameHistory, setGameHistory] = useState<GameHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Redirect to sign in if not authenticated
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }

    // Fetch user data if authenticated
    if (status === 'authenticated' && session?.user?.id) {
      fetchUserData();
    }
  }, [status, session, router]);

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      // In a real app, you would fetch this data from your API
      // For now, we'll use mock data
      
      // Mock typing stats
      setTypingStats({
        highestWpm: 95,
        averageWpm: 72,
        gamesPlayed: 42,
        totalTimePlayed: 7200, // 2 hours in seconds
        lastPlayed: new Date().toISOString(),
      });
      
      // Mock game history
      setGameHistory([
        {
          id: '1',
          gameMode: 'classic',
          wpm: 85,
          accuracy: 96.5,
          textLength: 250,
          duration: 180,
          completedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
        },
        {
          id: '2',
          gameMode: 'survival',
          wpm: 78,
          accuracy: 92.3,
          textLength: 150,
          duration: 120,
          completedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
        },
        {
          id: '3',
          gameMode: 'multiplayer',
          wpm: 95,
          accuracy: 98.1,
          textLength: 300,
          duration: 210,
          completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        },
        {
          id: '4',
          gameMode: 'classic',
          wpm: 82,
          accuracy: 94.7,
          textLength: 200,
          duration: 150,
          completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
        },
        {
          id: '5',
          gameMode: 'custom',
          wpm: 75,
          accuracy: 91.2,
          textLength: 400,
          duration: 320,
          completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
        },
      ]);
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-primary-600 hover:text-primary-700">
          <FaArrowLeft className="mr-2" /> Back to Home
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Profile</h1>
        <p className="text-gray-600 dark:text-gray-400">
          View your typing statistics and game history
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* User Info */}
        <div className="card p-6">
          <div className="flex items-center mb-6">
            <div className="h-16 w-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center text-primary-800 dark:text-primary-200 text-2xl font-bold">
              {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : <FaUser />}
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-bold">{session?.user?.name || 'User'}</h2>
              <p className="text-gray-600 dark:text-gray-400">{session?.user?.email}</p>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <Link href="/settings" className="btn btn-outline w-full">
              Edit Profile
            </Link>
          </div>
        </div>

        {/* Typing Stats */}
        <div className="md:col-span-2">
          <div className="card p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <FaChartLine className="mr-2 text-secondary-500" /> Typing Statistics
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 dark:bg-dark-200 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-primary-600">{typingStats?.highestWpm || 0}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Highest WPM</div>
              </div>

              <div className="bg-gray-50 dark:bg-dark-200 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-primary-600">{typingStats?.averageWpm || 0}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Average WPM</div>
              </div>

              <div className="bg-gray-50 dark:bg-dark-200 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-primary-600">{typingStats?.gamesPlayed || 0}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Games Played</div>
              </div>

              <div className="bg-gray-50 dark:bg-dark-200 p-4 rounded-lg text-center">
                <div className="text-3xl font-bold text-primary-600">
                  {typingStats ? formatTime(typingStats.totalTimePlayed) : '0m'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Time</div>
              </div>

              <div className="bg-gray-50 dark:bg-dark-200 p-4 rounded-lg text-center md:col-span-2">
                <div className="text-lg font-bold text-primary-600">
                  {typingStats?.lastPlayed ? formatDate(typingStats.lastPlayed) : 'Never'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Last Played</div>
              </div>
            </div>
          </div>
        </div>

        {/* Game History */}
        <div className="md:col-span-3">
          <div className="card p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <FaTrophy className="mr-2 text-secondary-500" /> Recent Games
            </h2>

            {gameHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>You haven't played any games yet.</p>
                <Link href="/game/classic" className="btn btn-primary mt-4">
                  Start Typing
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-dark-200">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Game Mode
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        WPM
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Accuracy
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Length
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Duration
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-dark-100 divide-y divide-gray-200 dark:divide-gray-700">
                    {gameHistory.map((game, index) => (
                      <motion.tr
                        key={game.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="hover:bg-gray-50 dark:hover:bg-dark-200"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="capitalize">{game.gameMode}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{game.wpm}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-gray-100">{game.accuracy.toFixed(1)}%</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-gray-100">{game.textLength} chars</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-gray-100">{formatTime(game.duration)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(game.completedAt)}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 