import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { api } from '../utils/api';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setIsSubmitting(true);
    try {
      await api.sendContactMessage({
        name,
        email,
        subject: subject || 'General Inquiry',
        message
      });
      setSubmitted(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 sm:py-16 bg-[#FDFBF7]" id="contact-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#C48B47] mb-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>Visit Us In Person</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#2A1E17] tracking-tight">
            Contact & Location
          </h1>
          <p className="text-[#2A1E17]/70 text-sm sm:text-base mt-3 font-light">
            We’d love to welcome you into our café or assist with special catering, wholesale beans, and private events.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Contact Info & Map */}
          <div className="lg:col-span-6 space-y-8">
            
            {/* Quick Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Address */}
              <div className="p-6 bg-white rounded-2xl border border-[#2A1E17]/8 shadow-sm space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#F6F2EC] text-[#C48B47] flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-base font-bold text-[#2A1E17]">Address</h4>
                <p className="text-xs sm:text-sm text-[#2A1E17]/70 font-light">
                  123 Main Street<br />Cityville, NY 10001
                </p>
              </div>

              {/* Phone */}
              <div className="p-6 bg-white rounded-2xl border border-[#2A1E17]/8 shadow-sm space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#F6F2EC] text-[#C48B47] flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-base font-bold text-[#2A1E17]">Phone</h4>
                <p className="text-xs sm:text-sm text-[#2A1E17]/70 font-light">
                  +1 (555) 234-5678<br />
                  <span className="text-[11px] text-[#2A1E17]/50">Available 7am–8pm</span>
                </p>
              </div>

              {/* Email */}
              <div className="p-6 bg-white rounded-2xl border border-[#2A1E17]/8 shadow-sm space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#F6F2EC] text-[#C48B47] flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-base font-bold text-[#2A1E17]">Email</h4>
                <p className="text-xs sm:text-sm text-[#2A1E17]/70 font-light truncate">
                  hello@thedailygrind.com<br />
                  <span className="text-[11px] text-[#2A1E17]/50">Replies within 2 hours</span>
                </p>
              </div>

              {/* Opening Hours */}
              <div className="p-6 bg-white rounded-2xl border border-[#2A1E17]/8 shadow-sm space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[#F6F2EC] text-[#C48B47] flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-base font-bold text-[#2A1E17]">Opening Hours</h4>
                <div className="text-xs sm:text-sm text-[#2A1E17]/70 font-light space-y-0.5">
                  <p>Mon–Fri: 7:00 AM – 8:00 PM</p>
                  <p>Sat–Sun: 8:00 AM – 9:00 PM</p>
                </div>
              </div>
            </div>

            {/* Map Preview Card */}
            <div className="bg-white rounded-3xl overflow-hidden border border-[#2A1E17]/10 shadow-sm">
              <div className="p-4 bg-[#FDFBF7] border-b border-[#2A1E17]/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#C48B47]" />
                  <span className="text-xs font-semibold text-[#2A1E17]">Corner of Main St & 4th Avenue</span>
                </div>
                <span className="text-[11px] bg-[#eef6f2] text-[#1E3A2F] font-bold px-2 py-0.5 rounded">
                  Open Now
                </span>
              </div>

              <div className="relative h-64 bg-[#ece7df] overflow-hidden">
                <iframe
                  title="Café Location Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215573295847!2d-73.98784492347209!3d40.75283303483984!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                  className="w-full h-full border-0 grayscale contrast-125 opacity-90 hover:grayscale-0 transition-all duration-300"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* Right: Contact Form (Prompt Requirement) */}
          <div className="lg:col-span-6 bg-white p-8 sm:p-10 rounded-3xl border border-[#2A1E17]/10 shadow-sm h-fit">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#C48B47] mb-1">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Get In Touch</span>
              </div>
              <h2 className="font-serif text-3xl font-bold text-[#2A1E17]">
                Send Us a Message
              </h2>
              <p className="text-xs sm:text-sm text-[#2A1E17]/70 mt-1 font-light">
                Have a question about our beans, booking a private event, or dietary allergies? Drop us a line.
              </p>
            </div>

            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#eef6f2] text-[#1E3A2F] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#2A1E17]">Message Received</h3>
                <p className="text-xs sm:text-sm text-[#2A1E17]/70 max-w-sm mx-auto font-light">
                  Thank you for reaching out. A member of our café team will reply to your email shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-6 py-2.5 bg-[#2A1E17] text-white text-xs font-semibold rounded-xl"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" id="contact-form">
                <div>
                  <label className="block text-xs font-semibold text-[#2A1E17] mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name || ''}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Sarah Johnson"
                    className="w-full px-4 py-3 rounded-xl border border-[#2A1E17]/15 text-xs sm:text-sm text-[#2A1E17] focus:outline-none focus:border-[#C48B47]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2A1E17] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email || ''}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sarah.j@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-[#2A1E17]/15 text-xs sm:text-sm text-[#2A1E17] focus:outline-none focus:border-[#C48B47]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2A1E17] mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={subject || ''}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Private event inquiry, wholesale beans..."
                    className="w-full px-4 py-3 rounded-xl border border-[#2A1E17]/15 text-xs sm:text-sm text-[#2A1E17] focus:outline-none focus:border-[#C48B47]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2A1E17] mb-1">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message || ''}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your note or question here..."
                    className="w-full px-4 py-3 rounded-xl border border-[#2A1E17]/15 text-xs sm:text-sm text-[#2A1E17] focus:outline-none focus:border-[#C48B47]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  id="contact-submit-btn"
                  className="w-full py-3.5 bg-[#2A1E17] hover:bg-[#1E1510] text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99] disabled:opacity-50"
                >
                  <Send className="w-4 h-4 text-[#D4A373]" />
                  <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
