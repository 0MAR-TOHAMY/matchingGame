import { ReactNode } from 'react';

interface CardProps {
    id: number;
    icon: ReactNode;
    isFlipped: boolean;
    isMatched: boolean;
    onClick: () => void;
}

export const Card = ({ id, icon, isFlipped, isMatched, onClick }: CardProps) => (
    <div
        key={id}
        onClick={onClick}
        className={`aspect-square bg-white rounded-lg cursor-pointer transform transition-all duration-300 ${
        isFlipped ? 'rotate-y-180' : ''
        }`}
    >
        <div
        className={`w-full h-full flex items-center justify-center rounded-lg border transition-all duration-300 ${
        isFlipped
            ? 'bg-white border-blue-600 *:rotate-y-180'
            : 'bg-blue-600 border-blue-600'
        } ${
        isMatched
            ? 'bg-green-100 border-green-600'
            : ''
        }`}
        >
            {isFlipped && icon}
        </div>
    </div>
);