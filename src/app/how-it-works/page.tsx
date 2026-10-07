import React from 'react';
import Link from 'next/link';
import {
  Search,
  Calendar,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  DollarSign,
  ArrowRight,
  CheckCircle2,
  Lock,
  Layers,
} from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="bg-[#fbfcfd] min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
            Rent • Use • Return
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight mt-2">
            How RentIt Works
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            RentIt connects you with neighbors who own gear you need temporarily. Renting saves money, reduces carbon footprints, and lets you access premium tools without buying.
          </p>
        </div>

        {/* Section 1: For Renters */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-xs space-y-8">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
              1
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">For Renters: Rent in 4 Simple Steps</h2>
              <p className="text-xs text-slate-500">Access cameras, projectors, gaming consoles, bikes, and tools nearby</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                A
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Find Your Product</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Filter by category, city, locality, and price. View detailed photos, condition, and owner ratings.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                B
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Select Dates & Request</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Choose start and end dates. The system instantly calculates rental fees, platform fee, and refundable deposit.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                C
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Coordinate Handover</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Once the owner accepts, coordinate handover timing via built-in chat. Verify the item condition together.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                D
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Return & Review</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Return the equipment in agreed condition. Deposits are released and both parties leave verified community ratings.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: For Owners */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-xs space-y-8">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-black">
              2
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">For Owners: Monetize Unused Gear</h2>
              <p className="text-xs text-slate-500">Turn items sitting in closets or garages into steady passive income</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-sm">List in 2 Minutes</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Take a few photos, set your daily rate and security deposit, and define your personal rental rules.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Review Requests</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                You have full control. Review the prospective renter's profile and message before choosing to accept or decline.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Meet & Hand Over</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Hand over the gear at a convenient nearby location or your doorstep. Check the item together.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                4
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Get Paid (90%)</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Upon safe return, the rental is marked complete and your earnings are credited with low 10% platform fee.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Commission & Economics */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl space-y-4">
          <div className="max-w-2xl">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
              Business Model & Transparency
            </span>
            <h2 className="text-2xl font-black tracking-tight mt-1">
              Transparent Pricing: How RentIt Earns
            </h2>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              We believe in simple, honest incentives. RentIt only earns when our community successfully completes a rental.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
              <span className="text-xs text-slate-400 block">Example Rental</span>
              <span className="text-2xl font-black text-white mt-1 block">₹1,000</span>
              <span className="text-[11px] text-slate-400">e.g. 2 days @ ₹500/day</span>
            </div>

            <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
              <span className="text-xs text-purple-400 block">RentIt Commission (10%)</span>
              <span className="text-2xl font-black text-purple-300 mt-1 block">₹100</span>
              <span className="text-[11px] text-slate-400">Covers platform, hosting & support</span>
            </div>

            <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700">
              <span className="text-xs text-emerald-400 block">Owner Payout (90%)</span>
              <span className="text-2xl font-black text-emerald-400 mt-1 block">₹900</span>
              <span className="text-[11px] text-slate-400">Directly into owner account</span>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center pt-4">
          <Link
            href="/browse"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3.5 rounded-2xl text-sm shadow-md transition-all"
          >
            <span>Start Exploring Gear Near You</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
