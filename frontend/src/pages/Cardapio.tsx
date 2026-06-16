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
  Users,
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { groupsService } from "@/services/groups.service"
import type { Grupo } from "@/types/groups"

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
  const [planoDetail, setPlanoDetail] = useState<PlanoSemanal | null>(null)
  const [refeicoes, setRefeicoes] = useState<Refeicao[]>([])

  const [grupos, setGrupos] = useState<Grupo[]>([])
  const [updatingPlano, setUpdatingPlano] = useState(false)

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

  // Novo Plano State
  const [newPlanModalOpen, setNewPlanModalOpen] = useState(false)
  const [newPlanWeek, setNewPlanWeek] = useState(currentMondayStr)
  const [newPlanGroup, setNewPlanGroup] = useState<string>("pessoal")

  // 1. Busca todos os planos do usuário ao abrir a tela
  useEffect(() => {
    fetchPlanosIniciais()
    fetchGrupos()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchGrupos = async () => {
    try {
      const res = await groupsService.getGroups()
      setGrupos(res)
    } catch (err) {
      console.error("Erro ao carregar grupos:", err)
    }
  }

  const handleUpdatePlanoGroup = async (val: string) => {
    if (!activePlanoId) return
    try {
      setUpdatingPlano(true)
      const novoGrupo = val === "pessoal" ? null : Number(val)
      const res = await planningService.updatePlano(Number(activePlanoId), {
        grupo: novoGrupo,
      })
      setPlanoDetail(res.data)

      // Atualiza a lista de planos silenciosamente
      const planosRes = await planningService.getPlanos()
      const data = Array.isArray(planosRes.data)
        ? planosRes.data
        : (planosRes.data as any).results || []
      setPlanos(data)
    } catch (err) {
      console.error("Erro ao atualizar grupo do plano:", err)
    } finally {
      setUpdatingPlano(false)
    }
  }

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

  const handleCreateNovoPlano = async () => {
    try {
      setCreatingPlano(true)
      const novoGrupo = newPlanGroup === "pessoal" ? null : Number(newPlanGroup)
      const res = await planningService.createPlano({
        semana_referencia: newPlanWeek,
        grupo: novoGrupo,
      })

      // Recarrega a lista de planos e seleciona o recém-criado
      const planosRes = await planningService.getPlanos()
      const data = Array.isArray(planosRes.data)
        ? planosRes.data
        : (planosRes.data as any).results || []
      setPlanos(data)
      setActivePlanoId(res.data.id.toString())
      setNewPlanModalOpen(false)
    } catch (err: any) {
      console.error("Erro ao criar plano:", err)
      alert(
        "Não foi possível criar o plano. Verifique se já não existe um cardápio para essa mesma semana no contexto (Pessoal/Grupo) escolhido."
      )
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

  const planosOrdenados = useMemo(() => {
    return [...planos].sort(
      (a, b) =>
        new Date(b.semana_referencia).getTime() -
        new Date(a.semana_referencia).getTime()
    )
  }, [planos])

  if (loadingPlanos) {
    return (
      <div className="flex h-full min-h-75 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-dish-primary" />
      </div>
    )
  }

  const currentGroupId =
    typeof planoDetail?.grupo === "object" && planoDetail?.grupo !== null
      ? (planoDetail.grupo as any).id
      : planoDetail?.grupo
  const currentGroup = grupos.find((g) => g.id === currentGroupId)
  const canChangeGroup =
    !currentGroupId || currentGroup?.meu_papel?.toLowerCase() === "dono"

  const activePlanoWeekLabel = planoDetail?.semana_referencia
    ? formatDateBr(planoDetail.semana_referencia)
    : "Nenhuma semana selecionada"

  const activePlanoContextLabel = currentGroupId
    ? `Grupo: ${currentGroup?.nome ?? "Compartilhado"}`
    : "Pessoal"

  const totalRefeicoes = refeicoes.length

  return (
    <>
      {/* Header e Seleção de Planos */}
      <div className="overflow-hidden rounded-2xl border border-border bg-linear-to-br from-muted/40 via-background to-dish-primary/5 p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-dish-primary/15">
                <Calendar className="h-5 w-5 text-dish-primary" />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                    Cardápio Semanal
                  </h1>

                  {activePlanoId && (
                    <span className="rounded-full border border-dish-primary/30 bg-dish-primary/10 px-2.5 py-1 text-xs font-medium text-dish-primary">
                      {activePlanoContextLabel}
                    </span>
                  )}
                </div>

                <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  Organize suas refeições, compartilhe com grupos e gere sua
                  lista de compras em poucos cliques.
                </p>
              </div>
            </div>

            {activePlanoId && (
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-xl border bg-background/70 p-3">
                  <p className="text-xs font-medium text-muted-foreground">
                    Semana ativa
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {activePlanoWeekLabel}
                  </p>
                </div>

                <div className="rounded-xl border bg-background/70 p-3">
                  <p className="text-xs font-medium text-muted-foreground">
                    Refeições
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {totalRefeicoes} cadastrada{totalRefeicoes === 1 ? "" : "s"}
                  </p>
                </div>

                <div className="rounded-xl border bg-background/70 p-3">
                  <p className="text-xs font-medium text-muted-foreground">
                    Compartilhamento
                  </p>
                  <p className="mt-1 truncate text-sm font-semibold text-foreground">
                    {activePlanoContextLabel}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex w-full flex-col gap-3 lg:w-auto lg:min-w-[320px] xl:min-w-140">
            {planos.length > 0 && (
              <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1fr)_220px]">
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium text-muted-foreground">
                    Semana do cardápio
                  </span>

                  <Select
                    value={activePlanoId}
                    onValueChange={setActivePlanoId}
                  >
                    <SelectTrigger className="h-11 w-full min-w-0 rounded-xl bg-background px-3">
                      <div className="flex min-w-0 items-center gap-2">
                        <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <SelectValue placeholder="Selecione a semana..." />
                      </div>
                    </SelectTrigger>

                    <SelectContent className="max-h-80 w-(--radix-select-trigger-width)">
                      {planosOrdenados.map((p) => (
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
                              {p.grupo
                                ? `Grupo: ${
                                    typeof p.grupo === "object"
                                      ? (p.grupo as any).nome
                                      : "Compartilhado"
                                  }`
                                : "Pessoal (Apenas eu)"}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {planoDetail && (
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-medium text-muted-foreground">
                      Visibilidade
                    </span>

                    <Select
                      value={
                        typeof planoDetail.grupo === "object" &&
                        planoDetail.grupo !== null
                          ? String((planoDetail.grupo as any).id)
                          : planoDetail.grupo
                            ? String(planoDetail.grupo)
                            : "pessoal"
                      }
                      onValueChange={handleUpdatePlanoGroup}
                      disabled={updatingPlano || !canChangeGroup}
                    >
                      <SelectTrigger className="h-11 w-full min-w-0 rounded-xl bg-background px-3">
                        <div className="flex min-w-0 items-center gap-2">
                          {updatingPlano ? (
                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                          ) : (
                            <Users className="h-4 w-4 shrink-0 text-muted-foreground" />
                          )}
                          <SelectValue placeholder="Compartilhar com..." />
                        </div>
                      </SelectTrigger>

                      <SelectContent className="max-h-80 w-(--radix-select-trigger-width)">
                        <SelectItem value="pessoal">
                          Apenas eu (Pessoal)
                        </SelectItem>

                        {grupos.map((g) => (
                          <SelectItem key={g.id} value={g.id.toString()}>
                            Grupo: {g.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {!canChangeGroup && (
                      <p className="text-xs text-muted-foreground">
                        Apenas o dono do grupo pode alterar.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            <Button
              onClick={() => setNewPlanModalOpen(true)}
              variant="outline"
              className="h-11 w-full rounded-xl border-dish-primary text-dish-primary hover:bg-dish-primary hover:text-white lg:self-end xl:w-auto"
            >
              <Plus className="mr-2 h-4 w-4" />
              Novo Cardápio
            </Button>
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
                // Leva para a tela de compras passando o plano_semanal como referência para mostrar a lista correta
                onClick={() =>
                  window.location.assign(
                    `/compras?plano_semanal=${activePlanoId}`
                  )
                }
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
      <Dialog open={newPlanModalOpen} onOpenChange={setNewPlanModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Novo Cardápio</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="week">Semana de Referência (Segunda-feira)</Label>
              <Input
                id="week"
                type="date"
                value={newPlanWeek}
                onChange={(e) => {
                  if (e.target.value) {
                    setNewPlanWeek(
                      toLocalISODate(getWeekMonday(new Date(e.target.value)))
                    )
                  }
                }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="group">Compartilhamento</Label>
              <Select value={newPlanGroup} onValueChange={setNewPlanGroup}>
                <SelectTrigger id="group">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pessoal">Apenas eu (Pessoal)</SelectItem>
                  {grupos.map((g) => (
                    <SelectItem key={g.id} value={g.id.toString()}>
                      Grupo: {g.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setNewPlanModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreateNovoPlano}
              disabled={creatingPlano}
              className="bg-dish-primary text-white hover:bg-dish-primary/90"
            >
              {creatingPlano && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Criar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
