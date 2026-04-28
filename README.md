AMAJAC - Associação de Moradores e Amigos do Bairro Jardim Atlântico Central
Site institucional e painel administrativo da AMAJAC, migrado de Vue 3 (Vite) para Next.js 15 com App Router.
🚀 Tecnologias
Next.js 15 - Framework React com App Router
React 19 - Biblioteca UI
TypeScript - Tipagem estática
Tailwind CSS - Estilização utilitária
shadcn/ui - Componentes de UI
Supabase - Backend as a Service (BaaS)
Netlify - Hospedagem e deploy contínuo
📁 Estrutura do Projeto
plain
Copy
app/
├── (site)/                    # Portal público (SEO otimizado)
│   ├── page.tsx               # Página inicial
│   ├── classificados/
│   ├── eventos/
│   ├── noticias/
│   │   └── [id]/              # Detalhe da notícia
│   ├── galeria/
│   ├── parceiros/
│   ├── contato/
│   ├── sobre/
│   ├── termos/
│   ├── privacidade/
│   └── associacao/            # Inscrição de sócios
│
├── (admin)/                   # Painel administrativo (protegido)
│   ├── login/
│   ├── dashboard/
│   ├── associados/
│   ├── noticias/
│   ├── eventos/
│   ├── parceiros/
│   ├── classificados/
│   ├── galeria/
│   ├── mensagens/
│   ├── sobre/
│   ├── configuracoes/         # Superadmin only
│   └── auditoria/             # Superadmin only
│
├── api/                       # Route Handlers
├── layout.tsx                 # Layout raiz + metadata
└── globals.css                # Tailwind + tema AMAJAC

components/
├── ui/                        # shadcn/ui components
├── site/                      # Componentes públicos
└── admin/                     # Componentes administrativos

lib/
├── supabase/                  # Clientes Supabase (server + client)
├── auth/                      # Data Access Layer (proteção de rotas)
└── utils.ts                   # Helpers e formatters

types/
└── database.ts                # Tipagens Supabase (auto-geradas)

public/                        # Assets estáticos
├── logo-amajac.png
├── favicon.ico
└── site.webmanifest

middleware.ts                  # Proteção de rotas admin
netlify.toml                   # Configuração deploy Netlify
🛠️ Instalação e Desenvolvimento
Pré-requisitos
Node.js 22.x
npm ou yarn
Instalar dependências
bash
Copy
npm install
Variáveis de Ambiente
Crie um arquivo .env.local na raiz do projeto:
env
Copy
NEXT_PUBLIC_SUPABASE_URL=sua-url-do-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anonima-do-supabase
Nota: Estas variáveis substituem as antigas VITE_SUPABASE_* do Vue 3.
Iniciar servidor de desenvolvimento
bash
Copy
npm run dev
Abra http://localhost:3000 no navegador.
Build de produção
bash
Copy
npm run build
O projeto utiliza Turbopack por padrão no Next.js 15.
🔐 Autenticação
Login via Supabase Auth
Proteção de rotas /admin/* via Middleware
Superadmin restrito às rotas /admin/configuracoes e /admin/auditoria
Sessão verificada em múltiplas camadas (Middleware + DAL + Client)
📦 Deploy
Netlify (Configurado)
O projeto está configurado para deploy contínuo via Netlify:
bash
Copy
# Build command
npm install && npm run build

# Publish directory
.next

# Plugin
@netlify/plugin-nextjs
O arquivo netlify.toml já contém toda a configuração necessária.
Variáveis de Ambiente no Netlify
Configure no dashboard do Netlify:
Table
Variável	Descrição
NEXT_PUBLIC_SUPABASE_URL	URL do projeto Supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY	Chave anônima do Supabase
🗄️ Banco de Dados (Supabase)
Tabelas utilizadas:
configuracoes - Configurações do sistema
parceiros_comerciais - Parceiros e apoiadores
mensagens_contato - Mensagens do formulário de contato
noticias - Notícias e blog
galeria - Imagens e álbuns
classificados - Anúncios classificados
avaliacoes_classificados - Avaliações 5 estrelas
eventos - Agenda de eventos
associados - Sócios da comunidade
auditoria_logs - Logs de auditoria
📋 Funcionalidades
Portal Público
Página inicial com seções dinâmicas
Notícias com detalhe individual
Eventos com indicadores passado/futuro
Galeria com lightbox
Classificados com avaliação 5 estrelas
Parceiros em grid
Formulário de contato (salva no Supabase)
Inscrição de sócios
Páginas institucionais (sobre, termos, privacidade)
Painel Administrativo
Dashboard com estatísticas em tempo real
CRUD completo para todas as entidades
Upload de imagens para Supabase Storage
Moderação de classificados
Exportação de dados para CSV
Gestão de associados (status e patamares)
Auditoria de ações (superadmin)
📝 Scripts Disponíveis
Table
Comando	Descrição
npm run dev	Inicia servidor de desenvolvimento
npm run build	Build de produção
npm run start	Inicia servidor de produção
npm run lint	Executa ESLint
🔄 Migração Vue 3 → Next.js 15
Este projeto foi migrado de Vue 3 (Vite) preservando:
100% dos dados e lógica original
Todas as rotas e funcionalidades
Integração completa com Supabase
Identidade visual da AMAJAC
📄 Licença
Projeto privado - AMAJAC. Todos os direitos reservados.
AMAJAC - Associação de Moradores e Amigos do Bairro Jardim Atlântico Central
Desenvolvido com ❤️ para a comunidade.