import type { Refeicao } from "@/types/api"
import { Trash2, Plus, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"

const TIPO_REFEICAO_MAP = {
  cafe: "Café da manhã",
  almoco: "Almoço",
  lanche: "Lanche",
  jantar: "Jantar",
  ceia: "Ceia",
} as const

type TipoRefeicao = keyof typeof TIPO_REFEICAO_MAP

interface DaySectionProps {
  dia: string
  label: string
  refeicoes: Refeicao[]
  onAddClick: (tipo: TipoRefeicao) => void
  onDeleteClick: (refeicaoId: number) => void
  onViewClick: (receitaId: number) => void
  isDeleting: number | null
}

export default function DaySection({
  label,
  refeicoes,
  onAddClick,
  onDeleteClick,
  onViewClick,
  isDeleting,
}: DaySectionProps) {
  const turnos: TipoRefeicao[] = ["cafe", "almoco", "lanche", "jantar", "ceia"]

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="border-b border-border/50 bg-muted/30 px-4 py-3">
        <h3 className="font-semibold text-foreground capitalize">{label}</h3>
      </div>
      <div className="space-y-3 p-4">
        {turnos.map((turno) => {
          const meal = refeicoes.find((r) => r.tipo_refeicao === turno)
          return (
            <div
              key={turno}
              className="flex flex-col justify-between gap-2 border-b border-border/40 pb-3 last:border-0 last:pb-0 sm:flex-row sm:items-center"
            >
              <div className="w-full shrink-0 sm:w-28">
                <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  {TIPO_REFEICAO_MAP[turno]}
                </span>
              </div>

              <div className="flex-1">
                {meal ? (
                  <div className="flex items-center justify-between rounded-lg border border-dish-primary/10 bg-dish-primary/5 px-3 py-2 transition-colors hover:bg-dish-primary/10">
                    <span
                      className="max-w-45 cursor-pointer truncate text-sm font-medium text-foreground hover:text-dish-primary hover:underline sm:max-w-75"
                      onClick={() => onViewClick(meal.receita_detail.id)}
                      title="Ver detalhes da receita"
                    >
                      {meal.receita_detail.titulo}
                    </span>
                    <div className="flex shrink-0 items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:bg-dish-primary/20 hover:text-dish-primary"
                        onClick={() => onViewClick(meal.receita_detail.id)}
                        title="Ver receita"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => onDeleteClick(meal.id)}
                        disabled={isDeleting === meal.id}
                        title="Remover refeição"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="h-9 w-full justify-start border-dashed bg-transparent text-xs text-muted-foreground hover:border-dish-primary/50 hover:text-dish-primary"
                    onClick={() => onAddClick(turno)}
                  >
                    <Plus className="mr-2 h-4 w-4 opacity-70" />
                    Adicionar refeição
                  </Button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
