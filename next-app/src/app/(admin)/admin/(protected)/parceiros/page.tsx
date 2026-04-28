'use client';

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/core/utils/supabaseClient';

type Parceiro = {
  id: string;
  created_at: string;
  nome: string;
  ramo: string;
  logo_url: string;
  link_site: string;
  instagram: string;
  facebook: string;
  ativo: boolean;
  telefone: string;
  email: string;
};

export default function AdminParceirosPage() {
  const [parceiros, setParceiros] = useState<Parceiro[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mostrarModalForm, setMostrarModalForm] = useState(false);
  const [parceiroEditando, setParceiroEditando] = useState<Parceiro | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    nome: '',
    ramo: '',
    telefone: '',
    email: '',
    link_site: '',
    instagram: '',
    facebook: '',
    logo_url: '',
    ativo: true,
  });

  const fetchParceiros = async () => {
    setLoading(true);
    try {
      const { data, error: err } = await supabase
        .from('parceiros_comerciais')
        .select('*')
        .order('nome', { ascending: true });
      if (err) throw err;
      setParceiros(data as Parceiro[]);
    } catch (err: any) {
      console.error('Erro ao buscar parceiros:', err);
      setError('Falha ao carregar a lista de parceiros.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParceiros();
  }, []);

  const handleDelete = async (id: string, nome: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir "${nome}"?`)) return;
    try {
      const { error: err } = await supabase.from('parceiros_comerciais').delete().eq('id', id);
      if (err) throw err;
      setParceiros((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      console.error('Erro ao deletar parceiro:', err);
      alert('Erro ao excluir. Tente novamente.');
    }
  };

  const abrirModalCriar = () => {
    setParceiroEditando(null);
    setFormData({ nome: '', ramo: '', telefone: '', email: '', link_site: '', instagram: '', facebook: '', logo_url: '', ativo: true });
    setMostrarModalForm(true);
  };

  const abrirModalEditar = (p: Parceiro) => {
    setParceiroEditando(p);
    setFormData({
      nome: p.nome || '',
      ramo: p.ramo || '',
      telefone: p.telefone || '',
      email: p.email || '',
      link_site: p.link_site || '',
      instagram: p.instagram || '',
      facebook: p.facebook || '',
      logo_url: p.logo_url || '',
      ativo: p.ativo ?? true,
    });
    setMostrarModalForm(true);
  };

  const fecharModal = () => {
    setMostrarModalForm(false);
    setParceiroEditando(null);
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const updates: any = { ...formData, updated_at: new Date().toISOString() };
      if (parceiroEditando) {
        const { error: err } = await supabase.from('parceiros_comerciais').update(updates).eq('id', parceiroEditando.id);
        if (err) throw err;
        setParceiros((prev) => prev.map((p) => (p.id === parceiroEditando.id ? { ...p, ...updates } : p)));
      } else {
        updates.created_at = new Date().toISOString();
        const { data, error: err } = await supabase.from('parceiros_comerciais').insert([updates]).select().single();
        if (err) throw err;
        if (data) setParceiros((prev) => [data as Parceiro, ...prev]);
      }
      fecharModal();
    } catch (err: any) {
      console.error('Erro ao salvar parceiro:', err);
      alert('Erro ao salvar. Verifique os dados e tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const uploadLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = e.target.files?.[0];
      if (!file) return;
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('logos').upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('logos').getPublicUrl(fileName);
      setFormData((prev) => ({ ...prev, logo_url: publicUrl }));
    } catch (err: any) {
      console.error('Erro no upload do logo:', err);
      alert('Erro ao fazer upload do logo.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen pb-8">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Gerenciar Parceiros Comerciais</h1>
          <p className="text-gray-600 dark:text-gray-400">Administre os parceiros e colaboradores da AMAJAC</p>
        </div>

        <div className="mb-6 flex justify-between items-center">
          <button onClick={abrirModalCriar} className="px-4 py-2 bg-[#2E7D32] text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 font-medium">
            + Novo Parceiro
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Parceiro</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Ramo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Contato</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {loading ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Carregando parceiros...</td></tr>
                ) : parceiros.length > 0 ? (
                  parceiros.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {p.logo_url ? (
                            <img src={p.logo_url} alt={p.nome} className="w-10 h-10 rounded object-cover" />
                          ) : (
                            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center text-gray-400">🏢</div>
                          )}
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{p.nome}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">{p.ramo || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                        <div className="space-y-1">
                          {p.telefone && <div>📱 {p.telefone}</div>}
                          {p.email && <div className="truncate max-w-[150px]">📧 {p.email}</div>}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${p.ativo ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                          {p.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => abrirModalEditar(p)} className="text-[#2E7D32] hover:text-green-700 mr-3 transition-colors text-lg" title="Editar">✎</button>
                        <button onClick={() => handleDelete(p.id, p.nome)} className="text-red-500 hover:text-red-700 transition-colors text-lg" title="Excluir">×</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500">Nenhum parceiro encontrado.</td></tr>
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
              <h2 className="text-xl font-bold text-[#2E7D32] dark:text-[#4CAF50]">{parceiroEditando ? 'Editar Parceiro' : 'Novo Parceiro'}</h2>
              <button onClick={fecharModal} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 text-2xl leading-none">&times;</button>
            </div>
            <div className="p-6 overflow-y-auto">
              <form id="parceiroForm" onSubmit={handleSalvar} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome *</label>
                    <input type="text" required value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ramo</label>
                    <input type="text" value={formData.ramo} onChange={(e) => setFormData({ ...formData, ramo: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Telefone</label>
                    <input type="text" value={formData.telefone} onChange={(e) => setFormData({ ...formData, telefone: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">E-mail</label>
                    <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Site</label>
                    <input type="url" value={formData.link_site} onChange={(e) => setFormData({ ...formData, link_site: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Instagram</label>
                    <input type="text" value={formData.instagram} onChange={(e) => setFormData({ ...formData, instagram: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" placeholder="@usuario" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Facebook</label>
                    <input type="text" value={formData.facebook} onChange={(e) => setFormData({ ...formData, facebook: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Logo {uploading && <span className="text-green-600">(Enviando...)</span>}</label>
                    <div className="flex flex-col gap-2">
                      {formData.logo_url && <img src={formData.logo_url} alt="Logo" className="w-20 h-20 object-contain" />}
                      <input type="file" accept="image/*" onChange={uploadLogo} disabled={uploading} className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700" />
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.ativo} onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })} className="w-4 h-4 text-[#2E7D32] rounded" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Ativo</span>
                  </label>
                </div>
              </form>
            </div>
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3 bg-gray-50 dark:bg-gray-800">
              <button type="button" onClick={fecharModal} className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50">Cancelar</button>
              <button type="submit" form="parceiroForm" disabled={isSubmitting || uploading} className="px-4 py-2 bg-[#2E7D32] hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-70">
                {isSubmitting ? 'Salvando...' : (parceiroEditando ? 'Atualizar' : 'Criar')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
