import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import LenisProvider from '@/Components/LenisProvider';
import CookieBanner from '@/Components/CookieBanner';
import { type ReactNode, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: any;
  }
}

interface Meta {
  title?: string;
  description?: string;
}

interface RootLayoutProps {
  children: ReactNode;
  meta?: Meta;
}

export default function RootLayout({ children, meta }: RootLayoutProps) {
  const { props } = usePage();
  const currentLocale = (props as any).locale || 'es';

  useEffect(() => {
    // Add google translate div if it doesn't exist
    if (!document.getElementById('google_translate_element')) {
      const gt = document.createElement('div');
      gt.id = 'google_translate_element';
      gt.style.display = 'none';
      document.body.appendChild(gt);

      // Add script
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      document.body.appendChild(script);

      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement({
          pageLanguage: 'es',
          includedLanguages: 'es,en,ru,zh-CN',
          autoDisplay: false
        }, 'google_translate_element');
      };
    }
  }, []);

  useEffect(() => {
    const checkAndTranslate = () => {
      const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
      if (select) {
        let langVal = '';
        if (currentLocale === 'en') langVal = 'en';
        else if (currentLocale === 'ru') langVal = 'ru';
        else if (currentLocale === 'cn') langVal = 'zh-CN';
        else langVal = 'es'; // default
        
        if (select.value !== langVal) {
          select.value = langVal;
          select.dispatchEvent(new Event('change'));
        }
      } else {
        setTimeout(checkAndTranslate, 500);
      }
    };
    checkAndTranslate();
  }, [currentLocale]);

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
