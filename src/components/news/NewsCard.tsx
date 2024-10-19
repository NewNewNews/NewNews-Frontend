"use client";

import { useCallback } from "react";
import { Separator } from "@/components/ui/separator";

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

const truncateText = (text: string, charCount: number) => {
    if (text.length <= charCount) {
        return text;
    }
    return text.slice(0, charCount) + '...';
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
        <div className="bg-white dark:bg-black rounded-lg shadow-md p-4 cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out" onClick={onClick}>
            <div className="flex flex-col gap-2">
                <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-400">{category}</div>
                <Separator className="my-1" />
                <div className="text-lg font-semibold overflow-hidden h-14">{truncateText(data, 80)}</div>
                <Separator className="my-1" />
                <div className="text-sm text-neutral-500 dark:text-neutral-400">{publisher}</div>
                <div className="text-sm text-neutral-500 dark:text-neutral-400">{date}</div>
            </div>
        </div>
    );
}

export default NewsCard;
