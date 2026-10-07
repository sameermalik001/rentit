'use client';

import React, { useState, useEffect, useMemo, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  MapPin,
  Star,
  ShieldCheck,
  Calendar,
  Clock,
  User,
  MessageSquare,
  AlertTriangle,
  Share2,
  CheckCircle2,
  Sparkles,
  Edit,
  ArrowLeft,
  Info,
} from 'lucide-react';
import { DataStore } from '@/lib/store';
import { Listing, Review } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { RentalModal } from '@/components/RentalModal';
import { ReportModal } from '@/components/ReportModal';
import { calculatePricing, formatCurrency, formatDate } from '@/lib/utils';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;
  const router = useRouter();
  const { user } = useAuth();

  const [listing, setListing] = useState<Listing | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isRentalModalOpen, setIsRentalModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Quick inline calculator state
  const tomorrowStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }, []);
  const defaultEndStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  }, []);

  const [calcStartDate, setCalcStartDate] = useState(tomorrowStr);
  const [calcEndDate, setCalcEndDate] = useState(defaultEndStr);

  useEffect(() => {
    const item = DataStore.getListingById(productId);
    if (item) {
      setListing(item);
      setReviews(DataStore.getReviewsForListing(productId));
    }
  }, [productId]);

  const pricing = useMemo(() => {
    if (!listing) return null;
    return calculatePricing({
      dailyPrice: listing.price_per_day,
      startDate: calcStartDate,
      endDate: calcEndDate,
      securityDeposit: listing.security_deposit,
      commissionPercent: 10,
    });
  }, [listing, calcStartDate, calcEndDate]);

  const isBooked = useMemo(() => {
    if (!listing || !calcStartDate || !calcEndDate) return false;
    return DataStore.isListingBooked(listing.id, calcStartDate, calcEndDate);
  }, [listing, calcStartDate, calcEndDate]);

  if (!listing) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Product Not Found</h2>
        <p className="text-slate-500 mt-2 text-sm">
          The listing may have been removed or does not exist.
        </p>
        <Link
          href="/browse"
          className="inline-flex items-center gap-2 mt-6 bg-emerald-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Browse
        </Link>
      </div>
    );
  }

  const isOwner = user?.id === listing.owner_id;
  const images = listing.images?.length > 0 ? listing.images : [
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80'
  ];

  const handleStartChat = () => {
    if (!user) {
      router.push('/login');
      return;
    }
    const conv = DataStore.getOrCreateConversation(listing.id, user.id, listing.owner_id);
    router.push(`/dashboard/messages?conv=${conv.id}`);
  };

  const handleStartDateChange = (val: string) => {
    setCalcStartDate(val);
    if (val && calcEndDate && new Date(val) > new Date(calcEndDate)) {
      setCalcEndDate(val);
    }
  };

  return (
    <div className="bg-[#fbfcfd] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button & Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/browse"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Browse</span>
          </Link>

          <div className="flex items-center gap-2">
            {isOwner && (
              <Link
                href={`/product/${listing.id}/edit`}
                className="flex items-center gap-1 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-xl transition-colors"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Listing</span>
              </Link>
            )}
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-red-600 transition-colors px-2 py-1"
              title="Report listing"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Report</span>
            </button>
          </div>
        </div>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left 2 Cols: Gallery, Title, Description, Rules, Reviews */}
          <div className="lg:col-span-2 space-y-8">
            {/* 1. Image Gallery */}
            <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs p-3">
              <div className="relative aspect-16/10 w-full bg-slate-100 rounded-2xl overflow-hidden">
                <img
                  src={images[activeImageIndex]}
                  alt={listing.title}
                  className="w-full h-full object-cover transition-all duration-300"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="bg-slate-900/85 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    {listing.condition}
                  </span>
                  {listing.category && (
                    <span className="bg-emerald-600/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                      {listing.category.name}
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-20 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                        activeImageIndex === idx ? 'border-emerald-600 shadow-xs' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Product Header & Description */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-2">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{listing.locality}, {listing.city}</span>
                  <span>•</span>
                  <span>Listed on {formatDate(listing.created_at)}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                  {listing.title}
                </h1>
              </div>

              {/* Description */}
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Description
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {listing.description}
                </p>
              </div>

              {/* Specifications / Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Condition</span>
                  <span className="text-sm font-bold text-slate-800">{listing.condition}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Security Deposit</span>
                  <span className="text-sm font-bold text-emerald-700">
                    {listing.security_deposit > 0 ? formatCurrency(listing.security_deposit) : 'None'}
                  </span>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Category</span>
                  <span className="text-sm font-bold text-slate-800">{listing.category?.name || 'General'}</span>
                </div>
              </div>

              {/* Rental Rules */}
              {listing.rental_rules && (
                <div className="pt-4 border-t border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                    Owner's Rental Rules
                  </h3>
                  <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 text-xs text-amber-900 whitespace-pre-line leading-relaxed">
                    {listing.rental_rules}
                  </div>
                </div>
              )}
            </div>

            {/* 3. Owner Profile Card */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                Listed by Owner
              </h3>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={listing.owner?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                    alt={listing.owner?.full_name}
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500/20"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-slate-900 text-lg">
                        {listing.owner?.full_name}
                      </h4>
                      {listing.owner?.is_verified && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Verified
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1 text-slate-700 font-semibold bg-amber-50 px-1.5 py-0.5 rounded-md">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        {listing.owner?.rating || 4.9} ({listing.owner?.total_ratings || 1} ratings)
                      </span>
                      <span>•</span>
                      <span>{listing.owner?.city}, {listing.owner?.locality}</span>
                    </div>
                    {listing.owner?.bio && (
                      <p className="text-xs text-slate-600 mt-2 line-clamp-2 italic">
                        "{listing.owner.bio}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex sm:flex-col gap-2">
                  <Link
                    href={`/profile/${listing.owner_id}`}
                    className="flex-1 text-center py-2 px-4 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors"
                  >
                    View Profile
                  </Link>
                  {!isOwner && (
                    <button
                      onClick={handleStartChat}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Message</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* 4. Product & Owner Reviews */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Verified Reviews ({reviews.length})
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Feedback from completed rentals on RentIt
                  </p>
                </div>
                <div className="flex items-center gap-1 text-slate-900 font-extrabold text-lg">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  <span>{listing.owner?.rating || 5.0}</span>
                </div>
              </div>

              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={rev.reviewer?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                            alt={rev.reviewer?.full_name}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <span className="text-xs font-bold text-slate-900">
                            {rev.reviewer?.full_name || 'Renter'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-amber-500">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {rev.comment}
                      </p>
                      <div className="text-[10px] text-slate-400">
                        {formatDate(rev.created_at)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-xs text-slate-500">No reviews yet for this listing.</p>
                  <p className="text-[11px] text-slate-400 mt-1">Be the first to rent and review this item!</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Col: Booking Calculator & Actions Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-lg shadow-slate-200/40 sticky top-24 space-y-6">
              {/* Daily Rate Header */}
              <div className="flex items-baseline justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-3xl font-black text-emerald-600">
                    {formatCurrency(listing.price_per_day)}
                  </span>
                  <span className="text-xs text-slate-400 font-medium"> / day</span>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Hyperlocal Rental
                </span>
              </div>

              {/* Date Selectors for Instant Live Price Calculation */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Select Rental Dates
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 block mb-1">START DATE</span>
                    <input
                      type="date"
                      min={tomorrowStr}
                      value={calcStartDate}
                      onChange={(e) => handleStartDateChange(e.target.value)}
                      className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl p-2 focus:bg-white focus:border-emerald-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 block mb-1">END DATE</span>
                    <input
                      type="date"
                      min={calcStartDate || tomorrowStr}
                      value={calcEndDate}
                      onChange={(e) => setCalcEndDate(e.target.value)}
                      className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl p-2 focus:bg-white focus:border-emerald-500 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Double Booking Conflict Alert */}
              {isBooked && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Already booked for these dates. Please choose another date range.</span>
                </div>
              )}

              {/* Automatic Calculation Breakdown */}
              {pricing && (
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>
                      {formatCurrency(pricing.dailyPrice)} × {pricing.totalDays} {pricing.totalDays === 1 ? 'day' : 'days'}
                    </span>
                    <span className="font-semibold text-slate-900">{formatCurrency(pricing.rentalAmount)}</span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span className="flex items-center gap-1">
                      <span>Platform fee (10%)</span>
                    </span>
                    <span className="font-semibold text-slate-900">{formatCurrency(pricing.platformFee)}</span>
                  </div>

                  {pricing.securityDeposit > 0 && (
                    <div className="flex justify-between text-slate-600">
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Security deposit (Refundable)</span>
                      </span>
                      <span className="font-semibold text-slate-900">{formatCurrency(pricing.securityDeposit)}</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
                    <span>Total Amount</span>
                    <span className="font-black text-emerald-600 text-base">{formatCurrency(pricing.totalAmount)}</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2">
                {isOwner ? (
                  <div className="space-y-2">
                    <Link
                      href={`/product/${listing.id}/edit`}
                      className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit My Listing</span>
                    </Link>
                    <Link
                      href="/dashboard/requests"
                      className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-200 flex items-center justify-center transition-all"
                    >
                      View Rental Requests
                    </Link>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => setIsRentalModalOpen(true)}
                      disabled={isBooked}
                      className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold text-sm rounded-xl shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 active:scale-98"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Request to Rent</span>
                    </button>

                    <button
                      onClick={handleStartChat}
                      className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Ask Owner a Question</span>
                    </button>
                  </>
                )}
              </div>

              {/* Trust Badge */}
              <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-slate-500 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Protected by RentIt verified peer policy and security deposit return.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <RentalModal
        listing={listing}
        isOpen={isRentalModalOpen}
        onClose={() => setIsRentalModalOpen(false)}
        initialStartDate={calcStartDate}
        initialEndDate={calcEndDate}
      />

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        reportedListingId={listing.id}
        targetName={listing.title}
      />
    </div>
  );
}
