"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { SearchSuggestion } from "@/hooks/useSearchSuggestions";
import { urlFor } from "@/sanity/lib/image";
import PriceFormatter from "./PriceFormatter";
import { Package, Tag, Grid3X3, Search } from "lucide-react";

interface SearchSuggestionsProps {
  suggestions: SearchSuggestion[];
  loading: boolean;
  onSuggestionClick: () => void;
  visible: boolean;
  searchQuery?: string;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  suggestions,
  loading,
  onSuggestionClick,
  visible,
  searchQuery,
}) => {
  if (!visible) return null;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "product":
        return <Package className="w-4 h-4 text-blue-500" />;
      case "brand":
        return <Tag className="w-4 h-4 text-green-500" />;
      case "category":
        return <Grid3X3 className="w-4 h-4 text-purple-500" />;
      default:
        return <Package className="w-4 h-4 text-gray-500" />;
    }
  };

  const getImageUrl = (image: any) => {
    if (!image) return null;
    try {
      return urlFor(image).width(60).height(60).url();
    } catch {
      return null;
    }
  };

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-[100] max-h-96 overflow-y-auto">
      {loading ? (
        <div className="p-4 text-center">
          <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-shop_light_green"></div>
          <span className="ml-2 text-sm text-gray-600">Searching...</span>
        </div>
      ) : suggestions.length > 0 ? (
        <div className="py-2">
          {suggestions.map((suggestion) => (
            <Link
              key={suggestion.id}
              href={suggestion.url}
              onClick={onSuggestionClick}
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors duration-150"
            >
              {/* Image or Icon */}
              <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                {suggestion.image && getImageUrl(suggestion.image) ? (
                  <Image
                    src={getImageUrl(suggestion.image)!}
                    alt={suggestion.title}
                    width={48}
                    height={48}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  getTypeIcon(suggestion.type)
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {suggestion.title}
                  </h4>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {suggestion.subtitle}
                  </span>
                </div>
                {suggestion.price && (
                  <div className="mt-1">
                    <PriceFormatter
                      amount={suggestion.price}
                      className="text-sm font-semibold text-shop_dark_green"
                    />
                  </div>
                )}
              </div>

              {/* Type indicator */}
              <div className="flex-shrink-0">
                {getTypeIcon(suggestion.type)}
              </div>
            </Link>
          ))}

          {/* View all results option */}
          {suggestions.length > 0 && searchQuery && (
            <div className="border-t border-gray-100">
              <Link
                href={`/products?search=${encodeURIComponent(searchQuery)}`}
                onClick={onSuggestionClick}
                className="flex items-center justify-center gap-2 px-4 py-3 hover:bg-gray-50 transition-colors duration-150 text-shop_dark_green font-medium"
              >
                <Search className="w-4 h-4" />
                <span>View all results for "{searchQuery}"</span>
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="p-4 text-center text-sm text-gray-500">
          No suggestions found
        </div>
      )}
    </div>
  );
};

export default SearchSuggestions;
