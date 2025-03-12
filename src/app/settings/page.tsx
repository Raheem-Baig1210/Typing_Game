'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaMoon, FaSun, FaVolumeUp, FaVolumeMute, FaPalette } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useGameStore, ThemeType } from '@/lib/store';

export default function SettingsPage() {
  const { theme, soundEnabled, setTheme, toggleSound } = useGameStore();
  const [username, setUsername] = useState('');
  
  const themeOptions: { value: ThemeType; label: string; color: string }[] = [
    { value: 'light', label: 'Light', color: 'bg-white' },
    { value: 'dark', label: 'Dark', color: 'bg-dark-200' },
    { value: 'neon', label: 'Neon', color: 'bg-gradient-to-r from-purple-500 to-pink-500' },
    { value: 'retro', label: 'Retro', color: 'bg-gradient-to-r from-amber-500 to-yellow-300' },
  ];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-primary-600 hover:text-primary-700">
          <FaArrowLeft className="mr-2" /> Back to Home
        </Link>
      </div>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Customize your typing experience with these settings.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Settings */}
        <div className="card p-6">
          <h2 className="text-xl font-bold mb-4">Profile</h2>
          
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input w-full"
              placeholder="Enter your username"
            />
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-primary"
          >
            Save Profile
          </motion.button>
        </div>
        
        {/* Appearance Settings */}
        <div className="card p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <FaPalette className="mr-2 text-secondary-500" /> Appearance
          </h2>
          
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Theme
            </label>
            <div className="grid grid-cols-2 gap-4">
              {themeOptions.map((option) => (
                <motion.div
                  key={option.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-4 rounded-lg cursor-pointer border-2 ${
                    theme === option.value ? 'border-primary-500' : 'border-transparent'
                  }`}
                  onClick={() => setTheme(option.value)}
                >
                  <div className={`h-12 w-full rounded-md ${option.color} mb-2`}></div>
                  <div className="text-center">{option.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Dark Mode
            </label>
            <div className="flex items-center">
              <button
                className={`flex items-center justify-center w-12 h-8 rounded-l-md ${
                  theme === 'dark' ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-dark-200 text-gray-700 dark:text-gray-300'
                }`}
                onClick={() => setTheme('dark')}
              >
                <FaMoon />
              </button>
              <button
                className={`flex items-center justify-center w-12 h-8 rounded-r-md ${
                  theme === 'light' ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-dark-200 text-gray-700 dark:text-gray-300'
                }`}
                onClick={() => setTheme('light')}
              >
                <FaSun />
              </button>
            </div>
          </div>
        </div>
        
        {/* Sound Settings */}
        <div className="card p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            {soundEnabled ? (
              <FaVolumeUp className="mr-2 text-secondary-500" />
            ) : (
              <FaVolumeMute className="mr-2 text-secondary-500" />
            )}
            Sound
          </h2>
          
          <div className="mb-4">
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={soundEnabled}
                  onChange={toggleSound}
                />
                <div className={`block w-14 h-8 rounded-full ${soundEnabled ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-700'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${soundEnabled ? 'transform translate-x-6' : ''}`}></div>
              </div>
              <div className="ml-3 text-gray-700 dark:text-gray-300">
                {soundEnabled ? 'Sound enabled' : 'Sound disabled'}
              </div>
            </label>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="volume">
              Volume
            </label>
            <input
              id="volume"
              type="range"
              min="0"
              max="100"
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              disabled={!soundEnabled}
            />
          </div>
        </div>
        
        {/* Game Settings */}
        <div className="card p-6">
          <h2 className="text-xl font-bold mb-4">Game Settings</h2>
          
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="difficulty">
              Difficulty
            </label>
            <select
              id="difficulty"
              className="input w-full"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
              <option value="expert">Expert</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="textLength">
              Text Length
            </label>
            <select
              id="textLength"
              className="input w-full"
            >
              <option value="short">Short</option>
              <option value="medium">Medium</option>
              <option value="long">Long</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
} 