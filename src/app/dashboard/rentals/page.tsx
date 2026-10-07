'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CalendarCheck,
  CheckCircle,
  Star,
  MessageSquare,
  Clock,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { DataStore } from '@/lib/store';
import { Rental } from '@/lib/types';
import { ReviewModal } from '@/components/ReviewModal';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function MyRentalsPage() {
  const { user } = useAuth();
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [filterTab, setFilterTab] = useState<'all' | 'active' | 'completed'>('all');
  const [selectedRentalForReview, setSelectedRentalForReview] = useState<Rental | null>(null);

  const loadRentals = () => {
    if (user) {
      const all = DataStore.getRentals().filter(
        (r) => r.renter_id === user.id || r.owner_id === user.id
      );
      setRentals(all);
    }
  };

  useEffect(() => {
    loadRentals();
  }, [user]);

  const handleCompleteRental = (rentalId: string) => {
    if (!user) return;
    if (confirm('Mark this rental as successfully completed and returned?')) {
      const res = DataStore.completeRental(rentalId, user.id);
      if (res.success) {
        loadRentals();
      } else {
        alert(res.error || 'Failed to complete rental');
      }
    }
  };

  const filteredRentals = rentals.filter((r) => {
    if (filterTab === 'active') return r.status === 'active';
    if (filterTab === 'completed') return r.status === 'completed';
    return true;
  });

  if (!user) {
    return (
      <div className="bg-white rounded-3xl p-10 text-center border border-slate-200">
        <p className="text-slate-500 text-sm">Please log in to view your rentals.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Rentals</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track confirmed bookings, active equipment usage, handovers, and reviews.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterTab === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            All ({rentals.length})
          </button>
          <button
            onClick={() => setFilterTab('active')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterTab === 'active' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Active ({rentals.filter((r) => r.status === 'active').length})
          </button>
          <button
            onClick={() => setFilterTab('completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterTab === 'completed' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Completed ({rentals.filter((r) => r.status === 'completed').length})
          </button>
        </div>
      </div>

      {/* Rentals List */}
      {filteredRentals.length > 0 ? (
        <div className="space-y-4">
          {filteredRentals.map((rental) => {
            const isOwner = user.id === rental.owner_id;
            const counterParty = isOwner ? rental.renter : rental.owner;
            const existingReviews = DataStore.getReviews().filter(
              (rev) => rev.rental_id === rental.id && rev.reviewer_id === user.id
            );
            const hasReviewed = existingReviews.length > 0;

            return (
              <div
                key={rental.id}
                className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4 hover:border-emerald-300 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${
                        rental.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800 animate-pulse'
                      }`}
                    >
                      {rental.status}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">
                      Rental Ref: #{rental.id.slice(-6)}
                    </span>
                  </div>

                  <div className="text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">Dates: </span>
                    {formatDate(rental.start_date)} to {formatDate(rental.end_date)}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Item info */}
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        rental.listing?.images?.[0] ||
                        'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=200&q=80'
                      }
                      alt=""
                      className="w-16 h-16 rounded-2xl object-cover shrink-0"
                    />
                    <div>
                      <Link
                        href={`/product/${rental.listing_id}`}
                        className="font-bold text-slate-900 text-sm hover:text-emerald-600 transition-colors flex items-center gap-1.5"
                      >
                        <span>{rental.listing?.title || 'Rental Item'}</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </Link>
                      <p className="text-xs text-slate-500 mt-1">
                        {isOwner ? 'Rented by' : 'Provided by'}:{' '}
                        <strong className="text-slate-800">{counterParty?.full_name || 'User'}</strong> ({counterParty?.city})
                      </p>
                    </div>
                  </div>

                  {/* Pricing info */}
                  <div className="text-right">
                    <div className="text-lg font-black text-emerald-600">
                      {formatCurrency(rental.total_amount)}
                    </div>
                    <div className="text-[11px] text-slate-400">Total amount paid</div>
                  </div>
                </div>

                {/* Handover & Action Buttons */}
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-xs text-slate-500 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Handover notes: {rental.handover_notes || 'Coordinate via direct messages.'}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href="/dashboard/messages"
                      className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat</span>
                    </Link>

                    {rental.status === 'active' && (
                      <button
                        onClick={() => handleCompleteRental(rental.id)}
                        className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Complete Return</span>
                      </button>
                    )}

                    {rental.status === 'completed' && (
                      hasReviewed ? (
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl">
                          ✓ Review Submitted
                        </span>
                      ) : (
                        <button
                          onClick={() => setSelectedRentalForReview(rental)}
                          className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white shadow-xs"
                        >
                          <Star className="w-3.5 h-3.5 fill-white" />
                          <span>Leave Review</span>
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs">
          <CalendarCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No rentals found</h3>
          <p className="text-xs text-slate-500 mt-1 mb-6">
            You don't have any {filterTab !== 'all' ? filterTab : ''} rentals right now.
          </p>
          <Link
            href="/browse"
            className="inline-block bg-emerald-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs"
          >
            Find Items to Rent
          </Link>
        </div>
      )}

      {/* Review Modal */}
      {selectedRentalForReview && (
        <ReviewModal
          rental={selectedRentalForReview}
          isOpen={Boolean(selectedRentalForReview)}
          onClose={() => setSelectedRentalForReview(null)}
          onReviewSubmitted={() => {
            loadRentals();
            setSelectedRentalForReview(null);
          }}
        />
      )}
    </div>
  );
}
