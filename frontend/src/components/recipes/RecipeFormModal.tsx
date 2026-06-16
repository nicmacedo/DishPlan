/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, X } from "lucide-react"
import { recipesService } from "@/services/recipes.service"
import type { Ingrediente, ReceitaWrite } from "@/types/api"

interface RecipeFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export default function RecipeFormModal({
  open,
  onOpenChange,
  onSuccess,
}: RecipeFormModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [ingredientesList, setIngredientesList] = useState<Ingrediente[]>([])

  const [form, setForm] = useState({
    titulo: "",
    descricao: "",
    modo_preparo: "",
    dificuldade: "facil" as ReceitaWrite["dificuldade"],
    tempo_preparo: "",
    porcoes: "",
    ingredientes_data: [{ ingredienteId: "", quantidade: "", unidade: "" }],
  })

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/immutability
      loadIngredientes()
    }
  }, [open])

  const loadIngredientes = async () => {
    try {
      const response = await recipesService.getIngredients()
      // Lida tanto com paginação do DRF quanto com retorno direto
      const data = (response.data as any).results || response.data
      setIngredientesList(data)
    } catch (err) {
      console.error("Erro ao carregar ingredientes", err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.titulo.trim()) return

    setLoading(true)
    setError(null)

    try {
      // Monta o payload exato da interface ReceitaWrite
      const payload: ReceitaWrite = {
        titulo: form.titulo,
        descricao: form.descricao,
        modo_preparo: form.modo_preparo,
        dificuldade: form.dificuldade,
        tempo_preparo: form.tempo_preparo ? Number(form.tempo_preparo) : null,
        porcoes: form.porcoes ? Number(form.porcoes) : null,
        ingredientes_data: form.ingredientes_data
          .filter((ing) => ing.ingredienteId && ing.quantidade && ing.unidade)
          .map((ing) => ({
            ingrediente: Number(ing.ingredienteId),
            quantidade: Number(ing.quantidade),
            unidade: ing.unidade.trim(),
          })),
      }

      await recipesService.createRecipe(payload)
      onSuccess()
      onOpenChange(false)

      // Reseta o formulário
      setForm({
        titulo: "",
        descricao: "",
        modo_preparo: "",
        dificuldade: "facil",
        tempo_preparo: "",
        porcoes: "",
        ingredientes_data: [{ ingredienteId: "", quantidade: "", unidade: "" }],
      })
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          "Erro ao criar a receita. Verifique os campos."
      )
    } finally {
      setLoading(false)
    }
  }

  const handleAddIngrediente = () => {
    setForm((prev) => ({
      ...prev,
      ingredientes_data: [
        ...prev.ingredientes_data,
        { ingredienteId: "", quantidade: "", unidade: "" },
      ],
    }))
  }

  const handleRemoveIngrediente = (index: number) => {
    setForm((prev) => ({
      ...prev,
      ingredientes_data: prev.ingredientes_data.filter((_, i) => i !== index),
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] w-[calc(100vw-2rem)] overflow-x-hidden overflow-y-auto sm:max-w-225 lg:max-w-275">
        <DialogHeader>
          <DialogTitle>Nova Receita</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-4">
          <div className="space-y-4">
            <Input
              placeholder="Título da Receita *"
              value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })}
              required
            />
            <Textarea
              placeholder="Breve descrição"
              value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              rows={2}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <select
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={form.dificuldade}
                onChange={(e) =>
                  setForm({ ...form, dificuldade: e.target.value as any })
                }
              >
                <option value="facil">Fácil</option>
                <option value="medio">Médio</option>
                <option value="dificil">Difícil</option>
              </select>
              <Input
                type="number"
                placeholder="Tempo (min)"
                value={form.tempo_preparo}
                onChange={(e) =>
                  setForm({ ...form, tempo_preparo: e.target.value })
                }
              />
              <Input
                type="number"
                placeholder="Porções"
                value={form.porcoes}
                onChange={(e) => setForm({ ...form, porcoes: e.target.value })}
              />
            </div>

            <Textarea
              placeholder="Modo de Preparo (passo a passo)"
              value={form.modo_preparo}
              onChange={(e) =>
                setForm({ ...form, modo_preparo: e.target.value })
              }
              rows={4}
            />
          </div>

          <div className="space-y-3 rounded-xl border border-border bg-muted/50 p-4">
            <h4 className="text-sm font-semibold">Ingredientes</h4>
            {form.ingredientes_data.map((ing, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 items-center gap-2 sm:grid-cols-[minmax(0,1fr)_96px_140px_40px]"
              >
                <select
                  className="flex h-10 w-full min-w-0 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={ing.ingredienteId}
                  onChange={(e) => {
                    const newIng = [...form.ingredientes_data]
                    newIng[idx].ingredienteId = e.target.value
                    setForm({ ...form, ingredientes_data: newIng })
                  }}
                  required
                >
                  <option value="">Selecione...</option>
                  {ingredientesList.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.nome}
                    </option>
                  ))}
                </select>

                <Input
                  type="number"
                  placeholder="Qtd"
                  className="w-full min-w-0"
                  step="0.01"
                  value={ing.quantidade}
                  onChange={(e) => {
                    const newIng = [...form.ingredientes_data]
                    newIng[idx].quantidade = e.target.value
                    setForm({ ...form, ingredientes_data: newIng })
                  }}
                  required
                />

                <Input
                  placeholder="Unidade (ex: kg)"
                  className="w-full min-w-0"
                  value={ing.unidade}
                  onChange={(e) => {
                    const newIng = [...form.ingredientes_data]
                    newIng[idx].unidade = e.target.value
                    setForm({ ...form, ingredientes_data: newIng })
                  }}
                  required
                />

                {form.ingredientes_data.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveIngrediente(idx)}
                    className="text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddIngrediente}
              className="mt-2 text-xs"
            >
              <Plus className="mr-2 h-3 w-3" /> Adicionar Linha
            </Button>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-dish-primary text-white hover:bg-dish-primary/90"
            >
              {loading ? "Salvando..." : "Salvar Receita"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
