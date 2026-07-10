import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AMAJAC | Associacao de Moradores e Amigos do Jardim Atlantico Central",
  description: "Site oficial da AMAJAC - Associacao de Moradores e Amigos do Jardim Atlantico Central, Itaipuacu, Marica/RJ. Acompanhe noticias, eventos, classificados e associe-se!",
  keywords: "AMAJAC, Associacao de Moradores, Itaipuacu, Marica, Jardim Atlantico Central, Noticias, Eventos, Classificados",
  openGraph: {
    title: "AMAJAC | Associacao de Moradores do Jardim Atlantico Central",
    description: "Acompanhe as novidades, eventos, projetos e servicos da nossa comunidade em Itaipuacu.",
    url: "https://amajac.com.br",
    siteName: "AMAJAC Oficial",
    locale: "pt_BR",
    type: "website",
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="scroll-smooth h-full antialiased" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Montserrat:wght@500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen flex flex-col bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
        {children}
      </body>
    </html>
  );
}
