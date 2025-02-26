import type { Metadata } from 'next';
import './globals.css';
import '@carbon/styles/css/styles.css';

export const metadata: Metadata = {
  title: 'Anonim Chat',
  description: 'Minimal gerçek zamanlı chat uygulaması',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <head>
        <link 
          rel="preconnect" 
          href="https://fonts.googleapis.com" 
        />
        <link 
          rel="preconnect" 
          href="https://fonts.gstatic.com" 
          crossOrigin="anonymous" 
        />
        <link 
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
} 