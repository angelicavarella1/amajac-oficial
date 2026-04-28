import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AMAJAC | Associação de Moradores e Amigos do Jardim Atlântico Central',
  description: 'Site oficial da AMAJAC - Associação de Moradores e Amigos do Jardim Atlântico Central, Itaipuaçu, Maricá/RJ. Acompanhe notícias, eventos, classificados e associe-se!',
  keywords: 'AMAJAC, Associação de Moradores, Itaipuaçu, Maricá, Jardim Atlântico Central, Notícias, Eventos, Classificados',
  openGraph: {
    title: 'AMAJAC | Associação de Moradores do Jardim Atlântico Central',
    description: 'Acompanhe as novidades, eventos, projetos e serviços da nossa comunidade em Itaipuaçu.',
    url: 'https://amajac.com.br',
    siteName: 'AMAJAC Oficial',
    locale: 'pt_BR',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
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
    <html lang="pt-BR" className="scroll-smooth h-full antialiased">
      <body className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        {children}
      </body>
    </html>
  );
}
