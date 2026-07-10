-- ══════════════════════════════════════════════
-- AMAJAC - Database Schema v1
-- Execute este arquivo no SQL Editor do Supabase
-- ══════════════════════════════════════════════

-- ── Extensions ──
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── Função updated_at ──
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ═══════════════════════
-- TABELAS PRINCIPAIS
-- ═══════════════════════

-- 1. configuracoes (chave-valor)
CREATE TABLE IF NOT EXISTS configuracoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chave TEXT NOT NULL UNIQUE,
  valor TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TRIGGER trg_configuracoes_updated_at
  BEFORE UPDATE ON configuracoes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Valores padrão
INSERT INTO configuracoes (chave, valor) VALUES
  ('missao', 'Representar e defender os interesses dos moradores do Jardim Atlântico Central, promovendo o desenvolvimento urbano, social e cultural do bairro.'),
  ('visao', 'Ser referência em organização comunitária no município de Maricá, com um bairro reconhecido pela qualidade de vida, infraestrutura e participação cidadã.'),
  ('valores', 'Transparência, participação democrática, respeito à diversidade, compromisso com a comunidade e sustentabilidade.'),
  ('historia', 'Fundada em 2019 por um grupo de moradores comprometidos com a melhoria da qualidade de vida no bairro, a AMAJAC atua na articulação entre a comunidade e o poder público, promovendo eventos, projetos sociais e melhorias na infraestrutura local.'),
  ('quem_somos_imagem_url', '')
ON CONFLICT (chave) DO NOTHING;

-- 2. noticias
CREATE TABLE IF NOT EXISTS noticias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  resumo TEXT DEFAULT '',
  conteudo TEXT NOT NULL DEFAULT '',
  imagem_url TEXT DEFAULT NULL,
  imagem_alt TEXT DEFAULT '',
  autor TEXT DEFAULT 'Equipe AMAJAC',
  destaque BOOLEAN DEFAULT false,
  ativo BOOLEAN DEFAULT true,
  rascunho BOOLEAN DEFAULT false,
  visualizacoes INTEGER DEFAULT 0,
  data_publicacao TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TRIGGER trg_noticias_updated_at
  BEFORE UPDATE ON noticias
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE INDEX idx_noticias_data ON noticias(data_publicacao DESC);
CREATE INDEX idx_noticias_destaque ON noticias(destaque DESC);
CREATE INDEX idx_noticias_publicadas ON noticias(ativo, rascunho);

-- 3. eventos
CREATE TABLE IF NOT EXISTS eventos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  descricao TEXT DEFAULT '',
  data_evento TIMESTAMPTZ NOT NULL,
  hora_evento TEXT DEFAULT '',
  local TEXT DEFAULT '',
  imagem_url TEXT DEFAULT NULL,
  imagem_alt TEXT DEFAULT '',
  destaque BOOLEAN DEFAULT false,
  ativo BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TRIGGER trg_eventos_updated_at
  BEFORE UPDATE ON eventos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE INDEX idx_eventos_data ON eventos(data_evento ASC);
CREATE INDEX idx_eventos_ativos ON eventos(ativo, data_evento);

-- 4. classificados
CREATE TABLE IF NOT EXISTS classificados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL DEFAULT '',
  categoria TEXT NOT NULL DEFAULT 'outros',
  nome_anunciante TEXT NOT NULL,
  bairro TEXT DEFAULT 'Jardim Atlântico Central',
  telefone TEXT DEFAULT '',
  email TEXT DEFAULT NULL,
  imagem_url TEXT DEFAULT NULL,
  ativo BOOLEAN DEFAULT true,
  aprovado BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TRIGGER trg_classificados_updated_at
  BEFORE UPDATE ON classificados
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE INDEX idx_classificados_aprovados ON classificados(aprovado, ativo);
CREATE INDEX idx_classificados_categoria ON classificados(categoria);
CREATE INDEX idx_classificados_data ON classificados(created_at DESC);

-- 5. avaliacoes_classificados
CREATE TABLE IF NOT EXISTS avaliacoes_classificados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  classificado_id UUID NOT NULL REFERENCES classificados(id) ON DELETE CASCADE,
  nota INTEGER NOT NULL CHECK (nota >= 1 AND nota <= 5),
  comentario TEXT DEFAULT NULL,
  nome_avaliador TEXT NOT NULL,
  email_avaliador TEXT NOT NULL,
  usuario_id UUID DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_avaliacoes_classificado ON avaliacoes_classificados(classificado_id);

-- 6. galeria
CREATE TABLE IF NOT EXISTS galeria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL DEFAULT 'Sem título',
  imagem_url TEXT NOT NULL,
  imagem_alt TEXT DEFAULT '',
  descricao TEXT DEFAULT NULL,
  categoria TEXT DEFAULT 'Geral',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TRIGGER trg_galeria_updated_at
  BEFORE UPDATE ON galeria
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE INDEX idx_galeria_categoria ON galeria(categoria);
CREATE INDEX idx_galeria_data ON galeria(created_at DESC);

-- 7. parceiros_comerciais
CREATE TABLE IF NOT EXISTS parceiros_comerciais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  logo_url TEXT DEFAULT NULL,
  link_site TEXT DEFAULT NULL,
  instagram TEXT DEFAULT NULL,
  facebook TEXT DEFAULT NULL,
  ramo TEXT DEFAULT NULL,
  imagem_alt TEXT DEFAULT '',
  ativo BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TRIGGER trg_parceiros_updated_at
  BEFORE UPDATE ON parceiros_comerciais
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE INDEX idx_parceiros_ativos ON parceiros_comerciais(ativo);

-- 8. mensagens_contato
CREATE TABLE IF NOT EXISTS mensagens_contato (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT DEFAULT NULL,
  assunto TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  lida BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TRIGGER trg_mensagens_updated_at
  BEFORE UPDATE ON mensagens_contato
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE INDEX idx_mensagens_naolidas ON mensagens_contato(lida);
CREATE INDEX idx_mensagens_data ON mensagens_contato(created_at DESC);

-- 9. associados
CREATE TABLE IF NOT EXISTS associados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  cpf TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT DEFAULT NULL,
  endereco TEXT NOT NULL,
  categoria TEXT NOT NULL DEFAULT 'benemerito' CHECK (categoria IN ('benemerito', 'remido')),
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'ativo', 'inativo', 'rejeitado')),
  observacoes_remido TEXT DEFAULT NULL,
  data_aprovacao TIMESTAMPTZ DEFAULT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TRIGGER trg_associados_updated_at
  BEFORE UPDATE ON associados
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE INDEX idx_associados_status ON associados(status);
CREATE INDEX idx_associados_categoria ON associados(categoria);

-- 10. admin_profiles
CREATE TABLE IF NOT EXISTS admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  ativo BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TRIGGER trg_admin_profiles_updated_at
  BEFORE UPDATE ON admin_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 11. admin_logs (auditoria)
CREATE TABLE IF NOT EXISTS admin_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000',
  action TEXT NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
  table_name TEXT NOT NULL,
  record_id UUID DEFAULT NULL,
  details JSONB DEFAULT NULL,
  ip_address TEXT DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_admin_logs_data ON admin_logs(created_at DESC);
CREATE INDEX idx_admin_logs_table ON admin_logs(table_name);

-- ═══════════════════════
-- ROW LEVEL SECURITY
-- ═══════════════════════

-- Configurações: leitura pública, escrita apenas admin
ALTER TABLE configuracoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "configuracoes_select_public" ON configuracoes FOR SELECT USING (true);
CREATE POLICY "configuracoes_all_admin" ON configuracoes FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Notícias: leitura pública (apenas publicadas), escrita admin
ALTER TABLE noticias ENABLE ROW LEVEL SECURITY;
CREATE POLICY "noticias_select_public" ON noticias FOR SELECT USING (ativo = true AND rascunho = false);
CREATE POLICY "noticias_all_admin" ON noticias FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Eventos: leitura pública, escrita admin
ALTER TABLE eventos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "eventos_select_public" ON eventos FOR SELECT USING (ativo = true);
CREATE POLICY "eventos_all_admin" ON eventos FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Classificados: leitura pública (apenas aprovados), escrita admin
ALTER TABLE classificados ENABLE ROW LEVEL SECURITY;
CREATE POLICY "classificados_select_public" ON classificados FOR SELECT USING (ativo = true AND aprovado = true);
CREATE POLICY "classificados_all_admin" ON classificados FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Avaliações: leitura pública, inserção pública
ALTER TABLE avaliacoes_classificados ENABLE ROW LEVEL SECURITY;
CREATE POLICY "avaliacoes_select_public" ON avaliacoes_classificados FOR SELECT USING (true);
CREATE POLICY "avaliacoes_insert_public" ON avaliacoes_classificados FOR INSERT WITH CHECK (true);
CREATE POLICY "avaliacoes_all_admin" ON avaliacoes_classificados FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Galeria: leitura pública, escrita admin
ALTER TABLE galeria ENABLE ROW LEVEL SECURITY;
CREATE POLICY "galeria_select_public" ON galeria FOR SELECT USING (true);
CREATE POLICY "galeria_all_admin" ON galeria FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Parceiros: leitura pública (apenas ativos), escrita admin
ALTER TABLE parceiros_comerciais ENABLE ROW LEVEL SECURITY;
CREATE POLICY "parceiros_select_public" ON parceiros_comerciais FOR SELECT USING (ativo = true);
CREATE POLICY "parceiros_all_admin" ON parceiros_comerciais FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Mensagens: inserção pública, leitura/escrita admin
ALTER TABLE mensagens_contato ENABLE ROW LEVEL SECURITY;
CREATE POLICY "mensagens_insert_public" ON mensagens_contato FOR INSERT WITH CHECK (true);
CREATE POLICY "mensagens_all_admin" ON mensagens_contato FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Associados: inserção pública, leitura/escrita admin
ALTER TABLE associados ENABLE ROW LEVEL SECURITY;
CREATE POLICY "associados_insert_public" ON associados FOR INSERT WITH CHECK (true);
CREATE POLICY "associados_all_admin" ON associados FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Admin profiles e logs: apenas admin
ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_profiles_all_admin" ON admin_profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);

ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_logs_insert_auth" ON admin_logs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "admin_logs_select_auth" ON admin_logs FOR SELECT TO authenticated USING (true);

-- ═══════════════════════
-- STORAGE BUCKET
-- ═══════════════════════

-- Cria o bucket de imagens (execute no SQL Editor)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'imagens',
  'imagens',
  true,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
) ON CONFLICT (id) DO NOTHING;

-- Políticas de storage
CREATE POLICY "storage_select_public" ON storage.objects FOR SELECT USING (bucket_id = 'imagens');
CREATE POLICY "storage_insert_admin" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'imagens');
CREATE POLICY "storage_update_admin" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'imagens');
CREATE POLICY "storage_delete_admin" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'imagens');

-- ═══════════════════════
-- TRIGGER: auto-create admin_profile on signup
-- ═══════════════════════
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO admin_profiles (id, nome, email, ativo)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'nome', 'Administrador'), NEW.email, true);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
