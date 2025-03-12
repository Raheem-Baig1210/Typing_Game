'use client';

import TypingGame from '@/components/TypingGame';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

export default function SurvivalModePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center text-primary-600 hover:text-primary-700">
          <FaArrowLeft className="mr-2" /> Back to Home
        </Link>
      </div>
      
      <TypingGame mode="survival" />
    </div>
  );
} 