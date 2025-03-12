'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/lib/store';
import { getRandomText, getLongText, getWordList } from '@/utils/sampleTexts';
import { FaPause, FaPlay, FaRedo, FaCog, FaVolumeUp, FaVolumeMute, FaRobot } from 'react-icons/fa';
import TypingCoach from './TypingCoach';

interface TypingGameProps {
  mode: 'classic' | 'survival' | 'custom' | 'multiplayer';
}

export default function TypingGame({ mode }: TypingGameProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const textDisplayRef = useRef<HTMLDivElement>(null);
  
  const {
    gameMode,
    isPlaying,
    isPaused,
    isGameOver,
    currentText,
    userInput,
    position,
    errors,
    wpm,
    accuracy,
    soundEnabled,
    startGame,
    pauseGame,
    resumeGame,
    endGame,
    resetGame,
    updateUserInput,
    toggleSound,
    setGameMode,
  } = useGameStore();
  
  const [countdown, setCountdown] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [survivalWords, setSurvivalWords] = useState<string[]>([]);
  const [wordTimeouts, setWordTimeouts] = useState<{ [key: string]: NodeJS.Timeout }>({});
  const [isCoachOpen, setIsCoachOpen] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  
  // Set the game mode when the component mounts
  useEffect(() => {
    setGameMode(mode);
    
    // Initialize game based on mode
    if (mode === 'classic') {
      initClassicMode();
    } else if (mode === 'survival') {
      initSurvivalMode();
    } else if (mode === 'custom') {
      initCustomMode();
    } else if (mode === 'multiplayer') {
      initMultiplayerMode();
    }
    
    // Focus the input field when the component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
    
    // Clean up when the component unmounts
    return () => {
      resetGame();
    };
  }, [mode, setGameMode, resetGame]);
  
  // Focus the input field when the game starts
  useEffect(() => {
    if (isPlaying && !isPaused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isPlaying, isPaused]);
  
  // Update WPM and elapsed time
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && !isPaused && !isGameOver) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, isPaused, isGameOver]);
  
  // Countdown effect
  useEffect(() => {
    if (countdown === null) return;
    
    console.log(`Countdown: ${countdown}`);
    
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else {
      console.log("Countdown finished, starting game...");
      startGame(currentText);
      setCountdown(null);
      
      // Focus the input field after the countdown
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  }, [countdown, startGame, currentText]);
  
  // Initialize different game modes
  const initClassicMode = () => {
    const text = getRandomText();
    useGameStore.setState({ currentText: text });
    console.log("Classic mode initialized with text:", text);
  };
  
  const initSurvivalMode = () => {
    const words = getWordList(20);
    setSurvivalWords(words);
    const text = words.join(' ');
    useGameStore.setState({ currentText: text });
    console.log("Survival mode initialized with words:", words);
  };
  
  const initCustomMode = () => {
    // If there are custom texts, use the first one, otherwise use a random text
    const { customTexts } = useGameStore.getState();
    const text = customTexts.length > 0 ? customTexts[0] : getRandomText();
    useGameStore.setState({ currentText: text });
    console.log("Custom mode initialized with text:", text);
  };
  
  const initMultiplayerMode = () => {
    // For now, just use a random text. In a real implementation, this would be synchronized with other players
    const text = getRandomText();
    useGameStore.setState({ currentText: text });
    console.log("Multiplayer mode initialized with text:", text);
  };
  
  // Start the game with a countdown
  const handleStartGame = () => {
    console.log("Starting game with countdown...");
    // Make sure the input field is focused
    if (inputRef.current) {
      inputRef.current.focus();
    }
    setCountdown(3);
  };
  
  // Handle user input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    updateUserInput(input);
    
    // Scroll the text display to keep the current position visible
    if (textDisplayRef.current) {
      const charElements = textDisplayRef.current.querySelectorAll('.char');
      if (charElements[position]) {
        charElements[position].scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
    
    // In survival mode, remove words as they are completed
    if (mode === 'survival' && input.endsWith(' ')) {
      const typedWords = input.trim().split(' ');
      const lastTypedWord = typedWords[typedWords.length - 1];
      
      if (survivalWords.includes(lastTypedWord)) {
        // Remove the word from the survival words
        setSurvivalWords(prev => prev.filter(word => word !== lastTypedWord));
        
        // Clear the timeout for this word
        if (wordTimeouts[lastTypedWord]) {
          clearTimeout(wordTimeouts[lastTypedWord]);
          setWordTimeouts(prev => {
            const newTimeouts = { ...prev };
            delete newTimeouts[lastTypedWord];
            return newTimeouts;
          });
        }
      }
    }
  };
  
  // Render the text with highlighting for the current position
  const renderText = () => {
    if (!currentText) return null;
    
    return (
      <div ref={textDisplayRef} className="text-display text-lg md:text-xl leading-relaxed mb-8 overflow-auto max-h-40 p-4 bg-white dark:bg-dark-100 rounded-lg shadow">
        {currentText.split('').map((char, index) => {
          let className = 'char';
          
          if (index < position) {
            // Character has been typed
            className += userInput[index] === char
              ? ' text-green-500' // Correct
              : ' text-red-500';  // Incorrect
          } else if (index === position) {
            // Current character
            className += ' bg-primary-200 dark:bg-primary-800';
          }
          
          return (
            <span key={index} className={className}>
              {char}
            </span>
          );
        })}
      </div>
    );
  };
  
  // Render survival mode words
  const renderSurvivalWords = () => {
    if (mode !== 'survival') return null;
    
    return (
      <div className="survival-words flex flex-wrap gap-2 mb-8">
        {survivalWords.map((word, index) => (
          <motion.div
            key={`${word}-${index}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="word-bubble bg-primary-100 dark:bg-primary-900 px-3 py-1 rounded-full"
          >
            {word}
          </motion.div>
        ))}
      </div>
    );
  };
  
  // Render game stats
  const renderStats = () => {
    return (
      <div className="stats grid grid-cols-3 gap-4 mb-6">
        <div className="stat bg-white dark:bg-dark-100 p-4 rounded-lg shadow text-center">
          <div className="stat-title text-gray-500 dark:text-gray-400 text-sm">WPM</div>
          <div className="stat-value text-2xl font-bold">{wpm}</div>
        </div>
        <div className="stat bg-white dark:bg-dark-100 p-4 rounded-lg shadow text-center">
          <div className="stat-title text-gray-500 dark:text-gray-400 text-sm">Accuracy</div>
          <div className="stat-value text-2xl font-bold">{accuracy}%</div>
        </div>
        <div className="stat bg-white dark:bg-dark-100 p-4 rounded-lg shadow text-center">
          <div className="stat-title text-gray-500 dark:text-gray-400 text-sm">Time</div>
          <div className="stat-value text-2xl font-bold">{elapsedTime}s</div>
        </div>
      </div>
    );
  };
  
  // Render game controls
  const renderControls = () => {
    return (
      <div className="controls flex items-center justify-center gap-4 mb-8">
        {!isPlaying && !isGameOver && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-primary"
            onClick={handleStartGame}
          >
            <FaPlay className="mr-2" /> Start
          </motion.button>
        )}
        
        {isPlaying && !isPaused && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-secondary"
            onClick={pauseGame}
          >
            <FaPause className="mr-2" /> Pause
          </motion.button>
        )}
        
        {isPlaying && isPaused && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-primary"
            onClick={resumeGame}
          >
            <FaPlay className="mr-2" /> Resume
          </motion.button>
        )}
        
        {(isGameOver || isPlaying) && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-outline"
            onClick={resetGame}
          >
            <FaRedo className="mr-2" /> Reset
          </motion.button>
        )}
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn btn-outline"
          onClick={toggleSound}
        >
          {soundEnabled ? <FaVolumeUp className="mr-2" /> : <FaVolumeMute className="mr-2" />}
          Sound
        </motion.button>
        
        {isGameOver && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-outline"
            onClick={() => setIsCoachOpen(true)}
          >
            <FaRobot className="mr-2" /> AI Coach
          </motion.button>
        )}
      </div>
    );
  };
  
  // Render game over screen
  const renderGameOver = () => {
    if (!isGameOver) return null;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="game-over bg-white dark:bg-dark-100 p-6 rounded-lg shadow-lg text-center"
      >
        <h2 className="text-2xl font-bold mb-4">Game Over!</h2>
        <div className="results grid grid-cols-2 gap-4 mb-6">
          <div className="result">
            <div className="result-title text-gray-500 dark:text-gray-400">WPM</div>
            <div className="result-value text-3xl font-bold">{wpm}</div>
          </div>
          <div className="result">
            <div className="result-title text-gray-500 dark:text-gray-400">Accuracy</div>
            <div className="result-value text-3xl font-bold">{accuracy}%</div>
          </div>
        </div>
        <div className="flex justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-primary"
            onClick={() => {
              resetGame();
              handleStartGame();
            }}
          >
            Play Again
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-secondary"
            onClick={() => setIsCoachOpen(true)}
          >
            <FaRobot className="mr-2" /> Get Tips
          </motion.button>
        </div>
      </motion.div>
    );
  };
  
  // Render countdown
  const renderCountdown = () => {
    if (countdown === null) return null;
    
    return (
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        className="countdown absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10"
      >
        <div className="text-6xl font-bold text-white">{countdown}</div>
      </motion.div>
    );
  };
  
  // Add a click handler to the game container to refocus the input
  const handleContainerClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  // Toggle debug mode
  const toggleDebug = () => {
    setShowDebug(!showDebug);
  };
  
  // Debug information
  const renderDebug = () => {
    if (!showDebug) return null;
    
    return (
      <div className="debug-info mt-8 p-4 bg-gray-100 dark:bg-dark-200 rounded-lg text-sm">
        <h3 className="font-bold mb-2">Debug Info:</h3>
        <pre className="whitespace-pre-wrap">
          {JSON.stringify({
            gameMode,
            isPlaying,
            isPaused,
            isGameOver,
            currentText: currentText ? `${currentText.substring(0, 20)}...` : null,
            userInput: userInput ? `${userInput.substring(0, 20)}...` : null,
            position,
            errors,
            wpm,
            accuracy,
            countdown,
          }, null, 2)}
        </pre>
      </div>
    );
  };
  
  return (
    <div className="typing-game relative max-w-4xl mx-auto p-4" onClick={handleContainerClick}>
      <h1 className="text-3xl font-bold mb-6 text-center">
        {mode === 'classic' && 'Classic Mode'}
        {mode === 'survival' && 'Survival Mode'}
        {mode === 'custom' && 'Custom Mode'}
        {mode === 'multiplayer' && 'Multiplayer Mode'}
      </h1>
      
      <div className="absolute top-4 right-4">
        <button 
          onClick={toggleDebug} 
          className="text-xs bg-gray-200 dark:bg-dark-300 px-2 py-1 rounded"
        >
          {showDebug ? 'Hide Debug' : 'Show Debug'}
        </button>
      </div>
      
      {renderStats()}
      {renderControls()}
      
      {mode === 'survival' && renderSurvivalWords()}
      
      {!isGameOver && renderText()}
      
      {isPlaying && !isPaused && !isGameOver && (
        <div className="input-container mb-8">
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={handleInputChange}
            className="input w-full p-3 text-lg border-2 border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-200 dark:border-primary-700 dark:text-white"
            placeholder="Start typing..."
            disabled={!isPlaying || isPaused || isGameOver}
            autoFocus
          />
        </div>
      )}
      
      {isGameOver && renderGameOver()}
      {countdown !== null && renderCountdown()}
      {isCoachOpen && <TypingCoach onClose={() => setIsCoachOpen(false)} />}
      
      {renderDebug()}
    </div>
  );
} 