'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Profile, UserRole } from '@/lib/types';
import { DataStore, INITIAL_PROFILES } from '@/lib/store';
import { isSupabaseConfigured, createClient } from '@/lib/supabase/client';

interface AuthContextType {
  user: Profile | null;
  isLoading: boolean;
  isSupabaseLive: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  sendPhoneOtp: (
    phone: string
  ) => Promise<{ success: boolean; otp?: string; smsSent?: boolean; message?: string; error?: string }>;
  loginWithPhoneOtp: (phone: string, otp: string, fullName?: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: {
    fullName: string;
    email: string;
    password?: string;
    phone?: string;
    city?: string;
    locality?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ success: boolean; error?: string }>;
  switchDemoUser: (role: 'owner' | 'renter' | 'admin') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'rentit_auth_user_id';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSupabaseLive, setIsSupabaseLive] = useState<boolean>(false);

  useEffect(() => {
    const initAuth = async () => {
      const live = isSupabaseConfigured();
      setIsSupabaseLive(live);

      if (live) {
        const supabase = createClient();
        if (supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const profile = DataStore.getProfileById(session.user.id);
            if (profile) {
              setUser(profile);
            } else {
              // Create profile if missing
              const newProf: Profile = {
                id: session.user.id,
                email: session.user.email || '',
                full_name: session.user.user_metadata?.full_name || 'RentIt User',
                phone: session.user.user_metadata?.phone || '',
                city: session.user.user_metadata?.city || 'Sonipat',
                locality: session.user.user_metadata?.locality || 'Sector 14',
                role: 'user',
                rating: 5.0,
                total_ratings: 0,
                is_verified: false,
                created_at: new Date().toISOString(),
              };
              DataStore.saveProfile(newProf);
              setUser(newProf);
            }
          }
        }
      } else {
        // Local persistence fallback
        const savedUserId = localStorage.getItem(AUTH_STORAGE_KEY);
        if (savedUserId === 'guest') {
          // User explicitly logged out; keep logged out
          setUser(null);
        } else if (savedUserId) {
          const profile = DataStore.getProfileById(savedUserId);
          if (profile) {
            setUser(profile);
          } else {
            setUser(null);
          }
        } else {
          // First visit: initialize with demo renter (Priya) for instant preview
          const defaultUser = INITIAL_PROFILES[1];
          setUser(defaultUser);
          localStorage.setItem(AUTH_STORAGE_KEY, defaultUser.id);
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  const sendPhoneOtp = async (
    phone: string
  ): Promise<{ success: boolean; otp?: string; smsSent?: boolean; message?: string; error?: string }> => {
    const clean = DataStore.normalizePhone(phone);
    if (!clean || clean.length < 10) {
      return { success: false, error: 'Please enter a valid 10-digit mobile number' };
    }

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: clean }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Failed to send OTP' };
      }

      if (typeof window !== 'undefined' && data.otp) {
        sessionStorage.setItem(
          `rentit_otp_${clean}`,
          JSON.stringify({
            code: data.otp,
            expiresAt: Date.now() + 5 * 60 * 1000,
          })
        );
      }

      return {
        success: true,
        otp: data.otp,
        smsSent: data.smsSent,
        message: data.message,
      };
    } catch {
      // Offline / fallback generator
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(
          `rentit_otp_${clean}`,
          JSON.stringify({
            code,
            expiresAt: Date.now() + 5 * 60 * 1000,
          })
        );
      }
      return { success: true, otp: code, smsSent: false };
    }
  };

  const loginWithPhoneOtp = async (
    phone: string,
    otp: string,
    fullName?: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const clean = DataStore.normalizePhone(phone);
    if (!clean || clean.length < 10) {
      setIsLoading(false);
      return { success: false, error: 'Please enter a valid 10-digit mobile number' };
    }

    const trimmedOtp = otp.trim();
    if (!trimmedOtp || trimmedOtp.length !== 6) {
      setIsLoading(false);
      return { success: false, error: 'Please enter the complete 6-digit OTP code' };
    }

    let isValid = false;

    // Verify with server API route
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: clean, otp: trimmedOtp }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        isValid = true;
      }
    } catch {
      // Fallback
    }

    if (!isValid && typeof window !== 'undefined') {
      const stored = sessionStorage.getItem(`rentit_otp_${clean}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.expiresAt > Date.now() && parsed.code === trimmedOtp) {
            isValid = true;
          }
        } catch (e) {
          console.error(e);
        }
      }
    }

    // Universal test code for demo & development
    if (trimmedOtp === '123456') {
      isValid = true;
    }

    if (!isValid) {
      setIsLoading(false);
      return { success: false, error: 'Invalid or expired OTP code. Please check the code or resend.' };
    }

    // Check if profile exists for this phone
    let profile = DataStore.getProfileByPhone(clean);

    if (!profile) {
      // Auto-create new mobile verified profile
      profile = {
        id: `u-${Date.now()}`,
        email: `${clean}@rentit.mobile`,
        password: 'password123',
        full_name: fullName?.trim() || `User ${clean.slice(-4)}`,
        phone: `+91 ${clean.slice(0, 5)} ${clean.slice(5)}`,
        city: 'Sonipat',
        locality: 'Sector 14',
        bio: 'Mobile verified member of RentIt community.',
        role: 'user',
        rating: 5.0,
        total_ratings: 0,
        is_verified: true,
        created_at: new Date().toISOString(),
      };
      DataStore.saveProfile(profile);
    }

    setUser(profile);
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_STORAGE_KEY, profile.id);
      sessionStorage.removeItem(`rentit_otp_${clean}`);
    }

    setIsLoading(false);
    return { success: true };
  };

  const login = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const trimmedInput = email.trim();
      if (!trimmedInput) {
        setIsLoading(false);
        return { success: false, error: 'Please enter your email or phone number' };
      }

      if (!password || password.trim().length === 0) {
        setIsLoading(false);
        return { success: false, error: 'Password is required' };
      }

      if (isSupabaseLive) {
        const supabase = createClient();
        if (supabase) {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: trimmedInput,
            password,
          });
          if (error) {
            setIsLoading(false);
            return { success: false, error: error.message };
          }
          if (data.user) {
            let prof = DataStore.getProfileById(data.user.id);
            if (!prof) {
              prof = {
                id: data.user.id,
                email: data.user.email || trimmedInput,
                password,
                full_name: data.user.user_metadata?.full_name || 'RentIt User',
                city: 'Sonipat',
                locality: 'Sector 14',
                role: 'user',
                rating: 5.0,
                total_ratings: 0,
                is_verified: false,
                created_at: new Date().toISOString(),
              };
              DataStore.saveProfile(prof);
            }
            setUser(prof);
            setIsLoading(false);
            return { success: true };
          }
        }
      }

      // Check if input is a phone number or email
      const isPhone = !trimmedInput.includes('@') && /^[0-9+\s\-()]{7,}$/.test(trimmedInput);
      const profile = isPhone
        ? DataStore.getProfileByPhone(trimmedInput)
        : DataStore.getProfileByEmail(trimmedInput);

      if (!profile) {
        setIsLoading(false);
        return {
          success: false,
          error: isPhone
            ? 'No account found with this phone number. Try logging in with OTP or sign up.'
            : 'No account found with this email. Try signing up.',
        };
      }

      // Determine expected password
      let expectedPwd = profile.password;
      if (!expectedPwd && typeof window !== 'undefined') {
        const storedPwd = localStorage.getItem(`rentit_user_pwd_${profile.email.toLowerCase()}`);
        if (storedPwd) expectedPwd = storedPwd;
      }
      if (!expectedPwd) {
        expectedPwd = 'password123';
      }

      // STRICT PASSWORD CHECK - NEVER ACCEPT INCORRECT PASSWORD
      if (password !== expectedPwd) {
        setIsLoading(false);
        return { success: false, error: 'Incorrect password. Please try again.' };
      }

      // Ensure password is synced to profile
      if (!profile.password) {
        profile.password = expectedPwd;
        DataStore.saveProfile(profile);
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem(`rentit_user_pwd_${profile.email.toLowerCase()}`, expectedPwd);
      }

      setUser(profile);
      if (typeof window !== 'undefined') {
        localStorage.setItem(AUTH_STORAGE_KEY, profile.id);
      }
      setIsLoading(false);
      return { success: true };
    } catch (err: unknown) {
      setIsLoading(false);
      const message = err instanceof Error ? err.message : 'Login failed';
      return { success: false, error: message };
    }
  };

  const signup = async (data: {
    fullName: string;
    email: string;
    password?: string;
    phone?: string;
    city?: string;
    locality?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      if (!data.fullName.trim()) return { success: false, error: 'Full name is required' };
      if (!data.email.trim() || !data.email.includes('@')) return { success: false, error: 'Valid email is required' };
      if (!data.password || data.password.length < 6) return { success: false, error: 'Password must be at least 6 characters' };

      // Check if email already exists
      const existing = DataStore.getProfileByEmail(data.email);
      if (existing) {
        setIsLoading(false);
        return { success: false, error: 'An account with this email already exists' };
      }

      let userId = `u-${Date.now()}`;

      if (isSupabaseLive) {
        const supabase = createClient();
        if (supabase && data.password) {
          const { data: authData, error } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
              data: {
                full_name: data.fullName,
                phone: data.phone || '',
                city: data.city || 'Sonipat',
                locality: data.locality || 'Sector 14',
              },
            },
          });
          if (error) {
            setIsLoading(false);
            return { success: false, error: error.message };
          }
          if (authData.user) {
            userId = authData.user.id;
          }
        }
      }

      const newProfile: Profile = {
        id: userId,
        email: data.email.toLowerCase(),
        password: data.password,
        full_name: data.fullName,
        phone: data.phone || '',
        city: data.city || 'Sonipat',
        locality: data.locality || 'Sector 14',
        bio: 'New member of RentIt community.',
        role: 'user',
        rating: 5.0,
        total_ratings: 0,
        is_verified: false,
        created_at: new Date().toISOString(),
      };

      DataStore.saveProfile(newProfile);
      setUser(newProfile);
      if (typeof window !== 'undefined') {
        localStorage.setItem(AUTH_STORAGE_KEY, newProfile.id);
        localStorage.setItem(`rentit_user_pwd_${data.email.toLowerCase()}`, data.password);
      }

      setIsLoading(false);
      return { success: true };
    } catch (err: unknown) {
      setIsLoading(false);
      const message = err instanceof Error ? err.message : 'Signup failed';
      return { success: false, error: message };
    }
  };

  const logout = async (): Promise<void> => {
    if (isSupabaseLive) {
      const supabase = createClient();
      if (supabase) {
        await supabase.auth.signOut();
      }
    }
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_STORAGE_KEY, 'guest');
    }
  };

  const updateProfile = async (updates: Partial<Profile>): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'Not authenticated' };

    const updated = {
      ...user,
      ...updates,
      updated_at: new Date().toISOString(),
    };

    DataStore.saveProfile(updated);
    setUser(updated);

    if (isSupabaseLive) {
      const supabase = createClient();
      if (supabase) {
        await supabase
          .from('profiles')
          .update(updates)
          .eq('id', user.id);
      }
    }

    return { success: true };
  };

  const switchDemoUser = (role: 'owner' | 'renter' | 'admin') => {
    let targetProfile: Profile | undefined;
    if (role === 'owner') targetProfile = INITIAL_PROFILES[0]; // Rahul
    else if (role === 'renter') targetProfile = INITIAL_PROFILES[1]; // Priya
    else if (role === 'admin') targetProfile = INITIAL_PROFILES[2]; // Admin

    if (targetProfile) {
      // Ensure it exists in store
      DataStore.saveProfile(targetProfile);
      setUser(targetProfile);
      if (typeof window !== 'undefined') {
        localStorage.setItem(AUTH_STORAGE_KEY, targetProfile.id);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isSupabaseLive,
        login,
        sendPhoneOtp,
        loginWithPhoneOtp,
        signup,
        logout,
        updateProfile,
        switchDemoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
