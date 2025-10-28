import { useColaboradoresStore } from '@/modules/colaboradores/stores/colaboradores';
import { storeToRefs } from 'pinia';

export function usePublicColaboradores() {
  const store = useColaboradoresStore();
  const { itens: parceiros, loading, error } = storeToRefs(store);

  const carregarParceiros = () => store.carregarColaboradores();
  const carregarParceiroPorId = (id) => store.carregarColaboradorPorId(id);

  // Getters específicos para parceiros
  const parceirosAtivos = () => {
    return store.itens.filter(parceiro => parceiro.ativo === true);
  };

  const buscarPorRamo = (ramo) => {
    return store.itens.filter(parceiro => 
      parceiro.ramo?.toLowerCase().includes(ramo.toLowerCase())
    );
  };

  const buscarPorTipo = (tipo) => {
    return store.itens.filter(parceiro => 
      parceiro.tipo?.toLowerCase().includes(tipo.toLowerCase())
    );
  };

  const ramosDisponiveis = () => {
    const ramos = store.itens
      .map(parceiro => parceiro.ramo)
      .filter(Boolean);
    return [...new Set(ramos)];
  };

  return {
    // State
    parceiros,
    loading,
    error,
    
    // Getters
    parceirosAtivos,
    buscarPorRamo,
    buscarPorTipo,
    ramosDisponiveis,
    
    // Actions
    carregarParceiros,
    carregarParceiroPorId
  };
}