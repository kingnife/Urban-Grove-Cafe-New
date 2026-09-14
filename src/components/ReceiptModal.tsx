import React, { useState, useEffect } from 'react';
import { 
  Printer, 
  X, 
  Check, 
  Copy, 
  Coffee, 
  Receipt, 
  Clock, 
  MapPin, 
  Phone, 
  CreditCard,
  ShieldCheck,
  Download,
  Mail
} from 'lucide-react';
import { Order } from '../types';

interface ReceiptModalProps {
  order: Order | null;
  onClose: () => void;
  onEmailReceipt?: (order: Order) => void;
  userEmail?: string;
  isEmailSent?: boolean;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ 
  order, 
  onClose,
  onEmailReceipt,
  userEmail,
  isEmailSent
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!order) return null;

  const handlePrint = () => {
    try {
      window.print();
    } catch (err) {
      console.warn('Print trigger failed in current context:', err);
    }
  };

  const handleCopyText = () => {
    const lines = [
      '========================================',
      '           URBAN GROVE CAFE             ',
      '      Artisan Roasters & Kitchen        ',
      '  742 Evergreen Arts District, SF, CA   ',
      '          Tel: (415) 555-0192           ',
      '========================================',
      `Order #:       ${order.orderNumber}`,
      `Date & Time:   ${order.createdAt}`,
      `Order Type:    ${order.orderType.toUpperCase()}`,
      `Customer:      ${order.customerName}`,
      `Payment:       ${order.paymentMethod.toUpperCase()} (${order.paymentStatus.toUpperCase()})`,
      '----------------------------------------',
      'ITEMS:',
      ...order.items.map((it) => {
        const customParts: string[] = [];
        if (it.customization?.size) customParts.push(it.customization.size);
        if (it.customization?.milk) customParts.push(it.customization.milk);
        if (it.customization?.temperature) customParts.push(it.customization.temperature);
        if (it.customization?.sweetness) customParts.push(`Sweet: ${it.customization.sweetness}`);
        if (it.customization?.extraShots) customParts.push(`+${it.customization.extraShots} Shot(s)`);
        const customStr = customParts.length > 0 ? ` (${customParts.join(', ')})` : '';
        return `${it.quantity}x ${it?.menuItem?.name || 'Item'}${customStr} - $${(it.itemTotal || 0).toFixed(2)}`;
      }),
      '----------------------------------------',
      `Subtotal:      $${(order.subtotal || 0).toFixed(2)}`,
      `Tax (8.25%):   $${(order.tax || 0).toFixed(2)}`,
      order.orderType === 'delivery' ? `Delivery Fee:  $${(order.deliveryFee || 0).toFixed(2)}` : 'Delivery:      Free (Pickup)',
      '----------------------------------------',
      `TOTAL PAID:    $${(order.total || 0).toFixed(2)}`,
      '========================================',
      'Thank you for visiting Urban Grove Cafe!',
      '========================================'
    ];

    navigator.clipboard?.writeText(lines.join('\n')).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }).catch(() => {});
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white print:static print:inset-auto"
      id="receipt-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Print Styles injected specifically for cleanly rendering the receipt */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-receipt-card, #printable-receipt-card * {
            visibility: visible;
          }
          #printable-receipt-card {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 24px;
            box-shadow: none !important;
            border: 1px solid #ddd !important;
            background: #ffffff !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div 
        className="relative w-full max-w-lg bg-[#FAF8F5] rounded-3xl shadow-2xl border border-[#2A1E17]/15 overflow-hidden my-auto print:border-none print:shadow-none print:max-w-none print:rounded-none"
        id="receipt-modal-container"
      >
        {/* Modal Top Control Bar (Hidden when printing) */}
        <div className="no-print bg-[#2A1E17] text-white px-6 py-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-[#D4A373]" />
            <span className="font-serif font-bold text-sm sm:text-base text-[#FDFBF7]">Transaction Receipt</span>
          </div>

          <div className="flex items-center gap-2">
            {onEmailReceipt && (
              <button
                onClick={() => onEmailReceipt(order)}
                id="receipt-modal-email-btn"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white font-medium text-xs rounded-lg transition-colors cursor-pointer"
                title={userEmail ? `Email receipt to ${userEmail}` : 'Email Receipt'}
              >
                {isEmailSent ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">Emailed</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-3.5 h-3.5 text-[#D4A373]" />
                    <span>Email</span>
                  </>
                )}
              </button>
            )}

            <button
              onClick={handlePrint}
              id="receipt-modal-print-btn"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#C48B47] hover:bg-[#b07b3d] text-[#2A1E17] font-semibold text-xs rounded-lg transition-colors cursor-pointer"
              title="Print Receipt"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <button
              onClick={handleCopyText}
              id="receipt-modal-copy-btn"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white font-medium text-xs rounded-lg transition-colors cursor-pointer"
              title="Copy Summary"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={onClose}
              id="receipt-modal-close-btn"
              className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors ml-1"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Card Area */}
        <div 
          className="p-6 sm:p-8 bg-white max-h-[80vh] overflow-y-auto font-sans"
          id="printable-receipt-card"
        >
          {/* Receipt Header */}
          <div className="text-center pb-6 border-b border-dashed border-[#2A1E17]/20">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#2A1E17] text-[#D4A373] mb-3 shadow-xs">
              <Coffee className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-2xl font-bold tracking-tight text-[#2A1E17]">
              Urban Grove Cafe
            </h2>
            <p className="text-xs uppercase tracking-widest text-[#C48B47] font-semibold mt-0.5">
              Artisan Roasters & Kitchen
            </p>
            <p className="text-xs text-[#2A1E17]/65 mt-2 font-light">
              742 Evergreen Arts District, San Francisco, CA 94107
            </p>
            <p className="text-[11px] text-[#2A1E17]/50 mt-0.5 font-light">
              Tel: (415) 555-0192 • hello@urbangrovecafe.com
            </p>
            <p className="text-[10px] text-[#2A1E17]/40 tracking-wider mt-1 uppercase">
              Tax ID: US-94107-URBAN-GRV
            </p>
          </div>

          {/* Receipt Meta Strip */}
          <div className="py-4 border-b border-dashed border-[#2A1E17]/20 text-xs space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-[#2A1E17]/60">Order Number:</span>
              <span className="font-mono font-bold text-[#2A1E17]">#{order.orderNumber}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#2A1E17]/60">Date & Time:</span>
              <span className="text-[#2A1E17] font-medium">{order.createdAt}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#2A1E17]/60">Order Type:</span>
              <span className="font-semibold text-[#C48B47] uppercase tracking-wide">
                {order.orderType === 'pickup' ? 'In-Store Pickup' : 'Local Courier Delivery'}
              </span>
            </div>
            {order.tableNumber && (
              <div className="flex justify-between items-center">
                <span className="text-[#2A1E17]/60">Seating Table:</span>
                <span className="text-[#2A1E17] font-medium">{order.tableNumber}</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-[#2A1E17]/60">Customer Name:</span>
              <span className="text-[#2A1E17] font-medium">{order.customerName || 'Valued Guest'}</span>
            </div>
            {order.deliveryAddress && (
              <div className="flex justify-between items-start pt-1">
                <span className="text-[#2A1E17]/60 shrink-0">Delivery To:</span>
                <span className="text-[#2A1E17] text-right font-light max-w-[240px]">{order.deliveryAddress}</span>
              </div>
            )}
          </div>

          {/* Itemized Table */}
          <div className="py-5 border-b border-dashed border-[#2A1E17]/20">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#2A1E17]/60 flex justify-between pb-2 border-b border-[#2A1E17]/10">
              <span className="w-8">Qty</span>
              <span className="flex-1 px-2">Item Description</span>
              <span className="w-16 text-right">Amount</span>
            </div>

            <div className="divide-y divide-[#2A1E17]/5 py-1">
              {order.items.map((it, idx) => {
                const customNotes: string[] = [];
                if (it.customization?.size) customNotes.push(it.customization.size);
                if (it.customization?.milk) customNotes.push(it.customization.milk);
                if (it.customization?.temperature) customNotes.push(it.customization.temperature);
                if (it.customization?.sweetness && it.customization.sweetness !== '100%') {
                  customNotes.push(`Sweet: ${it.customization.sweetness}`);
                }
                if (it.customization?.extraShots) {
                  customNotes.push(`+${it.customization.extraShots} Shot`);
                }
                if (it.customization?.selectedAddOns && it.customization.selectedAddOns.length > 0) {
                  customNotes.push(...it.customization.selectedAddOns);
                }

                return (
                  <div key={it.cartItemId || idx} className="py-2.5 flex items-start text-xs justify-between">
                    <span className="w-8 font-mono font-semibold text-[#2A1E17]">{it.quantity}x</span>
                    <div className="flex-1 px-2">
                      <p className="font-semibold text-[#2A1E17]">{it?.menuItem?.name || 'Artisan Selection'}</p>
                      {customNotes.length > 0 && (
                        <p className="text-[11px] text-[#2A1E17]/60 font-light mt-0.5">
                          {customNotes.join(' • ')}
                        </p>
                      )}
                      {it.customization?.specialInstructions && (
                        <p className="text-[10px] text-[#C48B47] italic mt-0.5">
                          Note: "{it.customization.specialInstructions}"
                        </p>
                      )}
                    </div>
                    <span className="w-16 text-right font-mono font-medium text-[#2A1E17]">
                      ${(it.itemTotal || 0).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Financial Totals */}
          <div className="py-4 border-b border-dashed border-[#2A1E17]/20 text-xs space-y-2">
            <div className="flex justify-between items-center text-[#2A1E17]/70">
              <span>Subtotal</span>
              <span className="font-mono">${(order.subtotal || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-[#2A1E17]/70">
              <span>Estimated Tax (8.25%)</span>
              <span className="font-mono">${(order.tax || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-[#2A1E17]/70">
              <span>Fulfillment Fee ({order.orderType === 'delivery' ? 'Local Courier' : 'In-Store Pickup'})</span>
              <span className="font-mono">
                {order.orderType === 'delivery' ? `$${(order.deliveryFee || 0).toFixed(2)}` : '$0.00'}
              </span>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-[#2A1E17]/10 text-base font-bold text-[#2A1E17]">
              <span className="font-serif">Total</span>
              <span className="font-mono font-bold text-[#C48B47] text-lg">
                ${(order.total || 0).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Payment & Security Method */}
          <div className="py-4 border-b border-dashed border-[#2A1E17]/20 text-xs space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-[#2A1E17]/60">Payment Method:</span>
              <span className="font-semibold capitalize text-[#2A1E17] flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5 text-[#1E3A2F]" />
                {order.paymentMethod.replace('_', ' ')} (•••• 4242)
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#2A1E17]/60">Payment Status:</span>
              <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wide">
                <ShieldCheck className="w-3 h-3" />
                {order.paymentStatus === 'paid' ? 'Paid & Verified' : order.paymentStatus}
              </span>
            </div>
            {order.notes && (
              <div className="pt-2 text-[11px] text-[#2A1E17]/70 italic">
                Special Note: "{order.notes}"
              </div>
            )}
          </div>

          {/* Barcode / Authenticity Seal & Footer */}
          <div className="pt-6 text-center space-y-3">
            {/* Stylized Barcode */}
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center justify-center gap-[3px] h-9 px-4 py-1 bg-white border border-gray-200 rounded-md">
                {[1, 3, 1, 2, 4, 1, 3, 2, 1, 2, 3, 1, 4, 2, 1, 3, 1, 2, 3, 1, 2, 4, 1, 2].map((w, i) => (
                  <div 
                    key={i} 
                    className="bg-[#2A1E17] h-full" 
                    style={{ width: `${w}px` }} 
                  />
                ))}
              </div>
              <span className="font-mono text-[10px] tracking-widest text-[#2A1E17]/50 mt-1">
                *UGC-{order.orderNumber}-{order.id.slice(-4)}*
              </span>
            </div>

            <p className="text-xs font-serif italic text-[#2A1E17]/80 max-w-xs mx-auto">
              “Thank you for being part of the Urban Grove family. May every sip bring comfort, clarity, and delight.”
            </p>

            <div className="text-[10px] text-[#2A1E17]/40 space-y-0.5 font-light">
              <p>Keep this receipt for returns or customer loyalty inquiries.</p>
              <p>www.urbangrovecafe.com • Support: support@urbangrovecafe.com</p>
            </div>
          </div>
        </div>

        {/* Bottom Action Footer (Screen only, hidden when printing) */}
        <div className="no-print bg-[#F6F2EC] px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#2A1E17]/10">
          <p className="text-xs text-[#2A1E17]/70 text-center sm:text-left">
            Printed receipt formatted for standard 80mm roll or letter paper.
          </p>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              id="receipt-modal-dismiss-btn"
              className="px-4 py-2 bg-white hover:bg-gray-100 text-[#2A1E17] text-xs font-semibold rounded-xl border border-[#2A1E17]/10 transition-colors cursor-pointer"
            >
              Close
            </button>
            {onEmailReceipt && (
              <button
                onClick={() => onEmailReceipt(order)}
                id="receipt-modal-email-bottom-btn"
                className="px-4 py-2 bg-white hover:bg-[#F6F2EC] text-[#2A1E17] text-xs font-semibold rounded-xl border border-[#2A1E17]/15 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {isEmailSent ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Receipt Emailed</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-3.5 h-3.5 text-[#C48B47]" />
                    <span>Email Receipt</span>
                  </>
                )}
              </button>
            )}
            <button
              onClick={handlePrint}
              id="receipt-modal-print-bottom-btn"
              className="px-5 py-2 bg-[#2A1E17] hover:bg-[#C48B47] text-white text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-[#D4A373]" />
              <span>Print Receipt</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
