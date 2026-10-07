'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  X,
  Calendar,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Listing } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { DataStore } from '@/lib/store';
import { calculatePricing, formatCurrency } from '@/lib/utils';

interface RentalModalProps {
  listing: Listing;
  isOpen: boolean;
  onClose: () => void;
  initialStartDate?: string;
  initialEndDate?: string;
}

export const RentalModal: React.FC<RentalModalProps> = ({
  listing,
  isOpen,
  onClose,
  initialStartDate,
  initialEndDate,
}) => {
  const router = useRouter();
  const { user } = useAuth();

  // Default to tomorrow and day after tomorrow
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
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

  const [startDate, setStartDate] = useState(initialStartDate || tomorrowStr);
  const [endDate, setEndDate] = useState(initialEndDate || defaultEndStr);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successData, setSuccessData] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialStartDate) setStartDate(initialStartDate);
      if (initialEndDate) setEndDate(initialEndDate);
      setErrorMsg('');
      setSuccessData(null);
    }
  }, [isOpen, initialStartDate, initialEndDate]);

  const handleStartDateChange = (val: string) => {
    setStartDate(val);
    if (val && endDate && new Date(val) > new Date(endDate)) {
      setEndDate(val);
    }
  };

  // Live pricing computation
  const pricing = useMemo(() => {
    return calculatePricing({
      dailyPrice: listing.price_per_day,
      startDate,
      endDate,
      securityDeposit: listing.security_deposit,
      commissionPercent: 10,
    });
  }, [listing.price_per_day, listing.security_deposit, startDate, endDate]);

  // Check double-booking conflict
  const isConflict = useMemo(() => {
    if (!startDate || !endDate) return false;
    return DataStore.isListingBooked(listing.id, startDate, endDate);
  }, [listing.id, startDate, endDate]);

  const isOwner = user?.id === listing.owner_id;
  const isUnavailable = listing.status !== 'active';

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!user) {
      router.push('/login');
      return;
    }

    if (isOwner) {
      setErrorMsg('You cannot rent your own product.');
      return;
    }

    if (isUnavailable) {
      setErrorMsg('This product is currently not available for rent.');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setErrorMsg('End date must be after or on start date.');
      return;
    }

    if (isConflict) {
      setErrorMsg('This item is already booked for the selected dates. Please choose different dates.');
      return;
    }

    setIsSubmitting(true);

    const result = DataStore.createRentalRequest({
      listing_id: listing.id,
      renter_id: user.id,
      owner_id: listing.owner_id,
      start_date: startDate,
      end_date: endDate,
      total_days: pricing.totalDays,
      daily_price: pricing.dailyPrice,
      rental_amount: pricing.rentalAmount,
      platform_fee: pricing.platformFee,
      security_deposit: pricing.securityDeposit,
      total_amount: pricing.totalAmount,
      message: message.trim() || undefined,
    });

    setIsSubmitting(false);

    if (result.success && result.request) {
      setSuccessData(result.request);
    } else {
      setErrorMsg(result.error || 'Failed to submit rental request');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">Request to Rent</h3>
            <p className="text-xs text-slate-500 truncate max-w-xs">{listing.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {successData ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-extrabold text-slate-900">Request Sent Successfully!</h4>
              <p className="text-sm text-slate-600 max-w-sm mx-auto">
                We've notified <strong>{listing.owner?.full_name || 'the owner'}</strong>. You will receive an alert as soon as they accept or message you.
              </p>

              <div className="bg-slate-50 rounded-2xl p-4 text-left border border-slate-100 space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between font-semibold text-slate-900">
                  <span>Rental Period:</span>
                  <span>{startDate} to {endDate} ({pricing.totalDays} days)</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Calculated:</span>
                  <span className="font-bold text-emerald-600">{formatCurrency(pricing.totalAmount)}</span>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50"
                >
                  Close
                </button>
                <Link
                  href="/dashboard/rentals"
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 text-center shadow-md shadow-emerald-600/20"
                >
                  View My Requests
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Not logged in or Owner warning */}
              {!user && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>You must be logged in to send a rental request.</span>
                </div>
              )}

              {isOwner && (
                <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>This is your own listing! You cannot rent your own items.</span>
                </div>
              )}

              {isConflict && (
                <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>This item is already booked during these selected dates. Please adjust your dates.</span>
                </div>
              )}

              {errorMsg && (
                <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Date pickers */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Start Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      min={todayStr}
                      value={startDate}
                      onChange={(e) => handleStartDateChange(e.target.value)}
                      required
                      className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:bg-white focus:border-emerald-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    End Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      min={startDate || todayStr}
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                      className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-medium focus:bg-white focus:border-emerald-500 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Price Breakdown Card */}
              <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>
                    {formatCurrency(pricing.dailyPrice)} × {pricing.totalDays} {pricing.totalDays === 1 ? 'day' : 'days'}
                  </span>
                  <span className="font-semibold text-slate-900">{formatCurrency(pricing.rentalAmount)}</span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span className="flex items-center gap-1">
                    <span>RentIt Platform fee</span>
                    <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1 rounded-md font-semibold">10%</span>
                  </span>
                  <span className="font-semibold text-slate-900">{formatCurrency(pricing.platformFee)}</span>
                </div>

                {pricing.securityDeposit > 0 && (
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Security deposit (Refundable)</span>
                    </span>
                    <span className="font-semibold text-slate-900">{formatCurrency(pricing.securityDeposit)}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-sm">
                  <span className="font-bold text-slate-900">Total Calculation</span>
                  <span className="font-black text-emerald-600 text-base">{formatCurrency(pricing.totalAmount)}</span>
                </div>
              </div>

              {/* Message to owner */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Message to Owner (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Introduce yourself, describe your use-case, or suggest preferred handover timings..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 placeholder-slate-400 focus:bg-white focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting || isOwner || isConflict}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-600/20 active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Submitting Request...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Send Rental Request</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
