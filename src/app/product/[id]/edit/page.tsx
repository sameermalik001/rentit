'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import { DataStore } from '@/lib/store';
import { Listing, Category, ItemCondition, ListingStatus } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';

export default function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;
  const router = useRouter();
  const { user } = useAuth();

  const [listing, setListing] = useState<Listing | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [pricePerDay, setPricePerDay] = useState<number>(0);
  const [securityDeposit, setSecurityDeposit] = useState<number>(0);
  const [city, setCity] = useState('');
  const [locality, setLocality] = useState('');
  const [condition, setCondition] = useState<ItemCondition>('Good');
  const [rentalRules, setRentalRules] = useState('');
  const [status, setStatus] = useState<ListingStatus>('active');

  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setCategories(DataStore.getCategories());
    const item = DataStore.getListingById(productId);
    if (item) {
      setListing(item);
      setTitle(item.title);
      setCategoryId(item.category_id);
      setDescription(item.description);
      setPricePerDay(item.price_per_day);
      setSecurityDeposit(item.security_deposit);
      setCity(item.city);
      setLocality(item.locality);
      setCondition(item.condition);
      setRentalRules(item.rental_rules || '');
      setStatus(item.status);
    }
  }, [productId]);

  if (!listing) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center">
        <p className="text-slate-500">Loading listing details...</p>
      </div>
    );
  }

  // Security check: Only owner or admin can edit
  const isAuthorized = user && (user.id === listing.owner_id || user.role === 'admin');
  if (!isAuthorized) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center">
        <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Access Denied</h2>
        <p className="text-xs text-slate-500 mt-2 mb-6">
          You are not authorized to edit this listing. You can only edit items that you own.
        </p>
        <Link
          href="/browse"
          className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-xs font-semibold"
        >
          Return to Marketplace
        </Link>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!title.trim()) {
      setErrorMsg('Product title is required');
      return;
    }
    if (pricePerDay <= 0) {
      setErrorMsg('Price per day must be greater than 0');
      return;
    }
    if (securityDeposit < 0) {
      setErrorMsg('Security deposit cannot be negative');
      return;
    }

    setIsSaving(true);

    const updatedListing: Listing = {
      ...listing,
      title: title.trim(),
      category_id: categoryId,
      description: description.trim(),
      price_per_day: pricePerDay,
      security_deposit: securityDeposit,
      city: city.trim(),
      locality: locality.trim(),
      condition,
      rental_rules: rentalRules.trim() || undefined,
      status,
      updated_at: new Date().toISOString(),
    };

    DataStore.saveListing(updatedListing);
    setIsSaving(false);
    setSuccess(true);

    setTimeout(() => {
      router.push(`/product/${listing.id}`);
    }, 1200);
  };

  return (
    <div className="bg-[#fbfcfd] min-h-screen py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href={`/product/${listing.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Cancel & Back</span>
          </Link>
          <span className="text-xs font-bold text-slate-400">Listing ID: {listing.id}</span>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
          <h1 className="text-2xl font-black text-slate-900 mb-1">Edit Listing Details</h1>
          <p className="text-xs text-slate-500 mb-6">
            Update pricing, description, availability, or rental terms for this product.
          </p>

          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl mb-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Listing updated successfully! Redirecting...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Product Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 font-medium focus:bg-white focus:border-emerald-500 focus:outline-hidden"
              />
            </div>

            {/* Category & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Category
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 font-medium focus:bg-white focus:border-emerald-500 focus:outline-hidden"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Listing Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ListingStatus)}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 font-medium focus:bg-white focus:border-emerald-500 focus:outline-hidden"
                >
                  <option value="active">Active (Available for Rent)</option>
                  <option value="unavailable">Unavailable (Temporarily Paused)</option>
                  <option value="rented">Currently Rented</option>
                </select>
              </div>
            </div>

            {/* Pricing & Deposit */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Price Per Day (₹)
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={pricePerDay}
                  onChange={(e) => setPricePerDay(Number(e.target.value))}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 font-medium focus:bg-white focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Security Deposit (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={securityDeposit}
                  onChange={(e) => setSecurityDeposit(Number(e.target.value))}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 font-medium focus:bg-white focus:border-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  City
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 font-medium focus:bg-white focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Locality / Sector
                </label>
                <input
                  type="text"
                  required
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 font-medium focus:bg-white focus:border-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Condition */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Item Condition
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as ItemCondition)}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 font-medium focus:bg-white focus:border-emerald-500 focus:outline-hidden"
              >
                <option value="New">Brand New</option>
                <option value="Like New">Like New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Description
              </label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 font-medium focus:bg-white focus:border-emerald-500 focus:outline-hidden"
              />
            </div>

            {/* Rental Rules */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Rental Rules & Instructions
              </label>
              <textarea
                rows={3}
                value={rentalRules}
                onChange={(e) => setRentalRules(e.target.value)}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 font-medium focus:bg-white focus:border-emerald-500 focus:outline-hidden"
              />
            </div>

            {/* Submit */}
            <div className="pt-4 flex gap-3">
              <Link
                href={`/product/${listing.id}`}
                className="flex-1 py-3 border border-slate-200 text-slate-700 font-bold text-sm rounded-xl text-center hover:bg-slate-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving Changes...' : 'Save & Update'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
