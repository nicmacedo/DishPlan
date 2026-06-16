/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react"
import {
  Loader2,
  Clock,
  ChefHat,
  Flame,
  Image as ImageIcon,
  Share2,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { recipesService } from "@/services/recipes.service"
import ShareRecipeModal from "./ShareRecipeModal"

interface RecipeDetailModalProps {
  recipeId: number | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function RecipeDetailModal({
  recipeId,
  open,
  onOpenChange,
}: RecipeDetailModalProps) {
  const [recipe, setRecipe] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)
  const [shareModalOpen, setShareModalOpen] = useState(false)

  useEffect(() => {
    if (open && recipeId) {
      const fetchRecipe = async () => {
        setLoading(true)
        setShareModalOpen(false)

        try {
          const response = await recipesService.getRecipe(recipeId)
          setRecipe(response.data)
        } catch (error) {
          console.error("Erro ao buscar detalhes da receita", error)
          setRecipe(null)
        } finally {
          setLoading(false)
        }
      }

      fetchRecipe()
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRecipe(null)
      setShareModalOpen(false)
    }
  }, [open, recipeId])

  const dificuldadeColors: Record<string, string> = {
    facil:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    medio:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    dificil: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  }

  const dificuldadeLabels: Record<string, string> = {
    facil: "Fácil",
    medio: "Médio",
    dificil: "Difícil",
  }

  const canShareRecipe = !!recipe && !recipe.grupo

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90dvh] w-[calc(100vw-1rem)] max-w-275! overflow-x-hidden overflow-y-auto p-5 sm:w-[calc(100vw-2rem)] sm:p-6">
          <DialogHeader className="space-y-3 pr-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1">
                <DialogTitle className="text-xl font-bold wrap-break-word sm:text-2xl">
                  {loading ? "Carregando..." : recipe?.titulo || "Receita"}
                </DialogTitle>

                <DialogDescription className="mt-1.5 leading-relaxed wrap-break-word">
                  {recipe?.descricao || "Sem descrição"}
                </DialogDescription>
              </div>

              {canShareRecipe && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShareModalOpen(true)}
                  className="w-full shrink-0 border-dish-primary/50 text-dish-primary hover:bg-dish-primary/10 sm:w-auto"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Compartilhar
                </Button>
              )}
            </div>
          </DialogHeader>

          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-dish-primary" />
            </div>
          ) : recipe ? (
            <div className="space-y-6">
              {/* Header info */}
              <div className="grid grid-cols-1 gap-3 border-b pb-4 text-sm text-muted-foreground sm:grid-cols-3">
                <div className="flex min-w-0 items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
                  <ChefHat className="h-4 w-4 shrink-0" />
                  <span className="truncate">
                    {recipe.porcoes ?? "-"} porções
                  </span>
                </div>

                <div className="flex min-w-0 items-center gap-2 rounded-lg bg-muted/50 px-3 py-2">
                  <Clock className="h-4 w-4 shrink-0" />
                  <span className="truncate">
                    {recipe.tempo_preparo ?? "-"} min
                  </span>
                </div>

                {recipe.dificuldade && (
                  <div
                    className={`flex min-w-0 items-center gap-2 rounded-lg px-3 py-2 font-medium ${
                      dificuldadeColors[recipe.dificuldade] || ""
                    }`}
                  >
                    <Flame className="h-4 w-4 shrink-0" />
                    <span className="truncate">
                      {dificuldadeLabels[recipe.dificuldade] ||
                        recipe.dificuldade}
                    </span>
                  </div>
                )}
              </div>

              {/* Imagem */}
              {recipe.imagem || recipe.has_imagem ? (
                <div className="w-full overflow-hidden rounded-xl bg-muted">
                  {recipe.imagem ? (
                    <img
                      src={recipe.imagem}
                      alt={recipe.titulo}
                      className="h-auto max-h-90 w-full object-cover"
                    />
                  ) : (
                    <div className="flex min-h-40 items-center justify-center p-4 text-muted-foreground">
                      <ImageIcon className="h-10 w-10 shrink-0 opacity-50" />
                      <span className="ml-2 text-sm">
                        Imagem não disponível
                      </span>
                    </div>
                  )}
                </div>
              ) : null}

              {/* Conteúdo principal */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
                {/* Ingredientes */}
                <div className="min-w-0">
                  <h3 className="mb-3 text-lg font-semibold">Ingredientes</h3>

                  {recipe.ingredientes_receita &&
                  recipe.ingredientes_receita.length > 0 ? (
                    <ul className="space-y-2 rounded-xl border bg-muted/20 p-4">
                      {recipe.ingredientes_receita.map((ir: any) => (
                        <li
                          key={ir.id}
                          className="grid grid-cols-1 gap-1 border-b border-dashed pb-2 text-sm last:border-0 last:pb-0 sm:grid-cols-[120px_24px_minmax(0,1fr)] sm:gap-2"
                        >
                          <span className="font-medium wrap-break-word text-foreground sm:text-right">
                            {ir.quantidade} {ir.unidade}
                          </span>

                          <span className="hidden text-muted-foreground sm:block">
                            de
                          </span>

                          <span className="min-w-0 wrap-break-word text-foreground">
                            <span className="text-muted-foreground sm:hidden">
                              de{" "}
                            </span>
                            {ir.ingrediente_nome}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Nenhum ingrediente cadastrado.
                    </p>
                  )}
                </div>

                {/* Modo de Preparo */}
                <div className="min-w-0">
                  <h3 className="mb-3 text-lg font-semibold">
                    Modo de Preparo
                  </h3>

                  {recipe.modo_preparo ? (
                    <div className="rounded-xl bg-muted/30 p-4 text-sm leading-relaxed wrap-break-word whitespace-pre-wrap text-foreground">
                      {recipe.modo_preparo}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      Modo de preparo não informado.
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4 border-t pt-4 text-left text-xs wrap-break-word text-muted-foreground sm:text-right">
                Criado por {recipe.criador_nome}
              </div>
            </div>
          ) : (
            <div className="py-10 text-center text-muted-foreground">
              Erro ao carregar detalhes da receita.
            </div>
          )}
        </DialogContent>
      </Dialog>

      {recipe && (
        <ShareRecipeModal
          open={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
          recipeId={recipe.id}
          recipeTitle={recipe.titulo}
        />
      )}
    </>
  )
}
