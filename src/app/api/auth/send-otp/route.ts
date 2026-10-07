import { NextResponse } from 'next/server';

// In-memory OTP storage for validation (in production, use Redis or Database)
declare global {
  // eslint-disable-next-line no-var
  var __rentit_otp_cache: Map<string, { code: string; expiresAt: number }> | undefined;
}

const otpCache = globalThis.__rentit_otp_cache ?? new Map<string, { code: string; expiresAt: number }>();
globalThis.__rentit_otp_cache = otpCache;

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();

    if (!phone) {
      return NextResponse.json({ success: false, error: 'Phone number is required' }, { status: 400 });
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '').slice(-10);
    if (cleanPhone.length !== 10) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid 10-digit mobile number' },
        { status: 400 }
      );
    }

    // Generate 6-digit OTP code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store in cache (valid for 5 minutes)
    otpCache.set(cleanPhone, {
      code: otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    const fast2smsKey = process.env.FAST2SMS_API_KEY;
    const twilioSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioAuth = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

    let smsSent = false;
    let providerUsed = 'none';
    let providerError = '';

    // 1. Try Fast2SMS (Common for Indian mobile numbers)
    if (fast2smsKey && fast2smsKey.trim().length > 0) {
      try {
        const trimmedKey = fast2smsKey.trim();
        const res = await fetch('https://www.fast2sms.com/dev/bulkV2', {
          method: 'POST',
          headers: {
            authorization: trimmedKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            route: 'otp',
            variables_values: otp,
            numbers: cleanPhone,
          }),
        });

        const data = await res.json();
        if (data.return) {
          smsSent = true;
          providerUsed = 'Fast2SMS';
        } else {
          providerError = data.message || JSON.stringify(data);
          console.warn('Fast2SMS OTP route response:', data);
          // Try fallback to Quick SMS route if OTP route failed
          const quickRes = await fetch('https://www.fast2sms.com/dev/bulkV2', {
            method: 'POST',
            headers: {
              authorization: trimmedKey,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              route: 'q',
              message: `Your RentIt login OTP is ${otp}. Valid for 5 minutes.`,
              language: 'english',
              numbers: cleanPhone,
            }),
          });
          const quickData = await quickRes.json();
          if (quickData.return) {
            smsSent = true;
            providerUsed = 'Fast2SMS';
            providerError = '';
          } else {
            providerError = quickData.message || providerError;
            console.error('Fast2SMS Quick SMS error:', quickData);
          }
        }
      } catch (err) {
        console.error('Fast2SMS fetch failed:', err);
      }
    }

    // 2. Try Twilio if Fast2SMS not configured or failed
    if (!smsSent && twilioSid && twilioAuth && twilioPhone) {
      try {
        const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`;
        const authHeader = 'Basic ' + Buffer.from(`${twilioSid}:${twilioAuth}`).toString('base64');

        const params = new URLSearchParams();
        params.append('To', `+91${cleanPhone}`);
        params.append('From', twilioPhone);
        params.append('Body', `Your RentIt verification code is: ${otp}. Valid for 5 minutes.`);

        const res = await fetch(twilioUrl, {
          method: 'POST',
          headers: {
            Authorization: authHeader,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: params.toString(),
        });

        if (res.ok) {
          smsSent = true;
          providerUsed = 'Twilio';
          providerError = '';
        } else {
          const errData = await res.json();
          console.error('Twilio error:', errData);
        }
      } catch (err) {
        console.error('Twilio fetch failed:', err);
      }
    }

    return NextResponse.json({
      success: true,
      phone: cleanPhone,
      smsSent,
      providerUsed,
      providerError: providerError || undefined,
      otp: smsSent ? undefined : otp,
      message: smsSent
        ? `SMS OTP sent directly to +91 ${cleanPhone}!`
        : `OTP sent to +91 ${cleanPhone}`,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to send OTP';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
