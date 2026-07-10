import QuemSomosSection from "@/components/QuemSomosSection";
import NoticiasSection from "@/components/NoticiasSection";
import EventosSection from "@/components/EventosSection";
import ClassificadosSection from "@/components/ClassificadosSection";
import GaleriaSection from "@/components/GaleriaSection";
import ParceirosSection from "@/components/ParceirosSection";

export default function Home() {
  return (
    <>
      <QuemSomosSection />
      <NoticiasSection />
      <EventosSection />
      <ClassificadosSection />
      <GaleriaSection />
      {/* Parceiros mobile (desktop shown in sidebar) */}
      <section className="lg:hidden py-12 bg-gray-50/50 dark:bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="section-title text-gray-900 dark:text-white mb-2">Nossos Colaboradores</h2>
          <p className="section-subtitle">Parceiros Comerciais da AMAJAC</p>
          <ParceirosSection />
        </div>
      </section>
    </>
  );
}
