export interface GrupoMembro {
  id: number;
  email: string;
  nome: string;
  papel: 'dono' | 'membro';
  created_at: string;
}

export interface Grupo {
  id: number;
  nome: string;
  created_at: string;
  membros: GrupoMembro[];
  meu_papel?: string | null;
}

export interface PaginatedGrupoList {
  count: number;
  next: string | null;
  previous: string | null;
  results: Grupo[];
}
