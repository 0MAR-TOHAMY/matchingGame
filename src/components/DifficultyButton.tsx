import { Difficulty } from '../App';

interface DifficultyButtonProps {
    level: Difficulty;
    currentDifficulty: Difficulty;
    onClick: (level: Difficulty) => void;
}

export const DifficultyButton = ({ level, currentDifficulty, onClick }: DifficultyButtonProps) => (
    <button
        onClick={() => onClick(level)}
        className={`px-2 py-1 md:px-4 md:py-2 text-xs md:text-base rounded-lg transition-colors ${
        currentDifficulty === level
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
    >
        {level.charAt(0).toUpperCase() + level.slice(1)}
    </button>
);