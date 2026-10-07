'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Package,
  CalendarCheck,
  Inbox,
  TrendingUp,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { DataStore } from '@/lib/store';
import { Listing, RentalRequest, Rental } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function DashboardOverviewPage() {
  const { user } = useAuth();
  const [myListings, setMyListings] = useState<Listing[]>([]);
  const [myRequests, setMyRequests] = useState<RentalRequest[]>([]);
  const [myRentals, setMyRentals] = useState<Rental[]>([]);

  useEffect(() => {
    if (user) {
      const allListings = DataStore.getListings().filter((l) => l.owner_id === user.id);
      setMyListings(allListings);

      const allRequests = DataStore.getRentalRequests().filter(
        (r) => r.owner_id === user.id || r.renter_id === user.id
      );
      setMyRequests(allRequests);

      const allRentals = DataStore.getRentals().filter(
        (r) => r.owner_id === user.id || r.renter_id === user.id
      );
      setMyRentals(allRentals);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
        <h3 className="text-lg font-bold text-slate-900">Please Sign In</h3>
        <p className="text-xs text-slate-500 mt-1 mb-4">
          Log in or switch demo user from the top navigation to view your personal dashboard.
        </p>
        <Link
          href="/login"
          className="inline-block bg-emerald-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl"
        >
          Sign In
        </Link>
      </div>
    );
  }

  const activeRentalsCount = myRentals.filter((r) => r.status === 'active').length;
  const pendingRequestsCount = myRequests.filter(
    (r) => r.status === 'pending' && r.owner_id === user.id
  ).length;

  // Compute owner earnings from completed rentals
  const completedOwnerRentals = myRentals.filter(
    (r) => r.owner_id === user.id && r.status === 'completed'
  );
  const totalEarnings = completedOwnerRentals.reduce((sum, r) => sum + r.total_amount * 0.9, 0);

  return (
    <div className="space-y-6">
      {/* Top Welcome Card */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-emerald-700/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider">
            RentIt Hyperlocal Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
            Hi, {user.full_name}!
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1">
            {myListings.length > 0
              ? `You have ${myListings.length} items listed in ${user.locality}, ${user.city}.`
              : 'Discover products to rent or start earning from what you own.'}
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            href="/list-product"
            className="bg-white hover:bg-emerald-50 text-emerald-900 font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors shrink-0"
          >
            + Add Listing
          </Link>
          <Link
            href="/browse"
            className="bg-emerald-800/60 hover:bg-emerald-800 border border-white/20 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors shrink-0"
          >
            Browse Gear
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">My Listings</span>
            <Package className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{myListings.length}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {myListings.filter((l) => l.status === 'active').length} active
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Leases</span>
            <CalendarCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{activeRentalsCount}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">In progress</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Pending Requests</span>
            <Inbox className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">{pendingRequestsCount}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Requires response</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Owner Net</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">
            {formatCurrency(Math.round(totalEarnings))}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">From completed rentals</div>
        </div>
      </div>

      {/* Action alerts if pending requests exist */}
      {pendingRequestsCount > 0 && (
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center font-black text-xs">
              !
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-900">
                You have {pendingRequestsCount} rental request(s) awaiting your decision!
              </h4>
              <p className="text-[11px] text-amber-700">
                Review and accept to confirm booking and schedule pickup coordinates.
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/requests"
            className="text-xs font-bold bg-amber-600 text-white px-3.5 py-1.5 rounded-xl hover:bg-amber-700 shadow-xs"
          >
            Review Now
          </Link>
        </div>
      )}

      {/* Recent Rentals / Requests Preview */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-base">Recent Rental Activity</h3>
          <Link
            href="/dashboard/rentals"
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {myRentals.length > 0 ? (
          <div className="space-y-3">
            {myRentals.slice(0, 4).map((rental) => {
              const isUserOwner = rental.owner_id === user.id;
              return (
                <div
                  key={rental.id}
                  className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={rental.listing?.images?.[0] || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=150&q=80'}
                      alt=""
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">
                        {rental.listing?.title || 'Rental Item'}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {formatDate(rental.start_date)} - {formatDate(rental.end_date)} • {isUserOwner ? `Rented to ${rental.renter?.full_name}` : `Rented from ${rental.owner?.full_name}`}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        rental.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {rental.status}
                    </span>
                    <div className="text-xs font-black text-slate-900 mt-1">
                      {formatCurrency(rental.total_amount)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-xs text-slate-500">No rental history yet.</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Browse products or list your first item to start renting!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
