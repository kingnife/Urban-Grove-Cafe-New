import React, { useState } from 'react';
import { Star, MessageSquare, Plus, CheckCircle, ShieldCheck } from 'lucide-react';
import { Review } from '../types';

interface CustomerReviewsProps {
  reviews: Review[];
  onAddReview: (reviewData: { customerName: string; rating: number; comment: string; favoriteItem?: string }) => void;
}

export const CustomerReviews: React.FC<CustomerReviewsProps> = ({ reviews, onAddReview }) => {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [favoriteItem, setFavoriteItem] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;
    onAddReview({
      customerName: name.trim(),
      rating,
      comment: comment.trim(),
      favoriteItem: favoriteItem.trim() || undefined
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setShowModal(false);
      setName('');
      setComment('');
      setFavoriteItem('');
    }, 1200);
  };

  return (
    <section className="py-20 bg-[#FDFBF7]" id="reviews-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#C48B47] mb-2">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Real Experiences</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2A1E17] tracking-tight">
              What Our Customers Say
            </h2>
          </div>

          <button
            onClick={() => setShowModal(true)}
            id="leave-review-btn"
            className="mt-4 sm:mt-0 inline-flex items-center gap-2 px-4 py-2 bg-[#F6F2EC] hover:bg-[#ede7de] text-[#2A1E17] text-xs font-semibold rounded-xl border border-[#2A1E17]/10 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-[#C48B47]" />
            <span>Leave a Review</span>
          </button>
        </div>

        {/* Compact Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(reviews || []).slice(0, 4).map((rev) => (
            <div
              key={rev.id}
              className="p-6 bg-white rounded-2xl border border-[#2A1E17]/8 shadow-sm flex flex-col justify-between"
              id={`review-card-${rev.id}`}
            >
              <div>
                {/* Stars */}
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < (rev.rating || 5)
                          ? 'fill-[#C48B47] text-[#C48B47]'
                          : 'fill-gray-200 text-gray-200'
                      }`}
                    />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-xs sm:text-sm text-[#2A1E17]/80 leading-relaxed font-light italic mb-4">
                  “{rev.comment}”
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-4 border-t border-[#2A1E17]/5 flex items-center gap-3">
                <img
                  src={rev.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                  alt={rev.customerName || 'Guest'}
                  className="w-9 h-9 rounded-full object-cover border border-[#D4A373]/30"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="text-xs font-bold text-[#2A1E17] truncate">{rev.customerName || 'Guest'}</p>
                    {rev.verifiedCustomer && (
                      <ShieldCheck className="w-3 h-3 text-[#1E3A2F]" title="Verified Guest" />
                    )}
                  </div>
                  {rev.favoriteItem && (
                    <p className="text-[10px] text-[#C48B47] truncate">
                      Fav: {rev.favoriteItem}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leave Review Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-[#2A1E17]/10 shadow-2xl relative">
            <h3 className="font-serif text-2xl font-bold text-[#2A1E17] mb-2">Share Your Experience</h3>
            <p className="text-xs text-[#2A1E17]/70 mb-5">We appreciate your feedback on our coffee, pastries, and team.</p>

            {submitted ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle className="w-12 h-12 text-[#1E3A2F] mx-auto" />
                <p className="font-serif text-lg font-bold text-[#2A1E17]">Thank You!</p>
                <p className="text-xs text-[#2A1E17]/70">Your review has been added to our board.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#2A1E17] mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sarah Johnson"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#2A1E17]/15 text-sm focus:outline-none focus:border-[#C48B47]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2A1E17] mb-1">Rating</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= rating
                              ? 'fill-[#C48B47] text-[#C48B47]'
                              : 'fill-gray-200 text-gray-200'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-semibold text-[#2A1E17] ml-2">{rating} Stars</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2A1E17] mb-1">Favorite Item (Optional)</label>
                  <input
                    type="text"
                    value={favoriteItem}
                    onChange={(e) => setFavoriteItem(e.target.value)}
                    placeholder="e.g. Artisan Cafe Latte"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#2A1E17]/15 text-sm focus:outline-none focus:border-[#C48B47]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2A1E17] mb-1">Review</label>
                  <textarea
                    required
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us about the coffee, atmosphere, or service..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#2A1E17]/15 text-sm focus:outline-none focus:border-[#C48B47]"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-xs font-medium text-[#2A1E17]/70 hover:text-[#2A1E17]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#2A1E17] hover:bg-[#1E1510] text-white text-xs font-semibold rounded-xl"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
