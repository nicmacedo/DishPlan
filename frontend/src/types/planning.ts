import type { GrupoResumo, ReceitaList } from './recipes';

export interface Refeicao {
  id: number;
  plano_semanal: number;
  receita: number;
  receita_detail: ReceitaList;
  dia_da_semana: 'segunda' | 'terca' | 'quarta' | 'quinta' | 'sexta' | 'sabado' | 'domingo';
  tipo_refeicao: 'cafe' | 'almoco' | 'lanche' | 'jantar' | 'ceia';
}

export interface RefeicaoWrite {
  receita: number;
  dia_da_semana: 'segunda' | 'terca' | 'quarta' | 'quinta' | 'sexta' | 'sabado' | 'domingo';
  tipo_refeicao: 'cafe' | 'almoco' | 'lanche' | 'jantar' | 'ceia';
}

export interface PlanoSemanalList {
  id: number;
  semana_referencia: string;
  criador_nome: string;
  grupo?: GrupoResumo | null;
  total_refeicoes: number;
  updated_at: string;
}

export interface PlanoSemanalDetail {
  id: number;
  semana_referencia: string;
  criador_nome: string;
  grupo: number | null;
  grupo_detail: GrupoResumo | null;
  refeicoes: Refeicao[];
  created_at: string;
  updated_at: string;
}

export interface PaginatedPlanoSemanalList {
  count: number;
  next: string | null;
  previous: string | null;
  results: PlanoSemanalList[];
}

export interface PaginatedRefeicaoList {
  count: number;
  next: string | null;
  previous: string | null;
  results: Refeicao[];
}
