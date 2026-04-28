'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/core/utils/supabaseClient';

type Evento = {
  id: string;
  created_at: string;
  updated_at?: string;
  titulo: string;
  descricao: string;
  data_evento: string;
  horario: string;
  local: string;
  destaque: boolean;
  ativo: boolean;
  imagem_url: string;
  imagem_alt: string;
};

export default function AdminEventosPage() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [mostrarModalForm, setMostrarModalForm] = useState(false);
  const [eventoEditando, setEventoEditando] = useState<Evento | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    data_evento: new Date().toISOString().split('T')[0],
    horario: '12:00',
    local: '',
    destaque: false,
    ativo: true,
    imagem_url: '',
    imagem_alt: ''
  });

  const fetchEventos = async () => {
    setLoading(true);
    try {
      const { data, error: err } = await supabase
        .from('eventos')
        .select('*')
        .order('data_evento', { ascending: false });
        
      if (err) throw err;
      setEventos(data as Evento[]);
    } catch (err: any) {
      console.error('Erro ao buscar eventos:', err);
      setError('Falha ao carregar a lista de eventos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  const handleDelete = async (id: string, titulo: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir "${titulo}"?`)) return;
    try {
      const { error: err } = await supabase.from('eventos').delete().eq('id', id);
      if (err) throw err;
      setEventos(prev => prev.filter(e => e.id !== id));
    } catch (err: any) {
      console.error('Erro ao deletar evento:', err);
      alert('Erro ao excluir. Tente novamente.');
    }
  };

  const toggleBoolean = async (id: string, field: 'ativo' | 'destaque', currentValue: boolean) => {
    try {
      const updates = { [field]: !currentValue, updated_at: new Date().toISOString() };
      const { error: err } = await supabase.from('eventos').update(updates).eq('id', id);
      if (err) throw err;
      setEventos(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
    } catch (err: any) {
      console.error(`Erro ao alternar ${field}:`, err);
      alert(`Erro ao alterar ${field}.`);
    }
  };

  const abrirModalCriar = () => {
    setEventoEditando(null);
    const now = new Date();
    setFormData({
      titulo: '', descricao: '',
      data_evento: now.toISOString().split('T')[0],
      horario: now.toTimeString().slice(0, 5),
      local: '', destaque: false, ativo: true,
      imagem_url: '', imagem_alt: ''
    });
    setMostrarModalForm(true);
  };

  const abrirModalEditar = (e: Evento) => {
    setEventoEditando(e);
    setFormData({
      titulo: e.titulo || '',
      descricao: e.descricao || '',
      data_evento: e.data_evento ? e.data_evento.split('T')[0] : '',
      horario: e.horario || '12:00',
      local: e.local || '',
      destaque: e.destaque ?? false,
      ativo: e.ativo ?? true,
      imagem_url: e.imagem_url || '',
      imagem_alt: e.imagem_alt || ''
    });
    setMostrarModalForm(true);
  };

  const fecharModal = () => {
    setMostrarModalForm(false);
    setEventoEditando(null);
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const updates: any = {
        ...formData,
        updated_at: new Date().toISOString()
      };

      if (eventoEditando) {
        const { error: err } = await supabase.from('eventos').update(updates).eq('id', eventoEditando.id);
        if (err) throw err;
        setEventos(prev => prev.map(ev => ev.id === eventoEditando.id ? { ...ev, ...updates } : ev));
      } else {
        updates.created_at = new Date().toISOString();
        const { data, error: err } = await supabase.from('eventos').insert([updates]).select().single();
        if (err) throw err;
        if (data) {
          setEventos(prev => [data as Evento, ...prev]);
        }
      }
      fecharModal();
    } catch (err: any) {
      console.error('Erro ao salvar evento:', err);
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

      const { error: uploadError } = await supabase.storage.from('eventos').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('eventos').getPublicUrl(filePath);
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

  const isPassado = (dataString: string) => {
    if (!dataString) return false;
    const dataEvento = new Date(dataString);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    return dataEvento < hoje;
  };

  return (
    <div className="min-h-screen pb-8">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Gerenciar Eventos
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Administre a agenda de eventos da AMAJAC
          </p>
        </div>

        <div className="mb-6 flex justify-between items-center">
          <button
            onClick={abrirModalCriar}
            className="px-4 py-2 bg-[#2E7D32] text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Novo Evento
          </button>
        </div>

        {/* Tabela */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Evento</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Data / Hora</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Local</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Destaque</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      Carregando eventos...
                    </td>
                  </tr>
                ) : eventos.length > 0 ? (
                  eventos.map((e) => {
                    const passado = isPassado(e.data_evento);
                    return (
                      <tr key={e.id} className={`hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors ${passado ? 'opacity-70' : ''}`}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {e.imagem_url ? (
                              <img src={e.imagem_url} alt={e.titulo} className="w-10 h-10 rounded object-cover" />
                            ) : (
                              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center text-gray-400">
                                📅
                              </div>
                            )}
                            <div className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-xs" title={e.titulo}>
                              {e.titulo}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm font-medium ${passado ? 'text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                            {formatarData(e.data_evento)}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {e.horario}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 dark:text-white truncate max-w-[200px]" title={e.local}>
                            {e.local}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button
                            onClick={() => toggleBoolean(e.id, 'destaque', e.destaque)}
                            className={`text-xl focus:outline-none transition-colors ${e.destaque ? 'text-amber-500 hover:text-amber-600' : 'text-gray-300 dark:text-gray-600 hover:text-gray-400'}`}
                            title={e.destaque ? "Remover destaque" : "Destacar evento"}
                          >
                            ★
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button 
                            onClick={() => toggleBoolean(e.id, 'ativo', e.ativo)} 
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full hover:opacity-80 transition-opacity ${
                              e.ativo 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}
                            title={e.ativo ? "Ocultar" : "Mostrar"}
                          >
                            {e.ativo ? 'Ativo' : 'Inativo'}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button onClick={() => abrirModalEditar(e)} className="text-[#2E7D32] hover:text-green-700 mr-3 transition-colors text-lg" title="Editar">✎</button>
                          <button onClick={() => handleDelete(e.id, e.titulo)} className="text-red-500 hover:text-red-700 transition-colors text-lg" title="Excluir">×</button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex flex-col items-center justify-center">
                        <span className="text-4xl mb-3">📅</span>
                        <p>Nenhum evento cadastrado.</p>
                      </div>
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
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#2E7D32] dark:text-[#4CAF50]">
                {eventoEditando ? 'Editar Evento' : 'Novo Evento'}
              </h2>
              <button onClick={fecharModal} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl leading-none">&times;</button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="eventoForm" onSubmit={handleSalvar} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título *</label>
                    <input type="text" required maxLength={150} value={formData.titulo} onChange={e => setFormData({...formData, titulo: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-[#2E7D32]" />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descrição *</label>
                    <textarea required rows={4} value={formData.descricao} onChange={e => setFormData({...formData, descricao: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data *</label>
                    <input type="date" required value={formData.data_evento} onChange={e => setFormData({...formData, data_evento: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Horário *</label>
                    <input type="time" required value={formData.horario} onChange={e => setFormData({...formData, horario: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Local *</label>
                    <input type="text" required maxLength={200} value={formData.local} onChange={e => setFormData({...formData, local: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Imagem do Evento {uploading && <span className="text-sm text-green-600">(Enviando...)</span>}
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
                    <div className="flex flex-col justify-end pb-[2px]">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Texto Alternativo da Imagem *</label>
                      <input type="text" required maxLength={200} value={formData.imagem_alt} onChange={e => setFormData({...formData, imagem_alt: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-6 pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.destaque} onChange={e => setFormData({...formData, destaque: e.target.checked})} className="w-4 h-4 text-[#2E7D32] rounded focus:ring-[#2E7D32]" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Em Destaque</span>
                  </label>
                  
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.ativo} onChange={e => setFormData({...formData, ativo: e.target.checked})} className="w-4 h-4 text-[#2E7D32] rounded focus:ring-[#2E7D32]" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Ativo (Público)</span>
                  </label>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3 bg-gray-50 dark:bg-gray-800">
              <button type="button" onClick={fecharModal} className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                Cancelar
              </button>
              <button type="submit" form="eventoForm" disabled={isSubmitting || uploading} className="px-4 py-2 bg-[#2E7D32] hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-70 flex items-center gap-2">
                {isSubmitting ? 'Salvando...' : (eventoEditando ? 'Atualizar Evento' : 'Criar Evento')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
