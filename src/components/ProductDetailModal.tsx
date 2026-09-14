import React, { useState, useEffect } from 'react';
import { X, Star, Plus, Minus, Check, Clock, Flame } from 'lucide-react';
import { MenuItem, CustomizationOption } from '../types';

interface ProductDetailModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onAddToCart: (item: MenuItem, quantity: number, customization?: CustomizationOption) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  item,
  onClose,
  onAddToCart
}) => {
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState<'Regular' | 'Large'>('Regular');
  const [milk, setMilk] = useState<'Whole Milk' | 'Oat Milk' | 'Almond Milk' | 'Soy Milk'>('Whole Milk');
  const [sweetness, setSweetness] = useState<'0%' | '25%' | '50%' | '100%'>('50%');
  const [temperature, setTemperature] = useState<'Hot' | 'Iced'>('Hot');
  const [extraShots, setExtraShots] = useState(0);
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Reset state when item changes
  useEffect(() => {
    if (item) {
      setQuantity(1);
      setSize('Regular');
      setMilk('Whole Milk');
      setSweetness('50%');
      setTemperature(item.category === 'cold-drinks' ? 'Iced' : 'Hot');
      setExtraShots(0);
      setSpecialInstructions('');
    }
  }, [item]);

  if (!item) return null;

  const isBeverage = item.category === 'coffee' || item.category === 'cold-drinks';

  // Calculate dynamic unit price with customizations
  const sizeSurcharge = size === 'Large' ? 0.75 : 0;
  const milkSurcharge = (milk === 'Oat Milk' || milk === 'Almond Milk') ? 0.60 : 0;
  const shotSurcharge = extraShots * 1.00;
  const unitPrice = item.price + (isBeverage ? sizeSurcharge + milkSurcharge + shotSurcharge : 0);
  const totalPrice = unitPrice * quantity;

  const handleAdd = () => {
    const customization: CustomizationOption | undefined = isBeverage
      ? {
          size,
          milk,
          sweetness,
          temperature,
          extraShots: extraShots > 0 ? extraShots : undefined,
          specialInstructions: specialInstructions.trim() || undefined
        }
      : specialInstructions.trim()
      ? { specialInstructions: specialInstructions.trim() }
      : undefined;

    onAddToCart(item, quantity, customization);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#2A1E17]/10 my-8 relative animate-in fade-in zoom-in-95 duration-200"
        id="product-detail-modal"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white text-[#2A1E17] flex items-center justify-center shadow-md transition-colors"
          aria-label="Close product modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top: Large Crisp Photography */}
        <div className="relative h-64 sm:h-72 bg-[#F6F2EC] overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          <div className="absolute bottom-4 left-6 flex items-center gap-2">
            <div className="bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#2A1E17] flex items-center gap-1.5 shadow-sm">
              <Star className="w-3.5 h-3.5 fill-[#C48B47] text-[#C48B47]" />
              <span>{item.rating.toFixed(1)}</span>
              <span className="text-[#2A1E17]/50 font-normal">({item.reviewCount} reviews)</span>
            </div>

            {item.calories && (
              <div className="bg-[#2A1E17]/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-[#D4A373]" />
                <span>{item.calories} kcal</span>
              </div>
            )}
          </div>
        </div>

        {/* Details Content */}
        <div className="p-6 sm:p-8 max-h-[calc(85vh-18rem)] overflow-y-auto space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#C48B47]">
                  {item.category.replace('-', ' ')}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2A1E17] mt-0.5">
                  {item.name}
                </h2>
              </div>
              <div className="text-right">
                <span className="font-serif text-2xl sm:text-3xl font-bold text-[#2A1E17]">
                  ${unitPrice.toFixed(2)}
                </span>
              </div>
            </div>

            <p className="text-sm text-[#2A1E17]/75 mt-2.5 leading-relaxed font-light">
              {item.description}
            </p>

            {/* Dietary Tags */}
            {item.dietary.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {item.dietary.map((d, i) => (
                  <span
                    key={i}
                    className="text-xs bg-[#eef6f2] text-[#1E3A2F] font-medium px-2.5 py-0.5 rounded-full capitalize"
                  >
                    ✓ {d}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Ingredients */}
          {item.ingredients.length > 0 && (
            <div className="pt-3 border-t border-[#2A1E17]/8">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#2A1E17]/80 mb-2">
                Ingredients
              </h4>
              <p className="text-xs text-[#2A1E17]/70 leading-normal">
                {item.ingredients.join(', ')}
              </p>
            </div>
          )}

          {/* Beverage Customizations */}
          {isBeverage && (
            <div className="space-y-4 pt-3 border-t border-[#2A1E17]/8">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#2A1E17]/80">
                Customizations
              </h4>

              {/* Temperature & Size Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#2A1E17]/80 mb-1.5">Temperature</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['Hot', 'Iced'] as const).map((temp) => (
                      <button
                        type="button"
                        key={temp}
                        onClick={() => setTemperature(temp)}
                        className={`py-2 px-3 text-xs font-medium rounded-xl border transition-all ${
                          temperature === temp
                            ? 'bg-[#2A1E17] text-white border-[#2A1E17]'
                            : 'bg-[#F6F2EC] text-[#2A1E17] border-transparent hover:bg-[#ede7de]'
                        }`}
                      >
                        {temp}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2A1E17]/80 mb-1.5">Size</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['Regular', 'Large'] as const).map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setSize(s)}
                        className={`py-2 px-3 text-xs font-medium rounded-xl border transition-all ${
                          size === s
                            ? 'bg-[#2A1E17] text-white border-[#2A1E17]'
                            : 'bg-[#F6F2EC] text-[#2A1E17] border-transparent hover:bg-[#ede7de]'
                        }`}
                      >
                        {s} {s === 'Large' && '(+$0.75)'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Milk Choice */}
              <div>
                <label className="block text-xs font-semibold text-[#2A1E17]/80 mb-1.5">Milk Option</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['Whole Milk', 'Oat Milk', 'Almond Milk', 'Soy Milk'] as const).map((m) => (
                    <button
                      type="button"
                      key={m}
                      onClick={() => setMilk(m)}
                      className={`py-2 px-2.5 text-center text-xs font-medium rounded-xl border transition-all ${
                        milk === m
                          ? 'bg-[#2A1E17] text-white border-[#2A1E17]'
                          : 'bg-[#F6F2EC] text-[#2A1E17] border-transparent hover:bg-[#ede7de]'
                      }`}
                    >
                      <span>{m}</span>
                      {(m === 'Oat Milk' || m === 'Almond Milk') && (
                        <span className="block text-[10px] opacity-70">+0.60</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sweetness & Extra Shots */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#2A1E17]/80 mb-1.5">Sweetness</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {(['0%', '25%', '50%', '100%'] as const).map((sw) => (
                      <button
                        type="button"
                        key={sw}
                        onClick={() => setSweetness(sw)}
                        className={`py-1.5 text-xs font-medium rounded-lg border transition-all ${
                          sweetness === sw
                            ? 'bg-[#C48B47] text-white border-[#C48B47]'
                            : 'bg-[#F6F2EC] text-[#2A1E17] border-transparent'
                        }`}
                      >
                        {sw}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2A1E17]/80 mb-1.5">Extra Espresso Shot</label>
                  <div className="flex items-center justify-between p-1.5 bg-[#F6F2EC] rounded-xl">
                    <button
                      type="button"
                      onClick={() => setExtraShots(Math.max(0, extraShots - 1))}
                      disabled={extraShots === 0}
                      className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-[#2A1E17] disabled:opacity-30"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-semibold text-[#2A1E17]">
                      {extraShots === 0 ? 'None' : `+${extraShots} ($${(extraShots * 1.0).toFixed(2)})`}
                    </span>
                    <button
                      type="button"
                      onClick={() => setExtraShots(Math.min(3, extraShots + 1))}
                      className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-[#2A1E17]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Special Instructions */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-[#2A1E17]/80 mb-1.5">
              Special Instructions
            </label>
            <input
              type="text"
              value={specialInstructions || ''}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Extra hot, light ice, dressing on the side..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#2A1E17]/15 text-xs text-[#2A1E17] focus:outline-none focus:border-[#C48B47]"
            />
          </div>
        </div>

        {/* Footer with Quantity & Add to Cart button */}
        <div className="p-6 bg-[#FDFBF7] border-t border-[#2A1E17]/10 flex items-center justify-between gap-4">
          {/* Quantity Selector */}
          <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-xl border border-[#2A1E17]/10 shadow-inner">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
              className="w-8 h-8 rounded-lg bg-[#F6F2EC] hover:bg-[#ede7de] text-[#2A1E17] flex items-center justify-center disabled:opacity-40 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="font-serif text-base font-bold text-[#2A1E17] w-6 text-center">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-lg bg-[#F6F2EC] hover:bg-[#ede7de] text-[#2A1E17] flex items-center justify-center transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to Cart CTA */}
          <button
            onClick={handleAdd}
            id="product-modal-add-to-cart-btn"
            className="flex-1 py-3.5 px-6 bg-[#2A1E17] hover:bg-[#1E1510] text-white font-medium text-sm rounded-xl transition-all shadow-md active:scale-[0.99] flex items-center justify-between"
          >
            <span>Add to Cart</span>
            <span className="font-serif text-base font-bold text-[#D4A373]">
              ${totalPrice.toFixed(2)}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
