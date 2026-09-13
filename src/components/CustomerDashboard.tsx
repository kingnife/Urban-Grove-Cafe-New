import React, { useState } from 'react';
import { 
  User, 
  Award, 
  Clock, 
  Heart, 
  MapPin, 
  RotateCcw, 
  Gift, 
  Plus, 
  CheckCircle2, 
  Trash2,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { CustomerUser, Order, MenuItem } from '../types';
import { DEFAULT_USER } from '../data/initialData';

interface CustomerDashboardProps {
  user?: CustomerUser;
  orders: Order[];
  menuItems: MenuItem[];
  onReorder: (order: Order) => void;
  onAddToCart: (item: MenuItem) => void;
  onUpdateUser: (updated: Partial<CustomerUser>) => void;
  onTrackOrder: (orderId: string) => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  user,
  orders,
  menuItems,
  onReorder,
  onAddToCart,
  onUpdateUser,
  onTrackOrder
}) => {
  const safeUser: CustomerUser = user || DEFAULT_USER;
  const [activeTab, setActiveTab] = useState<'orders' | 'favorites' | 'addresses' | 'loyalty'>('orders');
  const [newAddressLabel, setNewAddressLabel] = useState('');
  const [newAddressText, setNewAddressText] = useState('');
  const [redeemedReward, setRedeemedReward] = useState<string | null>(null);

  // Favorite items mapped safely
  const favoriteItemIds = safeUser.favoriteItemIds || [];
  const favoriteItems = menuItems.filter((it) => favoriteItemIds.includes(it.id));

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddressLabel.trim() || !newAddressText.trim()) return;
    const newAdd = {
      id: `addr-${Date.now()}`,
      label: newAddressLabel.trim(),
      address: newAddressText.trim(),
      isDefault: (safeUser.savedAddresses || []).length === 0
    };
    onUpdateUser({
      savedAddresses: [...(safeUser.savedAddresses || []), newAdd]
    });
    setNewAddressLabel('');
    setNewAddressText('');
  };

  const handleDeleteAddress = (id: string) => {
    onUpdateUser({
      savedAddresses: (safeUser.savedAddresses || []).filter((a) => a.id !== id)
    });
  };

  const handleRedeemReward = (rewardTitle: string, pointCost: number) => {
    if (safeUser.loyaltyPoints < pointCost) return;
    onUpdateUser({
      loyaltyPoints: safeUser.loyaltyPoints - pointCost
    });
    setRedeemedReward(`Voucher unlocked: ${rewardTitle}! Present code UGC-GIFT-${Math.floor(1000 + Math.random() * 9000)} to your barista.`);
    setTimeout(() => setRedeemedReward(null), 6000);
  };

  return (
    <div className="py-12 sm:py-16 bg-[#FDFBF7]" id="customer-dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* User Welcome Banner */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#2A1E17]/10 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#2A1E17] text-[#D4A373] flex items-center justify-center font-serif text-2xl font-bold">
              {safeUser.name ? safeUser.name.charAt(0) : 'U'}
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#C48B47]">
                Welcome Back
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#2A1E17]">
                {safeUser.name || 'Valued Guest'}
              </h1>
              <p className="text-xs text-[#2A1E17]/60 mt-0.5">
                {safeUser.email} • {safeUser.phone}
              </p>
            </div>
          </div>

          {/* Loyalty Points Capsule (Prompt Requirement) */}
          <div className="bg-[#F6F2EC] p-4 rounded-2xl border border-[#2A1E17]/8 flex items-center gap-4 w-full sm:w-auto">
            <div className="w-12 h-12 rounded-xl bg-[#C48B47] text-white flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#2A1E17]/60 block">
                Loyalty Points
              </span>
              <span className="font-serif text-2xl font-bold text-[#2A1E17]">
                {safeUser.loyaltyPoints} pts
              </span>
              <span className="text-[11px] text-[#1E3A2F] font-medium block">
                Earn 10 pts per $1 spent
              </span>
            </div>
          </div>
        </div>

        {/* Redeemed Banner */}
        {redeemedReward && (
          <div className="p-4 bg-[#eef6f2] border border-[#1E3A2F]/20 rounded-2xl flex items-center gap-3 text-xs text-[#1E3A2F] font-semibold">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{redeemedReward}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#2A1E17]/10 pb-2 overflow-x-auto scrollbar-none text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-[#2A1E17] text-white'
                : 'text-[#2A1E17]/70 hover:bg-[#F6F2EC]'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Order History ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'favorites'
                ? 'bg-[#2A1E17] text-white'
                : 'text-[#2A1E17]/70 hover:bg-[#F6F2EC]'
            }`}
          >
            <Heart className="w-4 h-4" />
            <span>Saved Favorites ({favoriteItems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('loyalty')}
            className={`px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'loyalty'
                ? 'bg-[#2A1E17] text-white'
                : 'text-[#2A1E17]/70 hover:bg-[#F6F2EC]'
            }`}
          >
            <Gift className="w-4 h-4" />
            <span>Rewards & Loyalty</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'addresses'
                ? 'bg-[#2A1E17] text-white'
                : 'text-[#2A1E17]/70 hover:bg-[#F6F2EC]'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Delivery Addresses</span>
          </button>
        </div>

        {/* Tab 1: Order History */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="py-16 text-center bg-white rounded-3xl border border-[#2A1E17]/10 p-6">
                <ShoppingBag className="w-10 h-10 text-[#C48B47] mx-auto mb-2 opacity-60" />
                <p className="font-serif text-lg font-bold text-[#2A1E17]">No orders yet</p>
                <p className="text-xs text-[#2A1E17]/60 mt-1">Browse our menu and place your first café order!</p>
              </div>
            ) : (
              orders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-white p-6 rounded-3xl border border-[#2A1E17]/8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6"
                  id={`order-history-${ord.id}`}
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-serif text-lg font-bold text-[#2A1E17]">
                        Order #{ord.orderNumber}
                      </span>
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                        ord.status === 'completed'
                          ? 'bg-[#eef6f2] text-[#1E3A2F]'
                          : 'bg-[#C48B47]/15 text-[#C48B47]'
                      }`}>
                        {ord.status}
                      </span>
                      <span className="text-xs text-[#2A1E17]/50 font-light">
                        {ord.createdAt}
                      </span>
                    </div>

                    <p className="text-xs text-[#2A1E17]/80">
                      <span className="font-semibold">{ord.items.length} items:</span>{' '}
                      {ord.items.map((i) => `${i.quantity}x ${i?.menuItem?.name || 'Item'}`).join(', ')}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-[#2A1E17]/60">
                      <span>Type: <strong className="text-[#2A1E17] uppercase">{ord.orderType}</strong></span>
                      <span>Total: <strong className="text-[#2A1E17] font-serif">${ord.total.toFixed(2)}</strong></span>
                      <span>Paid via: <strong className="text-[#2A1E17] capitalize">{ord.paymentMethod.replace('_', ' ')}</strong></span>
                    </div>
                  </div>

                  {/* Actions: Reorder and Track */}
                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => onTrackOrder(ord.orderNumber)}
                      className="px-4 py-2 bg-[#F6F2EC] hover:bg-[#ede7de] text-[#2A1E17] text-xs font-semibold rounded-xl transition-colors"
                    >
                      Track Status
                    </button>

                    <button
                      onClick={() => onReorder(ord)}
                      id={`reorder-btn-${ord.id}`}
                      className="px-4 py-2 bg-[#2A1E17] hover:bg-[#C48B47] text-white text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reorder</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Saved Favorites */}
        {activeTab === 'favorites' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteItems.map((item) => (
              <div
                key={item.id}
                className="bg-white p-5 rounded-3xl border border-[#2A1E17]/8 shadow-sm flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-2xl object-cover shrink-0 bg-[#F6F2EC]"
                  />
                  <div className="min-w-0">
                    <h4 className="font-serif text-base font-bold text-[#2A1E17] truncate">
                      {item.name}
                    </h4>
                    <p className="font-serif text-sm font-bold text-[#C48B47] mt-0.5">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onAddToCart(item)}
                  className="px-3 py-2 bg-[#2A1E17] hover:bg-[#C48B47] text-white text-xs font-semibold rounded-xl transition-colors shrink-0 shadow-sm"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Loyalty & Rewards */}
        {activeTab === 'loyalty' && (
          <div className="space-y-8">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#2A1E17]/10 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#C48B47]">
                  Tier: Gold Roastery Connoisseur
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#2A1E17] mt-1">
                  Rewards Program & Redemptions
                </h3>
                <p className="text-xs sm:text-sm text-[#2A1E17]/70 mt-1 font-light">
                  You earn 10 points for every $1 spent in store or online. Redeem your balance for complimentary artisan coffees and fresh pastries.
                </p>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-[#2A1E17] mb-2">
                  <span>Current Balance: {safeUser.loyaltyPoints} pts</span>
                  <span>Next Reward at 400 pts</span>
                </div>
                <div className="w-full h-3 bg-[#F6F2EC] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#C48B47] to-[#D4A373] rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (safeUser.loyaltyPoints / 400) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Redeemable Rewards Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-[#2A1E17]/10">
                <div className="p-5 bg-[#FDFBF7] rounded-2xl border border-[#2A1E17]/10 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[10px] font-bold text-[#C48B47] uppercase">100 Points</span>
                    <h4 className="font-serif text-base font-bold text-[#2A1E17]">Free Espresso Shot / Syrup</h4>
                    <p className="text-xs text-[#2A1E17]/60 mt-1">Add any flavor pump or double ristretto upgrade.</p>
                  </div>
                  <button
                    onClick={() => handleRedeemReward('Free Espresso Upgrade', 100)}
                    disabled={safeUser.loyaltyPoints < 100}
                    className="py-2 px-3 bg-[#2A1E17] hover:bg-[#1E1510] text-white text-xs font-semibold rounded-xl disabled:opacity-30 transition-colors"
                  >
                    Redeem 100 pts
                  </button>
                </div>

                <div className="p-5 bg-[#FDFBF7] rounded-2xl border border-[#2A1E17]/10 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[10px] font-bold text-[#C48B47] uppercase">200 Points</span>
                    <h4 className="font-serif text-base font-bold text-[#2A1E17]">Free Butter Croissant</h4>
                    <p className="text-xs text-[#2A1E17]/60 mt-1">Freshly baked traditional French pastry.</p>
                  </div>
                  <button
                    onClick={() => handleRedeemReward('Complimentary French Croissant', 200)}
                    disabled={safeUser.loyaltyPoints < 200}
                    className="py-2 px-3 bg-[#2A1E17] hover:bg-[#1E1510] text-white text-xs font-semibold rounded-xl disabled:opacity-30 transition-colors"
                  >
                    Redeem 200 pts
                  </button>
                </div>

                <div className="p-5 bg-[#FDFBF7] rounded-2xl border border-[#2A1E17]/10 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[10px] font-bold text-[#C48B47] uppercase">300 Points</span>
                    <h4 className="font-serif text-base font-bold text-[#2A1E17]">Free Specialty Latte</h4>
                    <p className="text-xs text-[#2A1E17]/60 mt-1">Any signature latte or cold brew of your choice.</p>
                  </div>
                  <button
                    onClick={() => handleRedeemReward('Complimentary Specialty Latte', 300)}
                    disabled={safeUser.loyaltyPoints < 300}
                    className="py-2 px-3 bg-[#C48B47] hover:bg-[#b37c3b] text-white text-xs font-semibold rounded-xl disabled:opacity-30 transition-colors"
                  >
                    Redeem 300 pts
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Delivery Addresses */}
        {activeTab === 'addresses' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(safeUser.savedAddresses || []).map((addr) => (
                <div
                  key={addr.id}
                  className="bg-white p-5 rounded-2xl border border-[#2A1E17]/10 shadow-sm flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-serif text-base font-bold text-[#2A1E17]">
                        {addr.label}
                      </span>
                      {addr.isDefault && (
                        <span className="text-[10px] bg-[#1E3A2F]/10 text-[#1E3A2F] font-bold px-2 py-0.5 rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#2A1E17]/70 font-light leading-relaxed">
                      {addr.address}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteAddress(addr.id)}
                    className="text-[#2A1E17]/40 hover:text-red-600 transition-colors p-1"
                    title="Delete address"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Address Form */}
            <div className="bg-white p-6 rounded-3xl border border-[#2A1E17]/10 shadow-sm max-w-xl">
              <h4 className="font-serif text-lg font-bold text-[#2A1E17] mb-3">
                Add New Delivery Location
              </h4>
              <form onSubmit={handleAddAddress} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#2A1E17] mb-1">Label</label>
                  <input
                    type="text"
                    required
                    value={newAddressLabel}
                    onChange={(e) => setNewAddressLabel(e.target.value)}
                    placeholder="e.g. Design Studio, Apartment, Loft"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#2A1E17]/15 text-xs text-[#2A1E17] focus:outline-none focus:border-[#C48B47]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2A1E17] mb-1">Full Street Address</label>
                  <input
                    type="text"
                    required
                    value={newAddressText}
                    onChange={(e) => setNewAddressText(e.target.value)}
                    placeholder="742 Evergreen Terrace, Suite 402, Cityville"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#2A1E17]/15 text-xs text-[#2A1E17] focus:outline-none focus:border-[#C48B47]"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#2A1E17] hover:bg-[#1E1510] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5 text-[#D4A373]" />
                  <span>Save Address</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
