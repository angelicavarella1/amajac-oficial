"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Preencha todos os campos.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) {
        setError(authError.message.includes("Invalid login credentials") ? "E-mail ou senha incorretos." : "Erro ao fazer login.");
        return;
      }
      // Forca refresh pra garantir que o cookie foi escrito antes de navegar
      window.location.href = searchParams.get("redirect") || "/admin/dashboard";
    } catch {
      setError("Erro inesperado. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <form onSubmit={handleLogin} className="space-y-5">
        {error && <div className="p-3 bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200 rounded-lg text-sm">{error}</div>}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">E-mail</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus disabled={loading}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none" />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Senha</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none" />
        </div>
        <button type="submit" disabled={loading}
          className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-semibold rounded-xl shadow-md shadow-green-600/20 disabled:opacity-70 transition-all flex items-center justify-center gap-2">
          {loading ? <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Entrando...</> : "Entrar"}
        </button>
      </form>
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
        <Link href="/" className="text-sm text-green-600 hover:text-green-700 font-medium">← Voltar ao site</Link>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mx-auto bg-gradient-to-br from-green-600 to-green-800 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-green-600/20">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Área Administrativa</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">AMAJAC — Associação de Moradores e Amigos de Itaipuaçu</p>
        </div>
        <Suspense fallback={<div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">Carregando...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
