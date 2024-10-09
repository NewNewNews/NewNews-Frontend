import React, { useMemo } from "react";
import Modal from "./Modal";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { useNewsList } from "@/hooks/useNewsList";

interface NewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  news: any;
  formatDate: (dateString: string) => string;
}

const NewsModal: React.FC<NewsModalProps> = ({
  isOpen,
  onClose,
  news,
  formatDate,
}) => {
  const searchTerm = useNewsList((state) => state.searchTerm);

  const highlightText = (text: string, term: string) => {
    if (!term) return text;
    const parts = text.split(new RegExp(`(${term})`, "gi"));
    return parts.map((part, index) => 
      part.toLowerCase() === term.toLowerCase() ? (
        <span key={index} className="bg-yellow-200 dark:bg-blue-500">{part}</span>
      ) : (
        part
      )
    );
  };

  const highlightedContent = useMemo(
    () => highlightText(news.data, searchTerm),
    [news.data, searchTerm]
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onClose}
      title={news.publisher}
      body={
        <div>
          <p className="leading-relaxed tracking-wide">
            <strong>Content: </strong> 
            {highlightedContent}
          </p>
          <Separator className="my-4" />
          <ScrollArea>
          <p>
            <strong>Date:</strong> {formatDate(news.date)}
          </p>
          </ScrollArea>
          <Separator className="my-4" />
          <p>
            <strong>Publisher:</strong> {news.publisher}
          </p>
          <Separator className="my-4" />
          <p>
            <strong>Link:</strong>{" "}
            <a href={news.url} target="_blank" rel="noopener noreferrer">
              {news.url}
            </a>
          </p>
        </div>
      }
      actionlabel="Close"
    />
  );
};

export default NewsModal;
