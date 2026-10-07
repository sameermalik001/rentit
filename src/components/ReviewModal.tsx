'use client';

import React, { useState } from 'react';
import { X, Star, CheckCircle2, AlertCircle } from 'lucide-react';
import { Rental, ReviewType } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { DataStore } from '@/lib/store';

interface ReviewModalProps {
  rental: Rental;
  isOpen: boolean;
  onClose: () => void;
  onReviewSubmitted?: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  rental,
  isOpen,
  onClose,
  onReviewSubmitted,
}) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewType, setReviewType] = useState<ReviewType>(
    user?.id === rental.renter_id ? 'product' : 'renter'
  );
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!user) {
      setErrorMsg('You must be logged in to leave a review.');
      return;
    }

    if (!comment.trim()) {
      setErrorMsg('Please write a short review comment.');
      return;
    }

    const revieweeId = user.id === rental.renter_id ? rental.owner_id : rental.renter_id;

    const res = DataStore.createReview({
      rental_id: rental.id,
      reviewer_id: user.id,
      reviewee_id: revieweeId,
      listing_id: rental.listing_id,
      rating,
      comment: comment.trim(),
      review_type: reviewType,
    });

    if (res.success) {
      setSuccess(true);
      if (onReviewSubmitted) onReviewSubmitted();
    } else {
      setErrorMsg(res.error || 'Failed to submit review');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Write a Review</h3>
            <p className="text-xs text-slate-500">Rental #{rental.id.slice(-6)}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {success ? (
            <div className="text-center py-6 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h4 className="text-lg font-bold text-slate-900">Review Submitted!</h4>
              <p className="text-xs text-slate-600">
                Thank you for contributing to RentIt's community trust and verified ratings.
              </p>
              <button
                onClick={onClose}
                className="mt-4 w-full py-2.5 bg-emerald-600 text-white font-semibold rounded-xl text-sm"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Review Type Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Review Target
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {user?.id === rental.renter_id ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setReviewType('product')}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold border ${
                          reviewType === 'product'
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                            : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        Product Experience
                      </button>
                      <button
                        type="button"
                        onClick={() => setReviewType('owner')}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold border ${
                          reviewType === 'owner'
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                            : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        Owner Communication
                      </button>
                    </>
                  ) : (
                    <div className="col-span-2 py-2 px-3 bg-emerald-50 rounded-xl text-xs font-semibold text-emerald-800 border border-emerald-200">
                      Renter Evaluation (Reliability & Care)
                    </div>
                  )}
                </div>
              </div>

              {/* Star Rating */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Rating (1 to 5 Stars)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 focus:outline-hidden"
                    >
                      <Star
                        className={`w-7 h-7 transition-colors ${
                          (hoverRating || rating) >= star
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-sm font-bold text-slate-700 ml-2">
                    {hoverRating || rating} / 5
                  </span>
                </div>
              </div>

              {/* Comment text */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Detailed Feedback
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="How was the equipment condition, handover punctuality, or communication?"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition-all"
              >
                Submit Review
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
