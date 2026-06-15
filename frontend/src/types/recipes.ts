export interface GrupoResumo {
  id: number;
  nome: string;
}

export interface Ingrediente {
  id: number;
  nome: string;
  categoria: 'carnes' | 'hortifruti' | 'laticinios' | 'graos_cereais' | 'temperos' | 'bebidas' | 'padaria' | 'enlatados' | 'congelados' | 'doces' | 'outros';
}

export interface IngredienteReceita {
  id: number;
  ingrediente: number;
  ingrediente_nome: string;
  ingrediente_categoria: string;
  quantidade: number;
  unidade: string;
}

export interface IngredienteReceitaWrite {
  ingrediente: number;
  quantidade: number;
  unidade: string;
}

export interface ReceitaList {
  id: number;
  titulo: string;
  descricao?: string;
  dificuldade: 'facil' | 'medio' | 'dificil';
  tempo_preparo: number | null;
  porcoes: number | null;
  criador_nome: string;
  grupo?: GrupoResumo | null;
  total_ingredientes: number;
  has_imagem: boolean;
  is_publica: boolean;
  created_at: string;
}

export interface ReceitaDetail {
  id: number;
  titulo: string;
  descricao?: string;
  modo_preparo?: string;
  dificuldade: 'facil' | 'medio' | 'dificil';
  tempo_preparo: number | null;
  porcoes: number | null;
  criador_nome: string;
  grupo: number | null;
  grupo_detail: GrupoResumo | null;
  ingredientes_receita: IngredienteReceita[];
  ingredientes_data?: IngredienteReceitaWrite[];
  imagem: string | null;
  created_at: string;
  updated_at: string;
}

/** Payload para criar ou atualizar uma receita (sem campos read-only). */
export interface ReceitaWrite {
  titulo: string;
  descricao?: string;
  modo_preparo?: string;
  dificuldade: 'facil' | 'medio' | 'dificil';
  tempo_preparo?: number | null;
  porcoes?: number | null;
  grupo?: number | null;
  ingredientes_data?: IngredienteReceitaWrite[];
}

export interface CompartilhamentoReceita {
  id: number;
  receita: number;
  receita_titulo: string;
  grupo: number;
  grupo_nome: string;
  data_compartilhamento: string;
}

export interface PaginatedReceitaList {
  count: number;
  next: string | null;
  previous: string | null;
  results: ReceitaList[];
}

export interface PaginatedIngredienteList {
  count: number;
  next: string | null;
  previous: string | null;
  results: Ingrediente[];
}

export interface PaginatedCompartilhamentoReceitaList {
  count: number;
  next: string | null;
  previous: string | null;
  results: CompartilhamentoReceita[];
}
