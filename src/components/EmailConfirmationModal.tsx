import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  X, 
  Check, 
  Coffee, 
  Clock, 
  Send, 
  Sparkles, 
  Printer, 
  ExternalLink,
  ShieldCheck,
  CreditCard,
  RotateCw
} from 'lucide-react';
import { Order } from '../types';

interface EmailConfirmationModalProps {
  order: Order | null;
  recipientEmail: string;
  sentAt?: string;
  onClose: () => void;
  onResend?: (order: Order) => Promise<void> | void;
  onOpenPrint?: (order: Order) => void;
}

export const EmailConfirmationModal: React.FC<EmailConfirmationModalProps> = ({
  order,
  recipientEmail,
  sentAt = 'Just now',
  onClose,
  onResend,
  onOpenPrint
}) => {
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!order) return null;

  const pointsEarned = Math.round(order.total * 10);

  const handleResendClick = async () => {
    if (onResend) {
      setIsResending(true);
      await onResend(order);
      setIsResending(false);
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 3000);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto"
      id="email-confirmation-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#2A1E17]/15 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200"
        id="email-confirmation-modal-container"
      >
        {/* Simulated Email Client Bar */}
        <div className="bg-[#2A1E17] text-white px-6 py-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#C48B47]/20 flex items-center justify-center text-[#D4A373]">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-xs text-white">Simulated Email Delivery</span>
                <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 text-[10px] font-medium px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3" />
                  Delivered
                </span>
              </div>
              <p className="text-[11px] text-white/60 font-light">
                To: <span className="text-[#D4A373] font-mono">{recipientEmail}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            id="email-confirmation-close-btn"
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Email Envelope Meta Details */}
        <div className="bg-[#FAF8F5] px-6 py-3 border-b border-[#2A1E17]/10 text-xs space-y-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div className="font-semibold text-[#2A1E17]">
              Subject: <span className="font-normal">Your Urban Grove Cafe Order Receipt #{order.orderNumber}</span>
            </div>
            <div className="text-[#2A1E17]/50 text-[11px] font-light flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#C48B47]" />
              <span>Dispatched at {sentAt}</span>
            </div>
          </div>
          <div className="text-[11px] text-[#2A1E17]/60 font-light flex items-center gap-2">
            <span>From: <strong>Urban Grove Cafe</strong> &lt;receipts@urbangrovecafe.com&gt;</span>
          </div>
        </div>

        {/* Formatted HTML Email Body (Scrollable) */}
        <div className="p-6 sm:p-8 max-h-[70vh] overflow-y-auto space-y-6 bg-white font-sans text-[#2A1E17]">
          {/* Email Template Header */}
          <div className="text-center pb-6 border-b border-[#2A1E17]/10">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#2A1E17] text-[#D4A373] mb-3 shadow-xs">
              <Coffee className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl font-bold tracking-tight text-[#2A1E17]">
              Urban Grove Cafe
            </h3>
            <p className="text-xs uppercase tracking-widest text-[#C48B47] font-semibold mt-0.5">
              Artisan Roasters & Kitchen
            </p>
          </div>

          {/* Salutation & Hero */}
          <div className="space-y-2">
            <h4 className="font-serif text-lg font-bold text-[#2A1E17]">
              Hi {order.customerName || 'Valued Guest'},
            </h4>
            <p className="text-xs sm:text-sm text-[#2A1E17]/75 leading-relaxed font-light">
              Thank you for ordering with us! We have processed your payment and prepared your itemized confirmation receipt below.
            </p>
          </div>

          {/* Quick Order Badge Card */}
          <div className="bg-[#FAF8F5] border border-[#2A1E17]/10 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#C48B47]">
                Order Reference
              </span>
              <p className="font-mono text-xl font-bold text-[#2A1E17]">
                #{order.orderNumber}
              </p>
              <p className="text-xs text-[#2A1E17]/60">
                Placed on {order.createdAt}
              </p>
            </div>

            <div className="flex flex-col sm:items-end gap-1.5 text-xs">
              <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5" />
                Payment Confirmed (${order.total.toFixed(2)})
              </span>
              <span className="text-[#2A1E17]/60 capitalize">
                {order.orderType === 'delivery' ? 'Local Courier Delivery' : 'In-Store Counter Pickup'}
              </span>
            </div>
          </div>

          {/* Itemized Order Table */}
          <div className="space-y-3">
            <h5 className="font-serif text-sm font-bold text-[#2A1E17] border-b border-[#2A1E17]/10 pb-2">
              Receipt Details
            </h5>

            <div className="divide-y divide-[#2A1E17]/5 text-xs">
              {order.items.map((it, idx) => {
                const customNotes: string[] = [];
                if (it.customization?.size) customNotes.push(it.customization.size);
                if (it.customization?.milk) customNotes.push(it.customization.milk);
                if (it.customization?.temperature) customNotes.push(it.customization.temperature);
                if (it.customization?.sweetness && it.customization.sweetness !== '100%') {
                  customNotes.push(`Sweetness: ${it.customization.sweetness}`);
                }
                if (it.customization?.extraShots) {
                  customNotes.push(`+${it.customization.extraShots} Shot(s)`);
                }

                return (
                  <div key={idx} className="py-2.5 flex items-start justify-between gap-4">
                    <div className="space-y-0.5">
                      <p className="font-semibold text-[#2A1E17]">
                        <span className="font-mono text-[#C48B47] font-bold mr-1.5">{it.quantity}x</span>
                        {it.menuItem?.name || 'Artisan Selection'}
                      </p>
                      {customNotes.length > 0 && (
                        <p className="text-[11px] text-[#2A1E17]/60 font-light">
                          {customNotes.join(' • ')}
                        </p>
                      )}
                    </div>
                    <span className="font-mono font-medium text-[#2A1E17]">
                      ${(it.itemTotal || 0).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pricing Totals */}
          <div className="border-t border-[#2A1E17]/10 pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-[#2A1E17]/70">
              <span>Subtotal</span>
              <span className="font-mono">${(order.subtotal || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[#2A1E17]/70">
              <span>Tax (8.25%)</span>
              <span className="font-mono">${(order.tax || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[#2A1E17]/70">
              <span>Fulfillment Fee</span>
              <span className="font-mono">
                {order.orderType === 'delivery' ? `$${(order.deliveryFee || 0).toFixed(2)}` : 'Free (Pickup)'}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-[#2A1E17]/10 text-base font-bold text-[#2A1E17]">
              <span className="font-serif">Total Charged</span>
              <span className="font-mono text-lg text-[#C48B47]">
                ${(order.total || 0).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Loyalty & Perks Banner */}
          <div className="bg-[#FAF4EC] border border-[#C48B47]/20 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#C48B47] text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="text-xs">
              <p className="font-bold text-[#2A1E17]">
                +{pointsEarned} Loyalty Points Credited!
              </p>
              <p className="text-[#2A1E17]/70 text-[11px] font-light">
                Points have been automatically added to your account for rewards and complimentary beverages.
              </p>
            </div>
          </div>

          {/* Email Footer Note */}
          <div className="border-t border-[#2A1E17]/10 pt-6 text-center text-[11px] text-[#2A1E17]/60 space-y-1 font-light">
            <p className="font-medium text-[#2A1E17]">Urban Grove Cafe & Roastery</p>
            <p>742 Evergreen Arts District, San Francisco, CA 94107 • (415) 555-0192</p>
            <p className="text-[10px] text-[#2A1E17]/40 pt-1">
              Have questions about your order? Reply directly to this email or visit our cafe bar.
            </p>
          </div>
        </div>

        {/* Modal Controls */}
        <div className="bg-[#FAF8F5] px-6 py-4 border-t border-[#2A1E17]/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-emerald-700 flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Simulated message delivered to <strong>{recipientEmail}</strong></span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {onOpenPrint && (
              <button
                onClick={() => {
                  onClose();
                  onOpenPrint(order);
                }}
                className="px-3.5 py-2 bg-white hover:bg-gray-50 text-[#2A1E17] text-xs font-semibold rounded-xl border border-[#2A1E17]/15 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-[#C48B47]" />
                <span>Print Copy</span>
              </button>
            )}

            {onResend && (
              <button
                onClick={handleResendClick}
                disabled={isResending}
                className="px-3.5 py-2 bg-white hover:bg-gray-50 text-[#2A1E17] text-xs font-semibold rounded-xl border border-[#2A1E17]/15 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                {isResending ? (
                  <RotateCw className="w-3.5 h-3.5 animate-spin text-[#C48B47]" />
                ) : resendSuccess ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Send className="w-3.5 h-3.5 text-[#C48B47]" />
                )}
                <span>{resendSuccess ? 'Sent Again' : isResending ? 'Sending...' : 'Resend Email'}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#2A1E17] hover:bg-[#C48B47] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
