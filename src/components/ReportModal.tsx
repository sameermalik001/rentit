'use client';

import React, { useState } from 'react';
import { X, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { DataStore } from '@/lib/store';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportedListingId?: string;
  reportedUserId?: string;
  targetName: string;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  reportedListingId,
  reportedUserId,
  targetName,
}) => {
  const { user } = useAuth();
  const [reason, setReason] = useState('Inaccurate description or counterfeit item');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!user) {
      setErrorMsg('You must be logged in to file a report.');
      return;
    }

    DataStore.createReport({
      reporter_id: user.id,
      reported_listing_id: reportedListingId,
      reported_user_id: reportedUserId,
      reason,
      details: details.trim() || undefined,
    });

    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-red-50/50">
          <div className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h3 className="font-bold text-base">Report to RentIt Trust & Safety</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {submitted ? (
            <div className="text-center py-6 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h4 className="text-lg font-bold text-slate-900">Report Received</h4>
              <p className="text-xs text-slate-600">
                Our trust & safety team will review this report within 24 hours. Thank you for keeping RentIt safe.
              </p>
              <button
                onClick={onClose}
                className="mt-4 w-full py-2.5 bg-slate-900 text-white font-semibold rounded-xl text-sm"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs text-slate-500">
                Reporting: <strong className="text-slate-800">{targetName}</strong>
              </p>

              {errorMsg && (
                <div className="p-2.5 bg-red-50 text-red-700 text-xs rounded-xl">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Reason for Report
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:bg-white focus:border-red-500 focus:outline-hidden"
                >
                  <option value="Inaccurate description or counterfeit item">Inaccurate description or counterfeit item</option>
                  <option value="Prohibited or hazardous item">Prohibited or hazardous item</option>
                  <option value="Suspected fraud or scam">Suspected fraud or scam</option>
                  <option value="Unresponsive or abusive communication">Unresponsive or abusive communication</option>
                  <option value="Damaged equipment delivered">Damaged equipment delivered</option>
                  <option value="Other concern">Other concern</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Additional Details
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Please provide specific context or evidence..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:bg-white focus:border-red-500 focus:outline-hidden"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 border border-slate-200 text-slate-700 font-semibold text-sm rounded-xl hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl shadow-md transition-all"
                >
                  Submit Report
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
