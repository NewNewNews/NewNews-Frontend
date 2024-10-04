import React from "react";
        import Modal from "./Modal";

        interface NewsModalProps {
            isOpen: boolean;
            onClose: () => void;
            news: any;
            formatDate: (dateString: string) => string;
        }

        const NewsModal: React.FC<NewsModalProps> = ({ isOpen, onClose, news, formatDate }) => {
            return (
                <Modal
                    isOpen={isOpen}
                    onClose={onClose}
                    onSubmit={onClose}
                    title={news.publisher}
                    body={
                        <div>
                            <p><strong>Data:</strong> {news.data}</p>
                            <p><strong>Date:</strong> {formatDate(news.date)}</p>
                            <p><strong>Publisher:</strong> {news.publisher}</p>
                            <p><strong>Link:</strong> <a href={news.url} target="_blank" rel="noopener noreferrer">{news.url}</a></p>
                        </div>
                    }
                    actionlabel="Close"
                />
            );
        };

        export default NewsModal;