import { Difficulty } from '../App';

interface BestScoresProps {
    bestScores: Record<Difficulty, number>;
}

export const BestScores = ({ bestScores }: BestScoresProps) => (
    <div className="mt-2 md:mt-4 p-2 md:p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm md:text-lg font-semibold text-gray-800 mb-1 md:mb-2">Best Scores</h3>
        <div className="grid grid-cols-3 gap-1 md:gap-4">
            {Object.entries(bestScores).map(([diff, score]) => (
            <div key={diff} className="text-center">
                <div className="text-xs md:text-base font-medium text-gray-600">
                {diff.charAt(0).toUpperCase() + diff.slice(1)}
                </div>
                <div className="text-sm md:text-xl font-bold text-blue-600">{score}</div>
            </div>
            ))}
        </div>
    </div>
);