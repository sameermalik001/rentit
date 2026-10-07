import React from 'react';
import Link from 'next/link';
import { MapPin, Star, ShieldCheck, Clock } from 'lucide-react';
import { Listing } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

interface ProductCardProps {
  listing: Listing;
}

export const ProductCard: React.FC<ProductCardProps> = ({ listing }) => {
  const primaryImage = listing.images?.[0] || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80';
  const ownerName = listing.owner?.full_name || 'Verified Owner';
  const ownerRating = listing.owner?.rating || 4.9;
  const isAvailable = listing.status === 'active';

  return (
    <Link
      href={`/product/${listing.id}`}
      className="group flex flex-col bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all duration-300 transform hover:-translate-y-1"
    >
      {/* Image Thumbnail & Badges */}
      <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
        <img
          src={primaryImage}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Condition & Category Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-xs">
            {listing.condition}
          </span>
          {listing.category && (
            <span className="bg-emerald-600/90 backdrop-blur-md text-white text-[11px] font-semibold px-2 py-0.5 rounded-full shadow-xs">
              {listing.category.name}
            </span>
          )}
        </div>

        {/* Status Pill */}
        <div className="absolute top-3 right-3">
          {isAvailable ? (
            <span className="bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-xs">
              Available
            </span>
          ) : (
            <span className="bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-xs">
              {listing.status}
            </span>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Location & Rating row */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="flex items-center gap-1 font-medium truncate max-w-[160px]">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              {listing.locality}, {listing.city}
            </span>
            <span className="flex items-center gap-1 text-slate-700 font-semibold bg-amber-50 px-1.5 py-0.5 rounded-md text-[11px]">
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
              {ownerRating}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-slate-900 text-base line-clamp-2 group-hover:text-emerald-700 transition-colors">
            {listing.title}
          </h3>

          {/* Security Deposit notice */}
          {listing.security_deposit > 0 && (
            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              Deposit: {formatCurrency(listing.security_deposit)} (Refundable)
            </p>
          )}
        </div>

        {/* Bottom Price & Owner Row */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={listing.owner?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
              alt={ownerName}
              className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200"
            />
            <span className="text-xs text-slate-600 font-medium truncate max-w-[90px]">
              {ownerName.split(' ')[0]}
            </span>
          </div>

          <div className="text-right">
            <span className="text-lg font-black text-emerald-600">
              {formatCurrency(listing.price_per_day)}
            </span>
            <span className="text-xs text-slate-400 font-medium"> / day</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
