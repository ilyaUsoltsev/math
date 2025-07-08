import React, { useState, useEffect } from 'react';
import {
  Plus,
  X,
  Star,
  Trophy,
  Sparkles,
  RotateCcw,
  Minus,
  Percent,
  Baby,
  BookOpen,
  GraduationCap,
  Brain,
} from 'lucide-react';

type Operation = 'addition' | 'multiplication' | 'subtraction' | 'division';

type AgeGroup = 'baby' | 'little' | 'explorer' | 'apprentice';

interface AgeGroupConfig {
  name: string;
  icon: React.ReactNode;
  description: string;
  maxNumber: number;
  operations: Operation[];
  color: string;
}

interface Problem {
  num1: number;
  num2: number;
  operation: Operation;
  correctAnswer: number;
  options: number[];
}

function App() {
  const [selectedAgeGroup, setSelectedAgeGroup] =
    useState<AgeGroup>('explorer');
  const [selectedOperations, setSelectedOperations] = useState<Set<Operation>>(
    new Set(['addition', 'subtraction', 'multiplication', 'division'])
  );
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [totalProblems, setTotalProblems] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

  // Age group configurations
  const ageGroups: Record<AgeGroup, AgeGroupConfig> = {
    baby: {
      name: 'Baby Brain (Ages 3–5)',
      icon: <Baby className='w-5 h-5' />,
      description: 'Basic shapes, colors, number recognition',
      maxNumber: 5,
      operations: ['addition'],
      color: 'bg-pink-500',
    },
    little: {
      name: 'Little Learner (Ages 5–7)',
      icon: <BookOpen className='w-5 h-5' />,
      description: 'Addition/subtraction within 10',
      maxNumber: 10,
      operations: ['addition', 'subtraction'],
      color: 'bg-blue-500',
    },
    explorer: {
      name: 'Learner (Ages 7–9)',
      icon: <Brain className='w-5 h-5' />,
      description:
        'Multiplication, division within 10, Addition/subtraction within 100',
      maxNumber: 100,
      operations: ['addition', 'subtraction', 'multiplication', 'division'],
      color: 'bg-purple-500',
    },
    apprentice: {
      name: 'Student (Ages 9–11)',
      icon: <GraduationCap className='w-5 h-5' />,
      description:
        'Fractions, decimals, Multiplication/division within 100, Addition/subtraction within 1000',
      maxNumber: 1000,
      operations: ['addition', 'subtraction', 'multiplication', 'division'],
      color: 'bg-green-500',
    },
  };

  // Select age group
  const selectAgeGroup = (ageGroup: AgeGroup) => {
    if (isAnswered) return;

    setSelectedAgeGroup(ageGroup);
    const config = ageGroups[ageGroup];
    setSelectedOperations(new Set(config.operations));
  };

  // Toggle operation selection
  const toggleOperation = (operation: Operation) => {
    if (isAnswered) return;

    const newSelectedOperations = new Set(selectedOperations);
    if (newSelectedOperations.has(operation)) {
      newSelectedOperations.delete(operation);
    } else {
      newSelectedOperations.add(operation);
    }

    // Ensure at least one operation is selected
    if (newSelectedOperations.size === 0) {
      newSelectedOperations.add('addition');
    }

    setSelectedOperations(newSelectedOperations);
  };

  // Generate random wrong answers
  const generateWrongAnswers = (
    correctAnswer: number,
    operation: Operation
  ): number[] => {
    const wrongAnswers: number[] = [];
    let range = 20;

    switch (operation) {
      case 'addition':
        range = 20;
        break;
      case 'subtraction':
        range = 20;
        break;
      case 'multiplication':
        range = 30;
        break;
      case 'division':
        range = 25;
        break;
    }

    while (wrongAnswers.length < 3) {
      let wrongAnswer: number;

      if (Math.random() < 0.5) {
        // Generate answers close to correct answer
        wrongAnswer = correctAnswer + Math.floor(Math.random() * 10) - 5;
      } else {
        // Generate random answers in range
        wrongAnswer = Math.max(
          1,
          correctAnswer + Math.floor(Math.random() * range) - range / 2
        );
      }

      if (
        wrongAnswer !== correctAnswer &&
        !wrongAnswers.includes(wrongAnswer) &&
        wrongAnswer > 0
      ) {
        wrongAnswers.push(wrongAnswer);
      }
    }

    return wrongAnswers;
  };

  // Generate a new problem
  const generateProblem = () => {
    if (selectedOperations.size === 0) return;

    const config = ageGroups[selectedAgeGroup];
    const maxNumber = config.maxNumber;

    // Select a random operation from the selected ones
    const operationsArray = Array.from(selectedOperations);
    const randomOperation =
      operationsArray[Math.floor(Math.random() * operationsArray.length)];

    let num1: number, num2: number, correctAnswer: number;

    switch (randomOperation) {
      case 'addition':
        if (selectedAgeGroup === 'baby') {
          // Baby Brain: Simple counting with shapes
          num1 = Math.floor(Math.random() * 3) + 1;
          num2 = Math.floor(Math.random() * 3) + 1;
        } else {
          num1 = Math.floor(Math.random() * maxNumber) + 1;
          num2 = Math.floor(Math.random() * maxNumber) + 1;
        }
        correctAnswer = num1 + num2;
        break;
      case 'subtraction':
        num1 = Math.floor(Math.random() * maxNumber) + 1;
        num2 = Math.floor(Math.random() * num1) + 1; // Ensure positive result
        correctAnswer = num1 - num2;
        break;
      case 'multiplication':
        if (selectedAgeGroup === 'explorer') {
          // Math Explorer: within 10
          num1 = Math.floor(Math.random() * 10) + 1;
          num2 = Math.floor(Math.random() * 10) + 1;
        } else {
          // Apprentice: within 100
          num1 = Math.floor(Math.random() * 100) + 1;
          num2 = Math.floor(Math.random() * 100) + 1;
        }
        correctAnswer = num1 * num2;
        break;
      case 'division':
        if (selectedAgeGroup === 'explorer') {
          // Math Explorer: within 10
          num2 = Math.floor(Math.random() * 10) + 1;
          const product = Math.floor(Math.random() * 10) + 1;
          num1 = num2 * product; // Ensure whole number result
        } else {
          // Apprentice: within 100
          num2 = Math.floor(Math.random() * 100) + 1;
          const product = Math.floor(Math.random() * 100) + 1;
          num1 = num2 * product; // Ensure whole number result
        }
        correctAnswer = num1 / num2;
        break;
    }

    const wrongAnswers = generateWrongAnswers(correctAnswer, randomOperation);
    const allOptions = [correctAnswer, ...wrongAnswers];

    // Shuffle the options
    const shuffledOptions = allOptions.sort(() => Math.random() - 0.5);

    setCurrentProblem({
      num1,
      num2,
      operation: randomOperation,
      correctAnswer,
      options: shuffledOptions,
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
    setTotalProblems((prev) => prev + 1);

    const isCorrect = answer === currentProblem?.correctAnswer;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      setFeedback('Good! 🌟');
      setShowCelebration(true);
    } else {
      setFeedback(
        `Not quite! The answer is ${currentProblem?.correctAnswer}. Try the next one! 💪`
      );
    }

    // Auto-generate next problem after delay
    setTimeout(
      () => {
        generateProblem();
      },
      isCorrect ? 1000 : 2500
    );
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
  }, [selectedOperations, selectedAgeGroup]);

  const accuracy =
    totalProblems > 0 ? Math.round((score / totalProblems) * 100) : 0;

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center p-4'>
      <div className='bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full relative overflow-hidden'>
        {/* Background decoration */}
        <div className='absolute top-0 left-0 w-full h-full pointer-events-none'>
          <div className='absolute top-4 left-4 text-yellow-300 opacity-50'>
            <Star className='w-6 h-6' />
          </div>
          <div className='absolute top-8 right-8 text-pink-300 opacity-50'>
            <Sparkles className='w-5 h-5' />
          </div>
          <div className='absolute bottom-6 left-6 text-blue-300 opacity-50'>
            <Star className='w-4 h-4' />
          </div>
          <div className='absolute bottom-4 right-4 text-purple-300 opacity-50'>
            <Sparkles className='w-6 h-6' />
          </div>
        </div>

        {/* Header */}
        <div className='text-center mb-4 relative z-10'>
          <h1 className='text-2xl font-bold text-gray-800 mb-2'>
            Math Quiz Champion! 🏆
          </h1>
        </div>

        {/* Score Display */}
        <div className='bg-gradient-to-r from-green-400 to-green-500 rounded-2xl p-2 mb-4 text-white text-center relative z-10'>
          <div className='flex items-center justify-center space-x-4'>
            <div className='flex items-center space-x-2'>
              <Trophy className='w-5 h-5' />
              <span className='font-bold text-lg'>{score}</span>
            </div>
            <div className='text-sm opacity-90'>out of {totalProblems}</div>
            {totalProblems > 0 && (
              <div className='text-sm opacity-90'>({accuracy}% correct)</div>
            )}
          </div>
        </div>

        {/* Age Group Selection */}
        <div className='mb-6 relative z-10'>
          <div className='flex items-center justify-center space-x-2 mb-2'>
            {ageGroups[selectedAgeGroup].icon}
            <select
              value={selectedAgeGroup}
              onChange={(e) => selectAgeGroup(e.target.value as AgeGroup)}
              disabled={isAnswered}
              className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 border-2 ${
                isAnswered
                  ? 'opacity-50 cursor-not-allowed bg-gray-100'
                  : 'bg-white hover:border-gray-400'
              } ${ageGroups[selectedAgeGroup].color.replace('bg-', 'border-')}`}
            >
              {Object.entries(ageGroups).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.name}
                </option>
              ))}
            </select>
          </div>
          <p className='text-xs text-gray-500 text-center'>
            {ageGroups[selectedAgeGroup].description}
          </p>
        </div>

        {/* Operation Selection */}
        <div className='grid grid-cols-2 gap-4 mb-6 relative z-10'>
          {ageGroups[selectedAgeGroup].operations.includes('addition') && (
            <button
              onClick={() => toggleOperation('addition')}
              disabled={isAnswered}
              className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                selectedOperations.has('addition')
                  ? 'bg-blue-500 text-white shadow-lg transform scale-105'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              } ${isAnswered ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Plus className='w-5 h-5' />
            </button>
          )}
          {ageGroups[selectedAgeGroup].operations.includes('subtraction') && (
            <button
              onClick={() => toggleOperation('subtraction')}
              disabled={isAnswered}
              className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                selectedOperations.has('subtraction')
                  ? 'bg-red-500 text-white shadow-lg transform scale-105'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              } ${isAnswered ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Minus className='w-5 h-5' />
            </button>
          )}
          {ageGroups[selectedAgeGroup].operations.includes(
            'multiplication'
          ) && (
            <button
              onClick={() => toggleOperation('multiplication')}
              disabled={isAnswered}
              className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                selectedOperations.has('multiplication')
                  ? 'bg-purple-500 text-white shadow-lg transform scale-105'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              } ${isAnswered ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <X className='w-5 h-5' />
            </button>
          )}
          {ageGroups[selectedAgeGroup].operations.includes('division') && (
            <button
              onClick={() => toggleOperation('division')}
              disabled={isAnswered}
              className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                selectedOperations.has('division')
                  ? 'bg-green-500 text-white shadow-lg transform scale-105'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              } ${isAnswered ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Percent className='w-5 h-5' />
            </button>
          )}
        </div>

        {/* Math Problem */}
        {currentProblem && (
          <div className='text-center mb-6 relative z-10'>
            <div className='bg-gray-50 rounded-2xl p-6 mb-6'>
              <div className='text-4xl font-bold text-gray-800 mb-6'>
                {currentProblem.num1}{' '}
                {currentProblem.operation === 'addition'
                  ? '+'
                  : currentProblem.operation === 'subtraction'
                  ? '-'
                  : currentProblem.operation === 'multiplication'
                  ? '×'
                  : '%'}{' '}
                {currentProblem.num2} = ?
              </div>

              {/* Multiple Choice Options */}
              <div className='grid grid-cols-2 gap-3'>
                {currentProblem.options.map((option, index) => {
                  let buttonClass =
                    'w-full h-16 text-2xl font-bold rounded-xl transition-all duration-300 transform hover:scale-105 ';

                  if (isAnswered) {
                    if (option === currentProblem.correctAnswer) {
                      buttonClass += 'bg-green-500 text-white shadow-lg';
                    } else if (
                      option === selectedAnswer &&
                      option !== currentProblem.correctAnswer
                    ) {
                      buttonClass += 'bg-red-500 text-white shadow-lg';
                    } else {
                      buttonClass += 'bg-gray-300 text-gray-600';
                    }
                  } else {
                    buttonClass +=
                      'bg-blue-100 hover:bg-blue-200 text-blue-800 border-2 border-blue-200 hover:border-blue-300';
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
          <div
            className={`text-center mb-6 relative z-10 ${
              showCelebration ? 'animate-bounce' : ''
            }`}
          >
            <div
              className={`p-4 rounded-xl font-bold text-lg ${
                showCelebration
                  ? 'bg-green-100 text-green-800'
                  : 'bg-orange-100 text-orange-800'
              }`}
            >
              {feedback}
            </div>
          </div>
        )}

        {/* Reset Button */}
        <div className='text-center relative z-10'>
          <button
            onClick={resetGame}
            className='flex items-center justify-center space-x-2 mx-auto py-2 px-4 bg-gray-200 hover:bg-gray-300 rounded-xl font-semibold text-gray-700 transition-all duration-300'
          >
            <RotateCcw className='w-4 h-4' />
            <span>Start Over</span>
          </button>
        </div>

        {/* Celebration Animation */}
        {showCelebration && (
          <div className='absolute inset-0 flex items-center justify-center pointer-events-none z-20'>
            <div className='animate-ping'>
              <Star className='w-16 h-16 text-yellow-400' />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
