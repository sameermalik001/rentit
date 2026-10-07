'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Inbox,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  MessageSquare,
  AlertCircle,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { DataStore } from '@/lib/store';
import { RentalRequest } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function RentalRequestsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const [requests, setRequests] = useState<RentalRequest[]>([]);
  const [actionAlert, setActionAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadRequests = () => {
    if (user) {
      const all = DataStore.getRentalRequests();
      setRequests(all);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [user]);

  const handleOwnerAction = (requestId: string, action: 'accepted' | 'rejected') => {
    if (!user) return;
    let reason: string | undefined;
    if (action === 'rejected') {
      const promptReason = prompt('Optional: Reason for declining this request?');
      if (promptReason !== null) {
        reason = promptReason || 'Equipment unavailable on these dates';
      }
    }

    const res = DataStore.updateRequestStatus(requestId, action, user.id, reason);
    if (res.success) {
      setActionAlert({
        type: 'success',
        message: action === 'accepted' ? 'Rental request accepted! Active booking created.' : 'Rental request declined.',
      });
      loadRequests();
    } else {
      setActionAlert({
        type: 'error',
        message: res.error || 'Failed to update request',
      });
    }

    setTimeout(() => setActionAlert(null), 4000);
  };

  const handleCancelRequest = (requestId: string) => {
    if (!user) return;
    if (confirm('Are you sure you want to cancel this rental request?')) {
      const res = DataStore.updateRequestStatus(requestId, 'cancelled', user.id);
      if (res.success) {
        setActionAlert({ type: 'success', message: 'Request cancelled successfully.' });
        loadRequests();
      } else {
        setActionAlert({ type: 'error', message: res.error || 'Failed to cancel request' });
      }
      setTimeout(() => setActionAlert(null), 4000);
    }
  };

  if (!user) {
    return (
      <div className="bg-white rounded-3xl p-10 text-center border border-slate-200">
        <p className="text-slate-500 text-sm">Please log in to view rental requests.</p>
      </div>
    );
  }

  const receivedRequests = requests.filter((r) => r.owner_id === user.id);
  const sentRequests = requests.filter((r) => r.renter_id === user.id);
  const displayedRequests = activeTab === 'received' ? receivedRequests : sentRequests;

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Rental Requests</h1>
          <p className="text-xs text-slate-500 mt-1">
            Accept or decline incoming booking requests from neighbors, and track requests you've sent.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('received')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'received'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Received as Owner ({receivedRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'sent'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Sent as Renter ({sentRequests.length})
          </button>
        </div>
      </div>

      {actionAlert && (
        <div
          className={`p-3.5 rounded-2xl text-xs flex items-center gap-2 border ${
            actionAlert.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-700 border-red-200'
          }`}
        >
          {actionAlert.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{actionAlert.message}</span>
        </div>
      )}

      {/* Requests List */}
      {displayedRequests.length > 0 ? (
        <div className="space-y-4">
          {displayedRequests.map((req) => {
            const isOwner = user.id === req.owner_id;
            const counterParty = isOwner ? req.renter : req.owner;
            const isPending = req.status === 'pending';

            return (
              <div
                key={req.id}
                className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4 hover:border-emerald-300 transition-colors"
              >
                {/* Status Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${
                        req.status === 'accepted' || req.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : req.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : req.status === 'cancelled'
                          ? 'bg-slate-100 text-slate-600'
                          : 'bg-amber-100 text-amber-800 animate-pulse'
                      }`}
                    >
                      {req.status}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">
                      Request ID: #{req.id.slice(-6)}
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-400">
                    Requested on {formatDate(req.created_at)}
                  </span>
                </div>

                {/* Details Row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        req.listing?.images?.[0] ||
                        'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=200&q=80'
                      }
                      alt=""
                      className="w-16 h-16 rounded-2xl object-cover shrink-0"
                    />
                    <div>
                      <Link
                        href={`/product/${req.listing_id}`}
                        className="font-bold text-slate-900 text-sm hover:text-emerald-600 transition-colors"
                      >
                        {req.listing?.title || 'Rental Item'}
                      </Link>
                      <p className="text-xs text-slate-500 mt-1">
                        {isOwner ? 'Requested by' : 'Listing Owner'}:{' '}
                        <strong className="text-slate-800">{counterParty?.full_name || 'User'}</strong>
                        {counterParty?.city && ` (${counterParty.city})`}
                      </p>
                      {req.message && (
                        <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 italic">
                          "{req.message}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-right min-w-[200px]">
                    <div className="text-xs font-semibold text-slate-600">
                      {formatDate(req.start_date)} - {formatDate(req.end_date)}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {req.total_days} {req.total_days === 1 ? 'day' : 'days'} @ {formatCurrency(req.daily_price)}/day
                    </div>
                    <div className="text-base font-black text-emerald-600 mt-1">
                      {formatCurrency(req.total_amount)}
                    </div>
                  </div>
                </div>

                {/* Action Row */}
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-xs text-slate-500 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Includes {formatCurrency(req.security_deposit)} refundable deposit</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href="/dashboard/messages"
                      className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat</span>
                    </Link>

                    {/* Owner controls: Accept or Reject */}
                    {isOwner && isPending && (
                      <>
                        <button
                          onClick={() => handleOwnerAction(req.id, 'rejected')}
                          className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                        <button
                          onClick={() => handleOwnerAction(req.id, 'accepted')}
                          className="flex items-center gap-1 text-xs font-bold px-4 py-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Accept Request</span>
                        </button>
                      </>
                    )}

                    {/* Renter controls: Cancel if pending */}
                    {!isOwner && isPending && (
                      <button
                        onClick={() => handleCancelRequest(req.id)}
                        className="text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                      >
                        Cancel Request
                      </button>
                    )}

                    {req.status === 'accepted' && (
                      <Link
                        href="/dashboard/rentals"
                        className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200"
                      >
                        <span>View in Rentals →</span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs">
          <Inbox className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">
            No {activeTab === 'received' ? 'incoming' : 'outgoing'} requests
          </h3>
          <p className="text-xs text-slate-500 mt-1 mb-6">
            {activeTab === 'received'
              ? 'When renters request your equipment, you will see their details and approval controls here.'
              : "You haven't requested to rent any products recently."}
          </p>
          <Link
            href="/browse"
            className="inline-block bg-emerald-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs"
          >
            Explore Marketplace
          </Link>
        </div>
      )}
    </div>
  );
}
