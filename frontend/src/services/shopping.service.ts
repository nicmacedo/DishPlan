import { api } from '@/lib/axios';
import type {
  ListaCompra,
  ItemCompra,
  ItemCompraWrite,
  ItemCompraToggleResponse,
} from '@/types/api';

export const shoppingService = {
  // LISTAS DE COMPRAS
  // GET /api/listas/
  getListas: (params?: {
    plano_semanal?: number;
    grupo?: number;
  }) => api.get<ListaCompra[]>('/api/listas/', { params }),

  // POST /api/listas/
  createLista: (data: ListaCompraWrite) =>
    api.post<ListaCompra>('/api/listas/', data),

  // GET /api/listas/{id}/
  getLista: (id: number) => api.get<ListaCompra>(`/api/listas/${id}/`),

  // PUT /api/listas/{id}/
  updateLista: (id: number, data: Partial<ListaCompraWrite>) =>
    api.put<ListaCompra>(`/api/listas/${id}/`, data),

  // DELETE /api/listas/{id}/
  deleteLista: (id: number) => api.delete<void>(`/api/listas/${id}/`),

  // POST /api/listas/gerar/
  gerarLista: (planoId: number) =>
    api.post<ListaCompra>('/api/listas/gerar/', {
      plano_semanal: planoId,
    }),

  // ITENS DE COMPRA
  // GET /api/itens/
  getItens: (params?: {
    lista_compra?: number;
    comprado?: boolean;
  }) => api.get<ItemCompra[]>('/api/itens/', { params }),

  // POST /api/itens/
  createItem: (data: ItemCompraWrite) =>
    api.post<ItemCompra>('/api/itens/', data),

  // GET /api/itens/{id}/
  getItem: (id: number) => api.get<ItemCompra>(`/api/itens/${id}/`),

  // PUT /api/itens/{id}/
  updateItem: (id: number, data: Partial<ItemCompraWrite>) =>
    api.put<ItemCompra>(`/api/itens/${id}/`, data),

  // DELETE /api/itens/{id}/
  deleteItem: (id: number) => api.delete<void>(`/api/itens/${id}/`),

  // PATCH /api/itens/{id}/toggle/
  toggleItem: (id: number) =>
    api.patch<ItemCompraToggleResponse>(`/api/itens/${id}/toggle/`),
};

// Helper type for ListaCompraWrite (same as ListaCompra without id, data, created_at, updated_at, etc.)
type ListaCompraWrite = Omit<ListaCompra, 'id' | 'data' | 'criador_nome' | 'grupo' | 'grupo_detail' | 'plano_semanal' | 'progresso_total' | 'itens' | 'updated_at'>;
// Actually we only need plano_semnal for gerar endpoint; createLista not used maybe but we keep simple.