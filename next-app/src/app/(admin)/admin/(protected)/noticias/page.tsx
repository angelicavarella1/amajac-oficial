'use client';

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/core/utils/supabaseClient';

type Noticia = {
  id: string;
  created_at: string;
  updated_at?: string;
  titulo: string;
  categoria: string;
  resumo: string;
  conteudo: string;
  data_publicacao: string;
  autor: string;
  destaque: boolean;
  ativo: boolean;
  rascunho: boolean;
  imagem_url: string;
  imagem_alt: string;
  visualizacoes: number;
};

export default function AdminNoticiasPage() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<'todos' | 'publicados' | 'rascunhos' | 'destaques'>('todos');
  
  const [mostrarModalForm, setMostrarModalForm] = useState(false);
  const [noticiaEditando, setNoticiaEditando] = useState<Noticia | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Uploading state
  const [uploading, setUploading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    titulo: '',
    categoria: '',
    resumo: '',
    conteudo: '',
    data_publicacao: new Date().toISOString().split('T')[0],
    autor: '',
    destaque: false,
    ativo: true,
    rascunho: false,
    imagem_url: '',
    imagem_alt: '',
    visualizacoes: 0
  });

  const fetchNoticias = async () => {
    setLoading(true);
    try {
      const { data, error: err } = await supabase
        .from('noticias')
        .select('*')
        .order('data_publicacao', { ascending: false });
        
      if (err) throw err;
      setNoticias(data as Noticia[]);
    } catch (err: any) {
      console.error('Erro ao buscar noticias:', err);
      setError('Falha ao carregar a lista de notícias.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNoticias();
  }, []);

  const noticiasFiltradas = useMemo(() => {
    return noticias.filter(n => {
      // Filtro de texto
      const matchesSearch = searchTerm === '' || 
        n.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        n.resumo?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filtro de status
      let matchesStatus = true;
      if (filtroStatus === 'publicados') matchesStatus = n.ativo && !n.rascunho;
      if (filtroStatus === 'rascunhos') matchesStatus = n.rascunho;
      if (filtroStatus === 'destaques') matchesStatus = n.destaque;

      return matchesSearch && matchesStatus;
    });
  }, [noticias, searchTerm, filtroStatus]);

  const handleDelete = async (id: string, titulo: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir "${titulo}"?`)) return;
    try {
      const { error: err } = await supabase.from('noticias').delete().eq('id', id);
      if (err) throw err;
      setNoticias(prev => prev.filter(n => n.id !== id));
    } catch (err: any) {
      console.error('Erro ao deletar noticia:', err);
      alert('Erro ao excluir. Tente novamente.');
    }
  };

  const toggleBoolean = async (id: string, field: 'ativo' | 'destaque' | 'rascunho', currentValue: boolean) => {
    try {
      const updates: any = { [field]: !currentValue, updated_at: new Date().toISOString() };
      
      // Regras de negócio associadas
      if (field === 'rascunho' && !currentValue) {
        updates.ativo = false; // se virou rascunho, não é ativo
      }
      if (field === 'ativo' && !currentValue) {
        updates.rascunho = false; // se ativou, não é mais rascunho
      }

      const { error: err } = await supabase.from('noticias').update(updates).eq('id', id);
      if (err) throw err;
      
      setNoticias(prev => prev.map(n => n.id === id ? { ...n, ...updates } : n));
    } catch (err: any) {
      console.error(`Erro ao alternar ${field}:`, err);
      alert(`Erro ao alterar ${field}.`);
    }
  };

  const abrirModalCriar = () => {
    setNoticiaEditando(null);
    setFormData({
      titulo: '', categoria: '', resumo: '', conteudo: '',
      data_publicacao: new Date().toISOString().split('T')[0],
      autor: '', destaque: false, ativo: true, rascunho: false,
      imagem_url: '', imagem_alt: '', visualizacoes: 0
    });
    setMostrarModalForm(true);
  };

  const abrirModalEditar = (n: Noticia) => {
    setNoticiaEditando(n);
    setFormData({
      titulo: n.titulo || '',
      categoria: n.categoria || '',
      resumo: n.resumo || '',
      conteudo: n.conteudo || '',
      data_publicacao: n.data_publicacao ? n.data_publicacao.split('T')[0] : new Date().toISOString().split('T')[0],
      autor: n.autor || '',
      destaque: n.destaque ?? false,
      ativo: n.ativo ?? true,
      rascunho: n.rascunho ?? false,
      imagem_url: n.imagem_url || '',
      imagem_alt: n.imagem_alt || '',
      visualizacoes: n.visualizacoes || 0
    });
    setMostrarModalForm(true);
  };

  const fecharModal = () => {
    setMostrarModalForm(false);
    setNoticiaEditando(null);
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const updates: any = {
        ...formData,
        updated_at: new Date().toISOString()
      };

      if (updates.rascunho) updates.ativo = false;

      if (noticiaEditando) {
        const { error: err } = await supabase
          .from('noticias')
          .update(updates)
          .eq('id', noticiaEditando.id);
        if (err) throw err;
        
        setNoticias(prev => prev.map(n => n.id === noticiaEditando.id ? { ...n, ...updates } : n));
      } else {
        updates.created_at = new Date().toISOString();

        const { data, error: err } = await supabase
          .from('noticias')
          .insert([updates])
          .select()
          .single();
        if (err) throw err;
        if (data) {
          setNoticias(prev => [data as Noticia, ...prev]);
        }
      }
      fecharModal();
    } catch (err: any) {
      console.error('Erro ao salvar noticia:', err);
      alert('Erro ao salvar. Verifique os dados e tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const uploadImagem = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = e.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('noticias')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('noticias').getPublicUrl(filePath);
      
      setFormData(prev => ({ ...prev, imagem_url: publicUrl }));
    } catch (err: any) {
      console.error('Erro no upload da imagem:', err);
      alert('Erro ao fazer upload da imagem.');
    } finally {
      setUploading(false);
    }
  };

  const formatarData = (dataString: string | null | undefined) => {
    if (!dataString) return '';
    return new Date(dataString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="min-h-screen pb-8">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Gestão de Notícias
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie as notícias e artigos do site
          </p>
        </div>

        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <button
            onClick={abrirModalCriar}
            className="px-4 py-2 bg-[#2E7D32] text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Nova Notícia
          </button>

          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <input 
              type="text" 
              placeholder="Buscar notícias..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            
            <div className="flex flex-wrap gap-2">
              {(['todos', 'publicados', 'rascunhos', 'destaques'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFiltroStatus(status)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    filtroStatus === status 
                      ? 'bg-[#2E7D32] text-white' 
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tabela */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Título</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Publicação</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Destaque</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      Carregando notícias...
                    </td>
                  </tr>
                ) : noticiasFiltradas.length > 0 ? (
                  noticiasFiltradas.map((n) => (
                    <tr key={n.id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {n.imagem_url ? (
                            <img src={n.imagem_url} alt={n.titulo} className="w-12 h-12 rounded object-cover" />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center text-gray-400">
                              📷
                            </div>
                          )}
                          <div className="max-w-xs">
                            <div className="text-sm font-medium text-gray-900 dark:text-white truncate" title={n.titulo}>
                              {n.titulo}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 capitalize">
                              {n.categoria} • {n.autor || 'AMAJAC'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white font-medium">
                          {formatarData(n.data_publicacao)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                          👁️ {n.visualizacoes || 0} views
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => toggleBoolean(n.id, 'destaque', n.destaque)}
                          className={`text-xl focus:outline-none transition-colors ${n.destaque ? 'text-amber-500 hover:text-amber-600' : 'text-gray-300 dark:text-gray-600 hover:text-gray-400'}`}
                          title={n.destaque ? "Remover destaque" : "Destacar notícia"}
                        >
                          ★
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {n.rascunho ? (
                          <button 
                            onClick={() => toggleBoolean(n.id, 'ativo', false)} 
                            className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 hover:bg-yellow-200"
                            title="Clique para publicar"
                          >
                            Rascunho
                          </button>
                        ) : (
                          <button 
                            onClick={() => toggleBoolean(n.id, 'ativo', n.ativo)} 
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full hover:opacity-80 transition-opacity ${
                              n.ativo 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}
                            title={n.ativo ? "Ocultar" : "Mostrar"}
                          >
                            {n.ativo ? 'Publicado' : 'Oculto'}
                          </button>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => abrirModalEditar(n)} className="text-[#2E7D32] hover:text-green-700 mr-3 transition-colors text-lg" title="Editar">✎</button>
                        <button onClick={() => handleDelete(n.id, n.titulo)} className="text-red-500 hover:text-red-700 transition-colors text-lg" title="Excluir">×</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                      Nenhuma notícia encontrada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {error && <div className="p-4 bg-red-50 text-red-700 text-sm border-t border-red-200">{error}</div>}
        </div>
      </div>

      {/* Modal Form */}
      {mostrarModalForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#2E7D32] dark:text-[#4CAF50]">
                {noticiaEditando ? 'Editar Notícia' : 'Nova Notícia'}
              </h2>
              <button onClick={fecharModal} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl leading-none">&times;</button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="noticiaForm" onSubmit={handleSalvar} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título *</label>
                    <input type="text" required maxLength={150} value={formData.titulo} onChange={e => setFormData({...formData, titulo: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-[#2E7D32]" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categoria *</label>
                    <select required value={formData.categoria} onChange={e => setFormData({...formData, categoria: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                      <option value="">Selecione uma categoria</option>
                      <option value="comunidade">Comunidade</option>
                      <option value="eventos">Eventos</option>
                      <option value="obras">Obras e Infraestrutura</option>
                      <option value="administracao">Administração</option>
                      <option value="seguranca">Segurança</option>
                      <option value="meio-ambiente">Meio Ambiente</option>
                      <option value="saude">Saúde</option>
                      <option value="educacao">Educação</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data de Publicação *</label>
                    <input type="date" required value={formData.data_publicacao} onChange={e => setFormData({...formData, data_publicacao: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Resumo *</label>
                    <textarea required rows={2} maxLength={300} value={formData.resumo} onChange={e => setFormData({...formData, resumo: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"></textarea>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Conteúdo Completo *</label>
                    <textarea required rows={6} value={formData.conteudo} onChange={e => setFormData({...formData, conteudo: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Autor</label>
                    <input type="text" maxLength={100} value={formData.autor} onChange={e => setFormData({...formData, autor: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" placeholder="AMAJAC" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Imagem de Capa {uploading && <span className="text-sm text-green-600">(Enviando...)</span>}
                    </label>
                    <div className="flex flex-col gap-2">
                      {formData.imagem_url && (
                        <div className="relative w-full h-32 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
                          <img src={formData.imagem_url} alt="Capa" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={uploadImagem} 
                        disabled={uploading}
                        className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 dark:file:bg-gray-700 dark:file:text-white"
                      />
                    </div>
                  </div>

                  {formData.imagem_url && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Texto Alternativo da Imagem (Acessibilidade)</label>
                      <input type="text" maxLength={200} value={formData.imagem_alt} onChange={e => setFormData({...formData, imagem_alt: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-6 pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.destaque} onChange={e => setFormData({...formData, destaque: e.target.checked})} className="w-4 h-4 text-[#2E7D32] rounded focus:ring-[#2E7D32]" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Em Destaque</span>
                  </label>
                  
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.ativo} onChange={e => setFormData({...formData, ativo: e.target.checked, rascunho: e.target.checked ? false : formData.rascunho})} className="w-4 h-4 text-[#2E7D32] rounded focus:ring-[#2E7D32]" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Publicado (Ativo)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.rascunho} onChange={e => setFormData({...formData, rascunho: e.target.checked, ativo: e.target.checked ? false : formData.ativo})} className="w-4 h-4 text-yellow-500 rounded focus:ring-yellow-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Salvar como Rascunho</span>
                  </label>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3 bg-gray-50 dark:bg-gray-800">
              <button type="button" onClick={fecharModal} className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                Cancelar
              </button>
              <button type="submit" form="noticiaForm" disabled={isSubmitting || uploading} className="px-4 py-2 bg-[#2E7D32] hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-70 flex items-center gap-2">
                {isSubmitting ? 'Salvando...' : formData.rascunho ? 'Salvar Rascunho' : (noticiaEditando ? 'Atualizar Notícia' : 'Publicar Notícia')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
