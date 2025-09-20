"use client";

import { Search, X } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearchSuggestions } from "@/hooks/useSearchSuggestions";
import SearchSuggestions from "./SearchSuggestions";
import { trackSearch } from "@/lib/facebook-pixel";

interface CollapsibleSearchBarProps {
  isSearchOpen: boolean;
  onToggleSearch: () => void;
  onCloseSearch: () => void;
  className?: string;
}

const CollapsibleSearchBar: React.FC<CollapsibleSearchBarProps> = ({
  isSearchOpen,
  onToggleSearch,
  onCloseSearch,
  className = "",
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { suggestions, loading } = useSearchSuggestions(searchQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Track search with Facebook Pixel
      trackSearch(searchQuery.trim());

      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
      setIsFocused(false);
      onCloseSearch();
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
    onCloseSearch();
  };

  const handleCloseSearch = () => {
    setSearchQuery("");
    setShowSuggestions(false);
    setIsFocused(false);
    onCloseSearch();
  };

  // Focus input when search opens
  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isSearchOpen]);

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
      handleCloseSearch();
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Search Input - Only show when open */}
      {isSearchOpen && (
        <div ref={searchRef} className="w-full">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onKeyDown={handleKeyDown}
                placeholder="Search for products, brands, categories..."
                className={`w-full px-4 py-1.5 border border-gray-200 rounded-full bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-shop_light_green focus:border-transparent transition-all duration-200 text-sm`}
              />
              {/* <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" /> */}
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                <button
                  type="submit"
                  className="bg-shop_light_green hover:bg-shop_dark_green text-white p-1.5 rounded-full transition-colors duration-200"
                  aria-label="Search"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </form>

          <SearchSuggestions
            suggestions={suggestions}
            loading={loading}
            onSuggestionClick={handleSuggestionClick}
            visible={showSuggestions && isFocused && isSearchOpen}
            searchQuery={searchQuery}
          />
        </div>
      )}
    </div>
  );
};

export default CollapsibleSearchBar;
