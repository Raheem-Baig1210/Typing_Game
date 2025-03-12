'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaKeyboard, FaChartLine, FaTrophy, FaUsers, FaCog } from 'react-icons/fa';

export default function Home() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex flex-col items-center min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-gray-100 dark:from-dark-200 dark:to-dark-300">
        <div className="container px-4 md:px-6 mx-auto flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
              <span className="gradient-text">TypeMaster</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-[700px] mx-auto">
              Improve your typing speed and accuracy with our interactive typing game
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 flex flex-col sm:flex-row gap-4"
          >
            <Link href="/game/classic" passHref>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-primary"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                Start Typing
              </motion.button>
            </Link>
            <Link href="/leaderboard" passHref>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-outline"
              >
                View Leaderboard
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Game Modes Section */}
      <section className="w-full py-12 md:py-24 bg-white dark:bg-dark-100">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Game Modes</h2>
            <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Choose from multiple game modes to improve your typing skills
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {[
              {
                title: 'Classic Mode',
                description: 'Type a given text as fast as possible',
                icon: <FaKeyboard className="h-10 w-10 text-primary-500" />,
                href: '/game/classic',
              },
              {
                title: 'Survival Mode',
                description: 'Words disappear if not typed quickly',
                icon: <FaChartLine className="h-10 w-10 text-primary-500" />,
                href: '/game/survival',
              },
              {
                title: 'Custom Mode',
                description: 'Add your own texts to practice with',
                icon: <FaCog className="h-10 w-10 text-primary-500" />,
                href: '/game/custom',
              },
              {
                title: 'Multiplayer Mode',
                description: 'Compete with friends in real-time',
                icon: <FaUsers className="h-10 w-10 text-primary-500" />,
                href: '/game/multiplayer',
              },
            ].map((mode, index) => (
              <Link key={index} href={mode.href} passHref>
                <motion.div
                  whileHover={{ y: -5 }}
                  className="card p-6 flex flex-col items-center text-center cursor-pointer"
                >
                  {mode.icon}
                  <h3 className="mt-4 text-xl font-bold">{mode.title}</h3>
                  <p className="mt-2 text-gray-500 dark:text-gray-400">{mode.description}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 bg-gray-50 dark:bg-dark-200">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Features</h2>
            <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Our typing game comes with a variety of features to help you improve
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {[
              {
                title: 'AI-Based Typing Coach',
                description: 'Get personalized suggestions based on your typing patterns',
                icon: <FaChartLine className="h-8 w-8 text-secondary-500" />,
              },
              {
                title: 'Leaderboard & Ranking',
                description: 'Compete with others and track your progress on the leaderboard',
                icon: <FaTrophy className="h-8 w-8 text-secondary-500" />,
              },
              {
                title: 'Themed UI & Customization',
                description: 'Customize the interface with different themes and settings',
                icon: <FaCog className="h-8 w-8 text-secondary-500" />,
              },
              {
                title: 'WPM & Accuracy Tracking',
                description: 'Monitor your typing speed and accuracy in real-time',
                icon: <FaChartLine className="h-8 w-8 text-secondary-500" />,
              },
              {
                title: 'Real-Time Multiplayer',
                description: 'Race against friends with live scores and rankings',
                icon: <FaUsers className="h-8 w-8 text-secondary-500" />,
              },
              {
                title: 'Gamification Elements',
                description: 'Earn achievements and complete daily challenges',
                icon: <FaTrophy className="h-8 w-8 text-secondary-500" />,
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="card p-6 flex flex-col items-center text-center"
              >
                {feature.icon}
                <h3 className="mt-4 text-xl font-bold">{feature.title}</h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 bg-white dark:bg-dark-100 border-t border-gray-200 dark:border-gray-800">
        <div className="container px-4 md:px-6 mx-auto flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} TypeMaster. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Link href="/about" className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
              About
            </Link>
            <Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
} 