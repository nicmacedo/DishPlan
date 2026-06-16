/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState, type FormEvent } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, Loader2, PackagePlus, Pencil } from "lucide-react"
import type { ItemCompra } from "@/types/api"

interface ShoppingItemModalProps {
  open: boolean
  onClose: () => void
  onSave: (payload: any, itemId?: number) => Promise<void>
  itemToEdit: ItemCompra | null
  listaId: number | null
}

export default function ShoppingItemModal({
  open,
  onClose,
  onSave,
  itemToEdit,
  listaId,
}: ShoppingItemModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    nome: "",
    quantidade: "",
    unidade: "",
  })

  const isEdit = !!itemToEdit
  const isLinkedIngredient = !!itemToEdit?.ingrediente

  const title = isEdit ? "Editar Item" : "Adicionar Item Avulso"

  const description = isEdit
    ? "Atualize as informações do item da sua lista de compras."
    : "Adicione um item manualmente à sua lista de compras."

  const isSubmitDisabled = useMemo(() => {
    const quantidade = Number(form.quantidade)

    return (
      loading ||
      !listaId ||
      !form.nome.trim() ||
      !form.quantidade ||
      Number.isNaN(quantidade) ||
      quantidade <= 0 ||
      !form.unidade.trim()
    )
  }, [form, listaId, loading])

  useEffect(() => {
    if (open && itemToEdit) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        nome: itemToEdit.nome_manual || itemToEdit.ingrediente_nome || "",
        quantidade: itemToEdit.quantidade?.toString() || "",
        unidade: itemToEdit.unidade || "",
      })
      setError(null)
    } else if (open) {
      setForm({
        nome: "",
        quantidade: "",
        unidade: "",
      })
      setError(null)
    }
  }, [open, itemToEdit])

  const handleClose = () => {
    if (loading) return

    setError(null)
    onClose()
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!listaId) {
      setError("Lista de compras não encontrada.")
      return
    }

    if (!form.nome.trim()) {
      setError("Informe o nome do item.")
      return
    }

    if (!form.quantidade || Number(form.quantidade) <= 0) {
      setError("Informe uma quantidade válida.")
      return
    }

    if (!form.unidade.trim()) {
      setError("Informe a unidade do item.")
      return
    }

    try {
      setLoading(true)
      setError(null)

      const payload: any = {
        lista_compra: listaId,
        quantidade: Number(form.quantidade),
        unidade: form.unidade.trim(),
      }

      if (itemToEdit?.ingrediente) {
        payload.ingrediente = itemToEdit.ingrediente
      } else {
        payload.nome_manual = form.nome.trim()
      }

      await onSave(payload, itemToEdit?.id)

      setForm({
        nome: "",
        quantidade: "",
        unidade: "",
      })

      onClose()
    } catch (err) {
      console.error("Erro ao salvar item:", err)
      setError("Erro ao salvar item. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(value) => !value && handleClose()}>
      <DialogContent className="max-h-[90dvh] w-[calc(100vw-1rem)] max-w-140! overflow-x-hidden overflow-y-auto rounded-2xl p-5 sm:w-[calc(100vw-2rem)] sm:p-6">
        <DialogHeader className="space-y-2 pr-6">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold sm:text-2xl">
            {isEdit ? (
              <Pencil className="h-5 w-5 shrink-0 text-dish-primary" />
            ) : (
              <PackagePlus className="h-5 w-5 shrink-0 text-dish-primary" />
            )}

            <span className="wrap-break-word">{title}</span>
          </DialogTitle>

          <DialogDescription className="text-sm leading-relaxed">
            {description}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-4">
          {error && (
            <div className="flex gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {isLinkedIngredient && (
            <div className="rounded-xl border border-dish-primary/30 bg-dish-primary/10 p-3 text-sm">
              <p className="font-medium text-foreground">
                Item vinculado a uma receita
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                O nome deste item vem de uma receita. Você pode alterar apenas a
                quantidade e a unidade.
              </p>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="shopping-item-name" className="text-sm font-medium">
              Nome do Item
            </label>

            <Input
              id="shopping-item-name"
              placeholder="Ex: Papel toalha, detergente..."
              value={form.nome}
              onChange={(event) =>
                setForm({ ...form, nome: event.target.value })
              }
              disabled={isLinkedIngredient || loading}
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="shopping-item-quantity"
                className="text-sm font-medium"
              >
                Quantidade
              </label>

              <Input
                id="shopping-item-quantity"
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0"
                placeholder="Ex: 2"
                value={form.quantidade}
                onChange={(event) =>
                  setForm({ ...form, quantidade: event.target.value })
                }
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="shopping-item-unit"
                className="text-sm font-medium"
              >
                Unidade
              </label>

              <Input
                id="shopping-item-unit"
                placeholder="Ex: un, kg, pacote"
                value={form.unidade}
                onChange={(event) =>
                  setForm({ ...form, unidade: event.target.value })
                }
                disabled={loading}
                required
              />
            </div>
          </div>

          <DialogFooter className="flex flex-col-reverse gap-2 border-t pt-4 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              className="w-full bg-dish-primary text-white hover:bg-dish-primary/90 sm:w-auto"
              disabled={isSubmitDisabled}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar Item"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
