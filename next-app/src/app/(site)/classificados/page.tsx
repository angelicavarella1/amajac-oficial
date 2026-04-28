import ClassificadosSection from '@/components/ClassificadosSection';

export const metadata = {
  title: 'Classificados de Serviços | AMAJAC',
  description: 'Encontre os melhores prestadores de serviço da região do Jardim Atlântico Central.',
};

export default function ClassificadosPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <ClassificadosSection />
    </main>
  );
}
