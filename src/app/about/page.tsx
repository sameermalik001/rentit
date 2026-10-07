import React from 'react';
import Link from 'next/link';
import { Sparkles, Recycle, ShieldCheck, HeartHandshake, MapPin } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-[#fbfcfd] min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
            About RentIt
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mt-2">
            The Hyperlocal Rental Revolution
          </h1>
          <p className="mt-4 text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            "Rent what you need. Don't buy what you won't."
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-xs space-y-6 text-sm text-slate-600 leading-relaxed">
          <h2 className="text-xl font-bold text-slate-900">Our Story & Entrepreneurial Thesis</h2>
          <p>
            In modern households across urban and university towns like Sonipat and Delhi NCR, high-value consumer goods sit idle for over 95% of their useful life. A DSLR camera is used during a rare weekend vacation; an impact drill is used for 15 minutes once every two years; a projector gathers dust in a wardrobe.
          </p>
          <p>
            At the same time, college students, freelancers, hobbyists, and families frequently need these tools for short periods—yet are forced either to compromise or spend massive amounts purchasing them brand-new.
          </p>
          <p>
            <strong>RentIt</strong> was founded to solve this misallocation of valuable neighborhood resources. By establishing verified peer-to-peer connections, transparent security deposits, and real-time hyperlocal discovery, RentIt transforms idle physical assets into revenue-generating community capital.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Recycle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Circular Sharing Economy</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every rental directly prevents duplicate manufacturing, packaging waste, and electronic disposal. We believe in maximizing the utility of existing products.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Trust by Design</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Peer ratings, transparent security deposits, verified phone numbers, and moderation controls guarantee safety for both owners and renters.
            </p>
          </div>
        </div>

        <div className="text-center pt-6">
          <Link
            href="/browse"
            className="inline-block bg-emerald-600 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md"
          >
            Explore the Marketplace
          </Link>
        </div>
      </div>
    </div>
  );
}
