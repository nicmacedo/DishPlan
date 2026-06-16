/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react"
import {
  ShoppingCart,
  CheckCircle2,
  ListChecks,
  Plus,
  Sparkles,
  RefreshCw,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { shoppingService } from "@/services/shopping.service"
import type {
  ListaCompra,
  ItemCompra,
} from "@/types/api"
import ShoppingListItem from "@/components/shopping/ShoppingListItem"
import GenerateListModal from "@/components/shopping/GenerateListModal"
import ShoppingItemModal from "@/components/shopping/ShoppingItemModal"
import type { ListaCompraDetail } from "@/types/shopping"

export default function Compras() {
  const [listas, setListas] = useState<ListaCompra[]>([])
  const [activeListaId, setActiveListaId] = useState<string>("")
  const [listaDetail, setListaDetail] = useState<ListaCompraDetail | null>(null)

  const [loadingListas, setLoadingListas] = useState(true)
  const [loadingDetail, setLoadingDetail] = useState(false)

  // Modais
  const [generateModalOpen, setGenerateModalOpen] = useState(false)
  const [itemModalOpen, setItemModalOpen] = useState(false)
  const [itemToEdit, setItemToEdit] = useState<ItemCompra | null>(null)

  const fetchListas = async (idToSelect?: number) => {
    try {
      setLoadingListas(true)
      const res = await shoppingService.getListas()
      const data = Array.isArray(res.data)
        ? res.data
        : (res.data as any).results || []
      setListas(data)

      if (idToSelect) {
        setActiveListaId(idToSelect.toString())
      } else if (data.length > 0 && !activeListaId) {
        setActiveListaId(data[0].id.toString())
      }
    } catch (err) {
      console.error("Erro ao buscar listas", err)
    } finally {
      setLoadingListas(false)
    }
  }

  const fetchListaDetail = async (id: number) => {
    try {
      setLoadingDetail(true)
      const res = await shoppingService.getLista(id)
      setListaDetail(res.data)
    } catch (err) {
      console.error("Erro ao buscar itens da lista", err)
    } finally {
      setLoadingDetail(false)
    }
  }

  useEffect(() => {
    fetchListas()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (activeListaId) {
      fetchListaDetail(Number(activeListaId))
    } else {
      setListaDetail(null)
    }
  }, [activeListaId])

  // Correção do Bug de Atualização da Página
  const handleGenerateSuccess = async (novaListaId: number) => {
    await fetchListas(novaListaId)
    // Força a atualização dos detalhes imediatamente, independente do estado anterior
    await fetchListaDetail(novaListaId)
  }

  const handleToggleItem = async (itemId: number, currentStatus: boolean) => {
    if (!listaDetail) return
    const novoStatus = !currentStatus
    const updatedItens = listaDetail.itens.map((item: { id: number }) =>
      item.id === itemId ? { ...item, comprado: novoStatus } : item
    )

    const total = updatedItens.length
    const comprados = updatedItens.filter(
      (i: { comprado: boolean }) => i.comprado
    ).length
    const novoProgresso =
      total === 0 ? 0 : Math.round((comprados / total) * 100)

    setListaDetail({
      ...listaDetail,
      itens: updatedItens,
      progresso_total: novoProgresso,
    })

    try {
      await shoppingService.toggleItem(itemId)
    } catch (err) {
      console.error("Erro ao atualizar status do item", err)
      fetchListaDetail(Number(activeListaId)) // Desfaz se falhar
    }
  }

  // --- CRUD DE ITENS MANUAIS ---
  const handleSaveItem = async (payload: any, itemId?: number) => {
    try {
      if (itemId) {
        await shoppingService.updateItem(itemId, payload)
      } else {
        await shoppingService.createItem(payload)
      }
      // Atualiza a lista na tela logo após a API responder
      await fetchListaDetail(Number(activeListaId))
    } catch (error) {
      console.error("Erro ao salvar item:", error)
      throw error // Joga para o modal lidar com o estado de botão
    }
  }

  const handleDeleteItem = async (itemId: number) => {
    if (!confirm("Tem certeza que deseja excluir este item?")) return
    try {
      await shoppingService.deleteItem(itemId)
      await fetchListaDetail(Number(activeListaId))
    } catch (error) {
      console.error("Erro ao excluir item:", error)
    }
  }

  const openAddItemModal = () => {
    setItemToEdit(null)
    setItemModalOpen(true)
  }

  const openEditItemModal = (item: ItemCompra) => {
    setItemToEdit(item)
    setItemModalOpen(true)
  }

  const itensPendentes =
    listaDetail?.itens.filter((i: { comprado: boolean }) => !i.comprado) || []
  const itensComprados =
    listaDetail?.itens.filter((i: { comprado: boolean }) => i.comprado) || []

  if (loadingListas) {
    return (
      <div className="flex min-h-dvh flex-1 items-center justify-center">
        <ShoppingCart className="h-8 w-8 animate-pulse text-dish-primary/50" />
      </div>
    )
  }

  return (
    <div className="mx-auto mb-20 flex w-full max-w-3xl flex-col gap-6 p-4 md:mb-0 md:p-6 lg:p-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight">
            <ShoppingCart className="h-6 w-6 text-dish-primary" />
            Lista de Compras
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Controle os ingredientes necessários para a semana.
          </p>
        </div>

        <div className="flex w-full gap-2 sm:w-auto">
          {listas.length > 0 && (
            <Select value={activeListaId} onValueChange={setActiveListaId}>
              <SelectTrigger className="w-full bg-background sm:w-50">
                <SelectValue placeholder="Selecione a lista..." />
              </SelectTrigger>
              <SelectContent>
                {listas.map((l) => (
                  <SelectItem key={l.id} value={l.id.toString()}>
                    Lista: {l.data.split("-").reverse().join("/")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {listas.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="shrink-0 border-dish-primary/50 text-dish-primary hover:bg-dish-primary/10"
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${loadingDetail ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Atualizar</span>
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  onClick={() => fetchListaDetail(Number(activeListaId))}
                  className="cursor-pointer"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Sincronizar (Buscar alterações)
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setGenerateModalOpen(true)}
                  className="cursor-pointer text-dish-primary focus:text-dish-primary"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Gerar via Cardápio (Auto)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {!activeListaId || !listaDetail ? (
        <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/5 p-10 text-center">
          <ListChecks className="mb-4 h-12 w-12 text-muted-foreground/30" />
          <h3 className="mb-2 text-lg font-semibold text-foreground">
            Sua cesta está vazia
          </h3>
          <p className="mb-6 max-w-md text-sm text-muted-foreground">
            Você ainda não possui listas de compra. Gere uma automaticamente com
            base no seu cardápio semanal!
          </p>
          <Button
            onClick={() => setGenerateModalOpen(true)}
            className="bg-dish-primary text-white hover:bg-dish-primary/90"
          >
            Gerar Primeira Lista
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <div className="mb-2 flex justify-between text-sm font-semibold">
              <span className="text-muted-foreground">Progresso</span>
              <span className="text-dish-primary">
                {listaDetail.progresso_total}%
              </span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-dish-primary transition-all duration-500 ease-out"
                style={{ width: `${listaDetail.progresso_total}%` }}
              />
            </div>
          </div>

          {loadingDetail ? (
            <div className="py-10 text-center">
              <ShoppingCart className="mx-auto h-6 w-6 animate-pulse text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-8">
              <div className="space-y-3">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-sm font-bold tracking-wider text-muted-foreground uppercase">
                    <span className="rounded-md bg-destructive/10 px-2 py-0.5 text-xs text-destructive">
                      {itensPendentes.length}
                    </span>
                    Para Comprar
                  </h3>

                  {/* Botão de Adicionar Item Avulso */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={openAddItemModal}
                    className="text-dish-primary hover:bg-dish-primary/10 hover:text-dish-primary/80"
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Adicionar Item
                  </Button>
                </div>

                {itensPendentes.length === 0 ? (
                  <p className="rounded-xl border border-dashed p-4 text-center text-sm text-muted-foreground italic">
                    Nenhum item pendente. Tudo comprado! 🎉
                  </p>
                ) : (
                  <div className="grid gap-2">
                    {itensPendentes.map((item: ItemCompra) => (
                      <ShoppingListItem
                        key={item.id}
                        item={item}
                        onToggle={handleToggleItem}
                        onEdit={openEditItemModal}
                        onDelete={handleDeleteItem}
                      />
                    ))}
                  </div>
                )}
              </div>

              {itensComprados.length > 0 && (
                <div className="space-y-3 opacity-80">
                  <h3 className="mt-8 mb-4 flex items-center gap-2 text-sm font-bold tracking-wider text-muted-foreground uppercase">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Comprados ({itensComprados.length})
                  </h3>
                  <div className="grid gap-2">
                    {itensComprados.map((item: ItemCompra) => (
                      <ShoppingListItem
                        key={item.id}
                        item={item}
                        onToggle={handleToggleItem}
                        onEdit={openEditItemModal}
                        onDelete={handleDeleteItem}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Modais */}
      <GenerateListModal
        open={generateModalOpen}
        onClose={() => setGenerateModalOpen(false)}
        onSuccess={handleGenerateSuccess}
      />

      <ShoppingItemModal
        open={itemModalOpen}
        onClose={() => setItemModalOpen(false)}
        onSave={handleSaveItem}
        itemToEdit={itemToEdit}
        listaId={activeListaId ? Number(activeListaId) : null}
      />
    </div>
  )
}
