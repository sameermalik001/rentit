'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  MapPin,
  Calendar,
  Star,
  CheckCircle2,
  Package,
  MessageSquare,
  ShieldCheck,
  Edit,
  ArrowLeft,
} from 'lucide-react';
import { DataStore } from '@/lib/store';
import { Profile, Listing, Review } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';
import { ProductCard } from '@/components/ProductCard';
import { formatDate } from '@/lib/utils';

export default function UserProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const userId = resolvedParams.id;
  const router = useRouter();
  const { user: currentUser } = useAuth();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [userListings, setUserListings] = useState<Listing[]>([]);
  const [userReviews, setUserReviews] = useState<Review[]>([]);

  useEffect(() => {
    const p = DataStore.getProfileById(userId);
    if (p) {
      setProfile(p);
      const listings = DataStore.getListings().filter((l) => l.owner_id === userId && l.status === 'active');
      setUserListings(listings);
      const reviews = DataStore.getReviewsForUser(userId);
      setUserReviews(reviews);
    }
  }, [userId]);

  if (!profile) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center">
        <h2 className="text-xl font-bold text-slate-900">User Profile Not Found</h2>
        <Link
          href="/browse"
          className="mt-4 inline-block bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-xl"
        >
          Return to Marketplace
        </Link>
      </div>
    );
  }

  const isMe = currentUser?.id === profile.id;

  const handleStartMessage = () => {
    if (!currentUser) {
      router.push('/login');
      return;
    }
    const conv = DataStore.getOrCreateConversation('', currentUser.id, profile.id);
    router.push(`/dashboard/messages?conv=${conv.id}`);
  };

  return (
    <div className="bg-[#fbfcfd] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Back Link */}
        <Link
          href="/browse"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Marketplace</span>
        </Link>

        {/* Profile Card Header */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <img
              src={
                profile.avatar_url ||
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'
              }
              alt={profile.full_name}
              className="w-24 h-24 rounded-3xl object-cover ring-4 ring-emerald-500/20 shadow-md"
            />
            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl font-black text-slate-900">{profile.full_name}</h1>
                {profile.is_verified && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Verified Neighbor
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-500 mt-2">
                <span className="flex items-center gap-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  {profile.locality}, {profile.city}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-semibold text-slate-700 bg-amber-50 px-2 py-0.5 rounded-md">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  {profile.rating} ({profile.total_ratings} reviews)
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Member since {formatDate(profile.created_at)}
                </span>
              </div>

              {profile.bio && (
                <p className="text-xs text-slate-600 mt-3 max-w-xl leading-relaxed">
                  {profile.bio}
                </p>
              )}
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-center md:justify-end gap-2 shrink-0">
            {isMe ? (
              <Link
                href="/profile/edit"
                className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-4 py-2.5 rounded-xl transition-colors"
              >
                <Edit className="w-4 h-4" />
                <span>Edit Profile</span>
              </Link>
            ) : (
              <button
                onClick={handleStartMessage}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Send Message</span>
              </button>
            )}
          </div>
        </div>

        {/* User's Listings Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-slate-900">
              Active Listings ({userListings.length})
            </h2>
          </div>

          {userListings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {userListings.map((listing) => (
                <ProductCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 text-center border border-slate-200">
              <p className="text-xs text-slate-500">No active listings available right now.</p>
            </div>
          )}
        </div>

        {/* User's Reviews Section */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-slate-900">
            Community Feedback ({userReviews.length})
          </h2>

          {userReviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userReviews.map((rev) => (
                <div key={rev.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={rev.reviewer?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                        alt=""
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <span className="font-bold text-slate-900 text-xs">
                        {rev.reviewer?.full_name || 'Neighbor'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                  <span className="text-[10px] text-slate-400 block">{formatDate(rev.created_at)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400">No reviews yet for this user.</p>
          )}
        </div>
      </div>
    </div>
  );
}
