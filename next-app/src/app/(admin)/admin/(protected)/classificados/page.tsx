'use client';

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/core/utils/supabaseClient';

type Classificado = {
  id: string;
  created_at: string;
  updated_at?: string;
  titulo: string;
  descricao: string;
  categoria: string;
  telefone: string;
  nome_anunciante: string;
  bairro: string;
  email?: string;
  ativo: boolean;
  aprovado: boolean;
  data_aprovacao?: string | null;
};

export default function AdminClassificadosPage() {
  const [classificados, setClassificados] = useState<Classificado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filtroStatus, setFiltroStatus] = useState<'todos' | 'ativos' | 'pendentes'>('todos');
  
  const [mostrarModalForm, setMostrarModalForm] = useState(false);
  const [classificadoEditando, setClassificadoEditando] = useState<Classificado | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    categoria: '',
    telefone: '',
    nome_anunciante: '',
    bairro: '',
    email: '',
    ativo: true,
    aprovado: false
  });

  const fetchClassificados = async () => {
    setLoading(true);
    try {
      const { data, error: err } = await supabase
        .from('classificados')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (err) throw err;
      setClassificados(data as Classificado[]);
    } catch (err: any) {
      console.error('Erro ao buscar classificados:', err);
      setError('Falha ao carregar a lista de classificados.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassificados();
  }, []);

  const classificadosFiltrados = useMemo(() => {
    if (filtroStatus === 'todos') return classificados;
    if (filtroStatus === 'pendentes') return classificados.filter(c => !c.aprovado && c.ativo);
    if (filtroStatus === 'ativos') return classificados.filter(c => c.ativo && c.aprovado);
    return classificados;
  }, [classificados, filtroStatus]);

  const handleDelete = async (id: string, titulo: string) => {
    if (!window.confirm(`Tem certeza que deseja excluir "${titulo}"? Esta ação não pode ser desfeita.`)) return;
    try {
      const { error: err } = await supabase.from('classificados').delete().eq('id', id);
      if (err) throw err;
      setClassificados(prev => prev.filter(c => c.id !== id));
    } catch (err: any) {
      console.error('Erro ao deletar classificado:', err);
      alert('Erro ao excluir. Tente novamente.');
    }
  };

  const abrirModalCriar = () => {
    setClassificadoEditando(null);
    setFormData({
      titulo: '', descricao: '', categoria: '', telefone: '', nome_anunciante: '', bairro: '', email: '',
      ativo: true, aprovado: false
    });
    setMostrarModalForm(true);
  };

  const abrirModalEditar = (c: Classificado) => {
    setClassificadoEditando(c);
    setFormData({
      titulo: c.titulo || '',
      descricao: c.descricao || '',
      categoria: c.categoria || '',
      telefone: c.telefone || '',
      nome_anunciante: c.nome_anunciante || '',
      bairro: c.bairro || '',
      email: c.email || '',
      ativo: c.ativo ?? true,
      aprovado: c.aprovado ?? false
    });
    setMostrarModalForm(true);
  };

  const fecharModal = () => {
    setMostrarModalForm(false);
    setClassificadoEditando(null);
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const updates: any = {
        ...formData,
        updated_at: new Date().toISOString()
      };

      if (classificadoEditando) {
        if (formData.aprovado && !classificadoEditando.aprovado) {
          updates.data_aprovacao = new Date().toISOString();
        } else if (!formData.aprovado) {
          updates.data_aprovacao = null;
        }

        const { error: err } = await supabase
          .from('classificados')
          .update(updates)
          .eq('id', classificadoEditando.id);
        if (err) throw err;
        
        setClassificados(prev => prev.map(c => c.id === classificadoEditando.id ? { ...c, ...updates } : c));
      } else {
        updates.created_at = new Date().toISOString();
        if (formData.aprovado) updates.data_aprovacao = new Date().toISOString();

        const { data, error: err } = await supabase
          .from('classificados')
          .insert([updates])
          .select()
          .single();
        if (err) throw err;
        if (data) {
          setClassificados(prev => [data as Classificado, ...prev]);
        }
      }
      fecharModal();
    } catch (err: any) {
      console.error('Erro ao salvar classificado:', err);
      alert('Erro ao salvar. Verifique os dados e tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const exportarDados = () => {
    const headers = ['Título', 'Categoria', 'Anunciante', 'Telefone', 'Email', 'Bairro', 'Status', 'Data Criação'];
    const csvData = classificados.map(c => [
      c.titulo,
      c.categoria,
      c.nome_anunciante,
      c.telefone,
      c.email || '',
      c.bairro,
      c.ativo ? (c.aprovado ? 'Aprovado' : 'Pendente') : 'Inativo',
      new Date(c.created_at).toLocaleDateString('pt-BR')
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => '"' + (field || '').replace(/"/g, '""') + '"').join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `classificados_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusClass = (status: string) => {
    const s = filtroStatus === status;
    switch (status) {
      case 'todos': return s ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
      case 'ativos': return s ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
      case 'pendentes': return s ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
      default: return '';
    }
  };

  const formatarData = (dataString: string | null | undefined) => {
    if (!dataString) return '';
    return new Date(dataString).toLocaleDateString('pt-BR');
  };

  const totalClassificados = classificados.length;
  const classificadosAtivos = classificados.filter(c => c.ativo).length;
  const classificadosAprovados = classificados.filter(c => c.aprovado).length;

  return (
    <div className="min-h-screen pb-8">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Gerenciar Classificados
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie todos os classificados do sistema
          </p>
        </div>

        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <button
            onClick={abrirModalCriar}
            className="px-4 py-2 bg-[#2E7D32] text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Adicionar Classificado
          </button>

          <div className="flex flex-wrap gap-2">
            {(['todos', 'pendentes', 'ativos'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFiltroStatus(status)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${getStatusClass(status)}`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Tabela */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Classificados</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Total: {totalClassificados} | Ativos: {classificadosAtivos} | Aprovados: {classificadosAprovados}
                </p>
              </div>
              <button
                onClick={exportarDados}
                className="px-3 py-1 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Exportar
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Título</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Categoria</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Anunciante</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Contato</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      Carregando classificados...
                    </td>
                  </tr>
                ) : classificadosFiltrados.length > 0 ? (
                  classificadosFiltrados.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[200px]" title={c.titulo}>
                          {c.titulo}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {formatarData(c.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 capitalize">
                          {c.categoria}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-white font-medium">{c.nome_anunciante}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{c.bairro || 'Bairro não informado'}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                        <div className="space-y-1">
                          {c.telefone && <div>📱 {c.telefone}</div>}
                          {c.email && <div className="truncate max-w-[150px]" title={c.email}>📧 {c.email}</div>}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-2">
                          <div className="flex gap-1">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${c.ativo ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                              {c.ativo ? 'Ativo' : 'Inativo'}
                            </span>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${c.aprovado ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}`}>
                              {c.aprovado ? 'Aprovado' : 'Pendente'}
                            </span>
                          </div>
                          {c.data_aprovacao && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Aprovado em: {formatarData(c.data_aprovacao)}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => abrirModalEditar(c)} className="text-[#2E7D32] hover:text-green-700 mr-3 transition-colors text-lg" title="Editar">✎</button>
                        <button onClick={() => handleDelete(c.id, c.titulo)} className="text-red-500 hover:text-red-700 transition-colors text-lg" title="Excluir">×</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                      Nenhum classificado encontrado.
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
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#2E7D32] dark:text-[#4CAF50]">
                {classificadoEditando ? 'Editar Classificado' : 'Adicionar Classificado'}
              </h2>
              <button onClick={fecharModal} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl leading-none">&times;</button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="classificadoForm" onSubmit={handleSalvar} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título *</label>
                    <input type="text" required value={formData.titulo} onChange={e => setFormData({...formData, titulo: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descrição *</label>
                    <textarea required rows={3} value={formData.descricao} onChange={e => setFormData({...formData, descricao: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categoria *</label>
                    <select required value={formData.categoria} onChange={e => setFormData({...formData, categoria: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                      <option value="">Selecione uma categoria</option>
                      <option value="jardinagem">Jardinagem</option>
                      <option value="limpeza">Limpeza</option>
                      <option value="reparos">Reparos</option>
                      <option value="pintura">Pintura</option>
                      <option value="encanamento">Encanamento</option>
                      <option value="eletrica">Elétrica</option>
                      <option value="construcao">Construção</option>
                      <option value="informatica">Informática</option>
                      <option value="transporte">Transporte</option>
                      <option value="outros">Outros</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Telefone *</label>
                    <input type="tel" required value={formData.telefone} onChange={e => setFormData({...formData, telefone: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome do Anunciante *</label>
                    <input type="text" required value={formData.nome_anunciante} onChange={e => setFormData({...formData, nome_anunciante: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bairro *</label>
                    <input type="text" required value={formData.bairro} onChange={e => setFormData({...formData, bairro: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">E-mail</label>
                    <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.ativo} onChange={e => setFormData({...formData, ativo: e.target.checked})} className="w-4 h-4 text-[#2E7D32] rounded focus:ring-[#2E7D32]" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Ativo</span>
                  </label>
                  
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.aprovado} onChange={e => setFormData({...formData, aprovado: e.target.checked})} className="w-4 h-4 text-[#2E7D32] rounded focus:ring-[#2E7D32]" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Aprovado</span>
                  </label>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3 bg-gray-50 dark:bg-gray-800">
              <button type="button" onClick={fecharModal} className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                Cancelar
              </button>
              <button type="submit" form="classificadoForm" disabled={isSubmitting} className="px-4 py-2 bg-[#2E7D32] hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-70">
                {isSubmitting ? 'Salvando...' : (classificadoEditando ? 'Salvar Alterações' : 'Criar Classificado')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
