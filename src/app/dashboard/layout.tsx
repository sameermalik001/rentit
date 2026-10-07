'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Compass,
  Package,
  CalendarCheck,
  Inbox,
  MessageSquare,
  Bell,
  User,
  Shield,
  PlusCircle,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const { unreadCount } = useNotifications();

  const navItems = [
    { label: 'Overview', href: '/dashboard', icon: Compass },
    { label: 'My Listings', href: '/dashboard/listings', icon: Package },
    { label: 'My Rentals', href: '/dashboard/rentals', icon: CalendarCheck },
    { label: 'Rental Requests', href: '/dashboard/requests', icon: Inbox },
    { label: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
    {
      label: 'Notifications',
      href: '/dashboard/notifications',
      icon: Bell,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    { label: 'Edit Profile', href: '/profile/edit', icon: User },
  ];

  return (
    <div className="bg-[#fbfcfd] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs sticky top-24 space-y-6">
              {/* User Greeting */}
              <div className="flex items-center gap-3 pb-5 border-b border-slate-100">
                <img
                  src={
                    user?.avatar_url ||
                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
                  }
                  alt={user?.full_name || 'User'}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-emerald-500/20"
                />
                <div className="overflow-hidden">
                  <div className="text-xs text-slate-400 font-semibold">Welcome back,</div>
                  <h3 className="font-extrabold text-slate-900 text-sm truncate">
                    {user?.full_name || 'Guest'}
                  </h3>
                  <div className="text-[11px] font-bold text-emerald-600 truncate">
                    {user?.city || 'Sonipat'}
                  </div>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        active
                          ? 'bg-emerald-50 text-emerald-800 font-extrabold shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={`w-4 h-4 ${
                            active ? 'text-emerald-600' : 'text-slate-400'
                          }`}
                        />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span className="bg-emerald-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-black">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}

                {user?.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-purple-700 bg-purple-50/80 hover:bg-purple-100 transition-colors mt-2"
                  >
                    <Shield className="w-4 h-4 text-purple-600" />
                    <span>Admin Control Portal</span>
                  </Link>
                )}
              </nav>

              {/* Quick CTA */}
              <div className="pt-4 border-t border-slate-100">
                <Link
                  href="/list-product"
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>List New Product</span>
                </Link>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-3">{children}</main>
        </div>
      </div>
    </div>
  );
}
