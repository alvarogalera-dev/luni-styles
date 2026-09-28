import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import LenisProvider from '@/Components/LenisProvider';
import CookieBanner from '@/Components/CookieBanner';
import { type ReactNode, useEffect, useState } from 'react';
import { Head, usePage } from '@inertiajs/react';

// Optional: you can import the translations statically, but to avoid large bundle size we could fetch it,
// however importing is fine for ~500 strings.
import translationsData from '../translations.json';

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
  const [isTranslating, setIsTranslating] = useState(currentLocale !== 'es');

  useEffect(() => {
    if (currentLocale === 'es') {
      setIsTranslating(false);
      return;
    }

    const dict = (translationsData as any)[currentLocale];
    if (!dict) {
      setIsTranslating(false);
      return;
    }

    let isDisconnecting = false;
    let observer: MutationObserver;

    const translateNode = (node: Node) => {
      if (isDisconnecting) return;
      if (node.nodeType === Node.ELEMENT_NODE) {
        const tag = (node as HTMLElement).tagName?.toLowerCase();
        if (['script', 'style', 'noscript', 'code'].includes(tag)) return;
        // check placeholders
        if (node instanceof HTMLInputElement || node instanceof HTMLTextAreaElement) {
          const ph = node.getAttribute('placeholder');
          if (ph && dict[ph]) node.setAttribute('placeholder', dict[ph]);
        }
      }
      
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent || '';
        const trimmed = text.trim();
        // Replace if we have an exact match for the trimmed content
        if (trimmed && dict[trimmed] && dict[trimmed] !== trimmed) {
          node.textContent = text.replace(trimmed, dict[trimmed]);
        }
      } else {
        node.childNodes.forEach(translateNode);
      }
    };

    // Initial translation pass
    translateNode(document.body);
    setIsTranslating(false);

    // Watch for dynamic updates (React state changes, modales, etc.)
    observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(n => translateNode(n));
        } else if (mutation.type === 'characterData') {
          // Careful with infinite loops: translateNode only replaces if the text matches Spanish dictionary
          translateNode(mutation.target);
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });

    return () => {
      isDisconnecting = true;
      if (observer) observer.disconnect();
    };
  }, [currentLocale]);

  return (
    <LenisProvider>
      {/* Hide content to prevent flash of untranslated text */}
      <div style={{ opacity: isTranslating ? 0 : 1, transition: 'opacity 0.2s ease-in-out' }}>
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
      </div>
    </LenisProvider>
  );
}
