'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, Save, ArrowLeft, CheckCircle2, AlertCircle, UploadCloud } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function EditProfilePage() {
  const router = useRouter();
  const { user, updateProfile } = useAuth();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [locality, setLocality] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || '');
      setPhone(user.phone || '');
      setCity(user.city || 'Sonipat');
      setLocality(user.locality || 'Sector 14');
      setBio(user.bio || '');
      setAvatarUrl(user.avatar_url || '');
    }
  }, [user]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setAvatarUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim()) {
      setErrorMsg('Full name is required');
      return;
    }

    setSaving(true);
    const res = await updateProfile({
      full_name: fullName.trim(),
      phone: phone.trim(),
      city: city.trim(),
      locality: locality.trim(),
      bio: bio.trim(),
      avatar_url: avatarUrl.trim() || undefined,
    });

    setSaving(false);
    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        if (user) router.push(`/profile/${user.id}`);
      }, 1200);
    } else {
      setErrorMsg(res.error || 'Failed to update profile');
    }
  };

  if (!user) {
    return (
      <div className="bg-white rounded-3xl p-10 text-center border border-slate-200">
        <p className="text-slate-500 text-sm">Please log in to edit your profile.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#fbfcfd] min-h-screen py-10">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href={`/profile/${user.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Profile</span>
          </Link>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
          <h1 className="text-2xl font-black text-slate-900 mb-1">Edit Profile</h1>
          <p className="text-xs text-slate-500 mb-6">
            Keep your contact information and neighborhood details updated for seamless handovers.
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
              <span>Profile updated successfully! Redirecting...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Avatar Row */}
            <div className="flex items-center gap-4">
              <img
                src={
                  avatarUrl ||
                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
                }
                alt="Avatar"
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500/20"
              />
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  placeholder="Paste profile photo URL..."
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-hidden"
                />
                <label className="cursor-pointer inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-lg border border-emerald-200 transition-colors">
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>Upload from Device</span>
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            </div>

            {/* Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 font-medium focus:bg-white focus:border-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 font-medium focus:bg-white focus:border-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* City & Locality */}
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

            {/* Bio */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                About You / Bio
              </label>
              <textarea
                rows={3}
                placeholder="Share a bit about your hobbies, photography gear, DIY projects, or rental experience..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 font-medium focus:bg-white focus:border-emerald-500 focus:outline-hidden"
              />
            </div>

            {/* Actions */}
            <div className="pt-4 flex gap-3">
              <Link
                href={`/profile/${user.id}`}
                className="flex-1 py-3 border border-slate-200 text-slate-700 font-bold text-sm rounded-xl text-center hover:bg-slate-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Profile'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
