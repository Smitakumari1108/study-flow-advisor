
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X, TrendingUp } from 'lucide-react';

interface SearchAndFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedLevel: string;
  onLevelChange: (level: string) => void;
  priceFilter: string;
  onPriceFilterChange: (filter: string) => void;
  onClearFilters: () => void;
  onShowTrending: () => void;
  categories: string[];
}

const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedLevel,
  onLevelChange,
  priceFilter,
  onPriceFilterChange,
  onClearFilters,
  onShowTrending,
  categories
}) => {
  const hasActiveFilters = selectedCategory || selectedLevel || priceFilter;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
      <div className="flex flex-col lg:flex-row gap-4 items-center">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search courses, instructors, or topics..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-4 py-2 w-full"
          />
        </div>
        
        <div className="flex flex-wrap gap-3 items-center">
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all_categories">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedLevel} onValueChange={onLevelChange}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all_levels">All Levels</SelectItem>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priceFilter} onValueChange={onPriceFilterChange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Price" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all_prices">All Prices</SelectItem>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="under50">Under $50</SelectItem>
              <SelectItem value="under100">Under $100</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={onShowTrending}
            className="flex items-center gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            Trending
          </Button>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={onClearFilters}
              className="flex items-center gap-2 text-gray-600"
            >
              <X className="w-4 h-4" />
              Clear
            </Button>
          )}
        </div>
      </div>
      
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-4">
          {selectedCategory && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Category: {selectedCategory === 'all_categories' ? 'All Categories' : selectedCategory}
              <X className="w-3 h-3 cursor-pointer" onClick={() => onCategoryChange('')} />
            </Badge>
          )}
          {selectedLevel && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Level: {selectedLevel === 'all_levels' ? 'All Levels' : selectedLevel}
              <X className="w-3 h-3 cursor-pointer" onClick={() => onLevelChange('')} />
            </Badge>
          )}
          {priceFilter && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Price: {priceFilter === 'all_prices' ? 'All Prices' : priceFilter}
              <X className="w-3 h-3 cursor-pointer" onClick={() => onPriceFilterChange('')} />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchAndFilters;
