'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  MapPin,
  TrendingUp,
  Clock,
  CheckCircle,
  PiggyBank,
  Recycle,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { DataStore } from '@/lib/store';
import { Listing, Category } from '@/lib/types';
import { ProductCard } from '@/components/ProductCard';
import { CategoryCard } from '@/components/CategoryCard';

const EXAMPLE_SEARCHES = ['Camera', 'Projector', 'Gaming Console', 'Bicycle', 'Tools', 'Furniture'];

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('Sonipat');
  const [featuredListings, setFeaturedListings] = useState<Listing[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const allListings = DataStore.getListings().filter((l) => l.status === 'active');
    setFeaturedListings(allListings.slice(0, 8));
    setCategories(DataStore.getCategories().slice(0, 8));
  }, []);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (searchQuery.trim()) queryParams.set('q', searchQuery.trim());
    if (selectedCity) queryParams.set('city', selectedCity);
    router.push(`/browse?${queryParams.toString()}`);
  };

  const handlePillClick = (term: string) => {
    router.push(`/browse?q=${encodeURIComponent(term)}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 bg-gradient-to-b from-emerald-50/60 via-white to-white">
        {/* Subtle Decorative Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-300/15 blur-[120px] rounded-full pointer-events-none -z-10" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-purple-300/15 blur-[100px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Brand Logo & Launch Pill */}
          <div className="flex flex-col items-center justify-center gap-3 mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
            <img
              src="/logo.png"
              alt="RentIt Logo"
              className="w-20 h-20 sm:w-24 sm:h-24 object-contain drop-shadow-md rounded-2xl hover:scale-105 transition-transform"
            />
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-300/60 text-emerald-800 text-xs font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Hyperlocal Peer-to-Peer Rental Network</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              <span className="text-emerald-700">Sonipat & Delhi NCR</span>
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] max-w-4xl mx-auto">
            Rent what you need.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
              Don't buy what you won't.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            RentIt connects you with people nearby who have products you need temporarily. Save money, reduce clutter, and rent safely.
          </p>

          {/* Hero Search Box */}
          <div className="mt-8 max-w-2xl mx-auto">
            <form
              onSubmit={handleHeroSearch}
              className="bg-white p-2 rounded-2xl sm:rounded-full shadow-xl shadow-slate-200/60 border border-slate-200/90 flex flex-col sm:flex-row items-center gap-2"
            >
              {/* City Selector */}
              <div className="flex items-center gap-1.5 px-3 py-2 text-slate-700 text-sm font-semibold border-b sm:border-b-0 sm:border-r border-slate-100 w-full sm:w-auto">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="bg-transparent text-slate-800 text-sm font-semibold focus:outline-hidden cursor-pointer"
                >
                  <option value="Sonipat">Sonipat</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Gurugram">Gurugram</option>
                  <option value="Noida">Noida</option>
                </select>
              </div>

              {/* Input text */}
              <div className="flex-1 flex items-center gap-2 px-3 w-full">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="What do you need to rent? (e.g. Sony Camera, PS5, Bicycle)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden py-1.5"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl sm:rounded-full text-sm shadow-md shadow-emerald-600/30 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Search</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Example Searches */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 text-xs text-slate-500">
              <span className="font-semibold text-slate-400 mr-1">Trending:</span>
              {EXAMPLE_SEARCHES.map((term) => (
                <button
                  key={term}
                  onClick={() => handlePillClick(term)}
                  className="bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 px-2.5 py-1 rounded-full transition-colors border border-slate-200/60"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          {/* Hero Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/browse"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl text-sm shadow-md shadow-emerald-600/25 transition-all transform hover:-translate-y-0.5"
            >
              Find Something to Rent
            </Link>
            <Link
              href="/list-product"
              className="bg-white hover:bg-slate-50 text-slate-800 font-bold px-6 py-3 rounded-xl text-sm border border-slate-200 shadow-xs hover:border-slate-300 transition-all transform hover:-translate-y-0.5"
            >
              List Your Product
            </Link>
          </div>
        </div>
      </section>

      {/* 2. POPULAR CATEGORIES */}
      <section className="py-16 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
                Explore by Category
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Popular Categories
              </h2>
            </div>
            <Link
              href="/categories"
              className="hidden sm:flex items-center gap-1 text-sm font-bold text-emerald-600 hover:text-emerald-700"
            >
              <span>View All Categories</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>

          <div className="mt-6 text-center sm:hidden">
            <Link
              href="/categories"
              className="inline-flex items-center gap-1 text-sm font-bold text-emerald-600"
            >
              <span>View All Categories</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS */}
      <section className="py-16 bg-slate-50/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
                Hyperlocal Near You
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Featured Listings
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Verified high-quality gear available for rent in Sonipat and NCR right now.
              </p>
            </div>
            <Link
              href="/browse"
              className="hidden sm:flex items-center gap-1 text-sm font-bold text-emerald-600 hover:text-emerald-700"
            >
              <span>Explore All Listings</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredListings.map((listing) => (
              <ProductCard key={listing.id} listing={listing} />
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/browse"
              className="inline-flex items-center gap-2 bg-white border border-slate-300 text-slate-800 font-bold px-6 py-3 rounded-xl text-sm shadow-xs hover:bg-slate-50 hover:border-slate-400 transition-all"
            >
              <span>Browse All Marketplace Items</span>
              <ArrowRight className="w-4 h-4 text-emerald-600" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. HOW RENTIT WORKS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              Simple 4-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1">
              How RentIt Works
            </h2>
            <p className="text-slate-500 text-base mt-2">
              Renting from a neighbor is as easy as ordering food online.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="relative flex flex-col items-center text-center p-6 bg-slate-50 rounded-2xl border border-slate-100 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-black text-lg flex items-center justify-center mb-4 shadow-md shadow-emerald-600/30">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">1. Find</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Discover high-value products nearby in Sonipat. Filter by category, location, and daily price.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative flex flex-col items-center text-center p-6 bg-slate-50 rounded-2xl border border-slate-100 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-black text-lg flex items-center justify-center mb-4 shadow-md shadow-emerald-600/30">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">2. Request</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Select your start and end dates. See transparent price breakdowns and submit a request to the owner.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative flex flex-col items-center text-center p-6 bg-slate-50 rounded-2xl border border-slate-100 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-black text-lg flex items-center justify-center mb-4 shadow-md shadow-emerald-600/30">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">3. Use</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Coordinate convenient handover via built-in chat. Use the product for your shoot, project, or event.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative flex flex-col items-center text-center p-6 bg-slate-50 rounded-2xl border border-slate-100 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-black text-lg flex items-center justify-center mb-4 shadow-md shadow-emerald-600/30">
                4
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">4. Return</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Return the item safely on time. Security deposits are released and both parties exchange reviews.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHY RENTIT */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              The Peer-to-Peer Advantage
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mt-1">
              Why Choose RentIt?
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Transforming how our cities consume, share, and preserve valuable resources.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <PiggyBank className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Save Money</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Why pay ₹80,000 for a camera you use twice a year? Rent it for ₹500/day and keep your savings.
              </p>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Earn from Unused Gear</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Your drill machine, projector, or tent sitting idle in a closet can earn you ₹5,000 to ₹15,000 monthly.
              </p>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Rent Locally</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Pick up items directly from neighbors in Sector 14, Model Town, or Omaxe City with zero shipping fees.
              </p>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Recycle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Reduce Unnecessary Buying</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Join the circular economy. Decreasing manufacturing demand directly lowers carbon footprints and electronic waste.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. BOTTOM CTA */}
      <section className="py-20 bg-gradient-to-tr from-emerald-600 via-emerald-700 to-teal-700 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
            Have something sitting unused?
          </h2>
          <p className="mt-4 text-emerald-100 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            List it on RentIt in under 2 minutes. Start earning passive income from products you already own.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/list-product"
              className="bg-white hover:bg-emerald-50 text-emerald-800 font-extrabold px-8 py-3.5 rounded-2xl text-base shadow-xl transition-all transform hover:-translate-y-0.5 active:scale-95"
            >
              List Your Product Now
            </Link>
            <Link
              href="/how-it-works"
              className="bg-emerald-800/50 hover:bg-emerald-800/70 border border-white/20 text-white font-bold px-6 py-3.5 rounded-2xl text-base transition-all"
            >
              Learn How It Works
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
