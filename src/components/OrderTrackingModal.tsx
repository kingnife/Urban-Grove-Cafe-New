import React, { useState, useEffect } from 'react';
import { X, Search, Clock, CheckCircle2, ChefHat, Store, Truck, AlertCircle, RefreshCw } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { api } from '../utils/api';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOrderNumber?: string;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  initialOrderNumber
}) => {
  const [searchInput, setSearchInput] = useState(initialOrderNumber || '1024');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = async (orderNum: string) => {
    if (!orderNum.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.getOrder(orderNum.trim());
      setOrder(data);
    } catch (err) {
      setError(`No order found matching #${orderNum}. Please check your order code.`);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      const codeToFetch = initialOrderNumber || '1024';
      setSearchInput(codeToFetch);
      fetchOrder(codeToFetch);
    }
  }, [isOpen, initialOrderNumber]);

  if (!isOpen) return null;

  const steps: { status: OrderStatus; label: string; icon: any }[] = [
    { status: 'received', label: 'Order Received', icon: Clock },
    { status: 'preparing', label: 'Preparing Fresh', icon: ChefHat },
    { status: 'ready', label: order?.orderType === 'delivery' ? 'Out for Delivery' : 'Ready for Pickup', icon: order?.orderType === 'delivery' ? Truck : Store },
    { status: 'completed', label: 'Completed', icon: CheckCircle2 }
  ];

  const getStepIndex = (status?: OrderStatus) => {
    switch (status) {
      case 'received': return 0;
      case 'preparing': return 1;
      case 'ready': return 2;
      case 'delivered': return 2;
      case 'completed': return 3;
      default: return 0;
    }
  };

  const currentStepIdx = getStepIndex(order?.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#2A1E17]/10 my-6 relative animate-in fade-in zoom-in-95 duration-200"
        id="order-tracking-modal"
      >
        {/* Header */}
        <div className="p-6 border-b border-[#2A1E17]/10 bg-[#FDFBF7] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#2A1E17] text-[#D4A373] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#C48B47] font-semibold">
                Live Kitchen Radar
              </span>
              <h3 className="font-serif text-xl font-bold text-[#2A1E17]">
                Order Tracking
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#2A1E17]/60 hover:text-[#2A1E17] hover:bg-[#F6F2EC] rounded-full transition-colors"
            aria-label="Close tracking modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-6 pb-2 border-b border-[#2A1E17]/5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchOrder(searchInput);
            }}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#2A1E17]/40 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchInput || ''}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter Order # (e.g. 1024, 1023, 1022)"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#2A1E17]/15 text-sm text-[#2A1E17] focus:outline-none focus:border-[#C48B47]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2.5 bg-[#2A1E17] hover:bg-[#1E1510] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Track</span>
            </button>
          </form>

          {error && (
            <div className="mt-3 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Order Details Body */}
        {order ? (
          <div className="p-6 space-y-6 max-h-[calc(85vh-16rem)] overflow-y-auto">
            {/* Status Headline */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 rounded-2xl bg-[#FDFBF7] border border-[#2A1E17]/10">
              <div>
                <span className="text-[11px] font-semibold text-[#C48B47] uppercase tracking-wider">
                  Customer Order #{order.orderNumber}
                </span>
                <h4 className="font-serif text-lg font-bold text-[#2A1E17]">
                  For {order.customerName}
                </h4>
                <p className="text-xs text-[#2A1E17]/60 mt-0.5">
                  Ordered {order.createdAt} • {order.orderType.toUpperCase()}
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold capitalize bg-[#1E3A2F]/10 text-[#1E3A2F]">
                  <span className="w-2 h-2 rounded-full bg-[#1E3A2F] animate-ping" />
                  {order.status}
                </span>
                <p className="text-xs font-semibold text-[#2A1E17] mt-1.5">
                  Total: ${order.total.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Visual Timeline (Order Received -> Preparing -> Ready -> Completed) */}
            <div className="py-2">
              <div className="grid grid-cols-4 gap-2 text-center relative">
                {/* Connecting progress bar */}
                <div className="absolute top-4 left-6 right-6 h-0.5 bg-gray-200 -z-0" />
                <div 
                  className="absolute top-4 left-6 h-0.5 bg-[#C48B47] -z-0 transition-all duration-500"
                  style={{ width: `${(currentStepIdx / (steps.length - 1)) * 90}%` }}
                />

                {steps.map((st, idx) => {
                  const Icon = st.icon;
                  const isDone = idx < currentStepIdx;
                  const isCurrent = idx === currentStepIdx;
                  return (
                    <div key={st.status} className="relative z-10 flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                          isCurrent
                            ? 'bg-[#C48B47] text-white ring-4 ring-[#C48B47]/20 scale-110'
                            : isDone
                            ? 'bg-[#1E3A2F] text-white'
                            : 'bg-gray-100 text-gray-400 border border-gray-200'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={`text-[11px] font-semibold mt-2 leading-tight ${
                        isCurrent ? 'text-[#C48B47]' : isDone ? 'text-[#1E3A2F]' : 'text-gray-400'
                      }`}>
                        {st.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Estimated time banner */}
            <div className="p-4 rounded-2xl bg-[#F6F2EC] border border-[#2A1E17]/10 flex items-start gap-3">
              <Clock className="w-5 h-5 text-[#C48B47] shrink-0 mt-0.5" />
              <div>
                <h5 className="text-xs font-bold text-[#2A1E17]">Estimated Status</h5>
                <p className="text-xs text-[#2A1E17]/80 mt-0.5">{order.estimatedReadyTime}</p>
                {order.deliveryAddress && (
                  <p className="text-[11px] text-[#2A1E17]/60 mt-1">
                    Delivery Destination: {order.deliveryAddress}
                  </p>
                )}
              </div>
            </div>

            {/* Itemized Order Breakdown */}
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-[#2A1E17]/70 mb-3">
                Items in This Order
              </h5>
              <div className="space-y-2">
                {order.items.map((it) => (
                  <div
                    key={it.cartItemId}
                    className="p-3 bg-[#FDFBF7] rounded-xl border border-[#2A1E17]/5 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={it.menuItem?.image || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80'}
                        alt={it.menuItem?.name || 'Item'}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-semibold text-[#2A1E17]">
                          {it.quantity}x {it.menuItem?.name || 'Item'}
                        </p>
                        {it.customization && (
                          <p className="text-[10px] text-[#C48B47]">
                            {it.customization.size} {it.customization.milk}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="font-semibold text-[#2A1E17]">
                      ${it.itemTotal.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : !loading && (
          <div className="p-8 text-center text-xs text-[#2A1E17]/60">
            Enter your order number above to view real-time kitchen status.
          </div>
        )}
      </div>
    </div>
  );
};
