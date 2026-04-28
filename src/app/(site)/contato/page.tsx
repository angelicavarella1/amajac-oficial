import Link from 'next/link';
import ModalContato from '@/components/ui/ModalContato';

export const metadata = {
  title: 'Contato | AMAJAC',
  description: 'Entre em contato com a AMAJAC. Estamos à disposição para atendê-lo!',
};

export default function ContatoPage() {
  return (
    <main className="contato-page py-12 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <header className="text-center mb-12">
          <h1 className="text-3xl font-bold text-[#2E7D32] dark:text-[#4CAF50] mb-4">
            Fale Conosco
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Entre em contato com a AMAJAC. Estamos à disposição para atendê-lo!
          </p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Informações de Contato
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                <strong>E-mail:</strong>
                <br />
                <a
                  href="mailto:comunicacao@amajac.org.br"
                  className="text-[#2E7D32] hover:underline"
                >
                  comunicacao@amajac.org.br
                </a>
              </p>
              <p>
                <strong>Telefone/WhatsApp:</strong>
                <br />
                <a
                  href="https://wa.me/5521978979840"
                  target="_blank"
                  className="text-[#2E7D32] hover:underline"
                >
                  (21) 97897-9840
                </a>
              </p>
              <p>
                <strong>Endereço:</strong>
                <br />
                Rua Izabel Cristina Ouvina, 112 – Jardim Atlântico Central,
                <br />
                Maricá, Rio de Janeiro – CEP 24.946-320
              </p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Envie uma Mensagem
            </h2>
            <ModalContato />
          </div>
        </div>
      </div>
    </main>
  );
}
