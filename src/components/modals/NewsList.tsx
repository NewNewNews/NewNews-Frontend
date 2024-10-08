"use client";
import { useState, useEffect } from "react";
import NewsCard from "../NewsCard";
import NewsModal from "./NewsModal";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const NewsList: React.FC = () => {
  const [newsList, setNewsList] = useState<any[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { data: session } = useSession();

  const fetchNews = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/news`
      );
      const data = await response.json();
      setNewsList(data);

      const uniqueCategories = Array.from(
        new Set(data.map((news: { category: string }) => news.category))
      ).sort((a, b) => a.localeCompare(b));
      setCategories(uniqueCategories);
    } catch (error) {
      toast.error("Error fetching news");
    }
  };

  useEffect(() => {
    fetchNews();
    // Optionally, call getMe() here if needed
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
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("th-TH", options);
  };

  // Filter news based on selectedCategory
  const filteredNewsList = selectedCategory
    ? newsList.filter((news) => news.category === selectedCategory)
    : newsList;

  return (
    <>
      <div className="mb-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              {selectedCategory ? selectedCategory : "Select Category"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Category</DropdownMenuLabel>

            <DropdownMenuSeparator />
            <ScrollArea className="h-72 w-54 rounded-md border">
              {categories.map((cat) => (
                <DropdownMenuItem
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </DropdownMenuItem>
              ))}
            </ScrollArea>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setSelectedCategory(null)}>
              Clear Filter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNewsList.length > 0 ? (
          filteredNewsList.map((news) => (
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
          ))
        ) : (
          <p>No news available</p>
        )}
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
