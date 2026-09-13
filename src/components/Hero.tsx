import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, MapPin, Clock, Award, Coffee, Sparkles } from 'lucide-react';

interface HeroProps {
  onViewMenu: () => void;
  onFindUs: () => void;
  onReserveTable: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onViewMenu, onFindUs, onReserveTable }) => {
  return (
    <section className="relative overflow-hidden bg-[#2A1E17] text-[#FDFBF7]" id="hero-section">
      {/* Background Image with warm gradient overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=2000&q=85"
          alt="Urban Grove Cafe Interior"
          className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000"
        />
        {/* Editorial gradient tint overlays: ensures text readability without turning generic dark */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A120E]/95 via-[#2A1E17]/85 to-[#2A1E17]/50" />
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#1A120E]/30 to-[#1A120E]/70" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 flex flex-col justify-center min-h-[560px]">
        <div className="max-w-2xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#FDFBF7]/10 backdrop-blur-md border border-[#FDFBF7]/15 text-xs font-medium tracking-wide text-[#D4A373] mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-[#86efac] animate-pulse" />
            <span>Open Today: 7:00 AM – 9:00 PM</span>
            <span className="text-white/30">•</span>
            <span>123 Main Street</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#FDFBF7] leading-[1.1] mb-6"
          >
            Great Coffee.
            <br />
            <span className="text-[#D4A373] italic font-normal">Better Days.</span>
          </motion.h1>

          {/* Supporting Copy */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-[#FDFBF7]/85 leading-relaxed font-light mb-8 max-w-xl"
          >
            Freshly brewed coffee, delicious food, and a cozy space for good conversations. Sourced ethically from generational farms and prepared with artisan care.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center gap-3.5 sm:gap-4"
          >
            <button
              onClick={onViewMenu}
              id="hero-view-menu-btn"
              className="px-7 py-3.5 bg-[#C48B47] hover:bg-[#b37c3b] text-white font-medium text-sm rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-[0.98] flex items-center gap-2"
            >
              <span>View Menu</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onReserveTable}
              id="hero-reserve-table-btn"
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-[#FDFBF7] font-medium text-sm rounded-xl backdrop-blur-md border border-white/20 transition-all active:scale-[0.98]"
            >
              Reserve a Table
            </button>

            <button
              onClick={onFindUs}
              id="hero-find-us-btn"
              className="px-5 py-3.5 text-xs sm:text-sm text-[#D4A373] hover:text-white transition-colors flex items-center gap-1.5"
            >
              <MapPin className="w-4 h-4 text-[#D4A373]" />
              <span>Find Us & Hours</span>
            </button>
          </motion.div>
        </div>

        {/* Feature Highlights Ribbon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-14 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#D4A373]">
              <Coffee className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Single-Origin Roasts</p>
              <p className="text-[11px] text-white/60">Roasted weekly in micro-batches</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#D4A373]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Handmade Pastries</p>
              <p className="text-[11px] text-white/60">Slow-fermented French butter dough</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#D4A373]">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Award-Winning Space</p>
              <p className="text-[11px] text-white/60">Voted Best Local Café 2024</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
