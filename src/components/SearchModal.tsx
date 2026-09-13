import React, { useState, useMemo } from 'react';
import { X, Search, Star, Plus } from 'lucide-react';
import { MenuItem } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: MenuItem[];
  onSelectItem: (item: MenuItem) => void;
  onAddToCart: (item: MenuItem) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  items,
  onSelectItem,
  onAddToCart
}) => {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!items || items.length === 0) return [];
    if (!query.trim()) return items.slice(0, 6);
    const q = query.toLowerCase().trim();
    return items.filter(
      (it) =>
        (it?.name || '').toLowerCase().includes(q) ||
        (it?.description || '').toLowerCase().includes(q) ||
        (it?.category || '').toLowerCase().includes(q) ||
        (it?.ingredients || []).some((ing) => (ing || '').toLowerCase().includes(q))
    );
  }, [items, query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#2A1E17]/10 mt-12 relative animate-in fade-in zoom-in-95 duration-200"
        id="search-modal"
      >
        {/* Search Input Header */}
        <div className="p-4 sm:p-5 border-b border-[#2A1E17]/10 flex items-center gap-3 bg-[#FDFBF7]">
          <Search className="w-5 h-5 text-[#C48B47] shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search coffee, pastries, avocado toast, pasta..."
            className="w-full bg-transparent text-sm sm:text-base text-[#2A1E17] placeholder-[#2A1E17]/40 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-[#2A1E17]/40 hover:text-[#2A1E17] px-2 py-1"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 text-[#2A1E17]/60 hover:text-[#2A1E17] rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6 space-y-3">
          <div className="flex items-center justify-between text-xs text-[#2A1E17]/50 mb-2">
            <span>{query ? `Found ${results.length} results` : 'Popular Café Suggestions'}</span>
            <span className="hidden sm:inline">Press ESC to close</span>
          </div>

          {results.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#2A1E17]/60">
              No menu items found matching "{query}". Try searching for "Latte", "Croissant", or "Pasta".
            </div>
          ) : (
            results.map((item) => (
              <div
                key={item.id}
                className="group p-3 bg-[#FDFBF7] hover:bg-[#F6F2EC] rounded-2xl border border-[#2A1E17]/5 flex items-center justify-between gap-3 transition-colors"
              >
                <div
                  className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                  onClick={() => {
                    onSelectItem(item);
                    onClose();
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-xl object-cover bg-white shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif text-sm font-bold text-[#2A1E17] group-hover:text-[#C48B47] transition-colors truncate">
                        {item.name}
                      </h4>
                      <span className="text-[10px] bg-[#2A1E17]/10 text-[#2A1E17] px-2 py-0.5 rounded capitalize">
                        {item.category.replace('-', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-[#2A1E17]/65 truncate mt-0.5">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-serif text-xs font-bold text-[#2A1E17]">
                        ${item.price.toFixed(2)}
                      </span>
                      <div className="flex items-center gap-0.5 text-[11px] text-[#C48B47]">
                        <Star className="w-3 h-3 fill-[#C48B47]" />
                        <span>{item.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onAddToCart(item);
                    onClose();
                  }}
                  className="p-2.5 bg-[#2A1E17] hover:bg-[#C48B47] text-white rounded-xl transition-colors shrink-0 shadow-sm"
                  title="Add to Cart"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
