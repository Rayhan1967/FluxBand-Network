import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { WalletProvider } from '../context/walletcontext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FluxBand Network - DePIN Bandwidth Validation Protocol',
  description: 'The most advanced decentralized bandwidth validation protocol built on U2U Network. Test your connection, earn rewards, and contribute to the future of DePIN infrastructure.',
  keywords: 'DePIN, bandwidth, validation, blockchain, U2U, rewards, cryptocurrency',
  authors: [{ name: 'FluxBand Team' }],
  openGraph: {
    title: 'FluxBand Network - DePIN Bandwidth Validation',
    description: 'Test your internet speed and earn U2U tokens. Join the decentralized bandwidth validation network.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FluxBand Network - DePIN Bandwidth Validation',
    description: 'Test your internet speed and earn U2U tokens. Join the decentralized bandwidth validation network.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://rpc-nebulas-testnet.uniultra.xyz" />
        <link rel="preconnect" href="https://testnet-explorer.uniultra.xyz" />
        
        {/* Meta tags for better performance */}
        <meta name="theme-color" content="#0f172a" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        
        {/* Network detection */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Detect if user is on mobile
              if (/Mobi|Android/i.test(navigator.userAgent)) {
                document.documentElement.classList.add('mobile');
              }
              
              // Detect connection quality
              if ('connection' in navigator) {
                const conn = navigator.connection;
                if (conn && conn.effectiveType) {
                  document.documentElement.setAttribute('data-connection', conn.effectiveType);
                }
              }
            `,
          }}
        />
      </head>
      
      <body className={`${inter.className} antialiased`}>
        {/* Global loading screen */}
        <div id="loading-screen" className="fixed inset-0 bg-slate-900 flex items-center justify-center z-[9999] transition-opacity duration-500">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <div className="text-white font-medium">Loading FluxBand Network...</div>
          </div>
        </div>

        {/* Main application wrapped in WalletProvider */}
        <WalletProvider>
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {children}
          </div>
        </WalletProvider>

        {/* Global scripts */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Hide loading screen after DOM is ready
              document.addEventListener('DOMContentLoaded', function() {
                setTimeout(() => {
                  const loadingScreen = document.getElementById('loading-screen');
                  if (loadingScreen) {
                    loadingScreen.style.opacity = '0';
                    setTimeout(() => {
                      loadingScreen.style.display = 'none';
                    }, 500);
                  }
                }, 1000);
              });

              // Error boundary for unhandled errors
              window.addEventListener('error', function(e) {
                console.error('Global error:', e.error);
              });

              // Unhandled promise rejection handler
              window.addEventListener('unhandledrejection', function(e) {
                console.error('Unhandled promise rejection:', e.reason);
              });

              // Performance monitoring
              if ('performance' in window) {
                window.addEventListener('load', function() {
                  setTimeout(() => {
                    const perfData = performance.getEntriesByType('navigation')[0];
                    if (perfData && perfData.loadEventEnd > 0) {
                      const loadTime = perfData.loadEventEnd - perfData.fetchStart;
                      console.log('Page load time:', Math.round(loadTime), 'ms');
                    }
                  }, 0);
                });
              }

              // Service Worker registration for PWA (if needed in future)
              if ('serviceWorker' in navigator && 'production' === '${process.env.NODE_ENV}') {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />

        {/* Analytics (placeholder for future implementation) */}
        {process.env.NODE_ENV === 'production' && (
          <>
            {/* Google Analytics */}
            <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', 'GA_MEASUREMENT_ID');
                `,
              }}
            />
          </>
        )}
      </body>
    </html>
  );
}