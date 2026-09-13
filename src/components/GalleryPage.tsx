import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Camera, Sparkles } from 'lucide-react';
import { GALLERY_ITEMS } from '../data/initialData';

export const GalleryPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = [
    { id: 'all', label: 'All Photographs' },
    { id: 'interior', label: 'Café Interior' },
    { id: 'coffee', label: 'Specialty Coffee' },
    { id: 'pastries', label: 'Fresh Pastries' },
    { id: 'food', label: 'Dishes & Food' },
    { id: 'customers', label: 'Community' },
    { id: 'events', label: 'Events' },
  ];

  const filteredItems = activeCategory === 'all'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((it) => it.category === activeCategory);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, filteredItems.length]);

  const handleNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
  };

  const handlePrev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + filteredItems.length) % filteredItems.length);
  };

  return (
    <div className="py-12 sm:py-16 bg-[#FDFBF7]" id="gallery-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#C48B47] mb-2">
            <Camera className="w-3.5 h-3.5" />
            <span>Visual Journal</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#2A1E17] tracking-tight">
            Our Gallery
          </h1>
          <p className="text-[#2A1E17]/70 text-sm sm:text-base mt-3 font-light">
            A visual documentation of daily rituals, roasted beans, flaky crusts, and warm community mornings.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeCategory === cat.id
                  ? 'bg-[#2A1E17] text-[#FDFBF7] shadow-sm'
                  : 'bg-white text-[#2A1E17]/70 border border-[#2A1E17]/10 hover:bg-[#F6F2EC]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Editorial Masonry/Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setLightboxIndex(idx)}
              className="group relative rounded-3xl overflow-hidden cursor-pointer bg-[#2A1E17] aspect-[4/3] shadow-sm hover:shadow-xl transition-all duration-500"
              id={`gallery-item-${item.id}`}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-108"
                loading="lazy"
              />
              
              {/* Editorial Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white" />

              {/* Text details */}
              <div className="absolute inset-x-0 bottom-0 p-6 text-white translate-y-2 sm:translate-y-4 sm:group-hover:translate-y-0 transition-transform duration-300">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#D4A373] block mb-1">
                  {item.category}
                </span>
                <h4 className="font-serif text-lg font-bold leading-tight">
                  {item.title}
                </h4>
                <p className="text-xs text-white/80 mt-1 line-clamp-2 font-light">
                  {item.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modern Editorial Lightbox Modal */}
      {lightboxIndex !== null && filteredItems[lightboxIndex] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
          {/* Close button */}
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            aria-label="Close Lightbox"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Previous button */}
          <button
            onClick={handlePrev}
            className="absolute left-4 sm:left-8 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next button */}
          <button
            onClick={handleNext}
            className="absolute right-4 sm:right-8 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Current Image & Editorial Caption */}
          <div className="max-w-4xl w-full flex flex-col items-center">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl max-h-[75vh]">
              <img
                src={filteredItems[lightboxIndex].image}
                alt={filteredItems[lightboxIndex].title}
                className="w-full h-full max-h-[75vh] object-contain rounded-2xl"
              />
            </div>

            <div className="mt-5 text-center text-white max-w-xl">
              <span className="text-xs uppercase font-bold text-[#D4A373] tracking-widest">
                {filteredItems[lightboxIndex].category} • {lightboxIndex + 1} of {filteredItems.length}
              </span>
              <h3 className="font-serif text-2xl font-bold mt-1">
                {filteredItems[lightboxIndex].title}
              </h3>
              <p className="text-xs sm:text-sm text-white/70 mt-1 font-light">
                {filteredItems[lightboxIndex].caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
