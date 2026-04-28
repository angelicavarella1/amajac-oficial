import NoticiasSection from '@/components/NoticiasSection';

export const metadata = {
  title: 'Notícias | AMAJAC',
  description: 'Confira as últimas atualizações e notícias da AMAJAC.',
};

export default function NoticiasPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NoticiasSection />
    </main>
  );
}
