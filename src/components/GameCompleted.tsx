import { Difficulty } from '../App';

interface GameCompletedProps {
    moves: number;
    timer: number;
    score: number;
    bestScores: Record<Difficulty, number>;
    difficulty: Difficulty;
}

export const GameCompleted = ({ moves, timer, score, bestScores, difficulty }: GameCompletedProps) => (
    <div className="mt-2 md:mt-6 p-2 md:p-4 bg-green-100 rounded-lg">
        <h2 className="text-base md:text-xl font-bold text-green-800">
        Congratulations! 🎉
        </h2>
        <p className="text-xs md:text-base text-green-700">
            You completed the game in {moves} moves and{' '}
            {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}{' '}
            minutes with a score of {score} points!
            {score === bestScores[difficulty] && (
            <span className="block mt-1 md:mt-2 font-semibold">
            🏆 New Best Score for {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} difficulty!
            </span>
            )}
        </p>
    </div>
);