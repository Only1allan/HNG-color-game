"use client"
import React, { useState, useCallback, useEffect } from 'react';

const ColorGame = () => {
  // State variables using useState hook
  // useState returns an array with current value and setter function
  const [targetColor, setTargetColor] = useState('');        // Color user needs to guess
  const [colorOptions, setColorOptions] = useState<string[]>([]); // Array of color choices
  const [score, setScore] = useState(0);                     // Player's current score
  const [gameStatus, setGameStatus] = useState('');          // Feedback message
  const [isAnimating, setIsAnimating] = useState(false);     // Controls button disable state
  const [textColor, setTextColor] = useState('text-gray-800'); // Controls text color for feedback

  // Helper function: Generates a random HSL color
  // If baseHue provided, uses that as starting point
  const generateRandomColor = (baseHue: number | null = null): string => {
    const hue = baseHue ?? Math.floor(Math.random() * 360);
    const saturation = 70 + Math.floor(Math.random() * 30);
    const lightness = 45 + Math.floor(Math.random() * 20);
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  // Helper function: Creates a similar color based on input hue
  const generateSimilarColor = (baseHue: number): string => {
    const hueVariation = Math.floor(Math.random() * 30) - 15;
    return generateRandomColor((baseHue + hueVariation + 360) % 360);
  };

  // useCallback hook memoizes this function to prevent unnecessary rerenders
  // Empty dependency array means function is created once and reused
  const resetGame = useCallback(() => {
    const baseHue = Math.floor(Math.random() * 360);
    const newTargetColor = generateRandomColor(baseHue);
    const options: string[] = [newTargetColor];
    
    // Generate 5 similar colors for options
    while (options.length < 6) {
      const newColor = generateSimilarColor(baseHue);
      if (!options.includes(newColor)) {
        options.push(newColor);
      }
    }

    // Shuffle color options randomly
    const shuffledOptions = [...options].sort(() => Math.random() - 0.5);
    
    // Reset all game state using setter functions
    setTargetColor(newTargetColor);
    setColorOptions(shuffledOptions);
    setGameStatus('');
    setIsAnimating(false);
    setTextColor('text-gray-800');
  }, []);

  // Function to start new game - resets score and game state
  const startNewGame = () => {
    setScore(0);
    resetGame();
  };

  // useEffect hook runs after component mounts
  // Calls resetGame to initialize game state
  // [resetGame] means effect reruns if resetGame function changes
  useEffect(() => {
    resetGame();
  }, [resetGame]);

  // Handles user's color selection
  const handleGuess = (color: string): void => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    if (color === targetColor) {
      // Correct guess: increment score, show success message
      setScore(prev => prev + 1);  // Using callback form ensures latest score
      setGameStatus('Correct! Well done! 🎉');
      setTextColor('text-green-500');
      setTimeout(() => {
        setTextColor('text-gray-800');
        resetGame();
      }, 1500);
    } else {
      // Wrong guess: show error message
      setGameStatus('Wrong guess! Try again! 😢');
      setTextColor('text-red-500');
      setTimeout(() => {
        setTextColor('text-gray-800');
        setIsAnimating(false);
      }, 1500);
    }
  };

  // Component's JSX structure
  return (
    <div className="flex flex-col items-center justify-center h-screen p-4 bg-[url('/bg.jpg')] bg-cover bg-center">
      <h1 className={`text-3xl font-bold mb-8 ${textColor} transition-colors duration-300`}>
        Color Guessing Game
      </h1>
      
      <p className="text-lg mb-6 text-gray-700 text-center" data-testid="gameInstructions">
        Can you guess which color matches the box below?
      </p>

      {/* Target color display box */}
      <div
        style={{ backgroundColor: targetColor }}
        className="w-48 h-48 rounded-lg shadow-lg mb-8 transition-all duration-300"
        data-testid="colorBox"
      />

      {/* Grid of color options */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {colorOptions.map((color: string, index: number) => (
          <button
            key={`${color}-${index}`}
            onClick={() => handleGuess(color)}
            style={{ backgroundColor: color }}
            className="w-24 h-24 rounded-lg shadow hover:shadow-xl transition-shadow duration-300 disabled:opacity-50"
            disabled={isAnimating}
            data-testid="colorOption"
          />
        ))}
      </div>

      {/* Game status message */}
      <p className={`text-xl font-semibold mb-4  ${textColor} transition-opacity duration-300 ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`} data-tesid="gameStatus">
        {gameStatus}
      </p>

      {/* Score display */}
      <p className={`text-2xl font-bold mb-6 ${textColor}` } data-testid="score">
        Score: {score}
      </p>

      {/* New game button */}
      <button
        onClick={startNewGame}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition-colors duration-300"
        data-testid="newGameButton"
      >
        New Game
      </button>
    </div>
  );
};

export default ColorGame;