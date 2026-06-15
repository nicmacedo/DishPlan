/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/immutability */
import { useEffect, useState, useMemo } from "react"
import { planningService } from "@/services/planning.service"
import type { PlanoSemanal, Refeicao } from "@/types/api"
import DaySection from "@/components/planning/DaySection"
import AddMealModal from "@/components/planning/AddMealModal"
import RecipeDetailModal from "@/components/recipes/RecipeDetailModal"
import {
  Loader2,
  Calendar,
  ShoppingCart,
  Plus,
  CalendarDays,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function getWeekMonday(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  d.setDate(d.getDate() + (day === 0 ? -6 : 1 - day))
  d.setHours(0, 0, 0, 0)
  return d
}

function toLocalISODate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

function formatDateBr(isoString: string): string {
  return isoString.split("-").reverse().join("/")
}

const DIAS_MAP = [
  { key: "segunda", label: "Segunda-feira" },
  { key: "terca", label: "Terça-feira" },
  { key: "quarta", label: "Quarta-feira" },
  { key: "quinta", label: "Quinta-feira" },
  { key: "sexta", label: "Sexta-feira" },
  { key: "sabado", label: "Sábado" },
  { key: "domingo", label: "Domingo" },
] as const

type DiaSemana = (typeof DIAS_MAP)[number]["key"]
type TipoRefeicao = "cafe" | "almoco" | "lanche" | "jantar" | "ceia"

export default function Cardapio() {
  // Estado dos Planos Disponíveis
  const [planos, setPlanos] = useState<PlanoSemanal[]>([])
  const [activePlanoId, setActivePlanoId] = useState<string>("")

  // Dados do plano ativo
  const [, setPlanoDetail] = useState<PlanoSemanal | null>(null)
  const [refeicoes, setRefeicoes] = useState<Refeicao[]>([])

  // Loaders
  const [loadingPlanos, setLoadingPlanos] = useState(true)
  const [loadingRefeicoes, setLoadingRefeicoes] = useState(false)
  const [creatingPlano, setCreatingPlano] = useState(false)

  // Modais State
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [addingTurno, setAddingTurno] = useState<{
    dia: DiaSemana
    tipo: TipoRefeicao
  } | null>(null)
  const [isAddingMeal, setIsAddingMeal] = useState(false)

  const [viewRecipeId, setViewRecipeId] = useState<number | null>(null)
  const [viewModalOpen, setViewModalOpen] = useState(false)

  const [deletingMealId, setDeletingMealId] = useState<number | null>(null)

  const currentMondayStr = toLocalISODate(getWeekMonday(new Date()))

  // 1. Busca todos os planos do usuário ao abrir a tela
  useEffect(() => {
    fetchPlanosIniciais()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 2. Quando o plano ativo muda no Select, busca as refeições dele
  useEffect(() => {
    if (activePlanoId) {
      fetchRefeicoesDoPlano(Number(activePlanoId))
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPlanoDetail(null)
      setRefeicoes([])
    }
  }, [activePlanoId])

  const fetchPlanosIniciais = async () => {
    try {
      setLoadingPlanos(true)
      const res = await planningService.getPlanos()
      const data = Array.isArray(res.data)
        ? res.data
        : (res.data as any).results || []
      setPlanos(data)

      // Auto-seleciona a semana atual se existir, ou a primeira da lista
      if (data.length > 0) {
        const currentWeekPlan = data.find(
          (p: PlanoSemanal) => p.semana_referencia === currentMondayStr
        )
        setActivePlanoId(
          currentWeekPlan
            ? currentWeekPlan.id.toString()
            : data[0].id.toString()
        )
      }
    } catch (err) {
      console.error("Erro ao carregar lista de planos:", err)
    } finally {
      setLoadingPlanos(false)
    }
  }

  const fetchRefeicoesDoPlano = async (planoId: number) => {
    try {
      setLoadingRefeicoes(true)
      const resPlano = await planningService.getPlano(planoId)
      setPlanoDetail(resPlano.data)

      const mealsRes = await planningService.getRefeicoes({
        plano_semanal: planoId,
      })
      const mealsData = Array.isArray(mealsRes.data)
        ? mealsRes.data
        : (mealsRes.data as any).results || []
      setRefeicoes(mealsData)
    } catch (err) {
      console.error("Erro ao carregar detalhes e refeições do plano:", err)
    } finally {
      setLoadingRefeicoes(false)
    }
  }

  const handleCreatePlanoCurrentWeek = async () => {
    try {
      setCreatingPlano(true)
      const res = await planningService.createPlano({
        semana_referencia: currentMondayStr,
      })

      // Recarrega a lista de planos e seleciona o recém-criado
      const planosRes = await planningService.getPlanos()
      const data = Array.isArray(planosRes.data)
        ? planosRes.data
        : (planosRes.data as any).results || []
      setPlanos(data)
      setActivePlanoId(res.data.id.toString())
    } catch (err) {
      console.error("Erro ao criar plano:", err)
    } finally {
      setCreatingPlano(false)
    }
  }

  // Ações de Refeição
  const handleAddMealClick = (dia: DiaSemana, tipo: TipoRefeicao) => {
    setAddingTurno({ dia, tipo })
    setAddModalOpen(true)
  }

  const handleConfirmAddMeal = async (receitaId: number) => {
    if (!activePlanoId || !addingTurno) return
    try {
      setIsAddingMeal(true)
      await planningService.createRefeicao({
        plano_semanal: Number(activePlanoId),
        receita: receitaId,
        dia_da_semana: addingTurno.dia,
        tipo_refeicao: addingTurno.tipo,
      })
      setAddModalOpen(false)
      setAddingTurno(null)
      await fetchRefeicoesDoPlano(Number(activePlanoId))
    } catch (err) {
      console.error("Erro ao adicionar refeição:", err)
    } finally {
      setIsAddingMeal(false)
    }
  }

  const handleDeleteMeal = async (refeicaoId: number) => {
    if (!activePlanoId) return
    try {
      setDeletingMealId(refeicaoId)
      await planningService.deleteRefeicao(refeicaoId)
      await fetchRefeicoesDoPlano(Number(activePlanoId))
    } catch (err) {
      console.error("Erro ao deletar refeição:", err)
    } finally {
      setDeletingMealId(null)
    }
  }

  const handleViewRecipe = (receitaId: number) => {
    setViewRecipeId(receitaId)
    setViewModalOpen(true)
  }

  // Verifica se o usuário tem um plano para a semana atual (para mostrar ou não o botão de criar)
  const planosOrdenados = useMemo(() => {
    return [...planos].sort(
      (a, b) =>
        new Date(b.semana_referencia).getTime() -
        new Date(a.semana_referencia).getTime()
    )
  }, [planos])

  const hasCurrentWeekPlan = planos.some(
    (p) => p.semana_referencia === currentMondayStr
  )

  if (loadingPlanos) {
    return (
      <div className="flex h-full min-h-75 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-dish-primary" />
      </div>
    )
  }

  return (
    <>
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-4 md:p-6 lg:p-8">
        {/* Header e Seleção de Planos */}
        <div className="flex flex-col justify-between gap-4 rounded-xl border border-border bg-muted/20 p-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-foreground">
              <Calendar className="h-6 w-6 text-dish-primary" />
              Cardápio Semanal
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Organize suas refeições e gere sua lista de compras.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            {planos.length > 0 && (
              <Select value={activePlanoId} onValueChange={setActivePlanoId}>
                <SelectTrigger className="h-11 w-full min-w-0 rounded-xl bg-background px-3 sm:w-65">
                  <div className="flex min-w-0 items-center gap-2">
                    <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <SelectValue placeholder="Selecione a semana..." />
                  </div>
                </SelectTrigger>

                <SelectContent className="max-h-80 w-(--radix-select-trigger-width)">
                  {planosOrdenados.map((p, index) => (
                    <SelectItem
                      key={p.id}
                      value={p.id.toString()}
                      textValue={`Semana ${formatDateBr(p.semana_referencia)}`}
                      className="cursor-pointer"
                    >
                      <div className="flex flex-col py-1">
                        <span className="text-sm font-medium">
                          Semana: {formatDateBr(p.semana_referencia)}
                        </span>

                        <span className="text-xs text-muted-foreground">
                          {index === 0
                            ? "Plano mais recente"
                            : "Plano alimentar"}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {!hasCurrentWeekPlan && (
              <Button
                onClick={handleCreatePlanoCurrentWeek}
                disabled={creatingPlano}
                variant="outline"
                className="w-full border-dish-primary text-dish-primary hover:bg-dish-primary hover:text-white sm:w-auto"
              >
                {creatingPlano ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="mr-2 h-4 w-4" />
                )}
                Criar Desta Semana
              </Button>
            )}
          </div>
        </div>

        {/* Corpo do Plano Ativo */}
        {!activePlanoId ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/5 p-10 text-center">
            <Calendar className="mb-4 h-12 w-12 text-muted-foreground/30" />
            <h3 className="mb-2 text-lg font-semibold text-foreground">
              Nenhum plano ativo
            </h3>
            <p className="max-w-md text-sm text-muted-foreground">
              Você ainda não possui planos alimentares. Clique no botão acima
              para iniciar o planejamento desta semana.
            </p>
          </div>
        ) : (
          <>
            {/* Bloco Informativo e Ação de Compras */}
            <div className="flex items-center justify-between rounded-xl border border-dish-primary/20 bg-dish-primary/5 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-dish-primary/20 p-2">
                  <ShoppingCart className="h-5 w-5 text-dish-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Lista de Compras</p>
                  <p className="text-xs text-muted-foreground">
                    Baseada neste cardápio
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                className="bg-dish-primary text-white hover:bg-dish-primary/90"
                disabled={refeicoes.length === 0}
              >
                Ver Lista
              </Button>
            </div>

            {/* Listagem de Dias */}
            {loadingRefeicoes ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-dish-primary" />
              </div>
            ) : (
              <div className="grid gap-6">
                {DIAS_MAP.map((diaObj) => {
                  const refeicoesDoDia = refeicoes.filter(
                    (r) => r.dia_da_semana === diaObj.key
                  )
                  return (
                    <DaySection
                      key={diaObj.key}
                      dia={diaObj.key}
                      label={diaObj.label}
                      refeicoes={refeicoesDoDia}
                      onAddClick={(tipo) =>
                        handleAddMealClick(diaObj.key, tipo)
                      }
                      onDeleteClick={handleDeleteMeal}
                      onViewClick={handleViewRecipe}
                      isDeleting={deletingMealId}
                    />
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* Modais */}
      <AddMealModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={handleConfirmAddMeal}
        isAdding={isAddingMeal}
      />

      <RecipeDetailModal
        recipeId={viewRecipeId}
        open={viewModalOpen}
        onOpenChange={setViewModalOpen}
      />
    </>
  )
}
