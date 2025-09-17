"use client";

import { Search } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearchSuggestions } from "@/hooks/useSearchSuggestions";
import SearchSuggestions from "./SearchSuggestions";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  const { suggestions, loading } = useSearchSuggestions(searchQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
      setIsFocused(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSuggestions(value.length >= 2);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
    if (searchQuery.length >= 2) {
      setShowSuggestions(true);
    }
  };

  const handleSuggestionClick = () => {
    setShowSuggestions(false);
    setIsFocused(false);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setShowSuggestions(false);
      setIsFocused(false);
    }
  };

  return (
    <div ref={searchRef} className="relative flex-1 max-w-2xl mx-4">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onKeyDown={handleKeyDown}
            placeholder="Search for products, brands, categories..."
            className={`w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-shop_light_green focus:border-transparent transition-all duration-200 text-sm `}
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-shop_light_green hover:bg-shop_dark_green text-white p-2 rounded-full transition-colors duration-200"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </form>

      <SearchSuggestions
        suggestions={suggestions}
        loading={loading}
        onSuggestionClick={handleSuggestionClick}
        visible={showSuggestions && isFocused}
        searchQuery={searchQuery}
      />
    </div>
  );
};

export default SearchBar;
