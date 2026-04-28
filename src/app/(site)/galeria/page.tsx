import GaleriaSection from '@/components/GaleriaSection';

export const metadata = {
  title: 'Galeria de Fotos | AMAJAC',
  description: 'Explore nossa coleção de imagens organizadas por categorias.',
};

export default function GaleriaPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <GaleriaSection />
    </main>
  );
}
