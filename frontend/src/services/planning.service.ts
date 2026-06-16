import { api } from '@/lib/axios';
import type { PlanoSemanal, PlanoSemanalWrite, Refeicao, RefeicaoWrite } from '@/types/api';

export const planningService = {
  // PLANOS SEMANAIS
  // GET /api/planos/
  getPlanos: (params?: {
    semana_referencia?: string; // YYYY-MM-DD
    grupo?: number;
  }) => api.get<PlanoSemanal[]>('/api/planos/', { params }),

  // POST /api/planos/
  createPlano: (data: PlanoSemanalWrite) =>
    api.post<PlanoSemanal>('/api/planos/', data),

  // GET /api/planos/{id}/
  getPlano: (id: number) => api.get<PlanoSemanal>(`/api/planos/${id}/`),

  // PATCH /api/planos/{id}/
  updatePlano: (id: number, data: Partial<PlanoSemanalWrite>) =>
    api.patch<PlanoSemanal>(`/api/planos/${id}/`, data),

  // DELETE /api/planos/{id}/
  deletePlano: (id: number) => api.delete<void>(`/api/planos/${id}/`),

  // REFEIÇÕES
  // GET /api/refeicoes/
  getRefeicoes: (params?: {
    plano_semanal?: number;
    dia_da_semana?: 'segunda' | 'terca' | 'quarta' | 'quinta' | 'sexta' | 'sabado' | 'domingo';
    tipo_refeicao?: 'cafe' | 'almoco' | 'lanche' | 'jantar' | 'ceia';
  }) => api.get<Refeicao[]>('/api/refeicoes/', { params }),

  // POST /api/refeicoes/
  createRefeicao: (data: RefeicaoWrite & { plano_semanal: number }) =>
    api.post<Refeicao>('/api/refeicoes/', data),

  // GET /api/refeicoes/{id}/
  getRefeicao: (id: number) => api.get<Refeicao>(`/api/refeicoes/${id}/`),

  // PUT /api/refeicoes/{id}/
  updateRefeicao: (id: number, data: Partial<RefeicaoWrite>) =>
    api.put<Refeicao>(`/api/refeicoes/${id}/`, data),

  // DELETE /api/refeicoes/{id}/
  deleteRefeicao: (id: number) => api.delete<void>(`/api/refeicoes/${id}/`),
};