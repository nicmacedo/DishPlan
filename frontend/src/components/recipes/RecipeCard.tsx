import { Utensils, Clock, ChefHat } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import type { Receita } from "@/types/api"

interface RecipeCardProps {
  recipe: Receita
  onClick?: () => void
}

export default function RecipeCard({ recipe, onClick }: RecipeCardProps) {
  // Mapeamento de cores baseado na dificuldade
  const dificuldadeColors = {
    facil:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    medio:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    dificil: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  }

  const difLabel =
    recipe.dificuldade.charAt(0).toUpperCase() + recipe.dificuldade.slice(1)

  return (
    <Card 
      onClick={onClick}
      className={`flex h-full flex-col transition-all duration-300 ${
        onClick 
          ? 'cursor-pointer hover:-translate-y-1 hover:border-dish-primary hover:shadow-lg hover:shadow-dish-primary/20' 
          : ''
      }`}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-lg leading-tight font-bold">
          {recipe.titulo}
        </CardTitle>
        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
          {recipe.descricao || "Nenhuma descrição fornecida."}
        </p>
      </CardHeader>

      <CardContent className="flex-1 pb-3">
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Utensils className="h-4 w-4 text-dish-primary" />
            <span>{recipe.porcoes ?? "-"} porções</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-dish-primary" />
            <span>{recipe.tempo_preparo ?? "-"} min</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ChefHat className="h-4 w-4 text-dish-primary" />
            <span>{recipe.total_ingredientes ?? 0} ingr.</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-0">
        <span
          className={`rounded-md px-2 py-1 text-[10px] font-bold tracking-wider uppercase ${dificuldadeColors[recipe.dificuldade]}`}
        >
          {difLabel}
        </span>
        <span className="max-w-30 truncate text-[10px] text-muted-foreground">
          Por: {recipe.criador_nome}
        </span>
      </CardFooter>
    </Card>
  )
}
