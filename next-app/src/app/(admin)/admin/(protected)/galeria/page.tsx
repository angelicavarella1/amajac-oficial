'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/core/utils/supabaseClient';

type Imagem = {
  id: string;
  created_at: string;
  titulo: string;
  imagem_url: string;
  imagem_alt: string;
  descricao: string;
  categoria: string;
};

const categoriasOptions = ['geral', 'eventos', 'obras', 'natureza', 'comunidade', 'historica', 'institucional'];

export default function AdminGaleriaPage() {
  const [imagens, setImagens] = useState<Imagem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mostrarModalForm, setMostrarModalForm] = useState(false);
  const [imagemEditando, setImagemEditando] = useState<Imagem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    categoria: 'geral',
    imagem_url: '',
    imagem_alt: '',
  });

  const fetchImagens = async () => {
    setLoading(true);
    try {
      const { data, error: err } = await supabase.from('galeria').select('*').order('created_at', { ascending: false });
      if (err) throw err;
      setImagens(data as Imagem[]);
    } catch (err: any) {
      console.error('Erro ao buscar galeria:', err);
      setError('Falha ao carregar a galeria.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImagens();
  }, []);

  const handleDelete = async (id: string, titulo: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir "${titulo}"?`)) return;
    try {
      const { error: err } = await supabase.from('galeria').delete().eq('id', id);
      if (err) throw err;
      setImagens((prev) => prev.filter((i) => i.id !== id));
    } catch (err: any) {
      console.error('Erro ao deletar imagem:', err);
      alert('Erro ao excluir. Tente novamente.');
    }
  };

  const abrirModalCriar = () => {
    setImagemEditando(null);
    setFormData({ titulo: '', descricao: '', categoria: 'geral', imagem_url: '', imagem_alt: '' });
    setMostrarModalForm(true);
  };

  const abrirModalEditar = (img: Imagem) => {
    setImagemEditando(img);
    setFormData({
      titulo: img.titulo || '',
      descricao: img.descricao || '',
      categoria: img.categoria || 'geral',
      imagem_url: img.imagem_url || '',
      imagem_alt: img.imagem_alt || '',
    });
    setMostrarModalForm(true);
  };

  const fecharModal = () => {
    setMostrarModalForm(false);
    setImagemEditando(null);
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const updates: any = { ...formData, updated_at: new Date().toISOString() };
      if (imagemEditando) {
        const { error: err } = await supabase.from('galeria').update(updates).eq('id', imagemEditando.id);
        if (err) throw err;
        setImagens((prev) => prev.map((i) => (i.id === imagemEditando.id ? { ...i, ...updates } : i)));
      } else {
        updates.created_at = new Date().toISOString();
        const { data, error: err } = await supabase.from('galeria').insert([updates]).select().single();
        if (err) throw err;
        if (data) setImagens((prev) => [data as Imagem, ...prev]);
      }
      fecharModal();
    } catch (err: any) {
      console.error('Erro ao salvar imagem:', err);
      alert('Erro ao salvar. Tente novamente.');
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
      const fileName = `${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('galeria').upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('galeria').getPublicUrl(fileName);
      setFormData((prev) => ({ ...prev, imagem_url: publicUrl }));
    } catch (err: any) {
      console.error('Erro no upload:', err);
      alert('Erro ao fazer upload da imagem.');
    } finally {
      setUploading(false);
    }
  };

  const totalImagens = imagens.length;
  const categoriasUnicas = new Set(imagens.map((i) => i.categoria)).size;

  return (
    <div className="min-h-screen pb-8">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Gerenciar Galeria de Imagens</h1>
          <p className="text-gray-600 dark:text-gray-400">Administre as imagens da galeria</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total de Imagens</p>
            <p className="text-2xl font-bold text-[#2E7D32] dark:text-[#4CAF50]">{totalImagens}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Categorias</p>
            <p className="text-2xl font-bold text-[#2E7D32] dark:text-[#4CAF50]">{categoriasUnicas}</p>
          </div>
        </div>

        <div className="mb-6 flex justify-between items-center">
          <button onClick={abrirModalCriar} className="px-4 py-2 bg-[#2E7D32] text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 font-medium">
            + Nova Imagem
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Imagem</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Título</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Categoria</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Descrição</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {loading ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Carregando galeria...</td></tr>
                ) : imagens.length > 0 ? (
                  imagens.map((img) => (
                    <tr key={img.id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                      <td className="px-6 py-4">
                        {img.imagem_url ? (
                          <img src={img.imagem_url} alt={img.imagem_alt} className="w-16 h-16 rounded object-cover" />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center text-gray-400">🖼️</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{img.titulo}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 capitalize">
                          {img.categoria}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300 max-w-xs truncate">{img.descricao || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => abrirModalEditar(img)} className="text-[#2E7D32] hover:text-green-700 mr-3 transition-colors text-lg" title="Editar">✎</button>
                        <button onClick={() => handleDelete(img.id, img.titulo)} className="text-red-500 hover:text-red-700 transition-colors text-lg" title="Excluir">×</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500">Nenhuma imagem encontrada.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          {error && <div className="p-4 bg-red-50 text-red-700 text-sm border-t border-red-200">{error}</div>}
        </div>
      </div>

      {mostrarModalForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#2E7D32] dark:text-[#4CAF50]">{imagemEditando ? 'Editar Imagem' : 'Nova Imagem'}</h2>
              <button onClick={fecharModal} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 text-2xl leading-none">&times;</button>
            </div>
            <div className="p-6 overflow-y-auto">
              <form id="galeriaForm" onSubmit={handleSalvar} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título *</label>
                  <input type="text" required value={formData.titulo} onChange={(e) => setFormData({ ...formData, titulo: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descrição</label>
                  <textarea rows={3} value={formData.descricao} onChange={(e) => setFormData({ ...formData, descricao: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categoria *</label>
                  <select required value={formData.categoria} onChange={(e) => setFormData({ ...formData, categoria: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white">
                    {categoriasOptions.map((c) => (
                      <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Imagem {uploading && <span className="text-green-600">(Enviando...)</span>}
                  </label>
                  <div className="flex flex-col gap-2">
                    {formData.imagem_url && <img src={formData.imagem_url} alt="Preview" className="w-full h-32 object-cover rounded-lg" />}
                    <input type="file" accept="image/*" onChange={uploadImagem} disabled={uploading} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Texto Alternativo *</label>
                  <input type="text" required value={formData.imagem_alt} onChange={(e) => setFormData({ ...formData, imagem_alt: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
                </div>
              </form>
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3 bg-gray-50 dark:bg-gray-800">
              <button type="button" onClick={fecharModal} className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50">Cancelar</button>
              <button type="submit" form="galeriaForm" disabled={isSubmitting || uploading} className="px-4 py-2 bg-[#2E7D32] hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-70">
                {isSubmitting ? 'Salvando...' : (imagemEditando ? 'Atualizar' : 'Criar')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
