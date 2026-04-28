'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/core/utils/supabaseClient';

export default function ModalContato() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    assunto: '',
    mensagem: '',
  });

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('openContactModal', handleOpen);
    return () => window.removeEventListener('openContactModal', handleOpen);
  }, []);

  const close = () => {
    setFormData({ nome: '', email: '', telefone: '', assunto: '', mensagem: '' });
    setIsOpen(false);
  };

  const closeOnOverlay = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).classList.contains('modal-overlay')) {
      close();
    }
  };

  const enviarMensagem = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { nome, email, telefone, assunto, mensagem } = formData;
      if (!nome || !email || !assunto || !mensagem) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        setLoading(false);
        return;
      }

      const dadosParaEnviar = {
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        telefone: telefone?.trim() || null,
        assunto: assunto.trim(),
        mensagem: mensagem.trim(),
        lida: false,
        created_at: new Date().toISOString(),
      };

      const { error: supabaseError } = await supabase
        .from('mensagens_contato')
        .insert([dadosParaEnviar])
        .select('id')
        .single();

      if (supabaseError) throw supabaseError;

      alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
      close();
    } catch (err: any) {
      console.error('Erro ao enviar mensagem:', err);
      alert('Erro ao enviar mensagem. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="modal-overlay fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4" 
      onClick={closeOnOverlay}
    >
      <div 
        className="modal-content bg-white dark:bg-gray-800 dark:text-white rounded-xl w-full max-w-[500px] max-h-[90vh] overflow-y-auto shadow-2xl" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="modal-title text-xl font-bold text-gray-800 dark:text-white m-0">Fale Conosco</h2>
          <button onClick={close} className="modal-close-btn bg-transparent border-none text-gray-500 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 p-1.5 rounded transition-all cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={enviarMensagem} className="modal-form p-6 space-y-4">
          <div className="form-group">
            <label htmlFor="nome" className="block font-semibold mb-2 text-gray-700 dark:text-gray-300">Nome *</label>
            <input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData({...formData, nome: e.target.value})}
              type="text"
              required
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md text-sm transition-all dark:bg-gray-700 dark:text-white focus:outline-none focus:border-[#2E7D32] dark:focus:border-[#4CAF50] focus:ring-[3px] focus:ring-[#2E7D32]/10 dark:focus:ring-[#4CAF50]/10"
              placeholder="Seu nome completo"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="block font-semibold mb-2 text-gray-700 dark:text-gray-300">E-mail *</label>
            <input
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              type="email"
              required
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md text-sm transition-all dark:bg-gray-700 dark:text-white focus:outline-none focus:border-[#2E7D32] dark:focus:border-[#4CAF50] focus:ring-[3px] focus:ring-[#2E7D32]/10 dark:focus:ring-[#4CAF50]/10"
              placeholder="seu@email.com"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="telefone" className="block font-semibold mb-2 text-gray-700 dark:text-gray-300">Telefone (opcional)</label>
            <input
              id="telefone"
              value={formData.telefone}
              onChange={(e) => setFormData({...formData, telefone: e.target.value})}
              type="tel"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md text-sm transition-all dark:bg-gray-700 dark:text-white focus:outline-none focus:border-[#2E7D32] dark:focus:border-[#4CAF50] focus:ring-[3px] focus:ring-[#2E7D32]/10 dark:focus:ring-[#4CAF50]/10"
              placeholder="(21) 99999-9999"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="assunto" className="block font-semibold mb-2 text-gray-700 dark:text-gray-300">Assunto *</label>
            <select
              id="assunto"
              value={formData.assunto}
              onChange={(e) => setFormData({...formData, assunto: e.target.value})}
              required
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md text-sm transition-all dark:bg-gray-700 dark:text-white focus:outline-none focus:border-[#2E7D32] dark:focus:border-[#4CAF50] focus:ring-[3px] focus:ring-[#2E7D32]/10 dark:focus:ring-[#4CAF50]/10"
              disabled={loading}
            >
              <option value="">Selecione um assunto</option>
              <option value="informacao">Informação</option>
              <option value="sugestao">Sugestão</option>
              <option value="reclamacao">Reclamação</option>
              <option value="associacao">Associação</option>
              <option value="outro">Outro</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="mensagem" className="block font-semibold mb-2 text-gray-700 dark:text-gray-300">Mensagem *</label>
            <textarea
              id="mensagem"
              value={formData.mensagem}
              onChange={(e) => setFormData({...formData, mensagem: e.target.value})}
              required
              rows={4}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md text-sm transition-all dark:bg-gray-700 dark:text-white focus:outline-none focus:border-[#2E7D32] dark:focus:border-[#4CAF50] focus:ring-[3px] focus:ring-[#2E7D32]/10 dark:focus:ring-[#4CAF50]/10"
              placeholder="Digite sua mensagem..."
              disabled={loading}
            ></textarea>
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#2E7D32] text-white border-none rounded-md py-3 px-6 font-semibold cursor-pointer transition-all hover:bg-[#1B5E20] disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            disabled={loading}
          >
            {loading ? 'Enviando...' : 'Enviar Mensagem'}
          </button>
        </form>
      </div>
    </div>
  );
}
