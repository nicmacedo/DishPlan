// Types for DishPlan API responses
export interface UsuarioBase {
  email: string;
  nome: string;
}

export interface GrupoMembro {
  id: number;
  usuario: UsuarioBase;
  papel: 'DONO' | 'MEMBRO';
  created_at: string;
}

export interface GrupoResumo {
  id: number;
  nome: string;
}

export interface Grupo {
  id: number;
  nome: string;
  created_at: string;
  membros: GrupoMembro[];
  meu_papel?: 'DONO' | 'MEMBRO';
}

export interface Ingrediente {
  id: number;
  nome: string;
  categoria: string;
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

export interface Receita {
  id: number;
  titulo: string;
  descricao: string;
  modo_preparo: string;
  dificuldade: 'facil' | 'medio' | 'dificil';
  tempo_preparo: number | null;
  porcoes: number | null;
  imagem: string | null; // data URI base64
  is_publica: boolean;
  created_at: string;
  updated_at: string;
  criador_nome: string;
  total_ingredientes?: number;
  grupo?: GrupoResumo;
  grupo_detail?: GrupoResumo;
  ingredientes_receita: IngredienteReceita[];
}

export interface ReceitaWrite {
  titulo: string;
  descricao?: string;
  modo_preparo?: string;
  dificuldade?: 'facil' | 'medio' | 'dificil';
  tempo_preparo?: number | null;
  porcoes?: number | null;
  imagem_upload?: File; // handled via FormData in service
  ingredientes_data?: IngredienteReceitaWrite[];
  grupo?: number | null;
  is_publica?: boolean;
}

export interface CompartilhamentoReceita {
  id: number;
  receita: number;
  receita_titulo: string;
  grupo: number;
  grupo_nome: string;
  data_compartilhamento: string;
}

export interface CompartilhamentoWrite {
  receita: number;
  grupo: number;
}

export interface PlanoSemanal {
  id: number;
  semana_referencia: string; // YYYY-MM-DD
  criador_nome: string;
  grupo?: GrupoResumo;
  grupo_detail?: GrupoResumo;
  refeicoes: Refeicao[];
  created_at: string;
  updated_at: string;
}

export interface PlanoSemanalWrite {
  semana_referencia: string; // YYYY-MM-DD
  grupo?: number | null;
}

export interface Refeicao {
  id: number;
  plano_semanal: number;
  receita: number;
  receita_detail: Receita; // nested
  dia_da_semana: 'segunda' | 'terca' | 'quarta' | 'quinta' | 'sexta' | 'sabado' | 'domingo';
  tipo_refeicao: 'cafe' | 'almoco' | 'lanche' | 'jantar' | 'ceia';
}

export interface RefeicaoWrite {
  receita: number;
  dia_da_semana: 'segunda' | 'terca' | 'quarta' | 'quinta' | 'sexta' | 'sabado' | 'domingo';
  tipo_refeicao: 'cafe' | 'almoco' | 'lanche' | 'jantar' | 'ceia';
}

export interface ListaCompra {
  id: number;
  data: string; // YYYY-MM-DD
  criador_nome: string;
  grupo?: GrupoResumo;
  grupo_detail?: GrupoResumo;
  plano_semanal: number;
  progresso_total: number;
  itens: ItemCompra[];
  updated_at: string;
}

export interface ListaCompraWrite {
  plano_semanal: number; // created automatically via gerar endpoint
}

export interface ItemCompra {
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

export interface ItemCompraWrite {
  ingrediente?: number | null;
  nome_manual?: string;
  quantidade: number;
  unidade: string;
  comprado?: boolean;
}

export interface ItemCompraToggleResponse {
  id: number;
  comprado: boolean;
}

// Query param types
export interface GetReceitasParams {
  search?: string;
  dificuldade?: 'facil' | 'medio' | 'dificil';
  grupo?: number;
}
export interface GetPlanosParams {
  semana_referencia?: string; // YYYY-MM-DD
  grupo?: number;
}
export interface GetRefeicoesParams {
  plano_semanal?: number;
  dia_da_semana?: 'segunda' | 'terca' | 'quarta' | 'quinta' | 'sexta' | 'sabado' | 'domingo';
  tipo_refeicao?: 'cafe' | 'almoco' | 'lanche' | 'jantar' | 'ceia';
}
export interface GetListasParams {
  plano_semanal?: number;
  grupo?: number;
}
export interface GetItensParams {
  lista_compra?: number;
  comprado?: boolean;
}