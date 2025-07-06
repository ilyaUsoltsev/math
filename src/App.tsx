import React, { useState, useEffect } from 'react';
import { Plus, X, Star, Trophy, Sparkles, RotateCcw } from 'lucide-react';

type Operation = 'addition' | 'multiplication';

interface Problem {
  num1: number;
  num2: number;
  operation: Operation;
  correctAnswer: number;
  options: number[];
}

function App() {
  const [operation, setOperation] = useState<Operation>('addition');
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [totalProblems, setTotalProblems] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

  // Generate random wrong answers
  const generateWrongAnswers = (correctAnswer: number, operation: Operation): number[] => {
    const wrongAnswers: number[] = [];
    const range = operation === 'addition' ? 20 : 30;
    
    while (wrongAnswers.length < 3) {
      let wrongAnswer: number;
      
      if (Math.random() < 0.5) {
        // Generate answers close to correct answer
        wrongAnswer = correctAnswer + Math.floor(Math.random() * 10) - 5;
      } else {
        // Generate random answers in range
        wrongAnswer = Math.max(1, correctAnswer + Math.floor(Math.random() * range) - range/2);
      }
      
      if (wrongAnswer !== correctAnswer && !wrongAnswers.includes(wrongAnswer) && wrongAnswer > 0) {
        wrongAnswers.push(wrongAnswer);
      }
    }
    
    return wrongAnswers;
  };

  // Generate a new problem
  const generateProblem = () => {
    let num1: number, num2: number, correctAnswer: number;
    
    if (operation === 'addition') {
      num1 = Math.floor(Math.random() * 50) + 1;
      num2 = Math.floor(Math.random() * 50) + 1;
      correctAnswer = num1 + num2;
    } else {
      num1 = Math.floor(Math.random() * 12) + 1;
      num2 = Math.floor(Math.random() * 12) + 1;
      correctAnswer = num1 * num2;
    }

    const wrongAnswers = generateWrongAnswers(correctAnswer, operation);
    const allOptions = [correctAnswer, ...wrongAnswers];
    
    // Shuffle the options
    const shuffledOptions = allOptions.sort(() => Math.random() - 0.5);

    setCurrentProblem({ 
      num1, 
      num2, 
      operation, 
      correctAnswer, 
      options: shuffledOptions 
    });
    setSelectedAnswer(null);
    setFeedback(null);
    setShowCelebration(false);
    setIsAnswered(false);
  };

  // Handle answer selection
  const selectAnswer = (answer: number) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answer);
    setIsAnswered(true);
    setTotalProblems(prev => prev + 1);

    const isCorrect = answer === currentProblem?.correctAnswer;

    if (isCorrect) {
      setScore(prev => prev + 1);
      setFeedback('Awesome! 🌟');
      setShowCelebration(true);
    } else {
      setFeedback(`Not quite! The answer is ${currentProblem?.correctAnswer}. Try the next one! 💪`);
    }

    // Auto-generate next problem after delay
    setTimeout(() => {
      generateProblem();
    }, isCorrect ? 1500 : 2500);
  };

  // Reset the game
  const resetGame = () => {
    setScore(0);
    setTotalProblems(0);
    setFeedback(null);
    setShowCelebration(false);
    setIsAnswered(false);
    generateProblem();
  };

  // Generate initial problem
  useEffect(() => {
    generateProblem();
  }, [operation]);

  const accuracy = totalProblems > 0 ? Math.round((score / totalProblems) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-4 left-4 text-yellow-300 opacity-50">
            <Star className="w-6 h-6" />
          </div>
          <div className="absolute top-8 right-8 text-pink-300 opacity-50">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="absolute bottom-6 left-6 text-blue-300 opacity-50">
            <Star className="w-4 h-4" />
          </div>
          <div className="absolute bottom-4 right-4 text-purple-300 opacity-50">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8 relative z-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Math Quiz Champion! 🏆
          </h1>
          <p className="text-gray-600">Choose the correct answer!</p>
        </div>

        {/* Score Display */}
        <div className="bg-gradient-to-r from-green-400 to-green-500 rounded-2xl p-4 mb-6 text-white text-center relative z-10">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center space-x-2">
              <Trophy className="w-5 h-5" />
              <span className="font-bold text-lg">{score}</span>
            </div>
            <div className="text-sm opacity-90">
              out of {totalProblems}
            </div>
            {totalProblems > 0 && (
              <div className="text-sm opacity-90">
                ({accuracy}% correct)
              </div>
            )}
          </div>
        </div>

        {/* Operation Selection */}
        <div className="flex space-x-2 mb-6 relative z-10">
          <button
            onClick={() => setOperation('addition')}
            disabled={isAnswered}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
              operation === 'addition'
                ? 'bg-blue-500 text-white shadow-lg transform scale-105'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            } ${isAnswered ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Plus className="w-5 h-5" />
            <span>Addition</span>
          </button>
          <button
            onClick={() => setOperation('multiplication')}
            disabled={isAnswered}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
              operation === 'multiplication'
                ? 'bg-purple-500 text-white shadow-lg transform scale-105'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            } ${isAnswered ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <X className="w-5 h-5" />
            <span>Multiply</span>
          </button>
        </div>

        {/* Math Problem */}
        {currentProblem && (
          <div className="text-center mb-6 relative z-10">
            <div className="bg-gray-50 rounded-2xl p-6 mb-6">
              <div className="text-4xl font-bold text-gray-800 mb-6">
                {currentProblem.num1} {operation === 'addition' ? '+' : '×'} {currentProblem.num2} = ?
              </div>
              
              {/* Multiple Choice Options */}
              <div className="grid grid-cols-2 gap-3">
                {currentProblem.options.map((option, index) => {
                  let buttonClass = "w-full h-16 text-2xl font-bold rounded-xl transition-all duration-300 transform hover:scale-105 ";
                  
                  if (isAnswered) {
                    if (option === currentProblem.correctAnswer) {
                      buttonClass += "bg-green-500 text-white shadow-lg";
                    } else if (option === selectedAnswer && option !== currentProblem.correctAnswer) {
                      buttonClass += "bg-red-500 text-white shadow-lg";
                    } else {
                      buttonClass += "bg-gray-300 text-gray-600";
                    }
                  } else {
                    buttonClass += "bg-blue-100 hover:bg-blue-200 text-blue-800 border-2 border-blue-200 hover:border-blue-300";
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => selectAnswer(option)}
                      disabled={isAnswered}
                      className={buttonClass}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Feedback */}
        {feedback && (
          <div className={`text-center mb-6 relative z-10 ${
            showCelebration ? 'animate-bounce' : ''
          }`}>
            <div className={`p-4 rounded-xl font-bold text-lg ${
              showCelebration 
                ? 'bg-green-100 text-green-800' 
                : 'bg-orange-100 text-orange-800'
            }`}>
              {feedback}
            </div>
          </div>
        )}

        {/* Reset Button */}
        <div className="text-center relative z-10">
          <button
            onClick={resetGame}
            className="flex items-center justify-center space-x-2 mx-auto py-2 px-4 bg-gray-200 hover:bg-gray-300 rounded-xl font-semibold text-gray-700 transition-all duration-300"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Start Over</span>
          </button>
        </div>

        {/* Celebration Animation */}
        {showCelebration && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <div className="animate-ping">
              <Star className="w-16 h-16 text-yellow-400" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;