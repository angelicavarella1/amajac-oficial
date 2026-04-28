import type { Metadata } from 'next';
import '../globals.css';
import SiteNavbar from '@/components/SiteNavbar';
import SiteFooter from '@/components/SiteFooter';
import AmajacBanner from '@/components/AmajacBanner';
import PrevisaoTempo from '@/components/ui/PrevisaoTempo';
import ParceirosSection from '@/components/ParceirosSection';
import ModalContato from '@/components/ui/ModalContato';

export const metadata: Metadata = {
  title: 'AMAJAC | Associação de Moradores e Amigos de Itaipuaçu',
  description: 'Site oficial da AMAJAC. Acompanhe notícias, eventos, classificados e associe-se!',
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' }
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SiteNavbar />
      <AmajacBanner />
      
      <div className="clima-section bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-4">
        <div className="container mx-auto px-4">
          <PrevisaoTempo /> 
        </div>
      </div>

      <div className="site-grid container mx-auto px-4 py-6 flex-grow grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-8">
        <main className="main-content min-w-0">
          {children}
        </main>
        
        <div className="parceiros-lateral hidden lg:flex flex-col sticky top-[2rem] self-start h-fit z-10 w-full rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="h-[calc(100vh-150px)]">
            <ParceirosSection />
          </div>
        </div>
      </div>

      <SiteFooter />
      <ModalContato />
    </>
  );
}
