import { api } from '@/lib/axios';
import type { Grupo, GrupoMembro } from '@/types/groups';

export const groupsService = {
  // GET /api/grupos/
  getGroups: () => api.get<{ results: Grupo[] }>('/api/grupos/').then(res => res.data.results),

  // POST /api/grupos/
  createGroup: (data: { nome: string }) => api.post<Grupo>('/api/grupos/', data),

  // GET /api/grupos/{id}/
  getGroup: (id: number) => api.get<Grupo>(`/api/grupos/${id}/`),

  // PUT /api/grupos/{id}/
  updateGroup: (id: number, data: Partial<{ nome: string }>) => api.put<Grupo>(`/api/grupos/${id}/`, data),

  // DELETE /api/grupos/{id}/
  deleteGroup: (id: number) => api.delete<void>(`/api/grupos/${id}/`),

  // POST /api/grupos/{id}/membros/
  addMember: (groupId: number, email: string) =>
    api.post<GrupoMembro>(`/api/grupos/${groupId}/membros/`, { email }),

  // DELETE /api/grupos/{id}/membros/{membro_id}/
  removeMember: (groupId: number, memberId: number) =>
    api.delete<void>(`/api/grupos/${groupId}/membros/${memberId}/`),
};