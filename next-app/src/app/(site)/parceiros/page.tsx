import ParceirosSection from '@/components/ParceirosSection';

export const metadata = {
  title: 'Parceiros Comerciais | AMAJAC',
  description: 'Conheça os parceiros comerciais da AMAJAC.',
};

export default function ParceirosPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <header className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Nossos Parceiros
          </h1>
          <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
            Conheça os colaboradores que apoiam a AMAJAC.
          </p>
        </header>
        <ParceirosSection />
      </div>
    </main>
  );
}
