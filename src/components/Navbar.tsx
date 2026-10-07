'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Compass,
  PlusCircle,
  Bell,
  MessageSquare,
  User,
  Shield,
  LogOut,
  Menu,
  X,
  Search,
  Layers,
  HelpCircle,
  Package,
  CalendarCheck,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, switchDemoUser, isSupabaseLive } = useAuth();
  const { unreadCount } = useNotifications();

  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [demoSwitchOpen, setDemoSwitchOpen] = useState(false);
  const [navSearch, setNavSearch] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNavSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (navSearch.trim()) {
      router.push(`/browse?q=${encodeURIComponent(navSearch.trim())}`);
      setNavSearch('');
    }
  };

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Demo Bar / Mode Indicator */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium text-slate-300">
              RentIt Hyperlocal Network: Sonipat & NCR
            </span>
            <span className="hidden sm:inline-block text-slate-500">|</span>
            <span className="hidden sm:inline-block text-slate-400">
              {isSupabaseLive ? '⚡ Live Supabase Connected' : '🚀 Demo / Local Store Mode (Ready for Supabase keys)'}
            </span>
          </div>

          {/* Quick Demo Switcher */}
          <div className="relative">
            <button
              onClick={() => setDemoSwitchOpen(!demoSwitchOpen)}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 px-2.5 py-0.5 rounded-full transition-colors font-medium border border-slate-700"
              title="Switch user role instantly"
            >
              <span>Role:</span>
              <span className="text-white">
                {mounted && user
                  ? `${user.full_name.split(' ')[0]} (${user.role === 'admin' ? 'Admin' : user.id.includes('owner') ? 'Owner' : 'Renter'})`
                  : 'Guest'}
              </span>
              <span className="text-[10px]">▼</span>
            </button>

            {demoSwitchOpen && (
              <div
                className="absolute right-0 mt-1 w-64 bg-white text-slate-800 rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                onClick={() => setDemoSwitchOpen(false)}
              >
                <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Switch Persona (1-Click)
                </div>
                <button
                  onClick={() => switchDemoUser('renter')}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-emerald-50 flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-slate-900">Priya Patel (Renter)</div>
                    <div className="text-slate-500 text-[11px]">Can rent items & leave reviews</div>
                  </div>
                  {user?.email.includes('priya') && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </button>
                <button
                  onClick={() => switchDemoUser('owner')}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-emerald-50 flex items-center justify-between border-t border-slate-100"
                >
                  <div>
                    <div className="font-semibold text-slate-900">Rahul Sharma (Owner)</div>
                    <div className="text-slate-500 text-[11px]">Owns Camera, Projector, Tent</div>
                  </div>
                  {user?.email.includes('rahul') && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </button>
                <button
                  onClick={() => switchDemoUser('admin')}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-emerald-50 flex items-center justify-between border-t border-slate-100"
                >
                  <div>
                    <div className="font-semibold text-slate-900">Platform Admin</div>
                    <div className="text-slate-500 text-[11px]">Full access to /admin portal</div>
                  </div>
                  {user?.role === 'admin' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <img
                src="/logo-icon.png"
                alt="RentIt Logo"
                className="w-10 h-10 object-contain group-hover:scale-105 transition-transform"
              />
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                  Rent<span className="text-emerald-600">It</span>
                </span>
                <span className="text-[10px] -mt-1 font-bold text-slate-500 tracking-wider uppercase">
                  Rent • Use • Return
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 ml-4">
              <Link
                href="/browse"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/browse')
                    ? 'text-emerald-700 bg-emerald-50 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Browse
              </Link>
              <Link
                href="/categories"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/categories')
                    ? 'text-emerald-700 bg-emerald-50 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Categories
              </Link>
              <Link
                href="/how-it-works"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/how-it-works')
                    ? 'text-emerald-700 bg-emerald-50 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                How It Works
              </Link>
            </nav>
          </div>

          {/* Quick Search Bar in Navbar */}
          <form onSubmit={handleNavSearch} className="hidden lg:flex items-center relative max-w-xs w-full mx-4">
            <input
              type="text"
              placeholder="Search camera, bike, tools..."
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              className="w-full bg-slate-100/90 hover:bg-slate-100 focus:bg-white text-sm text-slate-900 placeholder-slate-400 pl-9 pr-4 py-2 rounded-full border border-transparent focus:border-emerald-500 focus:outline-hidden transition-all shadow-inner"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          </form>

          {/* Actions & User Area */}
          <div className="hidden md:flex items-center gap-3">
            {/* List Your Product CTA */}
            <Link
              href="/list-product"
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-sm shadow-emerald-600/30 hover:shadow-md transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>List Your Product</span>
            </Link>

            {mounted && user ? (
              <div className="flex items-center gap-2">
                {/* Notifications Button */}
                <Link
                  href="/dashboard/notifications"
                  className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </Link>

                {/* Messages Button */}
                <Link
                  href="/dashboard/messages"
                  className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                  title="Messages"
                >
                  <MessageSquare className="w-5 h-5" />
                </Link>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    <img
                      src={user.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                      alt={user.full_name}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/20"
                    />
                    <span className="text-sm font-semibold text-slate-800 max-w-[100px] truncate">
                      {user.full_name}
                    </span>
                    <span className="text-xs text-slate-400">▼</span>
                  </button>

                  {profileDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200/80 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                        <p className="text-sm font-bold text-slate-900 truncate">{user.full_name}</p>
                        <p className="text-xs text-emerald-600 font-medium truncate">{user.city}, {user.locality}</p>
                      </div>

                      <div className="py-1">
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-emerald-700 font-medium"
                        >
                          <Compass className="w-4 h-4 text-slate-400" />
                          Dashboard Overview
                        </Link>
                        <Link
                          href="/dashboard/listings"
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-emerald-700 font-medium"
                        >
                          <Package className="w-4 h-4 text-slate-400" />
                          My Listings
                        </Link>
                        <Link
                          href="/dashboard/rentals"
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-emerald-700 font-medium"
                        >
                          <CalendarCheck className="w-4 h-4 text-slate-400" />
                          My Rentals & Requests
                        </Link>
                        <Link
                          href={`/profile/${user.id}`}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-emerald-700 font-medium"
                        >
                          <User className="w-4 h-4 text-slate-400" />
                          Public Profile
                        </Link>
                        {user.role === 'admin' && (
                          <Link
                            href="/admin"
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-purple-700 bg-purple-50/70 hover:bg-purple-100 font-semibold"
                          >
                            <Shield className="w-4 h-4 text-purple-600" />
                            Admin Control Panel
                          </Link>
                        )}
                      </div>

                      <div className="border-t border-slate-100 pt-1">
                        <button
                          onClick={logout}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium text-left"
                        >
                          <LogOut className="w-4 h-4 text-red-500" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/list-product"
              className="bg-emerald-600 text-white p-2 rounded-xl text-xs font-semibold"
              title="List Product"
            >
              <PlusCircle className="w-4 h-4" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-xl"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          {/* Mobile Search */}
          <form onSubmit={handleNavSearch} className="relative">
            <input
              type="text"
              placeholder="Search listings..."
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              className="w-full bg-slate-100 text-sm text-slate-900 placeholder-slate-400 pl-9 pr-4 py-2.5 rounded-xl border border-transparent focus:border-emerald-500 focus:outline-hidden"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </form>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <Link
              href="/browse"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl text-sm font-medium text-slate-800"
            >
              <Compass className="w-4 h-4 text-emerald-600" />
              Browse
            </Link>
            <Link
              href="/categories"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl text-sm font-medium text-slate-800"
            >
              <Layers className="w-4 h-4 text-emerald-600" />
              Categories
            </Link>
            <Link
              href="/how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl text-sm font-medium text-slate-800"
            >
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              How It Works
            </Link>
            <Link
              href="/list-product"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2.5 bg-emerald-50 rounded-xl text-sm font-semibold text-emerald-700"
            >
              <PlusCircle className="w-4 h-4 text-emerald-600" />
              List Item
            </Link>
          </div>

          {mounted && user ? (
            <div className="border-t border-slate-100 pt-3 space-y-2">
              <div className="flex items-center gap-3 px-2 py-1">
                <img
                  src={user.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                  alt={user.full_name}
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div>
                  <div className="font-bold text-slate-900">{user.full_name}</div>
                  <div className="text-xs text-slate-500">{user.email}</div>
                </div>
              </div>

              <div className="flex flex-col gap-1 pt-2">
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50 font-medium flex items-center justify-between"
                >
                  <span>Dashboard</span>
                  <span className="text-slate-400">→</span>
                </Link>
                <Link
                  href="/dashboard/listings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50 font-medium flex items-center justify-between"
                >
                  <span>My Listings</span>
                  <span className="text-slate-400">→</span>
                </Link>
                <Link
                  href="/dashboard/rentals"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50 font-medium flex items-center justify-between"
                >
                  <span>My Rentals & Requests</span>
                  <span className="text-slate-400">→</span>
                </Link>
                <Link
                  href="/dashboard/messages"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50 font-medium flex items-center justify-between"
                >
                  <span>Messages</span>
                  <span className="text-slate-400">→</span>
                </Link>
                <Link
                  href="/dashboard/notifications"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-50 font-medium flex items-center justify-between"
                >
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <span className="bg-emerald-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                      {unreadCount}
                    </span>
                  )}
                </Link>
                {user.role === 'admin' && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 rounded-lg text-sm text-purple-700 bg-purple-50 font-bold flex items-center justify-between"
                  >
                    <span>Admin Control Center</span>
                    <Shield className="w-4 h-4 text-purple-600" />
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 font-semibold"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div className="border-t border-slate-100 pt-3 flex gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2.5 border border-slate-300 rounded-xl text-sm font-semibold text-slate-800"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold shadow-sm"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
