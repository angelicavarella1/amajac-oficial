export const metadata = {
  title: 'Política de Privacidade | AMAJAC',
  description: 'Política de Privacidade do site da AMAJAC – Associação de Moradores e Amigos de Itaipuaçu.',
};

export default function PrivacidadePage() {
  return (
    <main className="py-16 px-4 bg-gray-50 dark:bg-gray-900 dark:text-gray-50">
      <div className="max-w-3xl mx-auto">
        <article>
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-gray-50">Política de Privacidade</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Última atualização: 6 de novembro de 2025
            </p>
          </header>

          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p>
              A AMAJAC – Associação de Moradores e Amigos de Itaipuaçu tem o compromisso com a transparência e a segurança de seus usuários. Esta política descreve como coletamos, usamos e protegemos as informações fornecidas em nosso site.
            </p>

            <h2 className="text-gray-900 dark:text-gray-50">1. Coleta de Informações</h2>
            <p>
              Coletamos informações pessoais apenas quando você as fornece voluntariamente, como ao se cadastrar, enviar uma mensagem de contato ou usar a área administrativa.
            </p>
            <ul>
              <li>
                **Formulários de Contato/Mensagens:** Nome, e-mail e telefone.
              </li>
              <li>
                **Área Administrativa (Login):** E-mail e senha (armazenados de forma segura e criptografada pelo Supabase).
              </li>
            </ul>

            <h2 className="text-gray-900 dark:text-gray-50">2. Uso das Informações</h2>
            <p>
              As informações coletadas são utilizadas para os seguintes propósitos:
            </p>
            <p>
              Para operar, manter e melhorar nosso site. Para responder a mensagens, solicitações de contato e fornecer suporte. Para enviar comunicações periódicas (como newsletters, se aplicável, mediante consentimento).
            </p>

            <h2 className="text-gray-900 dark:text-gray-50">3. Compartilhamento de Dados</h2>
            <p>
              A AMAJAC não vende, aluga ou compartilha suas informações pessoais com terceiros, exceto nas seguintes circunstâncias:
            </p>
            <ul>
              <li>Quando exigido por lei ou ordem judicial.</li>
              <li>Com parceiros de serviço (como o Supabase para autenticação) que nos ajudam na operação do site, e que concordam em manter a confidencialidade das informações.</li>
              <li>Em relação a anúncios na seção de Classificados, as informações de contato do anunciante são compartilhadas publicamente, conforme consentimento no momento da publicação.</li>
            </ul>

            <h2 className="text-gray-900 dark:text-gray-50">4. Segurança dos Dados</h2>
            <p>
              Empregamos medidas de segurança técnicas e administrativas razoáveis para proteger as informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição. No entanto, nenhum método de transmissão pela Internet ou armazenamento eletrônico é 100% seguro.
            </p>

            <h2 className="text-gray-900 dark:text-gray-50">5. Seus Direitos</h2>
            <p>
              Você tem o direito de acessar, corrigir ou excluir as informações pessoais que mantemos sobre você. Para exercer esses direitos, entre em contato conosco através do e-mail listado abaixo.
            </p>

            <h2 className="text-gray-900 dark:text-gray-50">6. Alterações desta Política</h2>
            <p>
              Reservamo-nos o direito de atualizar esta política de privacidade a qualquer momento. Quaisquer alterações serão publicadas nesta página com uma data de &quot;Última atualização&quot; revisada.
            </p>

            <h2 className="text-gray-900 dark:text-gray-50">7. Contato</h2>
            <p>
              Para quaisquer dúvidas sobre esta política, entre em contato com:{' '}
              <a href="mailto:contato@amajac.org.br" className="text-[#2E7D32]">contato@amajac.org.br</a>.
            </p>
          </div>
        </article>
      </div>
    </main>
  );
}
