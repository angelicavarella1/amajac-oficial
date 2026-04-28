import EventosSection from '@/components/EventosSection';

export const metadata = {
  title: 'Eventos | AMAJAC',
  description: 'Confira os eventos oficiais da AMAJAC.',
};

export default function EventosPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <EventosSection />
    </main>
  );
}
