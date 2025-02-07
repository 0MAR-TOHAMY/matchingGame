import { Timer, Trophy, RotateCcw } from 'lucide-react';

interface GameControlsProps {
    timer: number;
    score: number;
    onRestart: () => void;
}

export const GameControls = ({ timer, score, onRestart }: GameControlsProps) => (
    <div className="hidden md:flex gap-4 items-center">
        <div className="flex items-center gap-2">
        <Timer className="w-5 h-5 text-gray-600" />
        <span className="text-lg font-semibold">
            {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
        </span>
        </div>
        <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-gray-600" />
            <span className="text-lg font-semibold">{score}</span>
        </div>
        <button
        onClick={onRestart}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
        <RotateCcw className="w-4 h-4" />
        Restart
        </button>
    </div>
);