import React from 'react';
import { Star, Plus, ArrowRight, Sparkles } from 'lucide-react';
import { MenuItem } from '../types';
import { INITIAL_MENU_ITEMS } from '../data/initialData';

interface FeaturedMenuProps {
  items?: MenuItem[];
  onSelectItem: (item: MenuItem) => void;
  onAddToCart: (item: MenuItem) => void;
  onViewAllMenu?: () => void;
  onViewFullMenu?: () => void;
}

export const FeaturedMenu: React.FC<FeaturedMenuProps> = ({
  items = INITIAL_MENU_ITEMS,
  onSelectItem,
  onAddToCart,
  onViewAllMenu,
  onViewFullMenu
}) => {
  const handleViewAll = onViewAllMenu || onViewFullMenu || (() => {});
  // Take the 4 primary featured items requested in the prompt + additional popular items
  const menuList = (items && items.length > 0) ? items : INITIAL_MENU_ITEMS;
  const featured = menuList.filter(it => it.isPopular).slice(0, 4);

  return (
    <section className="py-20 bg-[#FDFBF7]" id="featured-menu-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 text-[#C48B47] text-xs font-semibold uppercase tracking-widest mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Café Favorites</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2A1E17] tracking-tight">
              Featured Menu
            </h2>
            <p className="text-[#2A1E17]/70 text-sm mt-2 max-w-md">
              A curated selection of our most beloved morning roasts, artisan pastries, and breakfast staples.
            </p>
          </div>

          <button
            onClick={handleViewAll}
            id="featured-view-all-btn"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-sm font-semibold text-[#2A1E17] hover:text-[#C48B47] group transition-colors"
          >
            <span>View All Menu</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl overflow-hidden border border-[#2A1E17]/8 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
              id={`featured-card-${item.id}`}
            >
              {/* Image Container with hover zoom */}
              <div 
                className="relative h-48 overflow-hidden bg-[#F6F2EC] cursor-pointer"
                onClick={() => onSelectItem(item)}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold text-[#2A1E17] flex items-center gap-1 shadow-sm">
                  <Star className="w-3 h-3 fill-[#C48B47] text-[#C48B47]" />
                  <span>{item.rating.toFixed(1)}</span>
                </div>

                {item.dietary.length > 0 && (
                  <div className="absolute bottom-3 left-3 bg-[#2A1E17]/80 backdrop-blur-sm text-[#FDFBF7] text-[10px] font-medium px-2 py-0.5 rounded capitalize">
                    {item.dietary[0]}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 
                    onClick={() => onSelectItem(item)}
                    className="font-serif text-lg font-bold text-[#2A1E17] group-hover:text-[#C48B47] transition-colors cursor-pointer"
                  >
                    {item.name}
                  </h3>
                  <p className="text-xs text-[#2A1E17]/70 mt-1.5 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-[#2A1E17]/5 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-[#2A1E17]/50 block">Price</span>
                    <span className="font-serif text-lg font-bold text-[#2A1E17]">
                      ${item.price.toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={() => onAddToCart(item)}
                    id={`featured-add-cart-${item.id}`}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-[#2A1E17] hover:bg-[#C48B47] text-white text-xs font-medium rounded-xl transition-all active:scale-95 shadow-sm"
                    title="Add to Cart or Customize"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
