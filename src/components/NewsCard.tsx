"use client";

import { use, useCallback } from "react";

interface NewsCardProps {
    data: string;
    category: string;
    date: string;
    publisher: string;
    url: string;
    actionId: string;
    disabled: boolean;
    onAction?: (id: string) => void;
    onClick?: () => void;
}

// Utility function to truncate text to a specific word count
const truncateText = (text: string, wordCount: number) => {
    const words = text.split(' ');
    if (words.length <= wordCount) {
        return text;
    }
    return words.slice(0, wordCount).join(' ') + '...'; // Add ellipsis to indicate truncation
};

const NewsCard: React.FC<NewsCardProps> = ({ data, category, date, publisher, url, actionId="", disabled, onAction, onClick }) => {
    const handleCancel = useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            if (disabled) return;
            onAction?.(actionId);
        },
        [onAction, actionId, disabled]
    );

    return (
        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-md p-4 cursor-pointer" onClick={onClick}>
            <div className="flex flex-col gap-2">
                <div className="text-xs text-neutral-500 dark:text-neutral-400">{category}</div>
                <div className="text-lg font-semibold">{truncateText(data, 10)}</div> {/* Truncate the news data */}
                <div className="text-sm text-neutral-500 dark:text-neutral-400">{publisher}</div>
                <div className="text-sm text-neutral-500 dark:text-neutral-400">{date}</div>
            </div>
        </div>
    );
}

export default NewsCard;
