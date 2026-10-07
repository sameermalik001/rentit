import { NextResponse } from 'next/server';

declare global {
  // eslint-disable-next-line no-var
  var __rentit_otp_cache: Map<string, { code: string; expiresAt: number }> | undefined;
}

const otpCache = globalThis.__rentit_otp_cache ?? new Map<string, { code: string; expiresAt: number }>();
globalThis.__rentit_otp_cache = otpCache;

export async function POST(req: Request) {
  try {
    const { phone, otp } = await req.json();

    if (!phone || !otp) {
      return NextResponse.json(
        { success: false, error: 'Phone number and OTP are required' },
        { status: 400 }
      );
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '').slice(-10);
    const trimmedOtp = otp.toString().trim();

    // Universal test code for local testing
    if (trimmedOtp === '123456') {
      return NextResponse.json({ success: true, verified: true });
    }

    const cached = otpCache.get(cleanPhone);
    if (!cached) {
      return NextResponse.json(
        { success: false, error: 'No OTP requested for this number or OTP has expired' },
        { status: 400 }
      );
    }

    if (Date.now() > cached.expiresAt) {
      otpCache.delete(cleanPhone);
      return NextResponse.json(
        { success: false, error: 'OTP has expired. Please request a new code.' },
        { status: 400 }
      );
    }

    if (cached.code !== trimmedOtp) {
      return NextResponse.json(
        { success: false, error: 'Incorrect OTP code. Please check and try again.' },
        { status: 400 }
      );
    }

    // OTP verified successfully, clear it
    otpCache.delete(cleanPhone);

    return NextResponse.json({
      success: true,
      verified: true,
      message: 'Mobile number verified successfully!',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Verification failed';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
