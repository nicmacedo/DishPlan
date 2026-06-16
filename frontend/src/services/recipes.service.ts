import { api } from '@/lib/axios';
import type {
  Ingrediente,
  Receita,
  ReceitaWrite,
  CompartilhamentoReceita,
  CompartilhamentoWrite,
} from '@/types/api';

export const recipesService = {
  // INGREDIENTES
  // GET /api/ingredientes/
  getIngredients: () => api.get<Ingrediente[]>('/api/ingredientes/'),

  // POST /api/ingredientes/
  createIngredient: (data: { nome: string; categoria: string }) =>
    api.post<Ingrediente>('/api/ingredientes/', data),

  // GET /api/ingredientes/{id}/
  getIngredient: (id: number) => api.get<Ingrediente>(`/api/ingredientes/${id}/`),

  // PUT /api/ingredientes/{id}/
  updateIngredient: (id: number, data: Partial<{ nome: string; categoria: string }>) =>
    api.put<Ingrediente>(`/api/ingredientes/${id}/`, data),

  // DELETE /api/ingredientes/{id}/
  deleteIngredient: (id: number) => api.delete<void>(`/api/ingredientes/${id}/`),

  // RECEITAS
  // GET /api/receitas/
  getRecipes: (params?: {
    search?: string;
    dificuldade?: 'facil' | 'medio' | 'dificil';
    grupo?: number;
  }) =>
    api.get<Receita[]>('/api/receitas/', { params }),

  // POST /api/receitas/
  createRecipe: (data: ReceitaWrite) => api.post<Receita>('/api/receitas/', data),

  // GET /api/receitas/{id}/
  getRecipe: (id: number) => api.get<Receita>(`/api/receitas/${id}/`),

  // PUT /api/receitas/{id}/
  updateRecipe: (id: number, data: Partial<ReceitaWrite>) =>
    api.put<Receita>(`/api/receitas/${id}/`, data),

  // DELETE /api/receitas/{id}/
  deleteRecipe: (id: number) => api.delete<void>(`/api/receitas/${id}/`),

  // COMPARTILHAMENTOS
  // GET /api/compartilhamentos/
  getCompartilhamentos: () =>
    api.get<CompartilhamentoReceita[]>('/api/compartilhamentos/'),

  // POST /api/compartilhamentos/
  createCompartilhamento: (data: CompartilhamentoWrite) =>
    api.post<CompartilhamentoReceita>('/api/compartilhamentos/', data),

  // GET /api/compartilhamentos/{id}/
  getCompartilhamento: (id: number) =>
    api.get<CompartilhamentoReceita>(`/api/compartilhamentos/${id}/`),

  // DELETE /api/compartilhamentos/{id}/
  deleteCompartilhamento: (id: number) =>
    api.delete<void>(`/api/compartilhamentos/${id}/`),
};
