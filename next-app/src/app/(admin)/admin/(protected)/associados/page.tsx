'use client';

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/core/utils/supabaseClient';

type Associado = {
  id: string;
  created_at: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string | null;
  endereco: string;
  categoria: 'fundador' | 'benemerito' | 'remido' | 'associado';
  status: 'pendente' | 'ativo' | 'inativo' | 'negado';
  motivo_negativa_remido?: string;
  observacoes_remido?: string;
};

export default function AdminAssociadosPage() {
  const [associados, setAssociados] = useState<Associado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filtroStatus, setFiltroStatus] = useState<'todos' | 'ativos' | 'pendentes' | 'remido'>('todos');
  
  const [mostrarModalForm, setMostrarModalForm] = useState(false);
  const [associadoEditando, setAssociadoEditando] = useState<Associado | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState<{
    nome: string;
    cpf: string;
    email: string;
    telefone: string;
    endereco: string;
    categoria: 'fundador' | 'benemerito' | 'remido' | 'associado';
    status: 'pendente' | 'ativo' | 'inativo' | 'negado';
  }>({
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    endereco: '',
    categoria: 'benemerito',
    status: 'pendente'
  });

  const fetchAssociados = async () => {
    setLoading(true);
    try {
      const { data, error: err } = await supabase
        .from('associados')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (err) throw err;
      setAssociados(data as Associado[]);
    } catch (err: any) {
      console.error('Erro ao buscar associados:', err);
      setError('Falha ao carregar a lista de associados.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssociados();
  }, []);

  const associadosFiltrados = useMemo(() => {
    if (filtroStatus === 'todos') return associados;
    if (filtroStatus === 'ativos') return associados.filter(a => a.status === 'ativo');
    if (filtroStatus === 'pendentes') return associados.filter(a => a.status === 'pendente');
    if (filtroStatus === 'remido') return associados.filter(a => a.categoria === 'remido');
    return associados;
  }, [associados, filtroStatus]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este associado?')) return;
    try {
      const { error: err } = await supabase.from('associados').delete().eq('id', id);
      if (err) throw err;
      setAssociados(prev => prev.filter(a => a.id !== id));
    } catch (err: any) {
      console.error('Erro ao deletar associado:', err);
      alert('Erro ao excluir. Tente novamente.');
    }
  };

  const abrirModalCriar = () => {
    setAssociadoEditando(null);
    setFormData({
      nome: '', cpf: '', email: '', telefone: '', endereco: '', categoria: 'benemerito', status: 'pendente'
    });
    setMostrarModalForm(true);
  };

  const abrirModalEditar = (assoc: Associado) => {
    setAssociadoEditando(assoc);
    setFormData({
      nome: assoc.nome || '',
      cpf: assoc.cpf || '',
      email: assoc.email || '',
      telefone: assoc.telefone || '',
      endereco: assoc.endereco || '',
      categoria: assoc.categoria || 'benemerito',
      status: assoc.status || 'pendente'
    });
    setMostrarModalForm(true);
  };

  const fecharModal = () => {
    setMostrarModalForm(false);
    setAssociadoEditando(null);
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (associadoEditando) {
        const { error: err } = await supabase
          .from('associados')
          .update(formData)
          .eq('id', associadoEditando.id);
        if (err) throw err;
        
        setAssociados(prev => prev.map(a => a.id === associadoEditando.id ? { ...a, ...formData } : a));
      } else {
        const { data, error: err } = await supabase
          .from('associados')
          .insert([formData])
          .select()
          .single();
        if (err) throw err;
        if (data) {
          setAssociados(prev => [data as Associado, ...prev]);
        }
      }
      fecharModal();
    } catch (err: any) {
      console.error('Erro ao salvar associado:', err);
      alert('Erro ao salvar. Verifique os dados e tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusClass = (status: string) => {
    const s = filtroStatus === status;
    switch (status) {
      case 'todos': return s ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
      case 'ativos': return s ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
      case 'pendentes': return s ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
      case 'remido': return s ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen pb-8">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Gestão de Associados
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Administre os sócios da AMAJAC conforme o Estatuto Social.
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
            Adicionar Sócio
          </button>

          <div className="flex flex-wrap gap-2">
            {(['todos', 'ativos', 'pendentes', 'remido'] as const).map((status) => (
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
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">CPF</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Contato</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Categoria</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      Carregando sócios...
                    </td>
                  </tr>
                ) : associadosFiltrados.length > 0 ? (
                  associadosFiltrados.map((assoc) => (
                    <tr key={assoc.id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-xs">
                          {assoc.nome}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                        {assoc.cpf?.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                        <div className="flex flex-col gap-1">
                          {assoc.email && <span>📧 {assoc.email}</span>}
                          {assoc.telefone && <span>📱 {assoc.telefone}</span>}
                          {!assoc.email && !assoc.telefone && <span className="text-gray-400">-</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        {assoc.categoria === 'benemerito' && <span className="text-green-700 dark:text-green-400">Benemérito</span>}
                        {assoc.categoria === 'remido' && <span className="text-blue-700 dark:text-blue-400">Remido</span>}
                        {assoc.categoria === 'fundador' && <span className="text-purple-700 dark:text-purple-400">Fundador</span>}
                        {assoc.categoria === 'associado' && <span className="text-gray-600 dark:text-gray-300">Comum</span>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          assoc.status === 'ativo' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          assoc.status === 'pendente' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {assoc.status.charAt(0).toUpperCase() + assoc.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => abrirModalEditar(assoc)}
                          className="text-[#2E7D32] hover:text-green-700 mr-3 transition-colors"
                          title="Editar"
                        >
                          ✎
                        </button>
                        <button
                          onClick={() => handleDelete(assoc.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          title="Excluir"
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                      Nenhum sócio encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {error && <div className="p-4 bg-red-50 text-red-700 text-sm">{error}</div>}
        </div>
      </div>

      {/* Modal Form */}
      {mostrarModalForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#2E7D32] dark:text-[#4CAF50]">
                {associadoEditando ? 'Editar Sócio' : 'Cadastrar Novo Sócio'}
              </h2>
              <button onClick={fecharModal} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl leading-none">&times;</button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="associadoForm" onSubmit={handleSalvar} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome Completo *</label>
                  <input type="text" required value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CPF *</label>
                  <input type="text" required value={formData.cpf} onChange={e => setFormData({...formData, cpf: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">E-mail *</label>
                  <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Telefone</label>
                  <input type="text" value={formData.telefone} onChange={e => setFormData({...formData, telefone: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Endereço Completo *</label>
                  <input type="text" required value={formData.endereco} onChange={e => setFormData({...formData, endereco: e.target.value})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categoria *</label>
                  <select required value={formData.categoria} onChange={e => setFormData({...formData, categoria: e.target.value as any})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option value="associado">Sócio Comum</option>
                    <option value="fundador">Sócio Fundador</option>
                    <option value="benemerito">Sócio Benemérito</option>
                    <option value="remido">Sócio Remido</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status *</label>
                  <select required value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option value="pendente">Pendente</option>
                    <option value="ativo">Ativo</option>
                    <option value="inativo">Inativo</option>
                    <option value="negado">Negado</option>
                  </select>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3 bg-gray-50 dark:bg-gray-800">
              <button type="button" onClick={fecharModal} className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                Cancelar
              </button>
              <button type="submit" form="associadoForm" disabled={isSubmitting} className="px-4 py-2 bg-[#2E7D32] hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-70">
                {isSubmitting ? 'Salvando...' : (associadoEditando ? 'Atualizar' : 'Cadastrar')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
