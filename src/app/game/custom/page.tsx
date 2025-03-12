'use client';

import { useState } from 'react';
import TypingGame from '@/components/TypingGame';
import Link from 'next/link';
import { FaArrowLeft, FaPlus, FaTrash } from 'react-icons/fa';
import { useGameStore } from '@/lib/store';
import { motion } from 'framer-motion';

export default function CustomModePage() {
  const [newText, setNewText] = useState('');
  const { customTexts, addCustomText, removeCustomText } = useGameStore();

  const handleAddText = () => {
    if (newText.trim()) {
      addCustomText(newText.trim());
      setNewText('');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-primary-600 hover:text-primary-700">
          <FaArrowLeft className="mr-2" /> Back to Home
        </Link>
      </div>

      <div className="mb-8 bg-white dark:bg-dark-100 p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Custom Texts</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Add your own texts to practice with. These texts will be available in the custom mode.
        </p>

        <div className="mb-4">
          <textarea
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            className="input min-h-[100px] w-full"
            placeholder="Enter your custom text here..."
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn btn-primary mb-6"
          onClick={handleAddText}
        >
          <FaPlus className="mr-2" /> Add Text
        </motion.button>

        <div className="custom-texts space-y-4">
          {customTexts.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 italic">
              No custom texts added yet. Add some texts above to get started.
            </p>
          ) : (
            customTexts.map((text, index) => (
              <div
                key={index}
                className="custom-text bg-gray-50 dark:bg-dark-200 p-4 rounded-md flex justify-between items-start"
              >
                <p className="text-sm text-gray-700 dark:text-gray-300 flex-1 mr-4">
                  {text.length > 100 ? `${text.substring(0, 100)}...` : text}
                </p>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => removeCustomText(index)}
                >
                  <FaTrash />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <TypingGame mode="custom" />
    </div>
  );
} 