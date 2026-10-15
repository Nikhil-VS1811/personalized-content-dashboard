import type { Metadata } from 'next';
import './globals.css';
import StoreProvider from '@/components/providers/StoreProvider';

export const metadata: Metadata = {
  title: 'PulseDash • Personalized Content Dashboard (Phase 2)',
  description:
    'SDE Intern Frontend Assignment: Phase 2 Personalized Content Dashboard with RTK Query, TMDB, NewsAPI, debounced search, per-source pagination, and dark theme.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Inline script to prevent theme flash without hydration errors */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('content_dashboard_theme_v1');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (theme === 'dark' || (!theme && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased font-sans selection:bg-indigo-500 selection:text-white">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
