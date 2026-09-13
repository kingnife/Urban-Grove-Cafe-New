import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Star, Clock, ChefHat, ArrowRight } from 'lucide-react';
import { MenuItem } from '../types';
import { INITIAL_MENU_ITEMS } from '../data/initialData';

interface TodaySpecialProps {
  specialItem?: MenuItem;
  items?: MenuItem[];
  onOrderSpecial?: (item: MenuItem) => void;
  onSelectItem?: (item: MenuItem) => void;
  onAddToCart?: (item: MenuItem) => void;
}

const DEFAULT_SPECIAL: MenuItem = INITIAL_MENU_ITEMS.find((m) => m.isSpecial) || INITIAL_MENU_ITEMS[4] || {
  id: 'special-default',
  name: 'Truffle Wild Mushroom Fettuccine',
  description: 'Handmade artisanal egg fettuccine tossed with sautéed cremini, chanterelle mushrooms, black truffle butter, and 24-month aged Parmigiano-Reggiano.',
  price: 12.50,
  category: 'pastries',
  image: 'https://images.unsplash.com/photo-1556760544-74068565f05c?auto=format&fit=crop&w=1200&q=80',
  rating: 4.95,
  reviewCount: 164,
  dietary: ['vegetarian'],
  ingredients: ['Fresh egg fettuccine', 'Wild chanterelles & cremini', 'Black truffle butter', 'Aged Parmigiano', 'White wine reduction'],
  calories: 460,
  isPopular: true,
  isSpecial: true,
  isAvailable: true,
  prepTimeMinutes: 14
};

export const TodaySpecial: React.FC<TodaySpecialProps> = ({
  specialItem,
  items,
  onOrderSpecial,
  onSelectItem,
  onAddToCart
}) => {
  // Resolve item safely
  const item: MenuItem = 
    specialItem || 
    (items && (items.find((m) => m.isSpecial) || items[0])) || 
    DEFAULT_SPECIAL;

  const handleAction = () => {
    if (onAddToCart) {
      onAddToCart(item);
    } else if (onOrderSpecial) {
      onOrderSpecial(item);
    } else if (onSelectItem) {
      onSelectItem(item);
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-[#F6F2EC]" id="todays-special-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#2A1E17] text-[#FDFBF7] rounded-3xl overflow-hidden shadow-xl border border-[#443226] grid grid-cols-1 lg:grid-cols-12 items-center">
          
          {/* Left Large Photography */}
          <div className="lg:col-span-7 relative h-72 sm:h-96 lg:h-full min-h-[380px] overflow-hidden">
            <img
              src={item?.image || DEFAULT_SPECIAL.image}
              alt={item?.name || 'Chef Special'}
              className="w-full h-full object-cover object-center scale-105 hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2A1E17]/80 via-transparent to-transparent lg:hidden" />
            
            {/* Promotional Chef Badge */}
            <div className="absolute top-5 left-5 bg-[#1E3A2F]/90 backdrop-blur-md border border-white/20 text-[#86efac] text-xs font-semibold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
              <ChefHat className="w-3.5 h-3.5" />
              <span>Chef's Daily Showcase</span>
            </div>

            <div className="absolute bottom-5 left-5 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs px-3 py-1.5 rounded-xl flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#D4A373]" />
              <span>Prepared fresh in ~{item?.prepTimeMinutes || 14} mins</span>
            </div>
          </div>

          {/* Right Editorial Content */}
          <div className="lg:col-span-5 p-8 sm:p-12 lg:p-14 flex flex-col justify-between">
            <div>
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 text-[#D4A373] text-xs font-semibold tracking-widest uppercase mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Today's Special</span>
              </div>

              {/* Title */}
              <h3 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
                {item?.name || 'Chef Signature Creation'}
              </h3>

              {/* Description */}
              <p className="text-white/80 text-sm sm:text-base leading-relaxed mb-6 font-light">
                {item?.description || DEFAULT_SPECIAL.description}
              </p>

              {/* Ingredients / Highlights */}
              <div className="space-y-2 mb-8 pt-4 border-t border-white/10">
                <p className="text-xs uppercase tracking-wider text-[#D4A373] font-semibold">
                  Key Ingredients & Origins
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {(item?.ingredients && item.ingredients.length > 0 ? item.ingredients : DEFAULT_SPECIAL.ingredients).map((ing, i) => (
                    <span
                      key={i}
                      className="text-xs bg-white/5 border border-white/10 text-white/90 px-2.5 py-1 rounded-lg"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Price & CTA Row */}
            <div className="flex items-center justify-between pt-6 border-t border-white/10">
              <div>
                <div className="flex items-center gap-1 text-[#D4A373] text-xs mb-1">
                  <Star className="w-3.5 h-3.5 fill-[#D4A373]" />
                  <span className="font-semibold text-white">{item?.rating?.toFixed(1) || '4.9'}</span>
                  <span className="text-white/50">({item?.reviewCount || 120} reviews)</span>
                </div>
                <span className="font-serif text-3xl font-bold text-[#D4A373]">
                  ${(item?.price || 12.5).toFixed(2)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {onSelectItem && (
                  <button
                    onClick={() => onSelectItem(item)}
                    className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-medium text-xs rounded-xl transition-all"
                  >
                    Details
                  </button>
                )}
                <button
                  onClick={handleAction}
                  id="todays-special-order-btn"
                  className="px-6 py-3.5 bg-[#C48B47] hover:bg-[#b37c3b] text-white font-medium text-sm rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-[0.98] flex items-center gap-2"
                >
                  <span>Order Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
