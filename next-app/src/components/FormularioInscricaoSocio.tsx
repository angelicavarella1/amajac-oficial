'use client';

import { useState } from 'react';
import { supabase } from '@/core/utils/supabaseClient';

export default function FormularioInscricaoSocio() {
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    endereco: '',
    moradorLocal: false,
    categoria: 'benemerito',
    observacoesRemido: '',
  });
  const [cpfFormatted, setCpfFormatted] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleCpfChange = (val: string) => {
    const cleaned = val.replace(/\D/g, '');
    if (cleaned.length <= 11) {
      setFormData((prev) => ({ ...prev, cpf: cleaned }));
      if (cleaned.length > 9) {
        setCpfFormatted(cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4'));
      } else if (cleaned.length > 6) {
        setCpfFormatted(cleaned.replace(/(\d{3})(\d{3})(\d{0,3})/, '$1.$2.$3'));
      } else if (cleaned.length > 3) {
        setCpfFormatted(cleaned.replace(/(\d{3})(\d{0,3})/, '$1.$2'));
      } else {
        setCpfFormatted(cleaned);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.moradorLocal) {
      setError('Você deve confirmar residência no Jardim Atlântico Central.');
      return;
    }

    setLoading(true);
    try {
      const { error: err } = await supabase.from('associados').insert({
        nome: formData.nome.trim(),
        cpf: formData.cpf.trim(),
        email: formData.email.trim(),
        telefone: formData.telefone?.trim() || null,
        endereco: formData.endereco.trim(),
        categoria: formData.categoria,
        status: 'pendente',
        observacoes_remido: formData.observacoesRemido?.trim() || null,
      });

      if (err) throw err;
      setSuccess(true);
    } catch (err: any) {
      console.error('Erro ao enviar inscrição:', err);
      setError(err.message || 'Erro ao enviar inscrição. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md max-w-2xl mx-auto text-center">
        <div className="mb-4 text-5xl">✅</div>
        <h2 className="text-xl font-bold text-green-700 dark:text-green-400 mb-2">
          Inscrição enviada com sucesso!
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Nossa equipe entrará em contato para confirmar sua residência no bairro.
        </p>
        {formData.categoria === 'remido' && (
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            <strong>Candidatos a Sócio Remido</strong> serão avaliados por uma comissão, conforme Art. 4º do Estatuto.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-[#2E7D32] dark:text-[#4CAF50] mb-4 text-center">
        Inscrição como Sócio da AMAJAC
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nome Completo <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            maxLength={150}
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Ex: Ana Silva"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            CPF <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            maxLength={14}
            inputMode="numeric"
            value={cpfFormatted}
            onChange={(e) => handleCpfChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="000.000.000-00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            E-mail <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            required
            maxLength={100}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="ana@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Telefone / WhatsApp
          </label>
          <input
            type="text"
            maxLength={20}
            value={formData.telefone}
            onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="(21) 99999-9999"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Endereço Completo <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            maxLength={200}
            value={formData.endereco}
            onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="Rua Exemplo, 123 - Jardim Atlântico Central, Maricá-RJ"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            O endereço deve estar localizado no bairro <strong>Jardim Atlântico Central</strong>, Maricá-RJ.
          </p>
        </div>

        <div className="flex items-start gap-3">
          <input
            id="moradorLocal"
            type="checkbox"
            required
            checked={formData.moradorLocal}
            onChange={(e) => setFormData({ ...formData, moradorLocal: e.target.checked })}
            className="mt-1 h-4 w-4 text-[#2E7D32] focus:ring-[#2E7D32] border-gray-300 rounded"
          />
          <label htmlFor="moradorLocal" className="text-sm text-gray-700 dark:text-gray-300">
            <span className="text-red-500">*</span> Confirmo que sou <strong>morador do bairro Jardim Atlântico Central, Maricá-RJ</strong>.
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Categoria pretendida <span className="text-red-500">*</span>
          </label>
          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="radio"
                value="benemerito"
                checked={formData.categoria === 'benemerito'}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                className="mt-1 h-4 w-4 text-[#2E7D32] focus:ring-[#2E7D32]"
              />
              <span>
                <strong>Sócio Benemérito</strong>
                <br />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Contribuição mensal. Tem direito a voto e ser votado.
                </span>
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="radio"
                value="remido"
                checked={formData.categoria === 'remido'}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                className="mt-1 h-4 w-4 text-[#2E7D32] focus:ring-[#2E7D32]"
              />
              <span>
                <strong>Sócio Remido</strong>
                <br />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Para moradores em vulnerabilidade financeira. Sem contribuição mensal. Sem direito a voto.
                </span>
              </span>
            </label>
          </div>
        </div>

        {formData.categoria === 'remido' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Informações adicionais (opcional)
            </label>
            <textarea
              rows={3}
              maxLength={500}
              value={formData.observacoesRemido}
              onChange={(e) => setFormData({ ...formData, observacoesRemido: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Descreva brevemente a situação de vulnerabilidade"
            />
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-200 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full px-5 py-2.5 bg-[#2E7D32] text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {loading ? 'Enviando...' : 'Enviar Inscrição'}
          </button>
        </div>
      </form>
    </div>
  );
}
