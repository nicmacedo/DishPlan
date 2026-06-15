import { useEffect, useMemo, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Check, ChefHat, Loader2, Search } from "lucide-react"
import { recipesService } from "@/services/recipes.service"
import type { Receita } from "@/types/api"

interface AddMealModalProps {
  open: boolean
  onClose: () => void
  onAdd: (receitaId: number) => Promise<void>
  isAdding: boolean
}

export default function AddMealModal({
  open,
  onClose,
  onAdd,
  isAdding,
}: AddMealModalProps) {
  const [recipes, setRecipes] = useState<Receita[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadRecipes = async () => {
      setLoading(true)
      setError(null)

      try {
        const res = await recipesService.getRecipes()

        const data = Array.isArray(res.data)
          ? res.data
          : // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (res.data as any).results || []

        if (isMounted) {
          setRecipes(data)
        }
      } catch (err) {
        console.error("Erro ao carregar receitas", err)

        if (isMounted) {
          setError("Erro ao carregar receitas. Tente novamente.")
          setRecipes([])
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    if (open) {
      loadRecipes()
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedRecipe("")
      setSearchTerm("")
      setError(null)
    }

    return () => {
      isMounted = false
    }
  }, [open])

  const filteredRecipes = useMemo(() => {
    const search = searchTerm.trim().toLowerCase()

    if (!search) return recipes

    return recipes.filter((recipe) =>
      recipe.titulo.toLowerCase().includes(search)
    )
  }, [recipes, searchTerm])

  const selectedRecipeData = useMemo(() => {
    return recipes.find((recipe) => recipe.id.toString() === selectedRecipe)
  }, [recipes, selectedRecipe])

  const handleClose = () => {
    if (isAdding) return

    setSelectedRecipe("")
    setSearchTerm("")
    setError(null)
    onClose()
  }

  const handleConfirm = async () => {
    if (!selectedRecipe || isAdding) return

    setError(null)

    try {
      await onAdd(Number(selectedRecipe))
      setSelectedRecipe("")
      setSearchTerm("")
      onClose()
    } catch (err) {
      console.error("Erro ao adicionar refeição", err)
      setError("Erro ao adicionar receita. Tente novamente.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={(value) => !value && handleClose()}>
      <DialogContent className="max-h-[90dvh] w-[calc(100vw-1rem)] max-w-170! overflow-x-hidden overflow-y-auto rounded-2xl p-5 sm:w-[calc(100vw-2rem)] sm:p-6">
        <DialogHeader className="space-y-2 pr-6">
          <DialogTitle className="text-xl font-bold sm:text-2xl">
            Selecionar Receita
          </DialogTitle>

          <DialogDescription className="text-sm leading-relaxed">
            Escolha uma receita para adicionar ao seu plano alimentar.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Buscar receita..."
              disabled={loading || recipes.length === 0}
              className="pl-9"
            />
          </div>

          {loading ? (
            <div className="flex min-h-36 flex-col items-center justify-center gap-3 rounded-xl border bg-muted/20 p-6 text-center">
              <Loader2 className="h-6 w-6 animate-spin text-dish-primary" />
              <p className="text-sm text-muted-foreground">
                Carregando receitas...
              </p>
            </div>
          ) : error ? (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              {error}
            </div>
          ) : recipes.length === 0 ? (
            <div className="flex min-h-36 flex-col items-center justify-center gap-2 rounded-xl border bg-muted/20 p-6 text-center">
              <ChefHat className="h-8 w-8 text-muted-foreground/70" />
              <p className="text-sm font-medium">Nenhuma receita encontrada.</p>
              <p className="text-xs text-muted-foreground">
                Cadastre uma receita antes de adicionar uma refeição.
              </p>
            </div>
          ) : filteredRecipes.length === 0 ? (
            <div className="flex min-h-32 items-center justify-center rounded-xl border bg-muted/20 p-6 text-center">
              <p className="text-sm text-muted-foreground">
                Nenhuma receita encontrada com esse nome.
              </p>
            </div>
          ) : (
            <div className="max-h-[42vh] space-y-2 overflow-x-hidden overflow-y-auto pr-1">
              {filteredRecipes.map((recipe) => {
                const isSelected = selectedRecipe === recipe.id.toString()

                return (
                  <button
                    key={recipe.id}
                    type="button"
                    onClick={() => setSelectedRecipe(recipe.id.toString())}
                    className={`w-full rounded-xl border p-3 text-left transition hover:bg-muted/60 ${
                      isSelected
                        ? "border-dish-primary bg-dish-primary/10 ring-1 ring-dish-primary/30"
                        : "border-border bg-muted/20"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium wrap-break-word text-foreground">
                          {recipe.titulo}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          Toque para selecionar essa receita
                        </p>
                      </div>

                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
                          isSelected
                            ? "border-dish-primary bg-dish-primary text-white"
                            : "border-border bg-background text-muted-foreground"
                        }`}
                      >
                        {isSelected ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <ChefHat className="h-4 w-4" />
                        )}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}

          {selectedRecipeData && (
            <div className="rounded-xl border border-dish-primary/30 bg-dish-primary/10 p-3 text-sm">
              <span className="font-semibold text-foreground">
                Receita selecionada:
              </span>{" "}
              <span className="wrap-break-word text-muted-foreground">
                {selectedRecipeData.titulo}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col-reverse gap-2 border-t pt-4 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isAdding}
            className="w-full sm:w-auto"
          >
            Cancelar
          </Button>

          <Button
            type="button"
            onClick={handleConfirm}
            disabled={!selectedRecipe || isAdding || loading}
            className="w-full bg-dish-primary text-white hover:bg-dish-primary/90 sm:w-auto"
          >
            {isAdding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirmar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
