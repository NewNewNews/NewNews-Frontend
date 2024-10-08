"use client";

import { useState } from "react";
import { BiSearch } from "react-icons/bi";
import { useNewsList } from "@/hooks/useNewsList";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

export default function Search() {
  const [searchInput, setSearchInput] = useState("");
  const setSearchTerm = useNewsList((state) => state.setSearchTerm); // Zustand action

  const handleSearch = () => {
    setSearchTerm(searchInput); // Update the search term in the store
  };

  return (
    <div className="relative flex items-center">
      <Input
        type="text"
        value={searchInput}
        onChange={(e) => {
            const value = e.target.value;
            setSearchInput(value);
            handleSearch()
          }}
        placeholder="Any News"
        className="border dark:border-neutral-800 focus:border-transparent dark:bg-black rounded-full pl-6 pr-10 py-4 transition duration-300 ease-in-out"
      />
      <div
        onClick={handleSearch}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 bg-black dark:bg-white rounded-full text-white dark:text-black cursor-pointer"
      >
        <BiSearch size={18} />
      </div>
    </div>
  );
}
