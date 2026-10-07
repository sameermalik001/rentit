'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Layers, Sparkles } from 'lucide-react';
import { DataStore } from '@/lib/store';
import { Category } from '@/lib/types';
import { CategoryCard } from '@/components/CategoryCard';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    setCategories(DataStore.getCategories());
  }, []);

  return (
    <div className="bg-[#fbfcfd] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full mb-3 border border-emerald-200">
            <Layers className="w-3.5 h-3.5" />
            <span>Marketplace Catalog</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Browse by Category
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Explore thousands of items available for rent across diverse categories in Sonipat and NCR.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>

        {/* Bottom Callout */}
        <div className="mt-16 bg-white rounded-3xl p-8 border border-slate-200 text-center max-w-3xl mx-auto shadow-xs">
          <h3 className="text-xl font-bold text-slate-900">
            Don't see what you're looking for?
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto mb-6">
            Search our entire catalog across all neighborhoods or post a rental inquiry to the community.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              href="/browse"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md transition-all"
            >
              Browse All Items
            </Link>
            <Link
              href="/list-product"
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-6 py-2.5 rounded-xl text-xs transition-all"
            >
              List an Item
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
