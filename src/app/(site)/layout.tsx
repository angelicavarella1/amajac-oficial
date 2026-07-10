import type { Metadata } from "next";
import SiteNavbar from "@/components/SiteNavbar";
import SiteFooter from "@/components/SiteFooter";
import AmajacBanner from "@/components/AmajacBanner";
import PrevisaoTempo from "@/components/ui/PrevisaoTempo";
import ParceirosSection from "@/components/ParceirosSection";
import ModalContato from "@/components/ui/ModalContato";
import ScrollToTop from "@/components/ui/ScrollToTop";

export const metadata: Metadata = {
  title: "AMAJAC | Associacao de Moradores e Amigos de Itaipuacu",
  description: "Site oficial da AMAJAC. Acompanhe noticias, eventos, classificados e associe-se!",
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteNavbar />
      <AmajacBanner />

      <div className="relative z-10 -mt-8 md:-mt-12 bg-white dark:bg-gray-950 rounded-t-3xl">
        <div className="clima-section py-5 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-green-50/50 via-white to-green-50/50 dark:from-green-950/20 dark:via-gray-950 dark:to-green-950/20">
          <div className="container mx-auto px-4">
            <PrevisaoTempo />
          </div>
        </div>

        <div className="site-grid container mx-auto px-4 py-8 md:py-12 flex-grow grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 lg:gap-10">
          <main className="main-content min-w-0">{children}</main>

          <aside className="parceiros-lateral hidden lg:block sticky top-28 self-start h-fit z-10 w-full">
            <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 max-h-[calc(100vh-140px)]">
              <ParceirosSection />
            </div>
          </aside>
        </div>

        <SiteFooter />
      </div>

      <ModalContato />
      <ScrollToTop />
    </>
  );
}
