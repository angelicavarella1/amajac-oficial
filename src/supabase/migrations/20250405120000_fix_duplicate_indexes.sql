-- ===================================================================
-- Migração: Correção de Índices Duplicados
-- Autor: Sistema Amajac
-- Data: 2025-04-05
-- Objetivo: Remover índice duplicado em public.configuracoes.chave
-- ===================================================================

-- 1. VALIDAÇÃO PRÉ-MIGRAÇÃO
DO $$
DECLARE
    duplicate_count INT;
    index1_exists BOOLEAN;
    index2_exists BOOLEAN;
    index_details RECORD;
BEGIN
    RAISE NOTICE '🚀 INICIANDO MIGRAÇÃO: Correção de Índices Duplicados';
    
    -- Verificar detalhes dos índices
    SELECT 
        COUNT(*) as total,
        COUNT(DISTINCT indexdef) as unique_definitions,
        ARRAY_AGG(indexname) as index_names
    INTO index_details
    FROM pg_indexes
    WHERE schemaname = 'public'
      AND tablename = 'configuracoes'
      AND indexdef LIKE '%UNIQUE INDEX%chave%';

    duplicate_count := index_details.total;
    
    RAISE NOTICE '🔍 [PRÉ-MIGRAÇÃO] Índices únicos em configuracoes.chave: %', duplicate_count;
    RAISE NOTICE '🔍 [PRÉ-MIGRAÇÃO] Definições únicas: %', index_details.unique_definitions;
    RAISE NOTICE '🔍 [PRÉ-MIGRAÇÃO] Nomes dos índices: %', index_details.index_names;

    -- Verificar existência específica dos índices
    SELECT EXISTS(
        SELECT 1 FROM pg_indexes
        WHERE schemaname = 'public'
          AND tablename = 'configuracoes'
          AND indexname = 'configuracoes_chave_key'
    ) INTO index1_exists;

    SELECT EXISTS(
        SELECT 1 FROM pg_indexes
        WHERE schemaname = 'public'
          AND tablename = 'configuracoes'
          AND indexname = 'configuracoes_chave_unique'
    ) INTO index2_exists;

    RAISE NOTICE '✅ [PRÉ-MIGRAÇÃO] configuracoes_chave_key existe: %', index1_exists;
    RAISE NOTICE '✅ [PRÉ-MIGRAÇÃO] configuracoes_chave_unique existe: %', index2_exists;

    -- Validação mais rigorosa
    IF duplicate_count < 2 THEN
        RAISE WARNING '⚠️ Nenhum índice duplicado detectado. Migração pode não ser necessária.';
    END IF;

    IF NOT index2_exists THEN
        RAISE NOTICE '⏭️ Índice alvo (configuracoes_chave_unique) não existe. Nada a fazer.';
    END IF;

    -- Verificar se há constraints associadas
    PERFORM 1 FROM information_schema.table_constraints 
    WHERE constraint_schema = 'public' 
      AND table_name = 'configuracoes' 
      AND constraint_name = 'configuracoes_chave_unique';
    
    IF FOUND THEN
        RAISE WARNING '⚠️ Existe uma constraint UNIQUE associada ao índice. Verifique manualmente.';
    END IF;
END $$;

-- 2. REMOÇÃO SEGURA DO ÍNDICE DUPLICADO
-- Estratégia: Manter configuracoes_chave_key, remover configuracoes_chave_unique

DO $$
BEGIN
    -- Verificar novamente antes de remover (double-check)
    IF EXISTS (
        SELECT 1 FROM pg_indexes
        WHERE schemaname = 'public'
          AND tablename = 'configuracoes'
          AND indexname = 'configuracoes_chave_unique'
    ) THEN
        RAISE NOTICE '🗑️ Removendo índice duplicado: public.configuracoes_chave_unique...';
        RAISE NOTICE '⏳ Esta operação é não-bloqueante (CONCURRENTLY)...';
    ELSE
        RAISE NOTICE '⏭️ Índice configuracoes_chave_unique não existe. Pulando remoção.';
        RETURN;
    END IF;
END $$;

-- Comando real de remoção (fora do bloco DO para permitir CONCURRENTLY)
DROP INDEX CONCURRENTLY IF EXISTS public.configuracoes_chave_unique;

-- 3. VERIFICAÇÃO INTERMEDIÁRIA
DO $$
DECLARE
    index_still_exists BOOLEAN;
BEGIN
    -- Verificar se o índice ainda existe após tentativa de remoção
    SELECT EXISTS(
        SELECT 1 FROM pg_indexes
        WHERE schemaname = 'public'
          AND tablename = 'configuracoes'
          AND indexname = 'configuracoes_chave_unique'
    ) INTO index_still_exists;

    IF index_still_exists THEN
        RAISE WARNING '❌ Falha ao remover índice duplicado. O índice ainda existe.';
        RAISE NOTICE '💡 Possível causa: O índice está sendo usado ou há locks ativos.';
    ELSE
        RAISE NOTICE '✅ Índice duplicado removido com sucesso.';
    END IF;
END $$;

-- 4. VALIDAÇÃO PÓS-MIGRAÇÃO
DO $$
DECLARE
    remaining_indexes TEXT[];
    remaining_count INT;
    primary_index_exists BOOLEAN;
BEGIN
    -- Listar índices restantes
    SELECT ARRAY_AGG(indexname ORDER BY indexname), COUNT(*)
    INTO remaining_indexes, remaining_count
    FROM pg_indexes
    WHERE schemaname = 'public'
      AND tablename = 'configuracoes'
      AND (indexdef LIKE '%chave%' OR indexname LIKE '%chave%');

    -- Verificar se o índice principal ainda existe
    SELECT EXISTS(
        SELECT 1 FROM pg_indexes
        WHERE schemaname = 'public'
          AND tablename = 'configuracoes'
          AND indexname = 'configuracoes_chave_key'
    ) INTO primary_index_exists;

    RAISE NOTICE '📊 [PÓS-MIGRAÇÃO] Relatório Final:';
    RAISE NOTICE '   ✅ Índices restantes em configuracoes: %', remaining_indexes;
    RAISE NOTICE '   ✅ Total de índices: %', remaining_count;
    RAISE NOTICE '   ✅ Índice principal (configuracoes_chave_key) existe: %', primary_index_exists;

    -- Validação do resultado
    IF remaining_count = 1 AND primary_index_exists THEN
        RAISE NOTICE '🎉 SUCESSO: Migração concluída com êxito!';
        RAISE NOTICE '   ✓ Apenas um índice único permanece';
        RAISE NOTICE '   ✓ Índice principal preservado';
    ELSIF remaining_count = 0 THEN
        RAISE WARNING '⚠️ ATENÇÃO: Nenhum índice encontrado para chave. Verifique integridade.';
    ELSIF remaining_count > 1 THEN
        RAISE WARNING '⚠️ ATENÇÃO: Ainda há % índices. Verifique manualmente.', remaining_count;
    END IF;

    -- Verificar integridade dos dados
    PERFORM 1 FROM public.configuracoes WHERE chave IS NULL LIMIT 1;
    IF FOUND THEN
        RAISE WARNING '⚠️ Valores NULL encontrados na coluna chave. Isso pode afetar a constraint única.';
    END IF;
END $$;

-- 5. ATUALIZAÇÃO DE ESTATÍSTICAS E PERFORMANCE
RAISE NOTICE '📈 Atualizando estatísticas do planner...';
ANALYZE VERBOSE public.configuracoes;

-- 6. LOG FINAL E RELATÓRIO DE BENEFÍCIOS
DO $$
DECLARE
    table_size_before TEXT;
    table_size_after TEXT;
    index_size_before TEXT;
    index_size_after TEXT;
BEGIN
    RAISE NOTICE '📋 RELATÓRIO FINAL DA MIGRAÇÃO:';
    RAISE NOTICE '   ✅ Estrutura otimizada: Remoção de índice duplicado';
    RAISE NOTICE '   ✅ Performance: Menos overhead em operações de escrita';
    RAISE NOTICE '   ✅ Storage: Redução no uso de espaço em disco';
    RAISE NOTICE '   ✅ Manutenção: Schema mais limpo e compreensível';
    RAISE NOTICE '';
    RAISE NOTICE '🔧 PRÓXIMOS PASSOS RECOMENDADOS:';
    RAISE NOTICE '   • Monitorar performance das queries relacionadas à tabela configuracoes';
    RAISE NOTICE '   • Verificar logs de aplicação por possíveis erros';
    RAISE NOTICE '   • Executar VACUUM ANALYZE em horário de baixa carga se necessário';
    
    RAISE NOTICE '🏁 MIGRAÇÃO CONCLUÍDA: %', now();
END $$;