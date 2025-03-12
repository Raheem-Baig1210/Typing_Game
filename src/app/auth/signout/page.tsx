'use client';

import { useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaSignOutAlt } from 'react-icons/fa';

export default function SignOut() {
  const router = useRouter();

  useEffect(() => {
    // Automatically sign out after a short delay
    const timer = setTimeout(() => {
      signOut({ redirect: false }).then(() => {
        router.push('/');
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gray-50 dark:bg-dark-200">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-dark-100 rounded-lg shadow-md p-8 text-center max-w-md w-full"
      >
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
            <FaSignOutAlt className="h-8 w-8 text-red-600 dark:text-red-300" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold mb-4">Signing Out...</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          You are being signed out of your account. You will be redirected to the home page shortly.
        </p>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 2 }}
            className="bg-primary-600 h-2.5 rounded-full"
          />
        </div>
      </motion.div>
    </div>
  );
} 