"use client";
import { useState, useEffect } from "react";
import NewsCard from "../NewsCard";
import Modal from "./Modal";
import NewsModal from "./NewsModal";

const NewsList: React.FC = () => {
    const [newsList, setNewsList] = useState<any[]>([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedNews, setSelectedNews] = useState<any>(null);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/news');
                const data = await response.json();
                setNewsList(data);
            } catch (error) {
                console.error("Error fetching news:", error);
            }
        };

        fetchNews();
    }, []);

    const handleCardClick = (news: any) => {
        setSelectedNews(news);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedNews(null);
    };

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('th-TH', options);
    };

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {newsList.map((news) => (
                    <NewsCard
                        key={news.actionId}
                        data={news.data}
                        category={news.category}
                        date={formatDate(news.date)}
                        publisher={news.publisher}
                        url={news.url}
                        actionId={news.actionId}
                        disabled={news.disabled}
                        onClick={() => handleCardClick(news)}
                    />
                ))}
            </div>

            {selectedNews && (
                <NewsModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    news={selectedNews}
                    formatDate={formatDate}
                />
            )}
        </>
    );
};

export default NewsList;
