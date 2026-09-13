import React, { useState } from 'react';
import { 
  X, 
  Check, 
  CreditCard, 
  Truck, 
  Store, 
  Banknote, 
  Building2, 
  ShieldCheck, 
  Clock, 
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { CartItem, CustomerUser, Order, OrderType, PaymentMethod } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  user: CustomerUser;
  onCompleteOrder: (orderData: any) => Promise<Order>;
  onTrackOrder: (orderId: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  user,
  onCompleteOrder,
  onTrackOrder
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [orderType, setOrderType] = useState<OrderType>('pickup');
  const [fullName, setFullName] = useState(user?.name || 'Sarah Johnson');
  const [email, setEmail] = useState(user?.email || 'sarah.j@example.com');
  const [phone, setPhone] = useState(user?.phone || '+1 (555) 234-8901');
  const [deliveryAddress, setDeliveryAddress] = useState(user?.savedAddresses?.[0]?.address || '742 Evergreen Terrace, Apt 4B');
  const [orderNotes, setOrderNotes] = useState('');
  
  // Payment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');

  // Confirmation state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, it) => sum + it.itemTotal, 0);
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const deliveryFee = orderType === 'delivery' ? 3.50 : 0;
  const total = Math.round((subtotal + tax + deliveryFee) * 100) / 100;

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!fullName.trim() || !email.trim() || !phone.trim()) return;
      if (orderType === 'delivery' && !deliveryAddress.trim()) return;
      setStep(2);
    } else if (step === 2) {
      handlePlaceOrder();
    }
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    try {
      const order = await onCompleteOrder({
        customerName: fullName,
        customerEmail: email,
        customerPhone: phone,
        items,
        orderType,
        deliveryAddress: orderType === 'delivery' ? deliveryAddress : undefined,
        paymentMethod,
        notes: orderNotes
      });
      setConfirmedOrder(order);
      setStep(3);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-[#2A1E17]/10 my-6 relative animate-in fade-in zoom-in-95 duration-200"
        id="checkout-modal"
      >
        {/* Header */}
        <div className="p-6 border-b border-[#2A1E17]/10 bg-[#FDFBF7] flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#C48B47]">
              Checkout Flow
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#2A1E17]">
              {step === 3 ? 'Order Confirmation' : 'Complete Your Order'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#2A1E17]/60 hover:text-[#2A1E17] hover:bg-[#F6F2EC] rounded-full transition-colors"
            aria-label="Close checkout modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Indicators */}
        {step !== 3 && (
          <div className="px-6 py-3.5 bg-[#F6F2EC] border-b border-[#2A1E17]/5 flex items-center justify-center gap-6 sm:gap-10 text-xs font-semibold">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-[#2A1E17]' : 'text-gray-400'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? 'bg-[#2A1E17] text-white' : 'bg-gray-200 text-gray-600'}`}>
                1
              </div>
              <span>Information</span>
            </div>

            <div className="w-8 sm:w-12 h-0.5 bg-[#2A1E17]/15" />

            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-[#2A1E17]' : 'text-gray-400'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? 'bg-[#2A1E17] text-white' : 'bg-gray-200 text-gray-600'}`}>
                2
              </div>
              <span>Payment</span>
            </div>

            <div className="w-8 sm:w-12 h-0.5 bg-[#2A1E17]/15" />

            <div className={`flex items-center gap-2 ${step === 3 ? 'text-[#2A1E17]' : 'text-gray-400'}`}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-gray-200 text-gray-600">
                3
              </div>
              <span>Confirmation</span>
            </div>
          </div>
        )}

        {/* Main Step Content */}
        <div className="p-6 sm:p-8 max-h-[calc(85vh-12rem)] overflow-y-auto">
          {step === 3 && confirmedOrder ? (
            /* Step 3: Success Confirmation */
            <div className="py-6 text-center space-y-6 max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-full bg-[#eef6f2] text-[#1E3A2F] flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-[#C48B47]">
                  Thank You for Ordering!
                </span>
                <h3 className="font-serif text-3xl font-bold text-[#2A1E17] mt-1">
                  Order Confirmed
                </h3>
                <p className="text-xs sm:text-sm text-[#2A1E17]/70 mt-2 font-light">
                  Your order has been received and our kitchen team has already begun preparing your coffee & dishes.
                </p>
              </div>

              {/* Order badge card */}
              <div className="bg-[#FDFBF7] p-5 rounded-2xl border border-[#2A1E17]/10 text-left space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-[#2A1E17]/10">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#2A1E17]/60 block">Order Number</span>
                    <span className="font-serif text-xl font-bold text-[#2A1E17]">#{confirmedOrder.orderNumber}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] uppercase tracking-wider text-[#2A1E17]/60 block">Type</span>
                    <span className="text-xs font-bold text-[#1E3A2F] uppercase">{confirmedOrder.orderType}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-[#2A1E17]">
                  <Clock className="w-4 h-4 text-[#C48B47]" />
                  <span className="font-medium">{confirmedOrder.estimatedReadyTime}</span>
                </div>

                <div className="pt-2 border-t border-[#2A1E17]/5 text-xs text-[#2A1E17]/70">
                  <span className="font-semibold text-[#2A1E17]">{confirmedOrder.items.length} items:</span>{' '}
                  {confirmedOrder.items.map(i => `${i.quantity}x ${i?.menuItem?.name || 'Item'}`).join(', ')}
                </div>

                <div className="flex justify-between text-xs pt-1 font-bold text-[#2A1E17]">
                  <span>Total Paid</span>
                  <span className="text-[#C48B47]">${confirmedOrder.total.toFixed(2)}</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <button
                  onClick={() => {
                    onClose();
                    onTrackOrder(confirmedOrder.orderNumber);
                  }}
                  id="checkout-track-order-btn"
                  className="px-6 py-3 bg-[#2A1E17] hover:bg-[#1E1510] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md"
                >
                  <Clock className="w-4 h-4 text-[#D4A373]" />
                  <span>Track Order Status</span>
                </button>

                <button
                  onClick={onClose}
                  className="px-5 py-3 bg-[#F6F2EC] hover:bg-[#ede7de] text-[#2A1E17] text-xs font-semibold rounded-xl"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left: Interactive Form */}
              <div className="lg:col-span-7">
                <form onSubmit={handleNextStep} className="space-y-6">
                  {step === 1 ? (
                    /* Step 1: Customer Info & Order Type */
                    <div className="space-y-5">
                      {/* Order Type Toggle */}
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#2A1E17] mb-2">
                          Order Type
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => setOrderType('pickup')}
                            className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                              orderType === 'pickup'
                                ? 'bg-[#2A1E17] text-white border-[#2A1E17] shadow-sm'
                                : 'bg-[#FDFBF7] text-[#2A1E17] border-[#2A1E17]/15 hover:bg-[#F6F2EC]'
                            }`}
                          >
                            <Store className="w-5 h-5 text-[#D4A373]" />
                            <div>
                              <p className="text-xs font-bold">Pick Up at Café</p>
                              <p className="text-[11px] opacity-70">Ready in ~15 mins (Free)</p>
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => setOrderType('delivery')}
                            className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                              orderType === 'delivery'
                                ? 'bg-[#2A1E17] text-white border-[#2A1E17] shadow-sm'
                                : 'bg-[#FDFBF7] text-[#2A1E17] border-[#2A1E17]/15 hover:bg-[#F6F2EC]'
                            }`}
                          >
                            <Truck className="w-5 h-5 text-[#D4A373]" />
                            <div>
                              <p className="text-xs font-bold">Local Delivery</p>
                              <p className="text-[11px] opacity-70">Courier to your door (+$3.50)</p>
                            </div>
                          </button>
                        </div>
                      </div>

                      {/* Contact Fields */}
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-semibold text-[#2A1E17] mb-1">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Sarah Johnson"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[#2A1E17]/15 text-sm focus:outline-none focus:border-[#C48B47]"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-[#2A1E17] mb-1">
                              Email Address *
                            </label>
                            <input
                              type="email"
                              required
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="sarah.j@example.com"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-[#2A1E17]/15 text-sm focus:outline-none focus:border-[#C48B47]"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-[#2A1E17] mb-1">
                              Phone Number *
                            </label>
                            <input
                              type="tel"
                              required
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder="+1 (555) 234-8901"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-[#2A1E17]/15 text-sm focus:outline-none focus:border-[#C48B47]"
                            />
                          </div>
                        </div>

                        {orderType === 'delivery' && (
                          <div>
                            <label className="block text-xs font-semibold text-[#2A1E17] mb-1">
                              Delivery Address *
                            </label>
                            <input
                              type="text"
                              required
                              value={deliveryAddress}
                              onChange={(e) => setDeliveryAddress(e.target.value)}
                              placeholder="Street Address, Apt / Suite / Floor, City"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-[#2A1E17]/15 text-sm focus:outline-none focus:border-[#C48B47]"
                            />
                          </div>
                        )}

                        <div>
                          <label className="block text-xs font-semibold text-[#2A1E17] mb-1">
                            Kitchen / Delivery Notes
                          </label>
                          <input
                            type="text"
                            value={orderNotes}
                            onChange={(e) => setOrderNotes(e.target.value)}
                            placeholder="e.g. Leave at front reception, extra napkins..."
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[#2A1E17]/15 text-sm focus:outline-none focus:border-[#C48B47]"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        id="checkout-step1-next-btn"
                        className="w-full py-3.5 bg-[#2A1E17] hover:bg-[#1E1510] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md mt-4"
                      >
                        <span>Continue to Payment</span>
                        <ArrowRight className="w-4 h-4 text-[#D4A373]" />
                      </button>
                    </div>
                  ) : (
                    /* Step 2: Payment Details */
                    <div className="space-y-5">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#2A1E17] mb-2">
                          Select Payment Method
                        </label>
                        <div className="space-y-2.5">
                          {/* Card */}
                          <label className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                            paymentMethod === 'card'
                              ? 'bg-[#FDFBF7] border-[#C48B47] ring-1 ring-[#C48B47]'
                              : 'bg-white border-[#2A1E17]/15 hover:bg-[#FDFBF7]'
                          }`}>
                            <div className="flex items-center gap-3">
                              <input
                                type="radio"
                                name="payment"
                                checked={paymentMethod === 'card'}
                                onChange={() => setPaymentMethod('card')}
                                className="text-[#C48B47] focus:ring-[#C48B47]"
                              />
                              <CreditCard className="w-5 h-5 text-[#C48B47]" />
                              <div>
                                <p className="text-xs font-bold text-[#2A1E17]">Credit / Debit Card</p>
                                <p className="text-[11px] text-[#2A1E17]/60">Instant & secure SSL checkout</p>
                              </div>
                            </div>
                            <span className="text-xs font-semibold text-[#1E3A2F]">Instant</span>
                          </label>

                          {/* Pay on Delivery */}
                          <label className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                            paymentMethod === 'cod'
                              ? 'bg-[#FDFBF7] border-[#C48B47] ring-1 ring-[#C48B47]'
                              : 'bg-white border-[#2A1E17]/15 hover:bg-[#FDFBF7]'
                          }`}>
                            <div className="flex items-center gap-3">
                              <input
                                type="radio"
                                name="payment"
                                checked={paymentMethod === 'cod'}
                                onChange={() => setPaymentMethod('cod')}
                                className="text-[#C48B47] focus:ring-[#C48B47]"
                              />
                              <Banknote className="w-5 h-5 text-[#C48B47]" />
                              <div>
                                <p className="text-xs font-bold text-[#2A1E17]">Pay on Delivery / Pickup</p>
                                <p className="text-[11px] text-[#2A1E17]/60">Pay with cash or contactless card upon arrival</p>
                              </div>
                            </div>
                            <span className="text-xs text-[#2A1E17]/60">In Person</span>
                          </label>

                          {/* Bank Transfer */}
                          <label className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                            paymentMethod === 'bank_transfer'
                              ? 'bg-[#FDFBF7] border-[#C48B47] ring-1 ring-[#C48B47]'
                              : 'bg-white border-[#2A1E17]/15 hover:bg-[#FDFBF7]'
                          }`}>
                            <div className="flex items-center gap-3">
                              <input
                                type="radio"
                                name="payment"
                                checked={paymentMethod === 'bank_transfer'}
                                onChange={() => setPaymentMethod('bank_transfer')}
                                className="text-[#C48B47] focus:ring-[#C48B47]"
                              />
                              <Building2 className="w-5 h-5 text-[#C48B47]" />
                              <div>
                                <p className="text-xs font-bold text-[#2A1E17]">Bank Transfer</p>
                                <p className="text-[11px] text-[#2A1E17]/60">Direct account transfer or USSD code</p>
                              </div>
                            </div>
                            <span className="text-xs text-[#2A1E17]/60">Direct</span>
                          </label>
                        </div>
                      </div>

                      {paymentMethod === 'card' && (
                        <div className="p-4 bg-[#F6F2EC] rounded-2xl border border-[#2A1E17]/10 space-y-3">
                          <div>
                            <label className="block text-[11px] font-semibold text-[#2A1E17] mb-1">Card Number</label>
                            <input
                              type="text"
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl bg-white border border-[#2A1E17]/15 text-xs text-[#2A1E17]"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-semibold text-[#2A1E17] mb-1">Expires</label>
                              <input
                                type="text"
                                value={cardExpiry}
                                onChange={(e) => setCardExpiry(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl bg-white border border-[#2A1E17]/15 text-xs text-[#2A1E17]"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-semibold text-[#2A1E17] mb-1">CVC Code</label>
                              <input
                                type="text"
                                value={cardCvc}
                                onChange={(e) => setCardCvc(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl bg-white border border-[#2A1E17]/15 text-xs text-[#2A1E17]"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2">
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="px-4 py-2 text-xs font-semibold text-[#2A1E17]/70 hover:text-[#2A1E17] flex items-center gap-1.5"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          <span>Back to Info</span>
                        </button>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          id="checkout-complete-order-btn"
                          className="px-6 py-3.5 bg-[#C48B47] hover:bg-[#b37c3b] text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition-all shadow-md active:scale-[0.99] disabled:opacity-50"
                        >
                          {isSubmitting ? (
                            <span>Placing Order...</span>
                          ) : (
                            <>
                              <span>Complete Order • ${total.toFixed(2)}</span>
                              <Check className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </form>
              </div>

              {/* Right: Order Summary Sidebar */}
              <div className="lg:col-span-5 bg-[#FDFBF7] p-5 rounded-2xl border border-[#2A1E17]/10 h-fit space-y-4">
                <h4 className="font-serif text-base font-bold text-[#2A1E17] pb-3 border-b border-[#2A1E17]/10">
                  Order Summary ({items.length})
                </h4>

                <div className="space-y-3 max-h-48 overflow-y-auto pr-1 text-xs">
                  {items.map((it) => (
                    <div key={it.cartItemId} className="flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <p className="font-semibold text-[#2A1E17] truncate">
                          {it.quantity}x {it?.menuItem?.name || 'Item'}
                        </p>
                        {it.customization && (
                          <p className="text-[10px] text-[#C48B47] truncate">
                            {it.customization.size} {it.customization.milk}
                          </p>
                        )}
                      </div>
                      <span className="font-semibold text-[#2A1E17] shrink-0">
                        ${it.itemTotal.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-1.5 pt-3 border-t border-[#2A1E17]/10 text-xs text-[#2A1E17]/80">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>{orderType === 'delivery' ? `$${deliveryFee.toFixed(2)}` : 'Free (Pickup)'}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-[#2A1E17] pt-2 border-t border-[#2A1E17]/10">
                    <span>Total Due</span>
                    <span className="font-serif text-base text-[#C48B47]">${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-[#1E3A2F] bg-[#eef6f2] p-2.5 rounded-xl">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Fresh preparation guaranteed within minutes.</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
