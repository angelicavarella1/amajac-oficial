<!-- 
Página: Política de Privacidade
Caminho: /privacidade
-->
<template>
	<main class="pagina-institucional">
		<div class="container">
			<article>
				<header class="mb-8">
					<h1 class="text-3xl md:text-4xl font-bold mb-4">Política de Privacidade</h1>
					<p class="text-gray-600 dark:text-gray-400">
						Última atualização: 6 de novembro de 2025
					</p>
				</header>

				<div class="prose prose-gray dark:prose-invert max-w-none">
					<p>
						A AMAJAC – Associação de Moradores e Amigos de Itaipuaçu tem o compromisso com a transparência e a segurança de seus usuários. Esta política descreve como coletamos, usamos e protegemos as informações fornecidas em nosso site.
					</p>

					<h2>1. Coleta de Informações</h2>
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

					<h2>2. Uso das Informações</h2>
					<p>
						As informações coletadas são utilizadas para os seguintes propósitos:
					</p>
					<p>
						Para operar, manter e melhorar nosso site. Para responder a mensagens, solicitações de contato e fornecer suporte. Para enviar comunicações periódicas (como newsletters, se aplicável, mediante consentimento).
					</p>

					<h2>3. Compartilhamento de Dados</h2>
					<p>
						A AMAJAC não vende, aluga ou compartilha suas informações pessoais com terceiros, exceto nas seguintes circunstâncias:
					</p>
					<ul>
						<li>Quando exigido por lei ou ordem judicial.</li>
						<li>Com parceiros de serviço (como o Supabase para autenticação) que nos ajudam na operação do site, e que concordam em manter a confidencialidade das informações.</li>
						<li>Em relação a anúncios na seção de Classificados, as informações de contato do anunciante são compartilhadas publicamente, conforme consentimento no momento da publicação.</li>
					</ul>

					<h2>4. Segurança dos Dados</h2>
					<p>
						Empregamos medidas de segurança técnicas e administrativas razoáveis para proteger as informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição. No entanto, nenhum método de transmissão pela Internet ou armazenamento eletrônico é 100% seguro.
					</p>

					<h2>5. Seus Direitos</h2>
					<p>
						Você tem o direito de acessar, corrigir ou excluir as informações pessoais que mantemos sobre você. Para exercer esses direitos, entre em contato conosco através do e-mail listado abaixo.
					</p>

					<h2>6. Alterações desta Política</h2>
					<p>
						Reservamo-nos o direito de atualizar esta política de privacidade a qualquer momento. Quaisquer alterações serão publicadas nesta página com uma data de "Última atualização" revisada.
					</p>

					<h2>7. Contato</h2>
					<p>
						Para quaisquer dúvidas sobre esta política, entre em contato com:
						<a href="mailto:contato@amajac.org.br" class="text-amajac-green">contato@amajac.org.br</a>.
					</p>
				</div>
			</article>
		</div>
	</main>
</template>

<script setup>
// Este componente não requer lógica complexa, apenas exibe o conteúdo estático.
</script>

<style scoped>
/* Reutilizando os estilos da página de Termos para consistência */
.pagina-institucional {
	padding: 4rem 1rem;
	background-color: #f9fafb;
}
.dark .pagina-institucional {
	background-color: #111827;
	color: #f9fafb;
}
.container {
	max-width: 800px;
	margin: 0 auto;
}
.text-amajac-green { color: #2E7D32; }
/* Estilos para garantir que o texto dentro do 'prose' (Tailwind Typography) respeite o modo escuro */
.prose h1,
.prose h2,
.prose h3 {
	color: #1f2937;
}
.dark .prose h1,
.dark .prose h2,
.dark .prose h3 {
	color: #f9fafb;
}
</style>