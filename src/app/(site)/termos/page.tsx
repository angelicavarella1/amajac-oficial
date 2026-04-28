export const metadata = {
  title: 'Termos de Uso | AMAJAC',
  description: 'Termos de Uso do site da AMAJAC – Associação de Moradores e Amigos de Itaipuaçu.',
};

export default function TermosPage() {
  return (
    <main className="py-16 px-4 bg-gray-50 dark:bg-gray-900 dark:text-gray-50">
      <div className="max-w-3xl mx-auto">
        <article>
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-gray-50">Termos de Uso</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Última atualização: 6 de novembro de 2025
            </p>
          </header>

          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p>
              Bem-vindo ao site oficial da AMAJAC – Associação de Moradores e Amigos de Itaipuaçu.
              Ao acessar e utilizar este site, você concorda com os seguintes termos:
            </p>

            <h2 className="text-gray-900 dark:text-gray-50">1. Uso do Site</h2>
            <p>
              O conteúdo deste site é destinado exclusivamente para fins informativos e institucionais.
              É proibida a reprodução total ou parcial sem autorização prévia da AMAJAC.
            </p>

            <h2 className="text-gray-900 dark:text-gray-50">2. Classificados e Conteúdo de Terceiros</h2>
            <p>
              Os anúncios na seção de Classificados com Avaliação são de responsabilidade dos anunciantes.
              A AMAJAC atua apenas como intermediária e não se responsabiliza pela veracidade das informações.
            </p>

            <h2 className="text-gray-900 dark:text-gray-50">3. Direitos Autorais</h2>
            <p>
              Todo o conteúdo (textos, imagens, logotipos) é de propriedade da AMAJAC ou de seus parceiros,
              protegido por leis de direitos autorais e propriedade intelectual.
            </p>

            <h2 className="text-gray-900 dark:text-gray-50">4. Alterações</h2>
            <p>
              A AMAJAC reserva-se o direito de modificar estes termos a qualquer momento.
              As alterações entrarão em vigor imediatamente após sua publicação no site.
            </p>

            <h2 className="text-gray-900 dark:text-gray-50">5. Contato</h2>
            <p>
              Para dúvidas sobre estes termos, entre em contato por:{' '}
              <a href="mailto:contato@amajac.org.br" className="text-[#2E7D32]">contato@amajac.org.br</a>.
            </p>
          </div>
        </article>
      </div>
    </main>
  );
}
