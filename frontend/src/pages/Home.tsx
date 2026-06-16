import { useAuthStore } from "@/stores/authStore"
import { useEffect, useMemo, useState } from "react"
import { Card } from "@/components/ui/card"
import { Link } from "react-router-dom"
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChefHat,
  Loader2,
  ShoppingCart,
  Sparkles,
  User,
  Users,
} from "lucide-react"

import { recipesService } from "@/services/recipes.service"
import { planningService } from "@/services/planning.service"
import { shoppingService } from "@/services/shopping.service"
import { groupsService } from "@/services/groups.service"

interface MetricsState {
  recipesCount: number
  activePlansCount: number
  shoppingItemsCount: number
  groupsCount: number
  loading: boolean
  error: string | null
}

interface MetricCardProps {
  title: string
  value: number
  description: string
  icon: React.ElementType
  to: string
}

interface QuickActionProps {
  title: string
  description: string
  icon: React.ElementType
  to: string
}

const initialMetrics: MetricsState = {
  recipesCount: 0,
  activePlansCount: 0,
  shoppingItemsCount: 0,
  groupsCount: 0,
  loading: true,
  error: null,
}

function normalizeListResponse<T = any>(response: any): T[] {
  if (Array.isArray(response)) return response

  if (Array.isArray(response?.data)) return response.data

  if (Array.isArray(response?.data?.results)) return response.data.results

  if (Array.isArray(response?.results)) return response.results

  return []
}

function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  to,
}: MetricCardProps) {
  return (
    <Link to={to} className="group block">
      <Card className="h-full overflow-hidden rounded-2xl border border-border bg-card/80 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-dish-primary/40 hover:shadow-md">
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-dish-primary/10 text-dish-primary">
            <Icon className="h-6 w-6" />
          </div>

          <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100" />
        </div>

        <div className="mt-5">
          <p className="text-3xl font-bold tracking-tight text-foreground">
            {value}
          </p>

          <p className="mt-1 text-sm font-semibold text-foreground">{title}</p>

          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
      </Card>
    </Link>
  )
}

function MetricSkeleton() {
  return (
    <Card className="h-full rounded-2xl border border-border bg-card/80 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
          <Loader2 className="h-5 w-5 animate-spin text-dish-primary" />
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <div className="h-8 w-16 animate-pulse rounded-lg bg-muted" />
        <div className="h-4 w-28 animate-pulse rounded-lg bg-muted" />
        <div className="h-3 w-full animate-pulse rounded-lg bg-muted" />
      </div>
    </Card>
  )
}

function QuickAction({ title, description, icon: Icon, to }: QuickActionProps) {
  return (
    <Link to={to} className="group block">
      <Card className="h-full rounded-2xl border border-border bg-background/70 p-4 transition hover:border-dish-primary/40 hover:bg-dish-primary/5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-dish-primary/10 text-dish-primary">
            <Icon className="h-5 w-5" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold text-foreground">{title}</p>
              <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-dish-primary" />
            </div>

            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  )
}

export default function Home() {
  const { user } = useAuthStore()
  const [metrics, setMetrics] = useState<MetricsState>(initialMetrics)

  const firstName = useMemo(() => {
    return user?.nome?.trim()?.split(" ")[0] || "Usuário"
  }, [user?.nome])

  useEffect(() => {
    let cancelled = false

    const loadMetrics = async () => {
      try {
        setMetrics((prev) => ({
          ...prev,
          loading: true,
          error: null,
        }))

        const [recipesResponse, planosResponse, itemsResponse, groupsResponse] =
          await Promise.all([
            recipesService.getRecipes(),
            planningService.getPlanos(),
            shoppingService.getItens({ comprado: false }),
            groupsService.getGroups(),
          ])

        const recipesData = normalizeListResponse(recipesResponse)
        const planosData = normalizeListResponse(planosResponse)
        const itemsData = normalizeListResponse(itemsResponse)
        const groupsData = normalizeListResponse(groupsResponse)

        if (!cancelled) {
          setMetrics({
            recipesCount: recipesData.length,
            activePlansCount: planosData.length,
            shoppingItemsCount: itemsData.length,
            groupsCount: groupsData.length,
            loading: false,
            error: null,
          })
        }
      } catch (err) {
        console.error("Erro ao carregar métricas da Home:", err)

        if (!cancelled) {
          setMetrics((prev) => ({
            ...prev,
            loading: false,
            error:
              err instanceof Error
                ? err.message
                : "Não foi possível carregar os dados da Home.",
          }))
        }
      }
    }

    loadMetrics()

    return () => {
      cancelled = true
    }
  }, [])

  const metricCards = [
    {
      title: "Receitas",
      value: metrics.recipesCount,
      description: "Receitas cadastradas na sua cozinha digital.",
      icon: BookOpen,
      to: "/receitas",
    },
    {
      title: "Cardápios",
      value: metrics.activePlansCount,
      description: "Planos semanais criados para organizar sua rotina.",
      icon: CalendarDays,
      to: "/cardapio",
    },
    {
      title: "Itens pendentes",
      value: metrics.shoppingItemsCount,
      description: "Itens ainda não comprados nas suas listas.",
      icon: ShoppingCart,
      to: "/compras",
    },
    {
      title: "Grupos",
      value: metrics.groupsCount,
      description: "Espaços compartilhados com outras pessoas.",
      icon: Users,
      to: "/perfil",
    },
  ]

  const quickActions = [
    {
      title: "Minhas receitas",
      description: "Veja, cadastre e compartilhe suas receitas.",
      icon: BookOpen,
      to: "/receitas",
    },
    {
      title: "Planejar semana",
      description: "Monte o cardápio semanal sem caos operacional.",
      icon: CalendarDays,
      to: "/cardapio",
    },
    {
      title: "Lista de compras",
      description: "Acompanhe os itens pendentes e comprados.",
      icon: ShoppingCart,
      to: "/compras",
    },
    {
      title: "Meu perfil",
      description: "Atualize seus dados e preferências da conta.",
      icon: User,
      to: "/perfil",
    },
  ]

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 md:p-6 lg:p-8">
      {/* Hero */}
      <section className="overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-dish-primary/15 via-background to-muted/40 p-5 shadow-sm sm:p-6 lg:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-dish-primary/30 bg-dish-primary/10 px-3 py-1 text-xs font-medium text-dish-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Dashboard da cozinha
            </div>

            <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Olá, {firstName}! Bora organizar sua alimentação sem virar
              planilha do caos.
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Gerencie receitas, cardápios semanais, listas de compras e grupos
              em um só lugar. Menos improviso, mais comida no prato.
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/cardapio"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-dish-primary px-5 text-sm font-semibold text-white transition hover:bg-dish-primary/90"
              >
                <CalendarDays className="mr-2 h-4 w-4" />
                Planejar semana
              </Link>

              <Link
                to="/receitas"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-background px-5 text-sm font-semibold text-foreground transition hover:border-dish-primary/40 hover:bg-dish-primary/5 hover:text-dish-primary"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Ver receitas
              </Link>
            </div>
          </div>

          <div className="grid min-w-0 grid-cols-2 gap-3 lg:w-80">
            <Card className="rounded-2xl border border-dish-primary/20 bg-background/70 p-4">
              <ChefHat className="mb-3 h-6 w-6 text-dish-primary" />
              <p className="text-2xl font-bold text-foreground">
                {metrics.loading ? "--" : metrics.recipesCount}
              </p>
              <p className="text-xs text-muted-foreground">receitas</p>
            </Card>

            <Card className="rounded-2xl border border-dish-primary/20 bg-background/70 p-4">
              <CheckCircle2 className="mb-3 h-6 w-6 text-dish-primary" />
              <p className="text-2xl font-bold text-foreground">
                {metrics.loading ? "--" : metrics.shoppingItemsCount}
              </p>
              <p className="text-xs text-muted-foreground">itens pendentes</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Erro */}
      {metrics.error && (
        <div className="flex gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <div>
            <p className="font-semibold">Erro ao carregar métricas</p>
            <p className="mt-1">{metrics.error}</p>
          </div>
        </div>
      )}

      {/* Métricas */}
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Resumo geral
            </h2>
            <p className="text-sm text-muted-foreground">
              Uma visão rápida do que está acontecendo na sua conta.
            </p>
          </div>
        </div>

        {metrics.loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <MetricSkeleton key={item} />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {metricCards.map((card) => (
              <MetricCard
                key={card.title}
                title={card.title}
                value={card.value}
                description={card.description}
                icon={card.icon}
                to={card.to}
              />
            ))}
          </div>
        )}
      </section>

      {/* Ações rápidas */}
      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Ações rápidas
          </h2>
          <p className="text-sm text-muted-foreground">
            Atalhos para as principais áreas do app.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {quickActions.map((action) => (
            <QuickAction
              key={action.title}
              title={action.title}
              description={action.description}
              icon={action.icon}
              to={action.to}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
