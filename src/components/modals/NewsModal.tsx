import React, { useState, useMemo, useEffect } from "react";
import Modal from "./Modal";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { useNewsList } from "@/hooks/useNewsList";
import { Button } from "../ui/button";
import { SpeakerLoudIcon, SpeakerOffIcon } from "@radix-ui/react-icons";

interface NewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  news: any;
  formatDate: (dateString: string) => string;
  onCompare: () => void;
  // onVoice: () => void;
}

const NewsModal: React.FC<NewsModalProps> = ({
  isOpen,
  onClose,
  news,
  formatDate,
  onCompare,
  // onVoice,
}) => {
  useEffect(() => {
    if (isOpen) {
      // Disable scrolling on body when modal is open
      document.body.style.overflow = "hidden";
    } else {
      onStop(); // Stop speech when modal is closed
      // Re-enable scrolling when modal is closed
      document.body.style.overflow = "";
    }

    // Clean up when the component unmounts or when the modal closes
    return () => {
      onStop(); // Stop speech when modal is closed
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const searchTerm = useNewsList((state) => state.searchTerm);
  const [isSpeaking, setIsSpeaking] = React.useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  const highlightText = (text: string, term: string) => {
    if (!term) return text;
    const parts = text.split(new RegExp(`(${term})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === term.toLowerCase() ? (
        <span key={index} className="bg-yellow-200 dark:bg-blue-500">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const highlightedContent = useMemo(
    () => highlightText(news.data, searchTerm),
    [news.data, searchTerm]
  );

  const onVoice = () => {
    const utterance = new SpeechSynthesisUtterance(news.data);
    utterance.lang = "th-TH"; // Set language to Thai
    speechSynthesis.speak(utterance); // Speak the news content

    // Set speaking state to true
    setIsSpeaking(true);

    // Event listener to reset speaking state when speech ends
    utterance.onend = () => setIsSpeaking(false);
  };

  const onStop = () => {
    speechSynthesis.cancel(); // Stop speech
    setIsSpeaking(false); // Reset speaking state
  };

  const onPlaying = () => {
    if (isSpeaking) {
      onStop(); // Stop speech if already speaking
    } else {
      onVoice(); // Start speaking
    }
  };

  const onSummarize = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/summary/one`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: news.url }), // Send the news URL in the request body
      });

      if (!response.ok) {
        throw new Error("Failed to fetch summary");
      }

      const data = await response.json();
      setSummary(data.summarized_text); // Save the summary
    } catch (error) {
      console.error("Error fetching summary:", error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onClose}
      title={news.publisher}
      body={
        <div>
          <div className="flex mb-4">
            <Button onClick={onSummarize} className="px-4 py-2 mr-2">
              Summarize News
            </Button>
            {/* <Button onClick={onCompare} className="px-4 py-2 mr-2">
              Compare News
            </Button> */}
            <Button size="icon" onClick={onPlaying}>
              {isSpeaking ? (
                <SpeakerOffIcon className="h-[1.2rem] w-[1.2rem] scale-100 transition-all dar" />
              ) : (
                <SpeakerLoudIcon className="h-[1.2rem] w-[1.2rem] scale-100 transition-all" />
              )}
              <span className="sr-only">Toggle Voice</span>
            </Button>
          </div>
          {summary && (
            <>
              <Separator className="my-4" />
              <p>
                <strong>Summary:</strong> {summary}
              </p>
              <Separator className="my-4" />
            </>
          )}
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
