import React from 'react';
import { Coffee, Instagram, Facebook, Twitter, MapPin, Phone, Mail, Clock, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: any) => void;
  onOpenReservation: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenReservation }) => {
  return (
    <footer className="bg-[#2A1E17] text-[#FDFBF7] pt-16 pb-12 border-t border-[#3D2C22]" id="site-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#433227]">
          
          {/* Col 1 & 2: Café Logo & Short Bio */}
          <div className="lg:col-span-2 space-y-4">
            <div 
              onClick={() => onNavigate('home')} 
              className="flex items-center gap-2.5 cursor-pointer group w-fit"
            >
              <div className="w-10 h-10 rounded-xl bg-[#D4A373] text-[#2A1E17] flex items-center justify-center shadow-md">
                <Coffee className="w-5 h-5" />
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-tight text-white block">
                  Urban Grove Cafe
                </span>
                <span className="text-[10px] uppercase tracking-widest text-[#D4A373] font-medium block">
                  Artisan Roasters & Kitchen
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-white/70 font-light leading-relaxed max-w-sm">
              Great coffee, good people, better days. Serving single-origin beans, house-baked pastries, and fresh seasonal brunch in Cityville since 2018.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#instagram"
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-[#D4A373] hover:text-[#2A1E17] text-white flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#facebook"
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-[#D4A373] hover:text-[#2A1E17] text-white flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#twitter"
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-[#D4A373] hover:text-[#2A1E17] text-white flex items-center justify-center transition-colors"
                aria-label="Twitter / X"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 3: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-bold text-white tracking-wide">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-white/75 font-light">
              <li>
                <button
                  onClick={() => onNavigate('menu')}
                  className="hover:text-[#D4A373] transition-colors"
                >
                  Our Menu & Specials
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenReservation}
                  className="hover:text-[#D4A373] transition-colors"
                >
                  Book Table Reservation
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('events')}
                  className="hover:text-[#D4A373] transition-colors"
                >
                  Upcoming Events & Music
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('gallery')}
                  className="hover:text-[#D4A373] transition-colors"
                >
                  Photo Gallery
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-[#D4A373] transition-colors"
                >
                  Our Roasting Story
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Opening Hours */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-bold text-white tracking-wide">
              Opening Hours
            </h4>
            <div className="space-y-2 text-xs text-white/75 font-light">
              <div className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-[#D4A373] shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-white">Monday – Friday</p>
                  <p className="text-white/60">7:00 AM – 8:00 PM</p>
                </div>
              </div>
              <div className="flex items-start gap-2 pt-1">
                <Clock className="w-3.5 h-3.5 text-[#D4A373] shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-white">Saturday – Sunday</p>
                  <p className="text-white/60">8:00 AM – 9:00 PM</p>
                </div>
              </div>
              <p className="text-[11px] text-[#D4A373] pt-1">
                Kitchen closes 30 mins before closing.
              </p>
            </div>
          </div>

          {/* Col 5: Contact Info */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-bold text-white tracking-wide">
              Visit Us
            </h4>
            <div className="space-y-2 text-xs text-white/75 font-light">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#D4A373] shrink-0 mt-0.5" />
                <span>123 Main Street, Cityville</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#D4A373] shrink-0" />
                <span>+1 555 234 5678</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#D4A373] shrink-0" />
                <span className="truncate">hello@urbangrovecafe.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar (Prompt Requirement: © 2026 Urban Grove Cafe. All rights reserved.) */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/50 gap-4">
          <p>© 2026 Urban Grove Cafe. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#terms" className="hover:text-white transition-colors">Terms of Service</a>
            <span>•</span>
            <span className="inline-flex items-center gap-1 text-[#D4A373]">
              Crafted with care & coffee
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
