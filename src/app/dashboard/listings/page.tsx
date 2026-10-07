'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Package,
  PlusCircle,
  Edit,
  Trash2,
  Power,
  Eye,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { DataStore } from '@/lib/store';
import { Listing } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

export default function MyListingsPage() {
  const { user } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  const loadListings = () => {
    if (user) {
      const items = DataStore.getListings().filter((l) => l.owner_id === user.id);
      setListings(items);
    }
  };

  useEffect(() => {
    loadListings();
  }, [user]);

  const handleToggleStatus = (listing: Listing) => {
    const newStatus = listing.status === 'active' ? 'unavailable' : 'active';
    DataStore.saveListing({
      ...listing,
      status: newStatus,
    });
    setNotification(`Listing marked as ${newStatus}`);
    loadListings();
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDelete = (listingId: string) => {
    if (!user) return;
    if (confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
      const res = DataStore.deleteListing(listingId, user.id);
      if (res.success) {
        setNotification('Listing deleted successfully');
        loadListings();
      } else {
        alert(res.error || 'Failed to delete listing');
      }
      setTimeout(() => setNotification(null), 3000);
    }
  };

  if (!user) {
    return (
      <div className="bg-white rounded-3xl p-10 text-center border border-slate-200">
        <p className="text-slate-500 text-sm">Please log in to manage your listings.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Listings</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your listed equipment, toggle availability, edit prices, or create new listings.
          </p>
        </div>
        <Link
          href="/list-product"
          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>List Another Item</span>
        </Link>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-2xl border border-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {listings.length > 0 ? (
        <div className="space-y-3">
          {listings.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-emerald-300 transition-colors"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.images?.[0] || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=200&q=80'}
                  alt={item.title}
                  className="w-16 h-16 rounded-xl object-cover ring-1 ring-slate-100 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        item.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'rented'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.status}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {item.category?.name || 'General'}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>

                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span className="font-bold text-emerald-600">
                      {formatCurrency(item.price_per_day)} / day
                    </span>
                    <span>•</span>
                    <span>Deposit: {formatCurrency(item.security_deposit)}</span>
                    <span>•</span>
                    <span>{item.locality}, {item.city}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 border-t sm:border-t-0 pt-3 sm:pt-0">
                <button
                  onClick={() => handleToggleStatus(item)}
                  className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-xl border transition-colors ${
                    item.status === 'active'
                      ? 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      : 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                  }`}
                  title={item.status === 'active' ? 'Deactivate listing' : 'Activate listing'}
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>{item.status === 'active' ? 'Deactivate' : 'Activate'}</span>
                </button>

                <Link
                  href={`/product/${item.id}/edit`}
                  className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </Link>

                <Link
                  href={`/product/${item.id}`}
                  className="p-2 rounded-xl text-slate-400 hover:text-emerald-600 hover:bg-slate-50 transition-colors"
                  title="View Public Page"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>

                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Delete Listing"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Package className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No listings yet</h3>
          <p className="text-xs text-slate-500 mt-1 mb-6">
            You haven't listed any products. Share what you own and start earning!
          </p>
          <Link
            href="/list-product"
            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>List Your First Product</span>
          </Link>
        </div>
      )}
    </div>
  );
}
