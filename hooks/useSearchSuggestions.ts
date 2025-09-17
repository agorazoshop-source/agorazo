import { useState, useEffect, useCallback } from 'react';

export interface SearchSuggestion {
  id: string;
  type: 'product' | 'brand' | 'category';
  title: string;
  subtitle: string;
  url: string;
  image?: any;
  price?: number;
}

export const useSearchSuggestions = (query: string, delay: number = 300) => {
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounce function
  const debounce = useCallback((func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  }, []);

  // Fetch suggestions function
  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    if (!searchQuery || searchQuery.length < 2) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(searchQuery)}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }

      const data = await response.json();
      setSuggestions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch suggestions');
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced version of fetchSuggestions
  const debouncedFetchSuggestions = useCallback(
    debounce(fetchSuggestions, delay),
    [fetchSuggestions, delay]
  );

  // Effect to trigger search when query changes
  useEffect(() => {
    if (query.trim()) {
      setLoading(true);
      debouncedFetchSuggestions(query.trim());
    } else {
      setSuggestions([]);
      setLoading(false);
    }
  }, [query, debouncedFetchSuggestions]);

  return {
    suggestions,
    loading,
    error,
    clearSuggestions: () => setSuggestions([])
  };
};