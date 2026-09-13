import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartItemId: string, delta: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onProceedToCheckout: () => void;
  onContinueShopping: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onContinueShopping
}) => {
  const subtotal = items.reduce((sum, it) => sum + it.itemTotal, 0);
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;
  const totalCount = items.reduce((sum, it) => sum + it.quantity, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-md w-full flex pl-10">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 26, stiffness: 300 }}
          className="w-full bg-[#FDFBF7] shadow-2xl flex flex-col justify-between"
          id="cart-drawer-panel"
        >
          {/* Header */}
          <div className="p-6 border-b border-[#2A1E17]/10 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#2A1E17] text-[#D4A373] flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#2A1E17]">
                Your Cart ({totalCount})
              </h3>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-[#2A1E17]/60 hover:text-[#2A1E17] hover:bg-[#F6F2EC] rounded-full transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#F6F2EC] text-[#C48B47] flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8 opacity-60" />
                </div>
                <div>
                  <p className="font-serif text-lg font-bold text-[#2A1E17]">Your cart is empty</p>
                  <p className="text-xs text-[#2A1E17]/60 mt-1 max-w-xs mx-auto">
                    Explore our specialty coffees, fresh croissants, and artisan toasts to start your order.
                  </p>
                </div>
                <button
                  onClick={onContinueShopping}
                  className="mt-4 px-5 py-2.5 bg-[#2A1E17] text-white text-xs font-semibold rounded-xl hover:bg-[#1E1510] transition-colors"
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              items.map((it) => (
                <div
                  key={it.cartItemId}
                  className="bg-white p-4 rounded-2xl border border-[#2A1E17]/8 shadow-sm flex items-start gap-3.5"
                  id={`cart-item-${it.cartItemId}`}
                >
                  {/* Image */}
                  <img
                    src={it.menuItem?.image || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80'}
                    alt={it.menuItem?.name || 'Item'}
                    className="w-16 h-16 rounded-xl object-cover bg-[#F6F2EC] shrink-0"
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-serif text-sm font-bold text-[#2A1E17] truncate">
                        {it.menuItem?.name || 'Artisan Item'}
                      </h4>
                      <span className="font-serif text-sm font-bold text-[#2A1E17] shrink-0">
                        ${(it.itemTotal || 0).toFixed(2)}
                      </span>
                    </div>

                    {/* Customizations summary */}
                    {it.customization && (
                      <div className="text-[11px] text-[#C48B47] mt-0.5 space-y-0.5">
                        {it.customization.size && <span>{it.customization.size} • </span>}
                        {it.customization.temperature && <span>{it.customization.temperature} • </span>}
                        {it.customization.milk && <span>{it.customization.milk}</span>}
                        {it.customization.extraShots ? <span> • +{it.customization.extraShots} shot</span> : null}
                        {it.customization.specialInstructions && (
                          <p className="text-[#2A1E17]/60 italic truncate">
                            Note: {it.customization.specialInstructions}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Quantity and Remove */}
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#2A1E17]/5">
                      <div className="flex items-center gap-2 bg-[#F6F2EC] px-2 py-1 rounded-lg">
                        <button
                          onClick={() => onUpdateQuantity(it.cartItemId, -1)}
                          className="w-5 h-5 flex items-center justify-center text-[#2A1E17] hover:text-[#C48B47]"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-semibold text-[#2A1E17] w-4 text-center">
                          {it.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(it.cartItemId, 1)}
                          className="w-5 h-5 flex items-center justify-center text-[#2A1E17] hover:text-[#C48B47]"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(it.cartItemId)}
                        className="text-[#2A1E17]/40 hover:text-red-600 transition-colors p-1"
                        title="Remove item"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with Calculations */}
          {items.length > 0 && (
            <div className="p-6 bg-white border-t border-[#2A1E17]/10 space-y-4">
              <div className="space-y-1.5 text-xs text-[#2A1E17]/80">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#2A1E17]">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#2A1E17] pt-2 border-t border-[#2A1E17]/10">
                  <span>Total</span>
                  <span className="font-serif text-lg text-[#C48B47]">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  onClick={onProceedToCheckout}
                  id="cart-proceed-checkout-btn"
                  className="w-full py-3.5 px-4 bg-[#2A1E17] hover:bg-[#1E1510] text-white text-sm font-medium rounded-xl transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 text-[#D4A373]" />
                </button>

                <button
                  onClick={onContinueShopping}
                  id="cart-continue-shopping-btn"
                  className="w-full py-2 text-xs font-semibold text-[#2A1E17]/70 hover:text-[#2A1E17] text-center"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
