import React from 'react';
import { ArrowRight, Heart, Users, Coffee } from 'lucide-react';

interface AboutSectionProps {
  onOurStory: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onOurStory }) => {
  return (
    <section className="py-20 sm:py-28 bg-[#FDFBF7] border-y border-[#2A1E17]/5" id="about-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left: Large Café Photography */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-lg aspect-[4/3] bg-[#F6F2EC]">
              <img
                src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80"
                alt="Urban Grove Cafe Community & Coffee Bar"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-[#FDFBF7]/95 backdrop-blur-md border border-[#2A1E17]/10 flex items-center justify-between text-[#2A1E17] shadow-md">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#C48B47]">Est. 2018</p>
                  <p className="font-serif text-sm font-bold">123 Main Street, Downtown</p>
                </div>
                <div className="flex -space-x-2">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                    alt="Barista"
                    className="w-8 h-8 rounded-full border-2 border-white object-cover"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                    alt="Barista"
                    className="w-8 h-8 rounded-full border-2 border-white object-cover"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
                    alt="Barista"
                    className="w-8 h-8 rounded-full border-2 border-white object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Decorative background element */}
            <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-[#D4A373]/15 rounded-full filter blur-2xl -z-10" />
          </div>

          {/* Right: Editorial Story */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#C48B47]">
              <Users className="w-3.5 h-3.5" />
              <span>Community & Craft</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2A1E17] tracking-tight leading-tight">
              A Place for Everyone
            </h2>

            <blockquote className="text-base sm:text-lg text-[#2A1E17]/80 font-serif italic border-l-2 border-[#C48B47] pl-4 my-4">
              “Urban Grove Cafe is more than just a café. It's a community space where great food, good coffee and meaningful conversations come together.”
            </blockquote>

            <p className="text-sm sm:text-base text-[#2A1E17]/70 leading-relaxed font-light">
              We started with a humble passion: taking time to roast exceptional beans and baking bread without shortcuts. Today, we welcome early risers, creative thinkers, laptop workers, and laughing friends into an unhurried, warm atmosphere.
            </p>

            <div className="grid grid-cols-2 gap-4 py-3">
              <div className="flex items-start gap-3">
                <Coffee className="w-5 h-5 text-[#C48B47] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#2A1E17] uppercase">Direct-Trade Beans</h4>
                  <p className="text-xs text-[#2A1E17]/60 mt-0.5">Fair prices directly to farming cooperatives.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-[#C48B47] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-[#2A1E17] uppercase">Warm Hospitality</h4>
                  <p className="text-xs text-[#2A1E17]/60 mt-0.5">Where your favorite order is remembered.</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onOurStory}
                id="about-our-story-btn"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#2A1E17] hover:text-[#C48B47] group transition-colors"
              >
                <span>Our Story</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-[#C48B47]" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
