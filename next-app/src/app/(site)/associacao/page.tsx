import FormularioInscricaoSocio from '@/components/FormularioInscricaoSocio';

export const metadata = {
  title: 'Tornar-se Sócio | AMAJAC',
  description: 'Associe-se à AMAJAC - Associação de Moradores e Amigos do Jardim Atlântico Central.',
};

export default function AssociacaoPage() {
  return (
    <main className="py-12 px-4 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Tornar-se Sócio da AMAJAC
          </h1>
          <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
            A AMAJAC é uma associação de moradores do <strong>Jardim Atlântico Central</strong>,
            fundada para promover a integração, defesa de direitos e melhoria da qualidade de vida no bairro.
            Qualquer morador pode se associar, independentemente de renda ou profissão.
          </p>
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            Conforme Art. 3º do <a href="/estatuto" target="_blank" className="text-[#2E7D32] hover:underline">Estatuto Social</a>,
            a inscrição é aberta a todos os moradores do bairro.
          </p>
        </header>

        <FormularioInscricaoSocio />
      </div>
    </main>
  );
}
