import { useState, useEffect } from 'react';
import { Facebook, Twitter, Github, Linkedin, Apple, Figma, Youtube, WholeWord as Wordpress, Pocket as Docker, AppWindow as Windows, Palette as Paypal, Disc as Discord, Cuboid as Android, MessageCircle, Pointer as Pinterest, RepeatIcon as ReactIcon, Code as NodeJs, Timer, Trophy, RotateCcw, Gamepad2, Menu } from 'lucide-react';
import { Card } from './components/Card';
import { DifficultyButton } from './components/DifficultyButton';
import { GameControls } from './components/GameControls';
import { BestScores } from './components/BestScores';
import { GameCompleted } from './components/GameCompleted';
import flipSound from "./public/sounds/flipcard.mp3";
import matchSound from "./public/sounds/correct.mp3";
import wrongSound from "./public/sounds/wrong-answer.mp3";
import victorySound from "./public/sounds/goodresult.mp3";

interface Card {
  id: number;
  icon: React.ReactNode;
  isFlipped: boolean;
  isMatched: boolean;
}

export type Difficulty = 'easy' | 'medium' | 'hard';

interface DifficultyConfig {
  pairs: number;
  scoreMultiplier: number;
  gridCols: {
    sm: string;
    md: string;
    lg: string;
  };
}

const DIFFICULTY_CONFIG: Record<Difficulty, DifficultyConfig> = {
  easy: {
    pairs: 6,
    scoreMultiplier: 1,
    gridCols: {
      sm: 'grid-cols-4',
      md: 'grid-cols-4',
      lg: 'grid-cols-4'
    }
  },
  medium: {
    pairs: 8,
    scoreMultiplier: 2,
    gridCols: {
      sm: 'grid-cols-4',
      md: 'grid-cols-4',
      lg: 'grid-cols-4'
    }
  },
  hard: {
    pairs: 12,
    scoreMultiplier: 3,
    gridCols: {
      sm: 'grid-cols-6',
      md: 'grid-cols-6',
      lg: 'grid-cols-6'
    }
  }
};

const icons = [
  { name: 'Facebook', component: Facebook },
  { name: 'Twitter', component: Twitter },
  { name: 'Github', component: Github },
  { name: 'Linkedin', component: Linkedin },
  { name: 'Apple', component: Apple },
  { name: 'Figma', component: Figma },
  { name: 'Youtube', component: Youtube },
  { name: 'Wordpress', component: Wordpress },
  { name: 'Docker', component: Docker },
  { name: 'Windows', component: Windows },
  { name: 'Paypal', component: Paypal },
  { name: 'Discord', component: Discord },
  { name: 'Android', component: Android },
  { name: 'Telegram', component: MessageCircle },
  { name: 'Pinterest', component: Pinterest },
  { name: 'React', component: ReactIcon },
  { name: 'Node', component: NodeJs },
];

function App() {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [bestScores, setBestScores] = useState<Record<Difficulty, number>>({
    easy: 0,
    medium: 0,
    hard: 0
  });

  const soundOn = (sound: string) => {
    const audio = new Audio(sound);
    audio.play();
  }

  const initializeGame = (newDifficulty?: Difficulty) => {
    const currentDifficulty = newDifficulty || difficulty;
    const { pairs } = DIFFICULTY_CONFIG[currentDifficulty];
    
    const shuffledIcons = [...icons]
      .sort(() => Math.random() - 0.5)
      .slice(0, pairs);
    
    const gameCards: Card[] = [...shuffledIcons, ...shuffledIcons]
      .sort(() => Math.random() - 0.5)
      .map((icon, index) => ({
        id: index,
        icon: <icon.component className="w-4 h-4 md:w-6 md:h-6" />,
        isFlipped: false,
        isMatched: false,
      }));

    if (newDifficulty) {
      setDifficulty(newDifficulty);
    }
    
    setCards(gameCards);
    setFlippedCards([]);
    setMoves(0);
    setScore(0);
    setTimer(0);
    setGameCompleted(false);
    setGameStarted(false);
    setShowMenu(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameStarted && !gameCompleted) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameCompleted]);

  const handleCardClick = (index: number) => {
    if (!gameStarted) {
      setGameStarted(true);
    }

    if (
      flippedCards.length === 2 ||
      cards[index].isFlipped ||
      cards[index].isMatched
    ) {
      return;
    }

    soundOn(flipSound);

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlippedCards = [...flippedCards, index];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves((prev) => prev + 1);
      const [firstIndex, secondIndex] = newFlippedCards;
      
      if (cards[firstIndex].icon.type === cards[secondIndex].icon.type) {
        newCards[firstIndex].isMatched = true;
        newCards[secondIndex].isMatched = true;
        setCards(newCards);
        const matchScore = 10 * DIFFICULTY_CONFIG[difficulty].scoreMultiplier;
        setScore((prev) => prev + matchScore);
        setFlippedCards([]);
        soundOn(matchSound);

        if (newCards.every((card) => card.isMatched)) {
          const finalScore = score + matchScore;
          setGameCompleted(true);
          if (finalScore > bestScores[difficulty]) {
            setBestScores(prev => ({
              ...prev,
              [difficulty]: finalScore
            }));
          }
          setTimeout(() => {
            soundOn(victorySound);
          }, 500);
        }
      } else {
        setTimeout(() => {
          newCards[firstIndex].isFlipped = false;
          newCards[secondIndex].isFlipped = false;
          setCards(newCards);
          setFlippedCards([]);
          soundOn(wrongSound);
        }, 1000);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl p-2 md:p-6 w-full max-w-2xl mx-2 my-1">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-4 mb-2 md:mb-6">
          <h1 className="text-xl md:text-3xl font-bold text-gray-800">Memory Match</h1>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="md:hidden bg-gray-100 p-1.5 rounded-lg"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Game Controls - Desktop */}
          <GameControls timer={timer} score={score} onRestart={() => initializeGame()} />
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden ${showMenu ? 'block' : 'hidden'} mb-2`}>
          <div className="flex flex-col gap-2 p-2 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-semibold">
                  {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-semibold">{score}</span>
              </div>
            </div>
            <button
              onClick={() => initializeGame()}
              className="flex items-center justify-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full text-sm"
            >
              <RotateCcw className="w-3 h-3" />
              Restart
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center gap-1 md:gap-4 mb-2 md:mb-6">
          <div className="flex items-center gap-1 md:gap-2">
            <Gamepad2 className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
            <span className="text-xs md:text-base text-gray-600">Difficulty:</span>
          </div>
          <div className="flex gap-1 md:gap-2">
            <DifficultyButton level="easy" currentDifficulty={difficulty} onClick={setDifficulty} />
            <DifficultyButton level="medium" currentDifficulty={difficulty} onClick={setDifficulty} />
            <DifficultyButton level="hard" currentDifficulty={difficulty} onClick={setDifficulty} />
          </div>
        </div>

        <div className={`grid ${DIFFICULTY_CONFIG[difficulty].gridCols.sm} sm:${DIFFICULTY_CONFIG[difficulty].gridCols.md} lg:${DIFFICULTY_CONFIG[difficulty].gridCols.lg} gap-1.5 md:gap-4`}>
          {cards.map((card, index) => (
            <Card
              key={card.id}
              id={card.id}
              icon={card.icon}
              isFlipped={card.isFlipped}
              isMatched={card.isMatched}
              onClick={() => handleCardClick(index)}
            />
          ))}
        </div>

        {gameCompleted && (
          <GameCompleted
            moves={moves}
            timer={timer}
            score={score}
            bestScores={bestScores}
            difficulty={difficulty}
          />
        )}
        <BestScores bestScores={bestScores} />
      </div>
    </div>
  );
}

export default App;