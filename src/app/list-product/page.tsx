'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  UploadCloud,
  X,
  Plus,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
  ShieldCheck,
  MapPin,
  Tag,
} from 'lucide-react';
import { DataStore } from '@/lib/store';
import { Category, ItemCondition } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';

export default function ListProductPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [pricePerDay, setPricePerDay] = useState<number | ''>('');
  const [securityDeposit, setSecurityDeposit] = useState<number | ''>('');
  const [city, setCity] = useState(user?.city || 'Sonipat');
  const [locality, setLocality] = useState(user?.locality || 'Sector 14');
  const [condition, setCondition] = useState<ItemCondition>('Like New');
  const [rentalRules, setRentalRules] = useState('');

  // Image handling
  const [images, setImages] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successId, setSuccessId] = useState<string | null>(null);

  useEffect(() => {
    const cats = DataStore.getCategories();
    setCategories(cats);
    if (cats.length > 0) {
      setCategoryId(cats[0].id);
    }
  }, []);

  const handleAddImageUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (imageUrlInput.trim()) {
      setImages([...images, imageUrlInput.trim()]);
      setImageUrlInput('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages(images.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!user) {
      setErrorMsg('You must be logged in to list an item.');
      return;
    }

    if (!title.trim() || title.length < 5) {
      setErrorMsg('Product title must be at least 5 characters long.');
      return;
    }

    if (!categoryId) {
      setErrorMsg('Please select a product category.');
      return;
    }

    if (!pricePerDay || Number(pricePerDay) <= 0) {
      setErrorMsg('Please specify a valid daily rental price greater than 0.');
      return;
    }

    if (securityDeposit !== '' && Number(securityDeposit) < 0) {
      setErrorMsg('Security deposit cannot be negative.');
      return;
    }

    if (!description.trim() || description.length < 20) {
      setErrorMsg('Please provide a detailed description (at least 20 characters).');
      return;
    }

    if (images.length === 0) {
      setErrorMsg('Please add at least one product photo.');
      return;
    }

    setIsSubmitting(true);

    const newListing = DataStore.saveListing({
      id: `list-${Date.now()}`,
      owner_id: user.id,
      category_id: categoryId,
      title: title.trim(),
      description: description.trim(),
      price_per_day: Number(pricePerDay),
      security_deposit: securityDeposit ? Number(securityDeposit) : 0,
      city: city.trim(),
      locality: locality.trim(),
      condition,
      rental_rules: rentalRules.trim() || undefined,
      status: 'active',
      views_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      images,
    });

    setIsSubmitting(false);
    setSuccessId(newListing.id);

    setTimeout(() => {
      router.push(`/product/${newListing.id}`);
    }, 1500);
  };

  return (
    <div className="bg-[#fbfcfd] min-h-screen py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full mb-2 border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Turn Idle Assets Into Income</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            List Your Product for Rent
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Publish your gear in Sonipat & NCR. Renters pay securely and pick up directly from you.
          </p>
        </div>

        {/* Not Logged In Warning */}
        {!user && (
          <div className="mb-6 p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-800 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>You must be logged in to create listings.</span>
            </div>
            <Link
              href="/login"
              className="bg-amber-600 text-white font-bold px-3 py-1.5 rounded-lg text-xs hover:bg-amber-700"
            >
              Log In Now
            </Link>
          </div>
        )}

        {/* Success State */}
        {successId && (
          <div className="mb-6 p-6 bg-emerald-50 rounded-3xl border border-emerald-200 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="text-lg font-bold text-emerald-900">Listing Published Successfully!</h3>
            <p className="text-xs text-emerald-700">
              Your item is now live on the marketplace. Redirecting to your product page...
            </p>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-6 p-3 bg-red-50 text-red-700 text-xs rounded-2xl border border-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Listing Form */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 1. Item Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Product Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Sony Alpha A7 IV Camera or PlayStation 5 Console"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:bg-white focus:border-emerald-500 focus:outline-hidden"
              />
            </div>

            {/* 2. Category & Condition */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Category *
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:bg-white focus:border-emerald-500 focus:outline-hidden"
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
                  Condition *
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as ItemCondition)}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:bg-white focus:border-emerald-500 focus:outline-hidden"
                >
                  <option value="New">Brand New (Unopened/Pristine)</option>
                  <option value="Like New">Like New (Flawless condition)</option>
                  <option value="Good">Good (Minor cosmetic wear, 100% working)</option>
                  <option value="Fair">Fair (Noticeable wear, fully functional)</option>
                </select>
              </div>
            </div>

            {/* 3. Pricing & Security Deposit */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Price Per Day (₹) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-sm font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder="e.g. 500"
                    value={pricePerDay}
                    onChange={(e) => setPricePerDay(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2.5 text-slate-900 font-bold focus:bg-white focus:border-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Security Deposit (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-sm font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 3000 (Refundable)"
                    value={securityDeposit}
                    onChange={(e) => setSecurityDeposit(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2.5 text-slate-900 font-bold focus:bg-white focus:border-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* 4. Location: City & Locality */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  City *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sonipat"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:bg-white focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Locality / Sector *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sector 14, Model Town"
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:bg-white focus:border-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* 5. Image Uploads & Previews */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Product Photos *
              </label>

              {/* Upload Dropzone */}
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-emerald-500 transition-colors bg-slate-50/50">
                <UploadCloud className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">
                  Upload photos from your computer or phone
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5 mb-3">
                  PNG, JPG, or WEBP up to 5MB each
                </p>
                <label className="cursor-pointer inline-flex items-center gap-1.5 bg-white border border-slate-200 hover:border-emerald-500 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs shadow-xs transition-colors">
                  <span>Choose Images</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Or Add Image URL */}
              <div className="mt-3 flex gap-2">
                <input
                  type="url"
                  placeholder="Or paste an image web URL..."
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3 py-2 rounded-xl"
                >
                  Add URL
                </button>
              </div>

              {/* Preview thumbnails */}
              {images.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-3">
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative w-24 h-24 rounded-2xl overflow-hidden border border-slate-200 group shadow-xs"
                    >
                      <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                      {idx === 0 && (
                        <span className="absolute bottom-1 left-1 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm">
                          Cover
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1 right-1 bg-slate-900/80 hover:bg-red-600 text-white p-1 rounded-full opacity-80 group-hover:opacity-100 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 6. Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Description *
              </label>
              <textarea
                rows={4}
                required
                placeholder="Include specifications, accessories included (e.g. charger, bag, cables), and ideal use cases..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-medium focus:bg-white focus:border-emerald-500 focus:outline-hidden"
              />
            </div>

            {/* 7. Rental Rules */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Rental Rules & Handover Terms (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="e.g. • Govt ID required at pickup • Clean after use • No water exposure"
                value={rentalRules}
                onChange={(e) => setRentalRules(e.target.value)}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 font-medium focus:bg-white focus:border-emerald-500 focus:outline-hidden"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting || !user}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-sm rounded-xl shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 active:scale-98"
              >
                <Plus className="w-4 h-4" />
                <span>{isSubmitting ? 'Publishing Listing...' : 'Publish Listing to RentIt'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
