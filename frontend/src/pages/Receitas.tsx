/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react"
import { Plus, Search, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import RecipeCard from "@/components/recipes/RecipeCard"
import RecipeFormModal from "@/components/recipes/RecipeFormModal"
import RecipeDetailModal from "@/components/recipes/RecipeDetailModal"
import { recipesService } from "@/services/recipes.service"
import type { Receita } from "@/types/api"

export default function Receitas() {
  const [recipes, setRecipes] = useState<Receita[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedRecipeId, setSelectedRecipeId] = useState<number | null>(null)

  const fetchRecipes = async () => {
    setLoading(true)
    try {
      const response = await recipesService.getRecipes({ search: searchTerm })
      // Lida com resposta paginada ou lista direta
      const data = (response.data as any).results || response.data
      setRecipes(data)
    } catch (error) {
      console.error("Erro ao buscar receitas", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Implementa um pequeno debounce para a busca
    const delayDebounceFn = setTimeout(() => {
      fetchRecipes()
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm])

  return (
    <div className="mx-auto flex h-full w-full max-w-7xl flex-col space-y-6 p-4 md:p-8">
      {/* Header & Ações */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Catálogo de Receitas
          </h1>
          <p className="text-sm text-muted-foreground">
            Gerencie suas receitas e descubra novas ideias.
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-dish-primary text-white hover:bg-dish-primary/90 sm:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" /> Nova Receita
        </Button>
      </div>

      {/* Barra de Busca */}
      <div className="relative">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar receita por título ou descrição..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Grid de Receitas */}
      {loading ? (
        <div className="flex min-h-50 flex-1 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-dish-primary" />
        </div>
      ) : recipes.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {recipes.map((recipe) => (
            <RecipeCard 
               key={recipe.id} 
               recipe={recipe} 
               onClick={() => setSelectedRecipeId(recipe.id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex min-h-75 flex-1 flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/10 p-8 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-dish-primary/10">
            <Search className="h-6 w-6 text-dish-primary" />
          </div>
          <h3 className="text-lg font-semibold">Nenhuma receita encontrada</h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            {searchTerm
              ? "Tente ajustar os termos da sua busca."
              : "Você ainda não possui receitas. Clique em 'Nova Receita' para começar!"}
          </p>
        </div>
      )}

      {/* Modal Render */}
      <RecipeFormModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={fetchRecipes}
      />

      <RecipeDetailModal
        open={selectedRecipeId !== null}
        onOpenChange={(open) => { if (!open) setSelectedRecipeId(null) }}
        recipeId={selectedRecipeId}
      />
    </div>
  )
}
