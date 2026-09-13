import React from 'react';
import { Coffee, Croissant, UtensilsCrossed, PartyPopper } from 'lucide-react';

interface OurServicesProps {
  onNavigateMenu: (category?: string) => void;
  onNavigateEvents: () => void;
}

export const OurServices: React.FC<OurServicesProps> = ({ onNavigateMenu, onNavigateEvents }) => {
  const services = [
    {
      id: 'coffee',
      title: 'Coffee & Drinks',
      description: 'Freshly brewed coffee, teas, cold brews and refreshing specialty drinks.',
      icon: Coffee,
      action: () => onNavigateMenu('coffee')
    },
    {
      id: 'bakery',
      title: 'Bakery & Pastries',
      description: 'Freshly baked laminated pastries, sourdough loaves, and seasonal tarts every morning.',
      icon: Croissant,
      action: () => onNavigateMenu('pastries')
    },
    {
      id: 'meals',
      title: 'Breakfast & Lunch',
      description: 'Simple, satisfying gourmet meals, sourdough toasts, paninis and pastas made fresh.',
      icon: UtensilsCrossed,
      action: () => onNavigateMenu('breakfast')
    },
    {
      id: 'events',
      title: 'Events & Catering',
      description: 'Private events, acoustic evenings, office catering and intimate special occasions.',
      icon: PartyPopper,
      action: () => onNavigateEvents()
    },
  ];

  return (
    <section className="py-20 bg-[#FDFBF7]" id="our-services-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#C48B47] mb-2 block">
            What We Offer
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2A1E17] tracking-tight">
            Our Services
          </h2>
          <p className="text-[#2A1E17]/70 text-sm mt-3">
            From the first morning pour-over to intimate evening gatherings, we craft every moment with warmth and dedication.
          </p>
        </div>

        {/* 4-column desktop layout that stacks on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {services.map((srv) => {
            const Icon = srv.icon;
            return (
              <div
                key={srv.id}
                onClick={srv.action}
                className="group p-7 bg-white rounded-2xl border border-[#2A1E17]/8 shadow-sm hover:shadow-md hover:border-[#C48B47]/30 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                id={`service-card-${srv.id}`}
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#F6F2EC] group-hover:bg-[#2A1E17] text-[#2A1E17] group-hover:text-[#D4A373] flex items-center justify-center transition-colors mb-5">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#2A1E17] group-hover:text-[#C48B47] transition-colors mb-2">
                    {srv.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#2A1E17]/70 leading-relaxed font-light">
                    {srv.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#2A1E17]/5 flex items-center text-xs font-semibold text-[#C48B47] group-hover:text-[#2A1E17] transition-colors">
                  <span>Explore Service →</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
