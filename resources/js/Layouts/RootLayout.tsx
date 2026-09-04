import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import LenisProvider from '@/Components/LenisProvider';
import CookieBanner from '@/Components/CookieBanner';
import { type ReactNode } from 'react';
import { Head } from '@inertiajs/react';

interface Meta {
  title?: string;
  description?: string;
}

interface RootLayoutProps {
  children: ReactNode;
  meta?: Meta;
}

export default function RootLayout({ children, meta }: RootLayoutProps) {
  return (
    <LenisProvider>
      {/* SEO */}
      <Head>
        <title>{meta?.title ?? 'Luni Styles'}</title>
        <meta
          name="description"
          content={
            meta?.description ??
            'Luni Styles: La barbería premium de precisión y peluquería infantil. El espacio perfecto que aúna el grooming de lujo y un entorno divertido para los más pequeños.'
          }
        />
        <meta name="theme-color" content="#0a0a0a" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </Head>

      {/* Grain film overlay */}
      <div className="grain-overlay pointer-events-none fixed inset-0 z-[9999]" />

      <div className="relative min-h-screen bg-void text-bone">
        <Navbar />
        <main>{children}</main>
        <Footer />
        <CookieBanner />
      </div>
    </LenisProvider>
  );
}
