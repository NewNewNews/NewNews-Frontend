"use client";
import { useState, useEffect, useMemo } from "react";
import NewsCard from "../NewsCard";
import NewsModal from "./NewsModal";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNewsList } from "@/hooks/useNewsList";
import { Separator } from "@radix-ui/react-separator";

const NewsList: React.FC = () => {
  const [newsList, setNewsList] = useState<any[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [publishers, setPublishers] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPublisher, setSelectedPublisher] = useState<string | null>(
    null
  );
  const [sortBy, setSortBy] = useState("newest");
  const searchTerm = useNewsList((state) => state.searchTerm);

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

      const uniquePublishers = Array.from(
        new Set(data.map((news: { publisher: string }) => news.publisher))
      ).sort((a, b) => a.localeCompare(b));
      setPublishers(uniquePublishers);
    } catch (error) {
      toast.error("Error fetching news");
    }
  };

  useEffect(() => {
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
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("th-TH", options);
  };

  const filteredNewsList = useMemo(() => {
    return newsList
      .filter((news) => {
        const searchInTitle = news.data
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const filterByCategory = selectedCategory
          ? news.category === selectedCategory
          : true;
        const filterByPublisher = selectedPublisher
          ? news.publisher === selectedPublisher
          : true;

        return searchInTitle && filterByCategory && filterByPublisher;
      })
      .sort((a, b) => {
        if (sortBy === "newest") {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        if (sortBy === "oldest") {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        }
        return 0;
      });
  }, [
    newsList,
    selectedCategory,
    selectedPublisher,
    sortBy,
    searchTerm,
  ]);

  const noNewsMessage = () => {
    let message = "No news available";
    if (searchTerm) {
        message = " No news matching your search.";
    }
    if (selectedCategory || selectedPublisher) {
      message = " No news matching your filters.";
    }
    return message;
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">
        {sortBy === "newest" ? "Newest News" : "Oldest News"}
      </h1>
      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center mb-4 gap-4 ">
        {/* Category Filter */}
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

        {/* Publisher Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              {selectedPublisher ? selectedPublisher : "Select Publisher"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Publisher</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {publishers.map((pub) => (
              <DropdownMenuItem
                key={pub}
                onClick={() => setSelectedPublisher(pub)}
              >
                {pub}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setSelectedPublisher(null)}>
              Clear Filter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Sort By Date */}
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="md:w-fit sm:w-56 justify-center bg-white dark:bg-black">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest" className="">Newest News</SelectItem>
            <SelectItem value="oldest" className="">Oldest News</SelectItem>
            <Separator />
            <SelectItem value=" ">Clear Sort</SelectItem>
          </SelectContent>
        </Select>
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
          <h1 className="col-span-full text-5xl font-medium text-center text-gray-500 w-full h-full mt-40">{noNewsMessage()}</h1>
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
