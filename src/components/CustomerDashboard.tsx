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
  ShoppingBag,
  Printer,
  Mail,
  Loader2,
  Check,
  Send,
  X
} from 'lucide-react';
import { CustomerUser, Order, MenuItem, LoyaltyTransaction } from '../types';
import { DEFAULT_USER } from '../data/initialData';
import { ReceiptModal } from './ReceiptModal';
import { EmailConfirmationModal } from './EmailConfirmationModal';
import { LoyaltyRewardsSection } from './LoyaltyRewardsSection';
import { api } from '../utils/api';

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
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<Order | null>(null);
  const [emailingOrderId, setEmailingOrderId] = useState<string | null>(null);
  const [sentEmailRecord, setSentEmailRecord] = useState<{ [orderId: string]: { sentAt: string; email: string } }>({});
  const [emailModalData, setEmailModalData] = useState<{ order: Order; sentAt: string; email: string } | null>(null);
  const [emailNotice, setEmailNotice] = useState<{ message: string; orderId?: string } | null>(null);

  // Favorite items mapped safely
  const favoriteItemIds = safeUser.favoriteItemIds || [];
  const favoriteItems = menuItems.filter((it) => favoriteItemIds.includes(it.id));

  const handleEmailReceipt = async (ord: Order) => {
    const targetEmail = safeUser.email || ord.customerEmail || 'sarah.j@example.com';
    setEmailingOrderId(ord.id);

    try {
      const res = await api.emailReceipt(ord.id, targetEmail, ord);
      const sentTime = res.data?.sentAt || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setSentEmailRecord((prev) => ({
        ...prev,
        [ord.id]: { sentAt: sentTime, email: targetEmail }
      }));
      setEmailNotice({
        message: `Official confirmation receipt for Order #${ord.orderNumber} was sent to ${targetEmail}`,
        orderId: ord.id
      });
      // Open the simulated email confirmation template viewer so the customer can preview what was sent
      setEmailModalData({ order: ord, sentAt: sentTime, email: targetEmail });
    } catch (err) {
      console.error('Failed to email receipt:', err);
      setEmailNotice({
        message: `Could not send email receipt. Please try again.`
      });
    } finally {
      setEmailingOrderId(null);
    }
  };

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

  const handleRedeemReward = async (rewardTitle: string, pointCost: number) => {
    if (safeUser.loyaltyPoints < pointCost) return;
    try {
      const res = await api.redeemReward(rewardTitle, pointCost);
      if (res?.user) {
        onUpdateUser(res.user);
        setRedeemedReward(`Voucher unlocked: ${rewardTitle}! Present code ${res.voucherCode} to your barista.`);
      } else {
        const updatedPoints = safeUser.loyaltyPoints - pointCost;
        const voucher = `UGC-GIFT-${Math.floor(1000 + Math.random() * 9000)}`;
        const newTx: LoyaltyTransaction = {
          id: `tx-${Date.now()}`,
          date: 'Just now',
          description: `Redeemed: ${rewardTitle} (Voucher ${voucher})`,
          points: -pointCost,
          type: 'redemption',
          balanceAfter: updatedPoints
        };
        onUpdateUser({
          loyaltyPoints: updatedPoints,
          pointsHistory: [newTx, ...(safeUser.pointsHistory || [])]
        });
        setRedeemedReward(`Voucher unlocked: ${rewardTitle}! Present code ${voucher} to your barista.`);
      }
      setTimeout(() => setRedeemedReward(null), 9000);
    } catch (err) {
      console.warn('Backend redeem unavailable, updating locally:', err);
      const updatedPoints = safeUser.loyaltyPoints - pointCost;
      const voucher = `UGC-GIFT-${Math.floor(1000 + Math.random() * 9000)}`;
      const newTx: LoyaltyTransaction = {
        id: `tx-${Date.now()}`,
        date: 'Just now',
        description: `Redeemed: ${rewardTitle} (Voucher ${voucher})`,
        points: -pointCost,
        type: 'redemption',
        balanceAfter: updatedPoints
      };
      onUpdateUser({
        loyaltyPoints: updatedPoints,
        pointsHistory: [newTx, ...(safeUser.pointsHistory || [])]
      });
      setRedeemedReward(`Voucher unlocked: ${rewardTitle}! Present code ${voucher} to your barista.`);
      setTimeout(() => setRedeemedReward(null), 9000);
    }
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
          <button
            onClick={() => setActiveTab('loyalty')}
            id="loyalty-header-capsule"
            className="bg-[#F6F2EC] hover:bg-[#ede6dc] transition-all p-4 rounded-2xl border border-[#2A1E17]/8 flex items-center gap-4 w-full sm:w-auto text-left group cursor-pointer"
            title="Click to view full Loyalty Rewards section"
          >
            <div className="w-12 h-12 rounded-xl bg-[#C48B47] text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#2A1E17]/60 block">
                  Loyalty Rewards
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#C48B47]/15 text-[#C48B47]">
                  Silver Explorer
                </span>
              </div>
              <span className="font-serif text-2xl font-bold text-[#2A1E17] block">
                {safeUser.loyaltyPoints} pts
              </span>
              <span className="text-[11px] text-[#1E3A2F] font-medium block">
                {safeUser.loyaltyPoints < 500 ? `${500 - safeUser.loyaltyPoints} pts to Gold Tier` : 'Elite Tier Active'}
              </span>
            </div>
          </button>
        </div>

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
            id="tab-loyalty-rewards"
            className={`px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'loyalty'
                ? 'bg-[#2A1E17] text-white shadow-xs'
                : 'text-[#2A1E17]/70 hover:bg-[#F6F2EC]'
            }`}
          >
            <Gift className="w-4 h-4" />
            <span>Loyalty Rewards</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              activeTab === 'loyalty' ? 'bg-white/20 text-white' : 'bg-[#C48B47]/20 text-[#C48B47]'
            }`}>
              {safeUser.loyaltyPoints} pts
            </span>
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
            {/* Email notification alert banner */}
            {emailNotice && (
              <div 
                className="bg-[#FAF8F5] border border-emerald-500/30 rounded-2xl p-4 flex items-center justify-between gap-3 animate-in fade-in"
                id="email-receipt-toast-banner"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#2A1E17]">{emailNotice.message}</p>
                    <p className="text-[11px] text-[#2A1E17]/60 font-light">
                      A formatted confirmation with itemized details and transaction summary was dispatched.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {emailNotice.orderId && (
                    <button
                      onClick={() => {
                        const targetOrder = orders.find(o => o.id === emailNotice.orderId);
                        if (targetOrder) {
                          const record = sentEmailRecord[targetOrder.id];
                          setEmailModalData({
                            order: targetOrder,
                            sentAt: record?.sentAt || 'Just now',
                            email: record?.email || safeUser.email || 'customer@example.com'
                          });
                        }
                      }}
                      className="px-3 py-1.5 bg-[#2A1E17] hover:bg-[#C48B47] text-white text-[11px] font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      View Confirmation
                    </button>
                  )}
                  <button
                    onClick={() => setEmailNotice(null)}
                    className="p-1 text-[#2A1E17]/40 hover:text-[#2A1E17] transition-colors"
                    aria-label="Dismiss notice"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

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

                  {/* Actions: Track, Print Receipt, Email Receipt, and Reorder */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
                    <button
                      onClick={() => setSelectedReceiptOrder(ord)}
                      id={`print-receipt-btn-${ord.id}`}
                      className="px-3.5 py-2 bg-white hover:bg-[#F6F2EC] text-[#2A1E17] text-xs font-semibold rounded-xl border border-[#2A1E17]/15 transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                      title="View & print receipt"
                    >
                      <Printer className="w-3.5 h-3.5 text-[#C48B47]" />
                      <span>Print Receipt</span>
                    </button>

                    <button
                      onClick={() => handleEmailReceipt(ord)}
                      id={`email-receipt-btn-${ord.id}`}
                      disabled={emailingOrderId === ord.id}
                      className="px-3.5 py-2 bg-white hover:bg-[#F6F2EC] text-[#2A1E17] text-xs font-semibold rounded-xl border border-[#2A1E17]/15 transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer disabled:opacity-60"
                      title={`Email formatted receipt to ${safeUser.email || ord.customerEmail || 'registered email'}`}
                    >
                      {emailingOrderId === ord.id ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 text-[#C48B47] animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : sentEmailRecord[ord.id] ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Receipt Sent</span>
                        </>
                      ) : (
                        <>
                          <Mail className="w-3.5 h-3.5 text-[#C48B47]" />
                          <span>Email Receipt</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => onTrackOrder(ord.orderNumber)}
                      className="px-4 py-2 bg-[#F6F2EC] hover:bg-[#ede7de] text-[#2A1E17] text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                    >
                      Track Status
                    </button>

                    <button
                      onClick={() => onReorder(ord)}
                      id={`reorder-btn-${ord.id}`}
                      className="px-4 py-2 bg-[#2A1E17] hover:bg-[#C48B47] text-white text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
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

        {/* Tab 3: Loyalty Rewards (Visualizes current points, progress toward next reward tier with progress bar, and history of points earned) */}
        {activeTab === 'loyalty' && (
          <LoyaltyRewardsSection
            user={safeUser}
            onRedeemReward={handleRedeemReward}
            redeemedNotice={redeemedReward}
          />
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
                    value={newAddressLabel || ''}
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
                    value={newAddressText || ''}
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

      {/* Styled Printable Receipt Modal */}
      <ReceiptModal 
        order={selectedReceiptOrder} 
        onClose={() => setSelectedReceiptOrder(null)} 
        onEmailReceipt={(ord) => handleEmailReceipt(ord)}
        userEmail={safeUser.email}
        isEmailSent={Boolean(selectedReceiptOrder && sentEmailRecord[selectedReceiptOrder.id])}
      />

      {/* Simulated Formatted Email Confirmation Modal */}
      <EmailConfirmationModal
        order={emailModalData?.order || null}
        recipientEmail={emailModalData?.email || safeUser.email || 'customer@example.com'}
        sentAt={emailModalData?.sentAt}
        onClose={() => setEmailModalData(null)}
        onResend={(ord) => handleEmailReceipt(ord)}
        onOpenPrint={(ord) => setSelectedReceiptOrder(ord)}
      />
    </div>
  );
};
