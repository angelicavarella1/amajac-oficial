"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const FooterLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
  const pathname = usePathname();
  const active = pathname === to;
  return (
    <Link
      href={to}
      className={`text-sm transition-colors duration-200 hover:text-green-300 ${
        active ? "text-green-300 font-semibold" : "text-green-100/80"
      }`}
    >
      {children}
    </Link>
  );
};

export default function SiteFooter() {
  const handleModal = () => {
    window.dispatchEvent(new CustomEvent("openContactModal"));
  };

  return (
    <footer id="site-footer" className="relative bg-gradient-to-b from-green-900 to-green-950 text-white">
      {/* Top wave */}
      <div className="absolute top-0 left-0 right-0 -translate-y-full">
        <svg viewBox="0 0 1440 60" className="w-full h-auto fill-green-900">
          <path d="M0,30 C320,0 480,50 720,20 C960,-10 1120,40 1440,20 L1440,60 L0,60 Z" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-16 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm overflow-hidden flex items-center justify-center ring-2 ring-white/20">
                <img
                  src="/images/logo-amajac.png"
                  alt="AMAJAC"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                    (e.target as HTMLImageElement).parentElement!.innerHTML =
                      '<span class="text-lg font-bold text-white">A</span>';
                  }}
                />
              </div>
              <span className="text-xl font-extrabold tracking-tight">
                <span className="text-green-300">AMA</span>JAC
              </span>
            </div>
            <p className="text-green-200/80 text-sm leading-relaxed mb-4">
              Associação de Moradores e Amigos do Jardim Atlântico Central
            </p>
            <p className="text-green-300/70 text-xs leading-relaxed">
              Juntos pelo desenvolvimento urbano e social do nosso bairro.
            </p>
          </div>

          {/* Área Restrita */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-green-300 mb-4">Área Restrita</h4>
            <ul className="space-y-3">
              <li>
                <a href="https://sosjacapp.amajac.org.br/login" target="_blank" rel="noopener noreferrer"
                  className="text-sm text-green-100/80 hover:text-green-300 transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  SOSJAC
                </a>
              </li>
              <li>
                <a href="https://associacoes.softaliza.com.br/login/amajac" target="_blank" rel="noopener noreferrer"
                  className="text-sm text-green-100/80 hover:text-green-300 transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  Associados
                </a>
              </li>
              <li>
                <Link href="/admin"
                  className="text-sm text-green-100/80 hover:text-green-300 transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  Administração
                </Link>
              </li>
            </ul>
          </div>

          {/* Acesso Rápido */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-green-300 mb-4">Acesso Rápido</h4>
            <ul className="space-y-2.5">
              <li><FooterLink to="/sobre">Quem Somos</FooterLink></li>
              <li><FooterLink to="/noticias">Notícias</FooterLink></li>
              <li><FooterLink to="/eventos">Eventos</FooterLink></li>
              <li><FooterLink to="/classificados">Classificados</FooterLink></li>
              <li><FooterLink to="/galeria">Galeria</FooterLink></li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-green-300 mb-4">Contato</h4>
            <address className="not-italic text-green-100/80 space-y-2.5 text-sm leading-relaxed">
              <p>Rua Izabel Cristina Ouvina, 112</p>
              <p>Maricá - RJ, CEP 24934-405</p>
              <p>
                <a href="https://wa.me/5521978979840" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-green-200 hover:text-green-300 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  (21) 97897-9840
                </a>
              </p>
              <p>
                <a href="mailto:comunicacao@amajac.org.br"
                  className="text-green-200 hover:text-green-300 transition-colors">
                  comunicacao@amajac.org.br
                </a>
              </p>
            </address>
          </div>

          {/* Atendimento */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-green-300 mb-4">Atendimento</h4>
            <button
              onClick={handleModal}
              className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/15 rounded-xl py-3 px-4 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              Fale Conosco
            </button>
            <p className="text-green-300/60 text-xs mt-3 leading-relaxed">
              Responderemos o mais breve possível.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-green-800/50 mt-12 pt-8 text-center">
          <p className="text-green-300/60 text-sm">
            &copy; {new Date().getFullYear()} AMAJAC — Associação de Moradores e Amigos do Jardim Atlântico Central
          </p>
          <div className="mt-3 flex items-center justify-center gap-4 text-sm">
            <Link href="/termos" className="text-green-300/60 hover:text-green-300 transition-colors">Termos de Uso</Link>
            <span className="text-green-800">|</span>
            <Link href="/privacidade" className="text-green-300/60 hover:text-green-300 transition-colors">Privacidade</Link>
          </div>
          <p className="mt-4 text-green-400/40 text-xs">
            Desenvolvido por Angélica Varella
          </p>
        </div>
      </div>
    </footer>
  );
}
