import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from "@/components/pages/theme-provider"
import Header from '@/components/pages/public/Header';
import Footer from '@/components/pages/public/Footer';
import Background from '@/components/pages/public/Background';
import { AuthProvider } from '@/contexts/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Reggie - Streamline Education Admin Workflows',
  description: 'Reggie is a software product that speeds up workflows in the education admin space. Digitize records and manage them efficiently.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Background />
            <div className="flex flex-col min-h-screen relative z-10">
              <Header />
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
