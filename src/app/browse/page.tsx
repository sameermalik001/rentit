'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  RotateCcw,
  Sparkles,
  MapPin,
  Tag,
  ArrowUpDown,
} from 'lucide-react';
import { DataStore } from '@/lib/store';
import { Listing, Category } from '@/lib/types';
import { ProductCard } from '@/components/ProductCard';

function BrowseContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const queryParam = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || 'all';
  const cityParam = searchParams.get('city') || 'all';

  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedCity, setSelectedCity] = useState(cityParam);
  const [selectedCondition, setSelectedCondition] = useState('all');
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [sortBy, setSortBy] = useState<string>('newest');

  const [categories, setCategories] = useState<Category[]>([]);
  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    setCategories(DataStore.getCategories());
    setAllListings(DataStore.getListings());
    setIsLoading(false);
  }, []);

  // Sync from URL changes
  useEffect(() => {
    setSearchQuery(queryParam);
    setSelectedCategory(categoryParam);
    setSelectedCity(cityParam);
  }, [queryParam, categoryParam, cityParam]);

  // Real Filter & Search computation
  const filteredListings = useMemo(() => {
    return allListings.filter((listing) => {
      // Must be active listing
      if (listing.status !== 'active') return false;

      // Search across title, description, category, and city/locality
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = listing.title.toLowerCase().includes(q);
        const matchesDesc = listing.description.toLowerCase().includes(q);
        const matchesCategory = listing.category?.name.toLowerCase().includes(q);
        const matchesCity = listing.city.toLowerCase().includes(q);
        const matchesLocality = listing.locality.toLowerCase().includes(q);

        if (!matchesTitle && !matchesDesc && !matchesCategory && !matchesCity && !matchesLocality) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'all') {
        const catObj = categories.find(
          (c) =>
            c.slug.toLowerCase() === selectedCategory.toLowerCase() ||
            c.name.toLowerCase() === selectedCategory.toLowerCase() ||
            c.id === selectedCategory
        );
        if (catObj && listing.category_id !== catObj.id) {
          return false;
        }
      }

      // City filter
      if (selectedCity !== 'all') {
        if (listing.city.toLowerCase() !== selectedCity.toLowerCase()) {
          return false;
        }
      }

      // Condition filter
      if (selectedCondition !== 'all') {
        if (listing.condition !== selectedCondition) {
          return false;
        }
      }

      // Price range
      if (minPrice !== '' && listing.price_per_day < Number(minPrice)) {
        return false;
      }
      if (maxPrice !== '' && listing.price_per_day > Number(maxPrice)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.price_per_day - b.price_per_day;
      if (sortBy === 'price_desc') return b.price_per_day - a.price_per_day;
      if (sortBy === 'rating') return (b.owner?.rating || 0) - (a.owner?.rating || 0);
      // newest
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [
    allListings,
    searchQuery,
    selectedCategory,
    selectedCity,
    selectedCondition,
    minPrice,
    maxPrice,
    sortBy,
    categories,
  ]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedCity('all');
    setSelectedCondition('all');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('newest');
    router.push('/browse');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    if (selectedCity !== 'all') params.set('city', selectedCity);
    router.push(`/browse?${params.toString()}`);
  };

  return (
    <div className="bg-[#fbfcfd] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumbs & Title */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Browse Marketplace
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Find and rent high-value equipment from people nearby in your city.
            </p>
          </div>

          {/* Quick Search in Header */}
          <form onSubmit={handleSearchSubmit} className="relative max-w-md w-full">
            <input
              type="text"
              placeholder="Search camera, projector, ps5, bike..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white text-sm text-slate-900 placeholder-slate-400 pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-hidden shadow-xs"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </form>
        </div>

        {/* Filter bar toggles for mobile */}
        <div className="flex lg:hidden items-center justify-between bg-white p-3 rounded-2xl border border-slate-200 mb-6 shadow-xs">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="flex items-center gap-2 text-sm font-bold text-slate-700"
          >
            <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
            <span>Filters ({selectedCategory !== 'all' || selectedCity !== 'all' || minPrice !== '' || maxPrice !== '' ? 'Active' : 'All'})</span>
          </button>
          <div className="text-xs font-semibold text-slate-500">
            {filteredListings.length} products found
          </div>
        </div>

        {/* Layout: Sidebar Filters + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters Desktop */}
          <aside className={`lg:block ${showMobileFilters ? 'block' : 'hidden'} lg:col-span-1`}>
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-6 sticky top-24">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <Filter className="w-4 h-4 text-emerald-600" />
                  <span>Filters</span>
                </div>
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-emerald-600 font-semibold transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>

              {/* 1. Category Filter */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl p-2.5 focus:bg-white focus:border-emerald-500 focus:outline-hidden font-medium"
                >
                  <option value="all">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. City / Location */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                  Location / City
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl p-2.5 focus:bg-white focus:border-emerald-500 focus:outline-hidden font-medium"
                >
                  <option value="all">All Locations</option>
                  <option value="Sonipat">Sonipat</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Gurugram">Gurugram</option>
                  <option value="Noida">Noida</option>
                </select>
              </div>

              {/* 3. Price Range (₹/day) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                  Price Per Day (₹)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min ₹"
                    min="0"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl p-2 focus:bg-white focus:border-emerald-500 focus:outline-hidden"
                  />
                  <input
                    type="number"
                    placeholder="Max ₹"
                    min="0"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl p-2 focus:bg-white focus:border-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* 4. Product Condition */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                  Item Condition
                </label>
                <select
                  value={selectedCondition}
                  onChange={(e) => setSelectedCondition(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl p-2.5 focus:bg-white focus:border-emerald-500 focus:outline-hidden font-medium"
                >
                  <option value="all">Any Condition</option>
                  <option value="New">Brand New</option>
                  <option value="Like New">Like New</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                </select>
              </div>

              {/* Close button for mobile */}
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-xs lg:hidden"
              >
                Apply Filters
              </button>
            </div>
          </aside>

          {/* Product Listings Section */}
          <main className="lg:col-span-3">
            {/* Top Toolbar: Result count + Sort selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 mb-6 shadow-xs">
              <div className="text-sm font-semibold text-slate-700">
                Showing <span className="text-emerald-700 font-bold">{filteredListings.length}</span> verified listings
                {searchQuery && <span> for "{searchQuery}"</span>}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl px-3 py-1.5 focus:outline-hidden focus:border-emerald-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Top Rated Owners</option>
                </select>
              </div>
            </div>

            {/* Listings Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-2xl h-80 animate-pulse border border-slate-200 p-4">
                    <div className="bg-slate-200 h-44 rounded-xl mb-4" />
                    <div className="bg-slate-200 h-4 rounded-md w-3/4 mb-2" />
                    <div className="bg-slate-200 h-4 rounded-md w-1/2" />
                  </div>
                ))}
              </div>
            ) : filteredListings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.map((listing) => (
                  <ProductCard key={listing.id} listing={listing} />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs max-w-lg mx-auto my-8">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">No products found</h3>
                <p className="text-xs text-slate-500 mt-1 mb-6 leading-relaxed">
                  We couldn't find any rentals matching your search criteria. Try removing filters or searching for another item.
                </p>
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-md transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function BrowsePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500">Loading marketplace...</div>}>
      <BrowseContent />
    </Suspense>
  );
}
