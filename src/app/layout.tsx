import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'RentIt — Rent What You Need, Nearby',
  description:
    'RentIt is a hyperlocal peer-to-peer rental marketplace. Rent cameras, projectors, gaming consoles, bicycles, tools, and gear from verified neighbors instead of buying.',
  keywords: [
    'peer to peer rental',
    'rent camera Sonipat',
    'rent PS5 nearby',
    'hyperlocal rental marketplace',
    'RentIt',
    'equipment rental',
  ],
  authors: [{ name: 'RentIt Team' }],
  openGraph: {
    title: 'RentIt — Rent What You Need, Nearby',
    description: 'Discover and rent high-value items from trusted neighbors nearby.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'RentIt',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body
        className="min-h-full flex flex-col bg-[#fbfcfd] text-slate-900 antialiased font-sans"
        suppressHydrationWarning
      >
        <AuthProvider>
          <NotificationProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
