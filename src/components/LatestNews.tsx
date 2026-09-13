import React, { useState } from 'react';
import { Calendar, ArrowRight, X, Newspaper } from 'lucide-react';

interface NewsArticle {
  id: string;
  title: string;
  category: string;
  date: string;
  image: string;
  description: string;
  fullContent: string;
}

export const LatestNews: React.FC = () => {
  const [activeArticle, setActiveArticle] = useState<NewsArticle | null>(null);

  const articles: NewsArticle[] = [
    {
      id: 'news-1',
      title: 'New Seasonal Autumn Harvest Menu',
      category: 'Menu & Seasonal',
      date: 'September 10, 2026',
      image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
      description: 'Try our new selection of seasonal drinks and pastries featuring roasted cardamom, poached pear, and spiced pumpkin purée.',
      fullContent: 'As the morning air turns crisp, our bakery team is unveiling our limited-edition autumn menu. Highlights include our slow-churned Cardamom & Cinnamon Morning Bun, roasted squash flatbread with goat cheese, and our Spiced Maple Oat Cortado made with single-origin beans from Guatemala. Available starting this week through November.'
    },
    {
      id: 'news-2',
      title: 'Live Acoustic Sessions This Friday',
      category: 'Events & Culture',
      date: 'September 12, 2026',
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
      description: 'Join us from 7:00 PM for an evening of great acoustic jazz, natural wine, artisan cheese boards, and warm company.',
      fullContent: 'This Friday from 7:00 PM to 9:30 PM, we are dimming the main dining room lights and welcoming the Maya Stone Jazz Trio. Expect warm acoustic upright bass, gentle nylon-string guitar, and soulful vocals. Our espresso bar will transition into an evening menu featuring pour-overs, artisanal cider, and savory small plates.'
    },
    {
      id: 'news-3',
      title: 'Direct-Trade Partnership with Huila Farmers',
      category: 'Roastery Journal',
      date: 'September 5, 2026',
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
      description: 'Learn how our head roaster spent three weeks in Colombia sourcing micro-lots with zero middleman markups.',
      fullContent: 'Our head roaster recently returned from a three-week expedition through the high mountain slopes of Huila, Colombia. We have partnered directly with twenty smallholder generational farms to bring you washed and natural-process Caturra beans with tasting notes of wild honey, bergamot, and sweet stone fruit.'
    }
  ];

  return (
    <section className="py-20 bg-[#F6F2EC]" id="latest-news-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#C48B47] mb-2">
            <Newspaper className="w-3.5 h-3.5" />
            <span>Journal & Updates</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2A1E17] tracking-tight">
            Latest News
          </h2>
          <p className="text-[#2A1E17]/70 text-sm mt-3 font-light">
            Stay in touch with our kitchen creations, roasting notes, and upcoming cultural gatherings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((art) => (
            <article
              key={art.id}
              className="bg-white rounded-2xl overflow-hidden border border-[#2A1E17]/8 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group"
              id={`news-card-${art.id}`}
            >
              <div 
                className="relative h-48 overflow-hidden bg-[#2A1E17]/5 cursor-pointer"
                onClick={() => setActiveArticle(art)}
              >
                <img
                  src={art.image}
                  alt={art.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 bg-[#2A1E17]/80 backdrop-blur-sm text-[#FDFBF7] text-[11px] font-medium px-2.5 py-1 rounded-md">
                  {art.category}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-[#2A1E17]/50 mb-2.5">
                    <Calendar className="w-3.5 h-3.5 text-[#C48B47]" />
                    <span>{art.date}</span>
                  </div>
                  <h3 
                    onClick={() => setActiveArticle(art)}
                    className="font-serif text-xl font-bold text-[#2A1E17] group-hover:text-[#C48B47] transition-colors line-clamp-2 cursor-pointer mb-2"
                  >
                    {art.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#2A1E17]/70 leading-relaxed font-light line-clamp-3">
                    {art.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#2A1E17]/5">
                  <button
                    onClick={() => setActiveArticle(art)}
                    id={`news-read-more-${art.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2A1E17] group-hover:text-[#C48B47] transition-colors"
                  >
                    <span>Read More</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C48B47] group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Article Detail Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto border border-[#2A1E17]/10 shadow-2xl p-6 sm:p-8 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setActiveArticle(null)}
              className="absolute top-4 right-4 p-2 text-[#2A1E17]/60 hover:text-[#2A1E17] hover:bg-[#F6F2EC] rounded-full transition-colors"
              aria-label="Close article modal"
            >
              <X className="w-5 h-5" />
            </button>

            <img
              src={activeArticle.image}
              alt={activeArticle.title}
              className="w-full h-56 object-cover rounded-2xl mb-5"
            />

            <div className="flex items-center gap-3 text-xs text-[#2A1E17]/60 mb-2">
              <span className="font-semibold text-[#C48B47]">{activeArticle.category}</span>
              <span>•</span>
              <span>{activeArticle.date}</span>
            </div>

            <h3 className="font-serif text-2xl font-bold text-[#2A1E17] mb-4">
              {activeArticle.title}
            </h3>

            <div className="text-sm text-[#2A1E17]/80 leading-relaxed space-y-4 font-light">
              <p>{activeArticle.fullContent}</p>
              <p>We welcome you to visit us at 123 Main Street or stop by during our opening hours to experience it firsthand.</p>
            </div>

            <div className="mt-8 pt-4 border-t border-[#2A1E17]/10 flex justify-end">
              <button
                onClick={() => setActiveArticle(null)}
                className="px-5 py-2.5 bg-[#2A1E17] text-white text-xs font-semibold rounded-xl hover:bg-[#1E1510] transition-colors"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
