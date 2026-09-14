import React, { useState, useMemo } from 'react';
import { Search, Star, Plus, SlidersHorizontal, Sparkles, Filter } from 'lucide-react';
import { MenuItem, MenuCategory, DietaryType } from '../types';

interface MenuPageProps {
  items: MenuItem[];
  onSelectItem: (item: MenuItem) => void;
  onAddToCart: (item: MenuItem) => void;
  initialCategory?: MenuCategory;
}

export const MenuPage: React.FC<MenuPageProps> = ({
  items,
  onSelectItem,
  onAddToCart,
  initialCategory = 'all'
}) => {
  const [activeCategory, setActiveCategory] = useState<MenuCategory>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc'>('popular');
  const [selectedDietary, setSelectedDietary] = useState<DietaryType[]>([]);

  const categories: { id: MenuCategory; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'coffee', label: 'Coffee' },
    { id: 'breakfast', label: 'Breakfast' },
    { id: 'sandwiches', label: 'Sandwiches' },
    { id: 'pastries', label: 'Pastries' },
    { id: 'desserts', label: 'Desserts' },
    { id: 'cold-drinks', label: 'Cold Drinks' },
  ];

  const dietaryOptions: { id: DietaryType; label: string }[] = [
    { id: 'vegan', label: 'Vegan' },
    { id: 'vegetarian', label: 'Vegetarian' },
    { id: 'gluten-free', label: 'Gluten-Free' },
    { id: 'dairy-free', label: 'Dairy-Free' },
  ];

  const toggleDietary = (dt: DietaryType) => {
    setSelectedDietary((prev) =>
      prev.includes(dt) ? prev.filter((d) => d !== dt) : [...prev, dt]
    );
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Category filter
      if (activeCategory !== 'all' && item.category !== activeCategory) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = (item?.name || '').toLowerCase().includes(q);
        const matchesDesc = (item?.description || '').toLowerCase().includes(q);
        const matchesIngredients = (item?.ingredients || []).some((ing) => (ing || '').toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesIngredients) return false;
      }
      // Dietary filter
      if (selectedDietary.length > 0) {
        const hasAllDietary = selectedDietary.every((dt) => (item?.dietary || []).includes(dt));
        if (!hasAllDietary) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      // Default: popular
      if (a.isPopular && !b.isPopular) return -1;
      if (!a.isPopular && b.isPopular) return 1;
      return b.rating - a.rating;
    });
  }, [items, activeCategory, searchQuery, sortBy, selectedDietary]);

  return (
    <div className="py-12 sm:py-16 bg-[#FDFBF7]" id="menu-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header (Prompt Requirement) */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#C48B47] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kitchen & Roastery</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#2A1E17] tracking-tight">
            Our Menu
          </h1>
          <p className="text-[#2A1E17]/80 text-base sm:text-lg mt-3 font-serif italic">
            Fresh ingredients. Bold flavours. Always made with care.
          </p>
        </div>

        {/* Filter Controls Row */}
        <div className="bg-white p-5 rounded-3xl border border-[#2A1E17]/10 shadow-sm mb-10 space-y-4">
          
          {/* Top Line: Search and Sort */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Search menu items... */}
            <div className="relative w-full sm:max-w-md">
              <Search className="w-4 h-4 text-[#2A1E17]/40 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery || ''}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search menu items..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#2A1E17]/15 text-xs sm:text-sm text-[#2A1E17] focus:outline-none focus:border-[#C48B47]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-xs text-[#2A1E17]/40 hover:text-[#2A1E17]"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <SlidersHorizontal className="w-4 h-4 text-[#C48B47] shrink-0" />
              <span className="text-xs font-medium text-[#2A1E17]/60 whitespace-nowrap">Sort by:</span>
              <select
                value={sortBy || 'popular'}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="px-3 py-2 rounded-xl border border-[#2A1E17]/15 text-xs font-medium text-[#2A1E17] bg-white focus:outline-none focus:border-[#C48B47]"
              >
                <option value="popular">Most Popular</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Category Filters Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? 'bg-[#2A1E17] text-white shadow-sm'
                    : 'bg-[#F6F2EC] text-[#2A1E17]/80 hover:bg-[#ede7de]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Dietary Filter Chips */}
          <div className="flex items-center flex-wrap gap-2 pt-2 border-t border-[#2A1E17]/5 text-xs">
            <span className="text-[11px] font-semibold text-[#2A1E17]/50 flex items-center gap-1 mr-1">
              <Filter className="w-3 h-3" /> Dietary:
            </span>
            {dietaryOptions.map((opt) => {
              const active = selectedDietary.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  onClick={() => toggleDietary(opt.id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                    active
                      ? 'bg-[#1E3A2F] text-white border-[#1E3A2F]'
                      : 'bg-white text-[#2A1E17]/70 border-[#2A1E17]/15 hover:border-[#2A1E17]/40'
                  }`}
                >
                  {active ? '✓ ' : ''}{opt.label}
                </button>
              );
            })}

            {selectedDietary.length > 0 && (
              <button
                onClick={() => setSelectedDietary([])}
                className="text-xs text-[#C48B47] hover:underline ml-auto"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Menu Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-[#2A1E17]/10 p-8">
            <p className="font-serif text-xl font-bold text-[#2A1E17]">No items found</p>
            <p className="text-xs text-[#2A1E17]/60 mt-1 max-w-sm mx-auto">
              We couldn't find any dishes or drinks matching your current filters. Try resetting the category or search term.
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
                setSelectedDietary([]);
              }}
              className="mt-4 px-5 py-2.5 bg-[#2A1E17] text-white text-xs font-semibold rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-3xl overflow-hidden border border-[#2A1E17]/8 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                id={`menu-card-${item.id}`}
              >
                {/* Image */}
                <div
                  className="relative h-52 overflow-hidden bg-[#F6F2EC] cursor-pointer"
                  onClick={() => onSelectItem(item)}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    {item.isPopular && (
                      <span className="bg-[#2A1E17]/85 backdrop-blur-sm text-[#D4A373] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Popular
                      </span>
                    )}
                    {item.isSpecial && (
                      <span className="bg-[#1E3A2F]/90 backdrop-blur-sm text-[#86efac] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Today's Special
                      </span>
                    )}
                  </div>

                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-[#2A1E17] flex items-center gap-1 shadow-sm">
                    <Star className="w-3.5 h-3.5 fill-[#C48B47] text-[#C48B47]" />
                    <span>{item.rating.toFixed(1)}</span>
                  </div>

                  {/* Dietary indicators */}
                  {item.dietary.length > 0 && (
                    <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
                      {item.dietary.map((d, i) => (
                        <span
                          key={i}
                          className="bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-0.5 rounded capitalize"
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3
                        onClick={() => onSelectItem(item)}
                        className="font-serif text-xl font-bold text-[#2A1E17] group-hover:text-[#C48B47] transition-colors cursor-pointer"
                      >
                        {item.name}
                      </h3>
                      <span className="font-serif text-lg font-bold text-[#2A1E17] shrink-0">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-[#2A1E17]/70 mt-2 line-clamp-2 leading-relaxed font-light">
                      {item.description}
                    </p>

                    {/* Ingredients summary */}
                    {item.ingredients.length > 0 && (
                      <p className="text-[11px] text-[#2A1E17]/50 mt-3 truncate">
                        <span className="font-semibold text-[#2A1E17]/70">With:</span> {item.ingredients.slice(0, 3).join(', ')}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-6 pt-4 border-t border-[#2A1E17]/5 flex items-center gap-2">
                    <button
                      onClick={() => onSelectItem(item)}
                      className="flex-1 py-2.5 px-3 bg-[#F6F2EC] hover:bg-[#ede7de] text-[#2A1E17] text-xs font-semibold rounded-xl transition-colors text-center"
                    >
                      Customize & Details
                    </button>

                    <button
                      onClick={() => onAddToCart(item)}
                      id={`menu-quick-add-${item.id}`}
                      className="py-2.5 px-3.5 bg-[#2A1E17] hover:bg-[#C48B47] text-white text-xs font-semibold rounded-xl transition-all active:scale-95 shadow-sm flex items-center gap-1 shrink-0"
                      title="Quick Add to Cart"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
