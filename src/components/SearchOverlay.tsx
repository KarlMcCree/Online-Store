import { Search, X } from "lucide-react";
import { useState } from "react";

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

const popularSearches = [
  "Study in Canada",
  "Visa Guide UK",
  "SOP Template",
  "Migration Program",
  "Travel Insurance",
  "Second Passport",
];

const SearchOverlay = ({ open, onClose }: SearchOverlayProps) => {
  const [query, setQuery] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-background/95 backdrop-blur-sm">
      <div className="container max-w-2xl pt-24">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-foreground hover:text-secondary transition-colors"
          aria-label="Close search"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, services, guides..."
            className="w-full bg-transparent border-b-2 border-border focus:border-secondary text-foreground text-xl font-body pl-12 pr-4 py-4 outline-none transition-colors"
            autoFocus
          />
        </div>

        <div className="mt-8">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider font-body mb-4">
            Popular Searches
          </p>
          <div className="flex flex-wrap gap-2">
            {popularSearches.map((term) => (
              <button
                key={term}
                onClick={() => setQuery(term)}
                className="px-4 py-2 text-sm font-body rounded-full border border-border text-foreground hover:bg-secondary hover:text-secondary-foreground hover:border-secondary transition-all"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;
