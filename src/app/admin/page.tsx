'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Shield,
  Users,
  Package,
  Layers,
  FileText,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Settings,
  Lock,
  ArrowLeft,
  Search,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { DataStore } from '@/lib/store';
import { Profile, Listing, Rental, Report, AdminSettings } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function AdminDashboardPage() {
  const { user, switchDemoUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'listings' | 'reports' | 'settings'>('overview');
  const [stats, setStats] = useState<any>(null);
  const [usersList, setUsersList] = useState<Profile[]>([]);
  const [listingsList, setListingsList] = useState<Listing[]>([]);
  const [reportsList, setReportsList] = useState<Report[]>([]);
  const [adminSettings, setAdminSettings] = useState<AdminSettings | null>(null);

  // Settings form state
  const [commissionInput, setCommissionInput] = useState<number>(10);
  const [supportEmailInput, setSupportEmailInput] = useState<string>('support@rentit.marketplace');
  const [settingsSaved, setSettingsSaved] = useState(false);

  const loadAdminData = () => {
    setStats(DataStore.getAdminStats());
    setUsersList(DataStore.getProfiles());
    setListingsList(DataStore.getListings());
    setReportsList(DataStore.getReports());
    const settings = DataStore.getAdminSettings();
    setAdminSettings(settings);
    setCommissionInput(settings.platform_commission_percent);
    setSupportEmailInput(settings.contact_support_email);
  };

  useEffect(() => {
    loadAdminData();
  }, [user]);

  // TEST 8: Strict Role-based authorization
  const isAdmin = user && user.role === 'admin';

  if (!isAdmin) {
    return (
      <div className="bg-[#fbfcfd] min-h-[80vh] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl border border-red-200 p-8 max-w-md w-full text-center shadow-lg space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Admin Access Denied</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            You do not have administrative privileges to access this control portal. This area is strictly reserved for RentIt Platform Administrators.
          </p>

          <div className="pt-2 p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-500">
            Current user: <strong>{user ? `${user.full_name} (${user.role})` : 'Anonymous Guest'}</strong>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => switchDemoUser('admin')}
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              Switch to Platform Admin Demo Role
            </button>
            <Link
              href="/dashboard"
              className="w-full py-2.5 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50"
            >
              Return to User Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleDeleteListing = (listingId: string) => {
    if (confirm('Admin Action: Delete this listing from RentIt?')) {
      DataStore.deleteListing(listingId, user.id);
      loadAdminData();
    }
  };

  const handleResolveReport = (reportId: string, status: Report['status']) => {
    DataStore.updateReportStatus(reportId, status, 'Reviewed and resolved by platform administrator');
    loadAdminData();
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    DataStore.updateAdminSettings({
      platform_commission_percent: Number(commissionInput),
      contact_support_email: supportEmailInput.trim(),
    });
    setSettingsSaved(true);
    loadAdminData();
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  return (
    <div className="bg-[#fbfcfd] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Admin Header */}
        <div className="bg-gradient-to-r from-purple-900 via-slate-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-400">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-purple-300 uppercase tracking-widest block">
                Security Level 1 • Root Control
              </span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                RentIt Admin Command Center
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="bg-purple-800/60 border border-purple-700 text-purple-200 text-xs font-bold px-3 py-1 rounded-full">
              Logged in as Admin
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200/90 shadow-2xs overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview & Revenue', icon: TrendingUp },
            { id: 'users', label: `Users (${usersList.length})`, icon: Users },
            { id: 'listings', label: `Listings (${listingsList.length})`, icon: Package },
            { id: 'reports', label: `Reports (${reportsList.length})`, icon: AlertTriangle },
            { id: 'settings', label: 'Platform Settings', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  active
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW & STATS */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Users</span>
                <span className="text-2xl font-black text-slate-900 mt-1 block">{stats.totalUsers}</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Listings</span>
                <span className="text-2xl font-black text-slate-900 mt-1 block">{stats.totalListings}</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Active Listings</span>
                <span className="text-2xl font-black text-emerald-600 mt-1 block">{stats.activeListings}</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Requests</span>
                <span className="text-2xl font-black text-slate-900 mt-1 block">{stats.totalRequests}</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Completed Rentals</span>
                <span className="text-2xl font-black text-blue-600 mt-1 block">{stats.completedRentals}</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-purple-200 bg-purple-50/20 shadow-2xs">
                <span className="text-[11px] font-bold text-purple-600 uppercase tracking-wider block">Platform Revenue</span>
                <span className="text-2xl font-black text-purple-700 mt-1 block">{formatCurrency(stats.platformRevenue)}</span>
              </div>
            </div>

            {/* Financial Commission Breakdown */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-base">Platform Monetization & Commission Model</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                RentIt generates revenue by taking a <strong>{stats.commissionPercent}% platform commission</strong> on successful completed rentals. The remainder is automatically settled with the product owner.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-xs text-slate-500 block">Gross Rental Volume</span>
                  <span className="text-xl font-black text-slate-900 mt-1 block">
                    {formatCurrency(stats.totalRentalVolume)}
                  </span>
                </div>
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <span className="text-xs text-emerald-700 block">Owner Payouts (90%)</span>
                  <span className="text-xl font-black text-emerald-800 mt-1 block">
                    {formatCurrency(Math.round(stats.totalRentalVolume * 0.9))}
                  </span>
                </div>
                <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100">
                  <span className="text-xs text-purple-700 block">RentIt Net Commission ({stats.commissionPercent}%)</span>
                  <span className="text-xl font-black text-purple-800 mt-1 block">
                    {formatCurrency(stats.platformRevenue)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: USERS MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Registered Users</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="p-4">User</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Rating</th>
                    <th className="p-4">Joined</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/50">
                      <td className="p-4 flex items-center gap-3">
                        <img
                          src={u.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'}
                          alt=""
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-bold text-slate-900">{u.full_name}</div>
                          <div className="text-[11px] text-slate-400">{u.email}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                            u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4 text-slate-600 font-medium">
                        {u.locality}, {u.city}
                      </td>
                      <td className="p-4 text-slate-700 font-bold">
                        ⭐ {u.rating} ({u.total_ratings})
                      </td>
                      <td className="p-4 text-slate-400">{formatDate(u.created_at)}</td>
                      <td className="p-4">
                        <Link
                          href={`/profile/${u.id}`}
                          className="text-emerald-600 hover:text-emerald-700 font-bold"
                        >
                          View Profile
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: LISTINGS MODERATION */}
        {activeTab === 'listings' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base">All Marketplace Listings</h3>
              <span className="text-xs text-slate-400">{listingsList.length} items total</span>
            </div>
            <div className="divide-y divide-slate-100">
              {listingsList.map((item) => (
                <div key={item.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.images?.[0] || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=150&q=80'}
                      alt=""
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">{item.title}</h4>
                      <p className="text-[11px] text-slate-500">
                        {formatCurrency(item.price_per_day)}/day • Owner: {item.owner?.full_name} • {item.city}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                        item.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.status}
                    </span>
                    <Link
                      href={`/product/${item.id}`}
                      className="text-xs font-semibold text-slate-600 hover:text-emerald-600"
                    >
                      Inspect
                    </Link>
                    <button
                      onClick={() => handleDeleteListing(item.id)}
                      className="text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 p-1.5 rounded-lg"
                      title="Remove Listing"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: REPORTS & TRUST */}
        {activeTab === 'reports' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Community Trust & Safety Reports</h3>
            {reportsList.length > 0 ? (
              <div className="space-y-3">
                {reportsList.map((rep) => (
                  <div key={rep.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-red-700 bg-red-100 px-2 py-0.5 rounded-md">
                        {rep.reason}
                      </span>
                      <span className="text-[10px] text-slate-400">{formatDate(rep.created_at)}</span>
                    </div>
                    {rep.details && <p className="text-xs text-slate-600">{rep.details}</p>}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                      <span className="text-slate-500">Status: <strong className="text-slate-800">{rep.status}</strong></span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleResolveReport(rep.id, 'resolved')}
                          className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg font-bold text-[11px]"
                        >
                          Mark Resolved
                        </button>
                        <button
                          onClick={() => handleResolveReport(rep.id, 'dismissed')}
                          className="px-2.5 py-1 border border-slate-200 text-slate-600 rounded-lg text-[11px]"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-6 text-center">No reports filed yet. The community is clean!</p>
            )}
          </div>
        )}

        {/* TAB 5: ADMIN SETTINGS */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs max-w-xl">
            <h3 className="font-bold text-slate-900 text-base mb-1">Marketplace Platform Settings</h3>
            <p className="text-xs text-slate-500 mb-6">
              Adjust commission percentage and platform-wide parameters without code deployments.
            </p>

            {settingsSaved && (
              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Settings updated successfully!</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Platform Commission (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  required
                  value={commissionInput}
                  onChange={(e) => setCommissionInput(Number(e.target.value))}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-bold focus:bg-white focus:border-purple-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Support Email Address
                </label>
                <input
                  type="email"
                  required
                  value={supportEmailInput}
                  onChange={(e) => setSupportEmailInput(e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:border-purple-500 focus:outline-hidden"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                >
                  Save Platform Settings
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
