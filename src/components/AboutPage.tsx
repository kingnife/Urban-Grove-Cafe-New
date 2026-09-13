import React from 'react';
import { Coffee, Flame, Heart, Award, Sparkles, ArrowRight } from 'lucide-react';

interface AboutPageProps {
  onNavigateMenu: () => void;
  onNavigateGallery: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigateMenu, onNavigateGallery }) => {
  const team = [
    {
      name: 'Julian Vance',
      role: 'Head Roaster & Co-Founder',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      bio: 'Q-grader certified with 14 years traveling to origin farms across Antioquia, Huila, and Yirgacheffe.'
    },
    {
      name: 'Elena Rostova',
      role: 'Master Pastry Chef',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
      bio: 'Trained at Ferrandi Paris. Specializes in 72-hour cultured sourdough and laminated artisanal viennoiserie.'
    },
    {
      name: 'Marcus Chen',
      role: 'Lead Barista & Educator',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
      bio: 'National Barista Championship finalist obsessed with extraction yields, mineral water chemistry, and micro-foam texture.'
    }
  ];

  return (
    <div className="py-12 sm:py-16 bg-[#FDFBF7]" id="about-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        
        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#C48B47]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Our Roots & Story</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#2A1E17] leading-tight tracking-tight">
              Coffee Crafted with Care.
            </h1>

            <p className="text-[#2A1E17]/85 text-base sm:text-lg font-serif italic leading-relaxed">
              At Urban Grove Cafe, we believe that great days begin with exceptional coffee. Every cup is brewed with passion and precision.
            </p>

            <div className="space-y-4 text-xs sm:text-sm text-[#2A1E17]/75 font-light leading-relaxed">
              <p>
                Founded in 2018 in the historic core of the arts district, Urban Grove Cafe was born out of a desire for a warm sanctuary where high-altitude micro-lots could meet European bakery heritage.
              </p>
              <p>
                We do not cut corners: our milk is sourced from local pasture-raised cows, our oat and almond blends are churned fresh without artificial stabilizers, and our beans are hand-selected from generational families who are paid substantially above Fair Trade minimums.
              </p>
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <button
                onClick={onNavigateMenu}
                className="px-6 py-3 bg-[#2A1E17] hover:bg-[#1E1510] text-white text-xs font-semibold rounded-xl shadow-md transition-colors flex items-center gap-2"
              >
                <span>Taste Our Menu</span>
                <ArrowRight className="w-4 h-4 text-[#D4A373]" />
              </button>
              <button
                onClick={onNavigateGallery}
                className="px-6 py-3 bg-[#F6F2EC] hover:bg-[#ede7de] text-[#2A1E17] text-xs font-semibold rounded-xl transition-colors"
              >
                Explore Photography
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-[#2A1E17]/10 aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1000&q=80"
                alt="Urban Grove Cafe Coffee Crafting"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Overlay badge */}
            <div className="absolute -bottom-6 -left-6 bg-white p-5 rounded-2xl border border-[#2A1E17]/10 shadow-xl hidden sm:flex items-center gap-4 max-w-xs">
              <div className="w-12 h-12 rounded-xl bg-[#1E3A2F] text-[#86efac] flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="font-serif text-sm font-bold text-[#2A1E17]">100% Direct Trade</p>
                <p className="text-[11px] text-[#2A1E17]/60">Sourced from smallholder micro-lot farms annually.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Four Core Philosophies */}
        <div className="bg-[#F6F2EC] p-8 sm:p-12 rounded-3xl border border-[#2A1E17]/10">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="font-serif text-3xl font-bold text-[#2A1E17]">Our Guiding Principles</h2>
            <p className="text-xs text-[#2A1E17]/70 mt-2 font-light">From seed to cup, how we operate every morning.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-[#2A1E17]/5 shadow-sm space-y-3">
              <Coffee className="w-8 h-8 text-[#C48B47]" />
              <h3 className="font-serif text-lg font-bold text-[#2A1E17]">Single-Origin Beans</h3>
              <p className="text-xs text-[#2A1E17]/70 font-light leading-relaxed">
                We roast strictly in small batches to preserve delicate floral and citrus acidity.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#2A1E17]/5 shadow-sm space-y-3">
              <Flame className="w-8 h-8 text-[#C48B47]" />
              <h3 className="font-serif text-lg font-bold text-[#2A1E17]">Custom Loring Roaster</h3>
              <p className="text-xs text-[#2A1E17]/70 font-light leading-relaxed">
                Our closed-loop convection roaster slashes emissions by 80% while delivering razor-sharp precision.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#2A1E17]/5 shadow-sm space-y-3">
              <Award className="w-8 h-8 text-[#C48B47]" />
              <h3 className="font-serif text-lg font-bold text-[#2A1E17]">Master Craftsmanship</h3>
              <p className="text-xs text-[#2A1E17]/70 font-light leading-relaxed">
                Every barista undertakes 120 hours of rigorous calibration before stepping onto the main bar.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#2A1E17]/5 shadow-sm space-y-3">
              <Heart className="w-8 h-8 text-[#C48B47]" />
              <h3 className="font-serif text-lg font-bold text-[#2A1E17]">Community Table</h3>
              <p className="text-xs text-[#2A1E17]/70 font-light leading-relaxed">
                Hosting local book clubs, jazz musicians, and supporting youth culinary arts programs.
              </p>
            </div>
          </div>
        </div>

        {/* Meet the Team (Prompt Requirement) */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#C48B47]">
              People Behind the Grind
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2A1E17] mt-1">
              Meet the Team
            </h2>
            <p className="text-xs sm:text-sm text-[#2A1E17]/70 mt-2 font-light">
              Obsessive roasters, passionate bakers, and friendly faces who make your day shine.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl overflow-hidden border border-[#2A1E17]/8 shadow-sm group flex flex-col justify-between"
              >
                <div className="h-64 overflow-hidden bg-[#F6F2EC]">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <span className="text-xs font-semibold text-[#C48B47] uppercase tracking-wider block mb-1">
                    {member.role}
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#2A1E17] mb-2">
                    {member.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#2A1E17]/70 font-light leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
