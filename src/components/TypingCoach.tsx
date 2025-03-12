'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaRobot, FaLightbulb, FaChartLine, FaTimes } from 'react-icons/fa';
import { useGameStore } from '@/lib/store';

interface TypingCoachProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TypingCoach({ isOpen, onClose }: TypingCoachProps) {
  const { userStats, errors, accuracy } = useGameStore();
  const [tips, setTips] = useState<string[]>([]);
  const [weakLetters, setWeakLetters] = useState<{ letter: string; errorRate: number }[]>([]);
  
  // Generate tips based on user performance
  useEffect(() => {
    if (!isOpen) return;
    
    const newTips: string[] = [];
    
    // Add tips based on accuracy
    if (accuracy < 90) {
      newTips.push('Focus on accuracy before speed. Slow down and try to type each character correctly.');
    }
    
    if (userStats.wpm < 30) {
      newTips.push('Practice the home row keys (ASDF JKL;) to build muscle memory.');
    } else if (userStats.wpm < 60) {
      newTips.push('Try to maintain a steady rhythm while typing instead of bursts of speed.');
    }
    
    // Add general tips
    newTips.push('Keep your wrists elevated while typing to prevent strain.');
    newTips.push('Look at the screen, not your keyboard, to improve touch typing skills.');
    newTips.push('Take short breaks every 20-30 minutes to rest your hands and eyes.');
    
    // Shuffle and limit the tips
    const shuffledTips = newTips.sort(() => 0.5 - Math.random()).slice(0, 3);
    setTips(shuffledTips);
    
    // Generate mock weak letters data
    // In a real implementation, this would analyze the user's typing patterns
    const mockWeakLetters = [
      { letter: 'R', errorRate: 35 },
      { letter: 'T', errorRate: 28 },
      { letter: 'Y', errorRate: 22 },
      { letter: 'P', errorRate: 18 },
      { letter: 'Q', errorRate: 15 },
    ];
    
    setWeakLetters(mockWeakLetters);
  }, [isOpen, accuracy, userStats.wpm]);
  
  if (!isOpen) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
    >
      <div className="bg-white dark:bg-dark-100 rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold flex items-center">
            <FaRobot className="mr-2 text-primary-500" /> AI Typing Coach
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <FaTimes />
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <FaLightbulb className="mr-2 text-yellow-500" /> Personalized Tips
            </h3>
            <ul className="space-y-2">
              {tips.map((tip, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start"
                >
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 mr-2">
                    {index + 1}
                  </span>
                  <span>{tip}</span>
                </motion.li>
              ))}
            </ul>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <FaChartLine className="mr-2 text-secondary-500" /> Your Weak Spots
            </h3>
            <div className="grid grid-cols-5 gap-2">
              {weakLetters.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col items-center"
                >
                  <div className="h-16 w-16 rounded-lg bg-gray-100 dark:bg-dark-200 flex items-center justify-center text-2xl font-bold mb-1">
                    {item.letter}
                  </div>
                  <div className="text-sm text-red-500">{item.errorRate}% errors</div>
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Practice Exercises</h3>
            <div className="bg-gray-50 dark:bg-dark-200 p-4 rounded-lg">
              <p className="mb-2 font-medium">Try this exercise to improve:</p>
              <p className="font-mono text-gray-700 dark:text-gray-300">
                {weakLetters.map(item => item.letter).join(' ')} {weakLetters.map(item => item.letter.toLowerCase()).join(' ')}
              </p>
              <p className="mt-4 font-mono text-gray-700 dark:text-gray-300">
                {weakLetters.map(item => `${item.letter}${item.letter.toLowerCase()}`).join(' ')} {weakLetters.map(item => `${item.letter.toLowerCase()}${item.letter}`).join(' ')}
              </p>
            </div>
          </div>
          
          <div className="flex justify-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-primary"
              onClick={onClose}
            >
              Got it!
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 