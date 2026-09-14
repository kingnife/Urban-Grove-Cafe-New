import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Ticket, CheckCircle2, Sparkles, X } from 'lucide-react';
import { CafeEvent } from '../types';

interface EventsPageProps {
  events: CafeEvent[];
  onRSVP: (eventId: string, data: { name: string; email: string; guests: number }) => Promise<void>;
}

export const EventsPage: React.FC<EventsPageProps> = ({ events, onRSVP }) => {
  const [selectedEvent, setSelectedEvent] = useState<CafeEvent | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [guests, setGuests] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rsvpSuccess, setRsvpSuccess] = useState(false);

  const handleOpenRSVP = (evt: CafeEvent) => {
    setSelectedEvent(evt);
    setRsvpSuccess(false);
    setName('');
    setEmail('');
    setGuests(1);
  };

  const handleSubmitRSVP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent || !name.trim() || !email.trim()) return;
    setIsSubmitting(true);
    try {
      await onRSVP(selectedEvent.id, { name, email, guests });
      setRsvpSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 sm:py-16 bg-[#FDFBF7]" id="events-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#C48B47] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Culture & Gatherings</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#2A1E17] tracking-tight">
            Upcoming Events
          </h1>
          <p className="text-[#2A1E17]/70 text-sm sm:text-base mt-3 font-light">
            Live music, cupping workshops, and weekend seasonal feasts in our hearth lounge and garden terrace.
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {events.map((evt) => (
            <div
              key={evt.id}
              className="bg-white rounded-3xl overflow-hidden border border-[#2A1E17]/8 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
              id={`event-card-${evt.id}`}
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden bg-[#2A1E17]/5">
                <img
                  src={evt.image}
                  alt={evt.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-[#2A1E17]/85 backdrop-blur-sm text-white text-[11px] font-semibold px-3 py-1 rounded-full">
                  {evt.category}
                </div>
                {evt.spotsLeft <= 5 && (
                  <div className="absolute top-4 right-4 bg-[#801414]/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full animate-pulse">
                    Only {evt.spotsLeft} spots left
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-[#2A1E17]/70 mb-3">
                    <div className="flex items-center gap-1.5 font-semibold text-[#C48B47]">
                      <Calendar className="w-4 h-4" />
                      <span>{evt.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#2A1E17]/50" />
                      <span>{evt.time}</span>
                    </div>
                  </div>

                  <h3 className="font-serif text-2xl font-bold text-[#2A1E17] mb-3 leading-snug">
                    {evt.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#2A1E17]/75 leading-relaxed font-light mb-4">
                    {evt.description}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-[#2A1E17]/60 py-2 border-y border-[#2A1E17]/5">
                    <MapPin className="w-3.5 h-3.5 text-[#C48B47]" />
                    <span>{evt.location}</span>
                  </div>
                </div>

                {/* Footer and RSVP Button */}
                <div className="mt-6 pt-4 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-[#2A1E17]/50 block">Admission</span>
                    <span className="font-serif text-lg font-bold text-[#2A1E17]">
                      {evt.ticketPrice === 0 ? 'Free Entry' : `$${evt.ticketPrice} / guest`}
                    </span>
                  </div>

                  <button
                    onClick={() => handleOpenRSVP(evt)}
                    id={`rsvp-btn-${evt.id}`}
                    className="px-5 py-2.5 bg-[#2A1E17] hover:bg-[#C48B47] text-white text-xs font-semibold rounded-xl transition-all shadow-sm active:scale-95 flex items-center gap-1.5"
                  >
                    <Ticket className="w-3.5 h-3.5 text-[#D4A373]" />
                    <span>RSVP Now</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RSVP Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-[#2A1E17]/10 shadow-2xl relative">
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 p-2 text-[#2A1E17]/60 hover:text-[#2A1E17] hover:bg-[#F6F2EC] rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {rsvpSuccess ? (
              <div className="py-6 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#eef6f2] text-[#1E3A2F] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#2A1E17]">
                  You're on the Guest List!
                </h3>
                <p className="text-xs text-[#2A1E17]/70 font-light leading-relaxed">
                  We've reserved {guests} {guests === 1 ? 'seat' : 'seats'} for you at{' '}
                  <span className="font-semibold text-[#2A1E17]">{selectedEvent.title}</span> on {selectedEvent.date}.
                </p>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="w-full py-3 bg-[#2A1E17] text-white text-xs font-semibold rounded-xl mt-4"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitRSVP} className="space-y-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#C48B47] tracking-wider">
                    RSVP Registration
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#2A1E17] mt-0.5">
                    {selectedEvent.title}
                  </h3>
                  <p className="text-xs text-[#2A1E17]/60 mt-1">
                    {selectedEvent.date} • {selectedEvent.time}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2A1E17] mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name || ''}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sarah Johnson"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#2A1E17]/15 text-xs text-[#2A1E17] focus:outline-none focus:border-[#C48B47]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2A1E17] mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email || ''}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sarah@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#2A1E17]/15 text-xs text-[#2A1E17] focus:outline-none focus:border-[#C48B47]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2A1E17] mb-1">Number of Guests</label>
                  <select
                    value={guests || 1}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#2A1E17]/15 text-xs text-[#2A1E17] bg-white focus:outline-none focus:border-[#C48B47]"
                  >
                    {[1, 2, 3, 4, 5].map((g) => (
                      <option key={g} value={g}>
                        {g} {g === 1 ? 'Guest (Just Me)' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-[#2A1E17] hover:bg-[#1E1510] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99] disabled:opacity-50"
                  >
                    <span>{isSubmitting ? 'Confirming...' : 'Confirm My Attendance'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
