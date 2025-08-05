import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Building, Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchOverlayProps {
  onCitySearchClick: () => void;
  onAddressSearchClick: () => void;
  onCitySelected?: (city: string) => void;
}

type SearchResultType = 'city' | 'address';

interface SearchResult {
  id: string;
  text: string;
  type: SearchResultType;
  icon: React.ReactNode;
}

const cities = [
  "Boston, MA",
  "Cambridge, MA", 
  "Somerville, MA",
  "Quincy, MA",
  "Brookline, MA",
  "Newton, MA",
  "Waltham, MA",
  "Medford, MA",
  "New York, NY"
];

export function SearchOverlay({ onCitySearchClick, onAddressSearchClick, onCitySelected }: SearchOverlayProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus search input on mount
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  // Generate search results based on query
  useEffect(() => {
    if (searchQuery.trim()) {
      const results: SearchResult[] = [];
      const query = searchQuery.toLowerCase();

      // Add city matches
      const cityMatches = cities.filter(city => 
        city.toLowerCase().includes(query)
      ).slice(0, 4);

      cityMatches.forEach((city, index) => {
        results.push({
          id: `city-${index}`,
          text: city,
          type: 'city',
          icon: <MapPin className="h-4 w-4 text-primary" />
        });
      });

      // Add address suggestions based on patterns
      if (isAddressLike(searchQuery)) {
        // Generate some mock address suggestions
        const addressSuggestions = generateAddressSuggestions(searchQuery);
        addressSuggestions.forEach((address, index) => {
          results.push({
            id: `address-${index}`,
            text: address,
            type: 'address',
            icon: <Building className="h-4 w-4 text-secondary" />
          });
        });
      }

      setSearchResults(results);
      setShowDropdown(results.length > 0);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  }, [searchQuery]);

  // Detect if input looks like an address
  const isAddressLike = (input: string): boolean => {
    const addressPatterns = [
      /^\d+\s+\w+/,           // Starts with number + space + word (e.g., "123 Main")
      /\d+.*\s+(st|street|ave|avenue|rd|road|blvd|boulevard|dr|drive|ln|lane|ct|court|pl|place|way)/i,
      /\d{5}$/,               // Ends with 5 digits (zip code)
    ];
    return addressPatterns.some(pattern => pattern.test(input.trim()));
  };

  // Generate mock address suggestions
  const generateAddressSuggestions = (query: string): string[] => {
    const suggestions = [
      `${query} Street, Boston, MA`,
      `${query} Avenue, Cambridge, MA`,
      `${query} Road, Somerville, MA`
    ];
    return suggestions.slice(0, 2);
  };

  const handleResultSelection = (result: SearchResult) => {
    setSearchQuery(result.text);
    setShowDropdown(false);
    
    // Brief delay to show selection, then close overlay
    setTimeout(() => {
      if (result.type === 'city') {
        onCitySelected?.(result.text);
        onCitySearchClick();
      } else {
        onAddressSearchClick();
      }
    }, 200);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setShowDropdown(false);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    
    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return text;
    
    return (
      <>
        {text.substring(0, index)}
        <span className="bg-primary/20 font-medium">
          {text.substring(index, index + query.length)}
        </span>
        {text.substring(index + query.length)}
      </>
    );
  };

  // Group results by type for organized display
  const groupedResults = searchResults.reduce((acc, result) => {
    if (!acc[result.type]) acc[result.type] = [];
    acc[result.type].push(result);
    return acc;
  }, {} as Record<SearchResultType, SearchResult[]>);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="w-[500px] bg-background rounded-lg shadow-xl p-8 animate-fade-in border border-border">
        
        {/* Unified Search Interface */}
        <div className="animate-fade-in">
          <h2 className="text-xl font-semibold text-foreground mb-6 text-center">
            Search Properties
          </h2>
          
          {/* Unified Search Input */}
          <div className="relative mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                ref={searchInputRef}
                type="text"
                placeholder="Search by city or address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearSearch}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Smart Search Results Dropdown */}
            {showDropdown && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-10 animate-fade-in max-h-80 overflow-y-auto">
                
                {/* City Results */}
                {groupedResults.city && groupedResults.city.length > 0 && (
                  <div>
                    <div className="px-4 py-2 text-xs font-medium text-muted-foreground bg-muted/50 border-b border-border">
                      Cities
                    </div>
                    {groupedResults.city.map((result) => (
                      <button
                        key={result.id}
                        onClick={() => handleResultSelection(result)}
                        className="w-full px-4 py-3 text-left hover:bg-accent transition-colors flex items-center gap-3 border-b border-border/30 last:border-b-0"
                      >
                        {result.icon}
                        <span className="text-foreground">
                          {highlightMatch(result.text, searchQuery)}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Address Results */}
                {groupedResults.address && groupedResults.address.length > 0 && (
                  <div>
                    <div className="px-4 py-2 text-xs font-medium text-muted-foreground bg-muted/50 border-b border-border">
                      Addresses
                    </div>
                    {groupedResults.address.map((result) => (
                      <button
                        key={result.id}
                        onClick={() => handleResultSelection(result)}
                        className="w-full px-4 py-3 text-left hover:bg-accent transition-colors flex items-center gap-3 last:rounded-b-lg"
                      >
                        {result.icon}
                        <span className="text-foreground">
                          {highlightMatch(result.text, searchQuery)}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* No Results Message */}
            {showDropdown && searchQuery && searchResults.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-10 p-4 text-center text-muted-foreground">
                No results found for "{searchQuery}"
              </div>
            )}
          </div>

          {/* Search Tips */}
          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Try searching for cities like "Boston, MA" or addresses like "123 Main Street"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}