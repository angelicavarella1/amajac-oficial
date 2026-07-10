"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/core/utils/supabaseClient";

export default function ModalContato() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ nome: "", email: "", telefone: "", assunto: "", mensagem: "" });

  useEffect(() => {
    const h = () => setOpen(true);
    window.addEventListener("openContactModal", h);
    return () => window.removeEventListener("openContactModal", h);
  }, []);

  const close = () => {
    setForm({ nome: "", email: "", telefone: "", assunto: "", mensagem: "" });
    setOpen(false);
    setSuccess(false);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome || !form.email || !form.assunto || !form.mensagem) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }
    setLoading(true);
    try {
      const { error: err } = await supabase.from("mensagens_contato").insert([{
        nome: form.nome.trim(),
        email: form.email.trim().toLowerCase(),
        telefone: form.telefone?.trim() || null,
        assunto: form.assunto,
        mensagem: form.mensagem.trim(),
        lida: false,
        created_at: new Date().toISOString(),
      }]);
      if (err) throw err;
      setSuccess(true);
      setTimeout(close, 2500);
    } catch {
      alert("Erro ao enviar mensagem. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
          onClick={(e) => { if ((e.target as HTMLElement).classList.contains("modal-overlay")) close(); }}
        >
          <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
          >
            {success ? (
              <div className="p-10 text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }} className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Mensagem enviada!</h3>
                <p className="text-gray-500 dark:text-gray-400">Entraremos em contato em breve.</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-gray-700">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Fale Conosco</h2>
                  <button onClick={close} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
                <form onSubmit={submit} className="p-5 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome *</label>
                    <input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required
                      className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm transition-all"
                      placeholder="Seu nome completo" disabled={loading} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">E-mail *</label>
                    <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required
                      className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm transition-all"
                      placeholder="seu@email.com" disabled={loading} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Telefone</label>
                    <input type="tel" value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm transition-all"
                      placeholder="(21) 99999-9999" disabled={loading} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assunto *</label>
                    <select value={form.assunto} onChange={(e) => setForm({ ...form, assunto: e.target.value })} required
                      className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm transition-all"
                      disabled={loading}>
                      <option value="">Selecione um assunto</option>
                      <option value="informacao">Informação</option>
                      <option value="sugestao">Sugestão</option>
                      <option value="reclamacao">Reclamação</option>
                      <option value="associacao">Associação</option>
                      <option value="outro">Outro</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mensagem *</label>
                    <textarea value={form.mensagem} onChange={(e) => setForm({ ...form, mensagem: e.target.value })} required rows={4}
                      className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm transition-all resize-none"
                      placeholder="Digite sua mensagem..." disabled={loading} />
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white rounded-xl font-semibold transition-all shadow-md shadow-green-600/20 disabled:opacity-60 flex items-center justify-center gap-2">
                    {loading ? (
                      <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Enviando...</>
                    ) : (
                      <>Enviar Mensagem</>
                    )}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
