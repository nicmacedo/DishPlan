import type { GrupoResumo } from './recipes';

export interface ItemCompraShopping {
  id: number;
  lista_compra: number;
  ingrediente: number | null;
  ingrediente_nome: string | null;
  ingrediente_categoria: string | null;
  nome_manual: string;
  nome_display: string;
  quantidade: number;
  unidade: string;
  comprado: boolean;
}

export interface ListaCompraList {
  id: number;
  data: string;
  criador_nome: string;
  grupo: GrupoResumo | null;
  plano_semanal: number;
  progresso_total: number;
  total_itens: number;
  updated_at: string;
}

export interface ListaCompraDetail {
  id: number;
  data: string;
  criador_nome: string;
  grupo: number | null;
  grupo_detail: GrupoResumo | null;
  plano_semanal: number;
  progresso_total: number;
  itens: ItemCompraShopping[];
  created_at: string;
  updated_at: string;
}

export interface PaginatedListaCompraList {
  count: number;
  next: string | null;
  previous: string | null;
  results: ListaCompraList[];
}

export interface PaginatedItemCompraList {
  count: number;
  next: string | null;
  previous: string | null;
  results: ItemCompraShopping[];
}
