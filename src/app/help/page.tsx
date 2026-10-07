'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { HelpCircle, ChevronDown, ShieldCheck, Mail, MessageSquare } from 'lucide-react';

const FAQS = [
  {
    q: 'How do security deposits work on RentIt?',
    a: 'Owners set a refundable security deposit based on the value of their equipment. When a rental request is accepted, the deposit is recorded in escrow. Once the rental is safely returned and inspected, the deposit is promptly returned to the renter.',
  },
  {
    q: 'How does payment processing work?',
    a: 'In live deployment, RentIt connects to real payment gateways like Stripe/Razorpay. In development mode, mock payments are logged to the database with platform fee calculations (10% platform fee, 90% owner payout) and marked as uncharged development transactions.',
  },
  {
    q: 'What if an item is returned damaged or not working?',
    a: 'We advise both parties to inspect the gear together at handover. If damage occurs during the rental period, the owner can file a dispute or deduct repair costs from the security deposit through the RentIt Resolution Center.',
  },
  {
    q: 'How do I know if an owner or renter is trustworthy?',
    a: 'Every user has a public profile displaying their average star rating, total completed rentals, and verified neighborhood badges. Reviews can only be submitted after a verified, completed rental.',
  },
  {
    q: 'Can I cancel a rental request?',
    a: 'Renters can cancel any request that has not yet been accepted by the owner with zero penalties. Once accepted, please communicate promptly with the owner via built-in chat.',
  },
];

export default function HelpPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="bg-[#fbfcfd] min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">
            Help & Trust Center
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2">
            Frequently Asked Questions
          </h1>
          <p className="mt-2 text-xs text-slate-500">
            Everything you need to know about peer-to-peer renting, security deposits, and safe handovers.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="bg-white rounded-3xl border border-slate-200/90 divide-y divide-slate-100 shadow-xs overflow-hidden">
          {FAQS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="p-6">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left flex items-center justify-between font-bold text-slate-900 text-sm focus:outline-hidden"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      isOpen ? 'transform rotate-180 text-emerald-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="mt-3 text-xs text-slate-600 leading-relaxed animate-in fade-in duration-200">
                    {item.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Contact box */}
        <div className="bg-emerald-50 rounded-3xl border border-emerald-200 p-6 text-center space-y-2">
          <Mail className="w-8 h-8 text-emerald-600 mx-auto" />
          <h3 className="font-bold text-slate-900 text-sm">Need direct assistance?</h3>
          <p className="text-xs text-slate-600">
            Reach our community support team at <strong>support@rentit.marketplace</strong>
          </p>
          <div className="pt-2">
            <Link
              href="/dashboard/messages"
              className="inline-block bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-xl"
            >
              Open Direct Messages
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
