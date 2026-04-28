import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: noticia } = await supabase
    .from('noticias')
    .select('titulo, resumo')
    .eq('id', id)
    .eq('ativo', true)
    .eq('rascunho', false)
    .single();

  return {
    title: noticia ? `${noticia.titulo} | AMAJAC` : 'Notícia | AMAJAC',
    description: noticia?.resumo || 'Leia a notícia completa no site da AMAJAC.',
  };
}

export default async function NoticiaDetalhePage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: noticia } = await supabase
    .from('noticias')
    .select('*')
    .eq('id', id)
    .eq('ativo', true)
    .eq('rascunho', false)
    .single();

  if (!noticia) {
    notFound();
  }

  // Incrementa visualizações
  await supabase
    .from('noticias')
    .update({ visualizacoes: (noticia.visualizacoes || 0) + 1 })
    .eq('id', id);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const readingTime = noticia.conteudo
    ? Math.ceil(noticia.conteudo.split(/\s+/).length / 200)
    : 0;

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <li>
              <Link href="/" className="hover:text-[#2E7D32] transition-colors">Home</Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/noticias" className="hover:text-[#2E7D32] transition-colors">Notícias</Link>
            </li>
            <li>/</li>
            <li className="text-gray-900 dark:text-gray-300 truncate max-w-[200px]">
              {noticia.titulo}
            </li>
          </ol>
        </nav>

        <article className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <header className="relative">
            {noticia.imagem_url ? (
              <img
                src={noticia.imagem_url}
                alt={noticia.imagem_alt || noticia.titulo}
                className="w-full h-64 md:h-96 object-cover"
              />
            ) : (
              <div className="w-full h-64 md:h-96 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-gray-500 dark:text-gray-400 text-lg">Sem imagem</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center flex-wrap gap-4 mb-4">
                  <time className="text-sm bg-[#2E7D32] bg-opacity-90 px-3 py-1 rounded-full">
                    {formatDate(noticia.data_publicacao)}
                  </time>
                  {noticia.destaque && (
                    <span className="text-sm bg-yellow-500 bg-opacity-90 px-3 py-1 rounded-full flex items-center">
                      ⭐ Destaque
                    </span>
                  )}
                </div>
                <h1 className="text-2xl md:text-4xl font-bold mb-4 leading-tight">
                  {noticia.titulo}
                </h1>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <span className="text-sm opacity-90">
                    Por <strong>{noticia.autor || 'Equipe AMAJAC'}</strong>
                  </span>
                  <div className="flex items-center space-x-4 text-sm opacity-90">
                    <span>👁️ {noticia.visualizacoes || 0} visualizações</span>
                    <span>⏱️ {readingTime} min de leitura</span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div className="p-6 md:p-8">
            <div className="max-w-3xl mx-auto">
              {noticia.resumo && (
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-blue-800 dark:text-blue-200 italic">{noticia.resumo}</p>
                </div>
              )}
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <div className="whitespace-pre-line text-gray-700 dark:text-gray-300 leading-relaxed">
                  {noticia.conteudo}
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <Link
                  href="/noticias"
                  className="inline-flex items-center text-[#2E7D32] hover:text-[#1B5E20] transition-colors"
                >
                  ← Voltar para Notícias
                </Link>
              </div>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
