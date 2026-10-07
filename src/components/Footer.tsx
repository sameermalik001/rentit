import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Recycle, HeartHandshake, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Core Value Banner */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-12 mb-12 border-b border-slate-800">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Hyperlocal First</h4>
              <p className="text-xs text-slate-400 mt-1">Discover items in your neighborhood. Fast handovers without shipping delays.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Safe & Verified</h4>
              <p className="text-xs text-slate-400 mt-1">Community peer ratings, security deposits, and structured rental agreements.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Recycle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Circular Economy</h4>
              <p className="text-xs text-slate-400 mt-1">Reduce consumer waste and carbon footprints by sharing unused tools and tech.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-semibold text-sm">Earn & Save</h4>
              <p className="text-xs text-slate-400 mt-1">Renters save up to 90% compared to buying. Owners earn recurring passive income.</p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Col */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shadow-xs">
                <img src="/logo-icon.png" alt="RentIt" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-white tracking-tight leading-none">
                  Rent<span className="text-emerald-400">It</span>
                </span>
                <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase mt-0.5">
                  Rent • Use • Return
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-400 max-w-sm mb-4">
              "Rent what you need. Don't buy what you won't."
              A peer-to-peer neighborhood rental marketplace connecting people with items sitting unused nearby.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Serving Sonipat, NCR & expanding nationwide.</span>
            </div>
          </div>

          {/* Col 1: Explore */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Marketplace</h5>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/browse" className="hover:text-emerald-400 transition-colors">Browse Products</Link></li>
              <li><Link href="/categories" className="hover:text-emerald-400 transition-colors">All Categories</Link></li>
              <li><Link href="/browse?category=cameras" className="hover:text-emerald-400 transition-colors">Cameras & Gear</Link></li>
              <li><Link href="/browse?category=gaming" className="hover:text-emerald-400 transition-colors">Gaming Consoles</Link></li>
              <li><Link href="/browse?category=tools" className="hover:text-emerald-400 transition-colors">DIY & Power Tools</Link></li>
            </ul>
          </div>

          {/* Col 2: For Owners */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-4">For Owners</h5>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/list-product" className="hover:text-emerald-400 transition-colors">List Your Item</Link></li>
              <li><Link href="/how-it-works" className="hover:text-emerald-400 transition-colors">Owner Earnings Guide</Link></li>
              <li><Link href="/dashboard/listings" className="hover:text-emerald-400 transition-colors">Listings Manager</Link></li>
              <li><Link href="/dashboard/requests" className="hover:text-emerald-400 transition-colors">Rental Requests</Link></li>
              <li><Link href="/help" className="hover:text-emerald-400 transition-colors">Security & Deposits</Link></li>
            </ul>
          </div>

          {/* Col 3: Company */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Company</h5>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/about" className="hover:text-emerald-400 transition-colors">About RentIt</Link></li>
              <li><Link href="/how-it-works" className="hover:text-emerald-400 transition-colors">How It Works</Link></li>
              <li><Link href="/help" className="hover:text-emerald-400 transition-colors">Help Center & FAQ</Link></li>
              <li><Link href="/admin" className="text-purple-400 hover:text-purple-300 transition-colors">Admin Portal</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            © {new Date().getFullYear()} RentIt Marketplace. Built for Entrepreneurship & Community Commerce.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/help" className="hover:text-slate-400">Terms of Service</Link>
            <Link href="/help" className="hover:text-slate-400">Privacy Policy</Link>
            <Link href="/help" className="hover:text-slate-400">Community Safety</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
