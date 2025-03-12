'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaTrophy, FaMedal, FaAward, FaFilter } from 'react-icons/fa';
import { motion } from 'framer-motion';

// Mock leaderboard data
const mockLeaderboardData = [
  { id: 1, username: 'SpeedTyper', wpm: 120, accuracy: 98.5, streak: 15, date: '2023-12-01' },
  { id: 2, username: 'KeyboardNinja', wpm: 115, accuracy: 97.2, streak: 12, date: '2023-12-02' },
  { id: 3, username: 'TypeMaster', wpm: 110, accuracy: 99.0, streak: 10, date: '2023-12-03' },
  { id: 4, username: 'SwiftFingers', wpm: 105, accuracy: 96.8, streak: 8, date: '2023-12-01' },
  { id: 5, username: 'WordWizard', wpm: 102, accuracy: 95.5, streak: 7, date: '2023-12-04' },
  { id: 6, username: 'RapidTypist', wpm: 98, accuracy: 94.2, streak: 5, date: '2023-12-02' },
  { id: 7, username: 'KeyMaster', wpm: 95, accuracy: 93.8, streak: 4, date: '2023-12-03' },
  { id: 8, username: 'SpeedDemon', wpm: 92, accuracy: 92.5, streak: 3, date: '2023-12-04' },
  { id: 9, username: 'QuickKeys', wpm: 90, accuracy: 91.0, streak: 2, date: '2023-12-01' },
  { id: 10, username: 'FlashTyper', wpm: 88, accuracy: 90.5, streak: 1, date: '2023-12-02' },
];

type SortField = 'wpm' | 'accuracy' | 'streak' | 'date';

export default function LeaderboardPage() {
  const [sortField, setSortField] = useState<SortField>('wpm');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  const sortedData = [...mockLeaderboardData].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-primary-600 hover:text-primary-700">
          <FaArrowLeft className="mr-2" /> Back to Home
        </Link>
      </div>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
        <p className="text-gray-600 dark:text-gray-400">
          See how you stack up against other typists from around the world.
        </p>
      </div>
      
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center">
          <span className="text-gray-700 dark:text-gray-300 mr-2">Filter:</span>
          <div className="flex bg-white dark:bg-dark-100 rounded-md shadow-sm">
            {(['all', 'today', 'week', 'month'] as const).map((filter) => (
              <button
                key={filter}
                className={`px-3 py-1.5 text-sm ${
                  timeFilter === filter
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-200'
                } ${filter === 'all' ? 'rounded-l-md' : ''} ${filter === 'month' ? 'rounded-r-md' : ''}`}
                onClick={() => setTimeFilter(filter)}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center">
          <FaFilter className="text-gray-500 mr-2" />
          <span className="text-gray-700 dark:text-gray-300 mr-2">Sort by:</span>
          <select
            className="bg-white dark:bg-dark-100 border border-gray-300 dark:border-gray-700 rounded-md px-2 py-1 text-sm"
            value={`${sortField}-${sortDirection}`}
            onChange={(e) => {
              const [field, direction] = e.target.value.split('-');
              setSortField(field as SortField);
              setSortDirection(direction as 'asc' | 'desc');
            }}
          >
            <option value="wpm-desc">WPM (Highest)</option>
            <option value="wpm-asc">WPM (Lowest)</option>
            <option value="accuracy-desc">Accuracy (Highest)</option>
            <option value="accuracy-asc">Accuracy (Lowest)</option>
            <option value="streak-desc">Streak (Highest)</option>
            <option value="date-desc">Date (Newest)</option>
            <option value="date-asc">Date (Oldest)</option>
          </select>
        </div>
      </div>
      
      <div className="bg-white dark:bg-dark-100 rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-dark-200">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Rank
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                User
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('wpm')}
              >
                WPM {sortField === 'wpm' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('accuracy')}
              >
                Accuracy {sortField === 'accuracy' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('streak')}
              >
                Streak {sortField === 'streak' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('date')}
              >
                Date {sortField === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-dark-100 divide-y divide-gray-200 dark:divide-gray-700">
            {sortedData.map((entry, index) => (
              <motion.tr 
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="hover:bg-gray-50 dark:hover:bg-dark-200"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {index === 0 ? (
                      <FaTrophy className="text-yellow-500 mr-2" />
                    ) : index === 1 ? (
                      <FaMedal className="text-gray-400 mr-2" />
                    ) : index === 2 ? (
                      <FaAward className="text-amber-700 mr-2" />
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400 font-medium">{index + 1}</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-800 dark:text-primary-200 font-bold">
                      {entry.username.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{entry.username}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-gray-100">{entry.wpm}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-gray-100">{entry.accuracy}%</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-gray-100">{entry.streak} days</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {entry.date}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 