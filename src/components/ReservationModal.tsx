import React, { useState } from 'react';
import { 
  X, 
  CalendarDays, 
  Clock, 
  Users, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  MapPin, 
  HeartHandshake 
} from 'lucide-react';
import { CustomerUser, Reservation } from '../types';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: CustomerUser;
  onBookReservation: (data: any) => Promise<Reservation>;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({
  isOpen,
  onClose,
  user,
  onBookReservation
}) => {
  const [date, setDate] = useState('2026-09-18');
  const [time, setTime] = useState('11:30 AM');
  const [guests, setGuests] = useState(2);
  const [seatingArea, setSeatingArea] = useState<'Main Dining Room' | 'Window Bar Counter' | 'Garden Terrace Patio' | 'Quiet Study Nook'>('Garden Terrace Patio');
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [specialRequests, setSpecialRequests] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedReservation, setConfirmedReservation] = useState<Reservation | null>(null);

  if (!isOpen) return null;

  const timeSlots = [
    '08:00 AM', '09:00 AM', '10:30 AM', '11:30 AM', 
    '01:00 PM', '02:30 PM', '04:00 PM', '05:30 PM', '07:00 PM', '08:00 PM'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || !date || !time) return;
    setIsSubmitting(true);
    try {
      const res = await onBookReservation({
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        date,
        time,
        guests,
        seatingArea,
        specialRequests
      });
      setConfirmedReservation(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#2A1E17]/10 my-6 relative animate-in fade-in zoom-in-95 duration-200"
        id="reservation-modal"
      >
        {/* Header */}
        <div className="p-6 border-b border-[#2A1E17]/10 bg-[#FDFBF7] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#1E3A2F] text-[#86efac] flex items-center justify-center">
              <CalendarDays className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#C48B47] font-semibold">
                Table Hospitality
              </span>
              <h3 className="font-serif text-xl font-bold text-[#2A1E17]">
                Reserve a Table
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#2A1E17]/60 hover:text-[#2A1E17] hover:bg-[#F6F2EC] rounded-full transition-colors"
            aria-label="Close reservation modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 max-h-[calc(85vh-8rem)] overflow-y-auto">
          {confirmedReservation ? (
            /* Confirmation State */
            <div className="py-6 text-center space-y-6 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-[#eef6f2] text-[#1E3A2F] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-[#C48B47]">
                  Reservation Confirmed!
                </span>
                <h3 className="font-serif text-3xl font-bold text-[#2A1E17] mt-1">
                  We look forward to seeing you
                </h3>
                <p className="text-xs sm:text-sm text-[#2A1E17]/70 mt-2 font-light">
                  A confirmation email has been dispatched to <span className="font-semibold text-[#2A1E17]">{confirmedReservation.customerEmail}</span>.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#FDFBF7] border border-[#2A1E17]/10 text-left space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-[#2A1E17]/10">
                  <span className="text-xs text-[#2A1E17]/60">Booking Reference</span>
                  <span className="font-mono text-sm font-bold text-[#C48B47]">{confirmedReservation.reservationCode}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[#2A1E17]/60 block">Date & Time</span>
                    <span className="font-semibold text-[#2A1E17]">{confirmedReservation.date} at {confirmedReservation.time}</span>
                  </div>
                  <div>
                    <span className="text-[#2A1E17]/60 block">Party Size</span>
                    <span className="font-semibold text-[#2A1E17]">{confirmedReservation.guests} Guests</span>
                  </div>
                </div>
                <div className="text-xs pt-2 border-t border-[#2A1E17]/5">
                  <span className="text-[#2A1E17]/60 block">Seating Area</span>
                  <span className="font-semibold text-[#1E3A2F]">{confirmedReservation.seatingArea}</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3 bg-[#2A1E17] hover:bg-[#1E1510] text-white text-xs font-semibold rounded-xl"
              >
                Done
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Form */}
              <form onSubmit={handleSubmit} className="md:col-span-7 space-y-4">
                {/* Date & Guests */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#2A1E17] mb-1">
                      Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#2A1E17]/15 text-xs text-[#2A1E17] focus:outline-none focus:border-[#C48B47]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#2A1E17] mb-1">
                      Guests *
                    </label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-[#2A1E17]/15 text-xs text-[#2A1E17] focus:outline-none focus:border-[#C48B47]"
                    >
                      {[1, 2, 3, 4, 5, 6, 8, 10].map((n) => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? 'Guest' : 'Guests'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Time Slots */}
                <div>
                  <label className="block text-xs font-semibold text-[#2A1E17] mb-1.5">
                    Preferred Time *
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                    {timeSlots.map((ts) => (
                      <button
                        type="button"
                        key={ts}
                        onClick={() => setTime(ts)}
                        className={`py-1.5 px-2 text-[11px] font-medium rounded-lg border transition-all ${
                          time === ts
                            ? 'bg-[#2A1E17] text-white border-[#2A1E17]'
                            : 'bg-[#F6F2EC] text-[#2A1E17] border-transparent hover:bg-[#ede7de]'
                        }`}
                      >
                        {ts}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Seating Area */}
                <div>
                  <label className="block text-xs font-semibold text-[#2A1E17] mb-1.5">
                    Preferred Seating Area
                  </label>
                  <select
                    value={seatingArea}
                    onChange={(e: any) => setSeatingArea(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#2A1E17]/15 text-xs text-[#2A1E17] focus:outline-none focus:border-[#C48B47]"
                  >
                    <option value="Garden Terrace Patio">Garden Terrace Patio</option>
                    <option value="Main Dining Room">Main Dining Room</option>
                    <option value="Window Bar Counter">Window Bar Counter</option>
                    <option value="Quiet Study Nook">Quiet Study Nook</option>
                  </select>
                </div>

                {/* Name, Email, Phone */}
                <div>
                  <label className="block text-xs font-semibold text-[#2A1E17] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Sarah Johnson"
                    className="w-full px-3 py-2 rounded-xl border border-[#2A1E17]/15 text-xs text-[#2A1E17] focus:outline-none focus:border-[#C48B47]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#2A1E17] mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="sarah@example.com"
                      className="w-full px-3 py-2 rounded-xl border border-[#2A1E17]/15 text-xs text-[#2A1E17] focus:outline-none focus:border-[#C48B47]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#2A1E17] mb-1">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 234-8901"
                      className="w-full px-3 py-2 rounded-xl border border-[#2A1E17]/15 text-xs text-[#2A1E17] focus:outline-none focus:border-[#C48B47]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2A1E17] mb-1">
                    Special Requests (Optional)
                  </label>
                  <input
                    type="text"
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="e.g. Highchair needed, birthday celebration..."
                    className="w-full px-3 py-2 rounded-xl border border-[#2A1E17]/15 text-xs text-[#2A1E17] focus:outline-none focus:border-[#C48B47]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  id="book-reservation-btn"
                  className="w-full py-3.5 bg-[#C48B47] hover:bg-[#b37c3b] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99] disabled:opacity-50"
                >
                  <CalendarDays className="w-4 h-4" />
                  <span>{isSubmitting ? 'Securing Table...' : 'Book Reservation'}</span>
                </button>
              </form>

              {/* Why Reserve Sidebar (Prompt Requirement) */}
              <div className="md:col-span-5 bg-[#FDFBF7] p-5 rounded-2xl border border-[#2A1E17]/10 space-y-5 h-fit">
                <div>
                  <h4 className="font-serif text-lg font-bold text-[#2A1E17] mb-1">
                    Why Reserve?
                  </h4>
                  <p className="text-xs text-[#2A1E17]/70 font-light">
                    Enjoy seamless hospitality tailored for you.
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#1E3A2F]/10 text-[#1E3A2F] flex items-center justify-center shrink-0">
                      ✓
                    </div>
                    <div>
                      <p className="font-bold text-[#2A1E17]">Guaranteed seating</p>
                      <p className="text-[#2A1E17]/60 mt-0.5">Your table is prepared 10 minutes prior to your arrival.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#1E3A2F]/10 text-[#1E3A2F] flex items-center justify-center shrink-0">
                      ✓
                    </div>
                    <div>
                      <p className="font-bold text-[#2A1E17]">Special occasion setup</p>
                      <p className="text-[#2A1E17]/60 mt-0.5">Custom table cards, anniversary treats, or private business setup.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#1E3A2F]/10 text-[#1E3A2F] flex items-center justify-center shrink-0">
                      ✓
                    </div>
                    <div>
                      <p className="font-bold text-[#2A1E17]">Priority service</p>
                      <p className="text-[#2A1E17]/60 mt-0.5">Dedicated barista and direct kitchen expediting.</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-[#F6F2EC] rounded-xl text-[11px] text-[#2A1E17]/70">
                  <p><strong>Café Policy:</strong> Tables are held for 15 minutes past reservation time. Large parties over 8 may call +1 (555) 234-8901 directly.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
