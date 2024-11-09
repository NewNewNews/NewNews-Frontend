import React, { useState, useMemo, useEffect } from "react";
import Modal from "./Modal";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { useNewsList } from "@/hooks/useNewsList";
import { Button } from "../ui/button";
import { SpeakerLoudIcon, SpeakerOffIcon } from "@radix-ui/react-icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";

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
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null); // State to manage audio
  const [updatedNews, setUpdatedNews] = useState(news);
  const { data: session } = useSession();
  // const isAdmin = session?.user?.isAdmin;
  const isAdmin = true;


  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedNews((prevNews: any) => ({ ...prevNews, [name]: value }));
  };

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

  const onVoice = async () => {
    try {
      // Send POST request with id in the body
      const response = await fetch('/api/audio/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: news.url }), // Send the news ID in the request body
      });
      
      if (!response.ok) {
        console.error("Failed to fetch audio data");
        return;
      }

      // Convert the audio data response to a blob
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob); // Create an object URL for the audio

      // Create a new audio element and set it in the state
      const newAudio = new Audio(audioUrl);
      setAudio(newAudio); // Save the audio object

      // Set speaking state to true
      setIsSpeaking(true);

      // Play the audio file
      newAudio.play();

      // Event listener to reset speaking state when speech ends
      newAudio.onended = () => setIsSpeaking(false);

    } catch (error) {
      console.error("Error fetching audio:", error);
    }
  };

  const onStop = () => {
    if (audio) {
      audio.pause(); // Stop speech
      audio.currentTime = 0; // Reset audio to start
    }
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
      const response = await fetch(`/api/summary/one`, {
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

  const handleUpdate = async () => {
    try {
      const response = await fetch("/api/news", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedNews),
      });
      if (!response.ok) throw new Error("Failed to update news");
      const result = await response.json();
      console.log("Update successful:", result);
    } catch (error) {
      console.error("Error updating news:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch("/api/news", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: news.id }),
      });

      if (!response.ok) throw new Error("Failed to delete news");

      const result = await response.json();
      console.log("Delete successful:", result);
      onClose(); // Close the modal after deletion
    } catch (error) {
      console.error("Error deleting news:", error);
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
          {isAdmin && (
            <div className="flex gap-4 mb-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Edit News</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Edit News</DialogTitle>
                    <DialogDescription>
                      Make changes to your news here. Click save when you're
                      done.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="data" className="text-right">
                        Content
                      </Label>
                      <input
                        name="data"
                        value={updatedNews.data}
                        onChange={handleInputChange}
                        className="col-span-3 border p-2 h-12 w-full"
                        placeholder="Edit data"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="category" className="text-right">
                        Category
                      </Label>
                      <input
                        name="category"
                        value={updatedNews.category}
                        onChange={handleInputChange}
                        className="col-span-3 border p-2 w-full"
                        placeholder="Edit category"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="date" className="text-right">
                        Date
                      </Label>
                      <input
                        name="date"
                        value={updatedNews.date}
                        onChange={handleInputChange}
                        className="col-span-3 border p-2 w-full"
                        placeholder="Edit date"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="publisher" className="text-right">
                        Publisher
                      </Label>
                      <input
                        name="publisher"
                        value={updatedNews.publisher}
                        onChange={handleInputChange}
                        className="col-span-3 border p-2 w-full"
                        placeholder="Edit publisher"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="url" className="text-right">
                        Link
                      </Label>
                      <input
                        name="url"
                        value={updatedNews.url}
                        onChange={handleInputChange}
                        className="col-span-3 border p-2 w-full"
                        placeholder="Edit URL"
                      />
                    </div>
                  </div>

                  <DialogFooter>
                    <Button type="submit" onClick={handleUpdate}>Save changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button onClick={handleDelete} className="bg-red-500 text-white">
                Delete News
              </Button>
            </div>
          )}
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
