"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Relogio from "./ui/Relogio";

const links = [
  { to: "/sobre", text: "Quem Somos", sectionId: "quem-somos-section" },
  { to: "/noticias", text: "Notícias", sectionId: "noticias-section" },
  { to: "/eventos", text: "Eventos", sectionId: "eventos-section" },
  { to: "/classificados", text: "Classificados", sectionId: "classificados-section" },
  { to: "/galeria", text: "Galeria", sectionId: "galeria-section" },
  { to: "/contato", text: "Contato", sectionId: "site-footer" },
];

export default function SiteNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("amajac-theme");
    const sysDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = saved ? saved === "dark" : sysDark;
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleDark = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("amajac-theme", next ? "dark" : "light");
  };

  const navigate = (rota: string, sectionId: string) => {
    setMobileOpen(false);
    if (rota === "/contato") {
      const footer = document.getElementById("site-footer");
      if (footer) {
        window.scrollTo({ top: footer.offsetTop - 100, behavior: "smooth" });
        setTimeout(() => window.dispatchEvent(new CustomEvent("openContactModal")), 800);
      } else {
        router.push("/contato");
      }
      return;
    }
    if (pathname === rota) {
      const el = document.getElementById(sectionId);
      if (el) window.scrollTo({ top: el.offsetTop - 100, behavior: "smooth" });
    } else {
      router.push(rota);
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) window.scrollTo({ top: el.offsetTop - 100, behavior: "smooth" });
      }, 500);
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-lg shadow-black/5 border-b border-gray-200/50 dark:border-gray-700/50"
            : "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-sm border-b border-transparent"
        }`}
      >
        {/* Top bar */}
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-white dark:bg-gray-800 ring-2 ring-green-600/20 dark:ring-green-400/20 group-hover:ring-green-600/40 transition-all duration-300 shadow-sm">
                <img
                  src="/images/logo-amajac.png"
                  alt="AMAJAC"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                    (e.target as HTMLImageElement).parentElement!.innerHTML =
                      '<span class="text-lg font-bold text-green-700 flex items-center justify-center h-full">A</span>';
                  }}
                />
              </div>
              <span className="text-xl font-extrabold tracking-tight">
                <span className="text-green-700 dark:text-green-400">AMA</span>
                <span className="text-green-600 dark:text-green-500">JAC</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {links.map((link) => {
                const active = pathname === link.to;
                return (
                  <button
                    key={link.to}
                    onClick={() => navigate(link.to, link.sectionId)}
                    className={`relative px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                      active
                        ? "text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/30"
                        : "text-gray-600 dark:text-gray-400 hover:text-green-700 dark:hover:text-green-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    {link.text}
                    {active && (
                      <motion.div
                        layoutId="nav-active"
                        className="absolute bottom-0 left-2 right-2 h-0.5 bg-green-600 dark:bg-green-400 rounded-full"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Dark mode toggle */}
              <button
                onClick={toggleDark}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                aria-label={darkMode ? "Modo claro" : "Modo escuro"}
              >
                {darkMode ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Menu"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  {mobileOpen ? (
                    <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Bottom bar: clock + quick links */}
          <div className="flex items-center justify-between py-2.5 border-t border-gray-100 dark:border-gray-800 gap-3">
            <Relogio />
            <div className="flex items-center gap-2">
              <a
                href="https://sosjacapp.amajac.org.br/login"
                target="_blank"
                className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl text-white bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 shadow-md shadow-emerald-600/20 hover:shadow-lg hover:shadow-emerald-600/30 hover:-translate-y-0.5 transition-all duration-200"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                SOSJAC
              </a>
              <a
                href="https://associacoes.softaliza.com.br/login/amajac"
                target="_blank"
                className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl text-white bg-gradient-to-r from-green-700 to-green-800 hover:from-green-600 hover:to-green-700 shadow-md shadow-green-700/20 hover:shadow-lg hover:shadow-green-700/30 hover:-translate-y-0.5 transition-all duration-200"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                Associados
              </a>
              <a
                href="/admin"
                target="_blank"
                className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl text-white bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 shadow-md shadow-gray-700/20 hover:shadow-lg hover:shadow-gray-700/30 hover:-translate-y-0.5 transition-all duration-200"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                Admin
              </a>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 overflow-hidden"
            >
              <nav className="container mx-auto px-4 py-3 flex flex-col gap-1">
                {links.map((link) => {
                  const active = pathname === link.to;
                  return (
                    <button
                      key={link.to}
                      onClick={() => navigate(link.to, link.sectionId)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-left transition-all duration-200 ${
                        active
                          ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      {link.text}
                    </button>
                  );
                })}
                <button
                  onClick={toggleDark}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  {darkMode ? "☀️ Modo Claro" : "🌙 Modo Escuro"}
                </button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Spacer */}
      <div className="h-[128px]" />
    </>
  );
}
