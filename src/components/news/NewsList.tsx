"use client";
import React, { useState, useEffect, useMemo } from "react";
import NewsCard from "./NewsCard";
import NewsModal from "../modals/NewsModal";
import toast from "react-hot-toast";
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
import { useNewsList } from "@/hooks/useNewsList";
import { Separator } from "@radix-ui/react-separator";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

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
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    undefined
  );
  const [sortBy, setSortBy] = useState("newest");
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const searchTerm = useNewsList((state) => state.searchTerm);

  const fetchNews = async () => {
    try {
      const response = await fetch(
        `/api/news`
      );
      const data = await response.json();
      if (Array.isArray(data)) {
        setNewsList(data);
      } else {
        console.error("API response is not an array:", data);
        setNewsList([]);
      }

      const uniqueCategories = Array.from(
        new Set(data.map((news: { category: string }) => news.category))
      ).sort((a, b) => (a as string).localeCompare(b as string));
      setCategories(uniqueCategories);
      

      const uniquePublishers = Array.from(
        new Set(data.map((news: { publisher: string }) => news.publisher))
      ).sort((a, b) => (a as string).localeCompare(b as string));
      setPublishers(uniquePublishers);

      const dates = Array.from(
        new Set(
          data.map((news: { date: string }) =>
            new Date(news.date).toDateString()
          )
        )
      );
      setAvailableDates(dates.map((dateStr) => new Date(dateStr as string)));
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
        const filterByDate = selectedDate
          ? // Compare only the date part (ignore time)
            new Date(news.date).toLocaleDateString() ===
            selectedDate.toLocaleDateString()
          : true;

        return (
          searchInTitle && filterByCategory && filterByPublisher && filterByDate
        );
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
    selectedDate,
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

  const isAvailableDate = (date: Date) => {
    return availableDates.some(
      (availableDate) =>
        date.getFullYear() === availableDate.getFullYear() &&
        date.getMonth() === availableDate.getMonth() &&
        date.getDate() === availableDate.getDate()
    );
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">
        {sortBy === "newest" ? "Newest News" : "Oldest News"}
      </h1>
      <div className="flex flex-col sm:flex-row sm:flex-wrap md:flex-row md:flex-wrap mb-4 gap-4 ">
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
              {categories.map((cat) => (
                <DropdownMenuItem
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </DropdownMenuItem>
              ))}
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

        {/* Date Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn("text-center font-normal", !selectedDate)}
            >
              {selectedDate ? (
                format(selectedDate, "PPP") // Format the selected date if any
              ) : (
                <h1>Pick a date</h1> // Placeholder when no date is selected
              )}
              <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => !isAvailableDate(date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* Sort By Date */}
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="md:w-fit sm:w-56 justify-center bg-white dark:bg-black">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest" className="">
              Newest News
            </SelectItem>
            <SelectItem value="oldest" className="">
              Oldest News
            </SelectItem>
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
          <h1 className="col-span-full text-5xl font-medium text-center text-gray-500 w-full h-full mt-40">
            {noNewsMessage()}
          </h1>
        )}
      </div>

      {selectedNews && (
        <NewsModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          news={selectedNews}
          formatDate={formatDate}
          onCompare={() => {}}
          // onVoice={() => {}}
        />
      )}
    </>
  );
};

export default NewsList;
