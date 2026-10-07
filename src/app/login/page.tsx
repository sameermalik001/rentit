'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Lock,
  Mail,
  Phone,
  ArrowRight,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  Eye,
  EyeOff,
  Copy,
  Check,
  RotateCcw,
  Smartphone,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') === 'phone' ? 'phone' : 'phone'; // Default to phone or email

  const { login, sendPhoneOtp, loginWithPhoneOtp, switchDemoUser } = useAuth();

  // Tab State
  const [authMode, setAuthMode] = useState<'phone' | 'email'>('phone');

  // Email form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Phone OTP form state
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [fullName, setFullName] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [simulatedOtp, setSimulatedOtp] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [copiedOtp, setCopiedOtp] = useState(false);

  // Status state
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Resend OTP countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Handle Email + Password Submission
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email.trim()) {
      setErrorMsg('Please enter your email address');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password');
      return;
    }

    setIsLoading(true);
    const res = await login(email, password);
    setIsLoading(false);

    if (res.success) {
      router.push('/dashboard');
    } else {
      setErrorMsg(res.error || 'Invalid credentials');
    }
  };

  // Handle Requesting OTP
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const clean = phone.replace(/[^0-9]/g, '');
    if (!clean || clean.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsLoading(true);
    const res = await sendPhoneOtp(clean);
    setIsLoading(false);

    if (res.success) {
      setOtpSent(true);
      setCountdown(30);
      if (res.smsSent) {
        setSimulatedOtp(null);
      } else {
        setSimulatedOtp(res.otp || null);
      }
      setSuccessMsg(`OTP sent to +91 ${clean.slice(-10)}`);
    } else {
      setErrorMsg(res.error || 'Failed to send OTP. Please try again.');
    }
  };

  // Handle Verifying OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!otp || otp.trim().length !== 6) {
      setErrorMsg('Please enter the 6-digit OTP code');
      return;
    }

    setIsLoading(true);
    const res = await loginWithPhoneOtp(phone, otp.trim(), fullName);
    setIsLoading(false);

    if (res.success) {
      router.push('/dashboard');
    } else {
      setErrorMsg(res.error || 'Invalid or expired OTP code');
    }
  };

  // Auto-fill Simulated OTP for quick testing
  const handleAutoFillOtp = () => {
    if (simulatedOtp) {
      setOtp(simulatedOtp);
      setCopiedOtp(true);
      setTimeout(() => setCopiedOtp(false), 2000);
    }
  };

  const handleQuickDemo = (role: 'renter' | 'owner' | 'admin') => {
    switchDemoUser(role);
    router.push('/dashboard');
  };

  return (
    <div className="bg-[#fbfcfd] min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center mb-3">
            <img
              src="/logo.png"
              alt="RentIt Logo"
              className="w-20 h-20 object-contain rounded-2xl shadow-xs border border-slate-100"
            />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Welcome back to RentIt
          </h2>
          <p className="mt-1.5 text-xs text-slate-500">
            Sign in to manage listings, review requests, or rent items nearby.
          </p>
        </div>

        {/* Quick 1-Click Demo Login Box */}
        <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>1-Click Demo Login</span>
            </div>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
              Demo Pwd: password123
            </span>
          </div>
          <p className="text-[11px] text-emerald-700">
            Instant 1-click access without typing, or use credentials below:
          </p>
          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleQuickDemo('renter')}
              className="py-1.5 px-2 bg-white hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200 shadow-2xs transition-colors text-center"
            >
              👤 Renter
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('owner')}
              className="py-1.5 px-2 bg-white hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200 shadow-2xs transition-colors text-center"
            >
              📸 Owner
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="py-1.5 px-2 bg-white hover:bg-purple-100 text-purple-800 rounded-xl text-xs font-bold border border-purple-200 shadow-2xs transition-colors text-center"
            >
              🛡️ Admin
            </button>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
          {/* Method Segmented Tabs */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl">
            <button
              type="button"
              onClick={() => {
                setAuthMode('phone');
                setErrorMsg('');
              }}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                authMode === 'phone'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Mobile OTP</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('email');
                setErrorMsg('');
              }}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                authMode === 'email'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Email & Password</span>
            </button>
          </div>

          {/* Feedback messages */}
          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && !errorMsg && (
            <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB 1: PHONE NUMBER & OTP LOGIN */}
          {authMode === 'phone' && (
            <div className="space-y-4">
              {!otpSent ? (
                // Step 1: Enter Phone Number
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Mobile Number
                    </label>
                    <div className="flex rounded-xl border border-slate-200 overflow-hidden bg-slate-50 focus-within:border-emerald-500 focus-within:bg-white transition-all">
                      <span className="inline-flex items-center px-3.5 bg-slate-100 text-slate-700 text-xs font-bold border-r border-slate-200">
                        🇮🇳 +91
                      </span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                        className="w-full text-sm px-3 py-2.5 text-slate-900 bg-transparent focus:outline-hidden tracking-wider"
                      />
                    </div>
                    <p className="mt-1.5 text-[11px] text-slate-400">
                      We will send a 6-digit one-time password (OTP) to this number.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || phone.length < 10}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-sm rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 active:scale-98"
                  >
                    <span>{isLoading ? 'Sending OTP...' : 'Get OTP Code'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                // Step 2: Enter & Verify OTP
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  {/* Realistic Simulated SMS Alert */}
                  {simulatedOtp && (
                    <div className="p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                          <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                          <span>SMS Received: +91 {phone.slice(-10)}</span>
                        </div>
                        <span className="text-[10px] font-mono font-bold bg-emerald-200/80 text-emerald-800 px-2 py-0.5 rounded-full">
                          Valid for 5m
                        </span>
                      </div>
                      <p className="text-xs text-slate-700">
                        Your RentIt verification code is:{' '}
                        <span className="font-mono font-black text-emerald-700 text-sm tracking-widest">
                          {simulatedOtp}
                        </span>
                      </p>
                      <button
                        type="button"
                        onClick={handleAutoFillOtp}
                        className="inline-flex items-center gap-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg transition-colors shadow-2xs"
                      >
                        {copiedOtp ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Auto-Filled!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Auto-Fill OTP ({simulatedOtp})</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Enter 6-Digit OTP
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setOtpSent(false);
                          setOtp('');
                        }}
                        className="text-xs font-semibold text-emerald-600 hover:underline"
                      >
                        Change Number
                      </button>
                    </div>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      placeholder="• • • • • •"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-full text-center text-xl font-mono tracking-widest bg-slate-50 border border-slate-200 rounded-xl py-3 text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Your Name (Required if registering new account)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Sameer Malik"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-hidden"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || otp.length !== 6}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-sm rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 active:scale-98"
                  >
                    <span>{isLoading ? 'Verifying OTP...' : 'Verify OTP & Sign In'}</span>
                    <ShieldCheck className="w-4 h-4" />
                  </button>

                  <div className="flex items-center justify-between text-xs pt-1 text-slate-500">
                    <span>Didn't receive code?</span>
                    {countdown > 0 ? (
                      <span className="text-slate-400 font-medium">Resend in {countdown}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSendOtp()}
                        className="text-emerald-600 hover:text-emerald-700 font-bold inline-flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Resend OTP</span>
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: EMAIL & PASSWORD LOGIN */}
          {authMode === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address or Mobile Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="name@example.com or 9876543210"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-hidden"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-10 py-2.5 text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-hidden"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-0.5"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-sm rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 active:scale-98 mt-2"
              >
                <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            Don't have an account yet?{' '}
            <Link href="/signup" className="font-bold text-emerald-600 hover:text-emerald-700">
              Sign up for free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-[#fbfcfd] min-h-[85vh] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
