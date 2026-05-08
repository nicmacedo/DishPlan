import {
  CalendarDays,
  ChefHat,
  ShoppingCart,
  TrendingUp,
  ArrowRight,
  Clock,
  Flame,
  Plus,
  Coffee,
  Sandwich,
  Utensils,
  Apple,
  Star,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"
import AppLayout from "@/components/layout/AppLayout"

{
  /* Dados mockados para o dashboard */
}
const statsCards = [
  {
    icon: CalendarDays,
    label: "Refeições esta semana",
    value: "12",
    change: "+3 que semana passada",
    positive: true,
    color: "text-dish-primary dark:text-dish-leaf",
    bg: "bg-dish-primary/10 dark:bg-dish-leaf/15",
    border: "border-dish-primary/20 dark:border-dish-leaf/20",
  },
  {
    icon: ChefHat,
    label: "Receitas salvas",
    value: "24",
    change: "5 novas este mês",
    positive: true,
    color: "text-dish-accent",
    bg: "bg-dish-accent/10",
    border: "border-dish-accent/20",
  },
  {
    icon: ShoppingCart,
    label: "Itens na lista",
    value: "8",
    change: "3 já comprados",
    positive: null,
    color: "text-dish-leaf-dark dark:text-dish-leaf-light",
    bg: "bg-dish-leaf/10",
    border: "border-dish-leaf/20",
  },
  {
    icon: TrendingUp,
    label: "Calorias médias",
    value: "1.840",
    change: "kcal/dia esta semana",
    positive: null,
    color: "text-orange-500 dark:text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
  },
]

const todayMeals = [
  {
    type: "Café da manhã",
    icon: Coffee,
    time: "07:30",
    recipe: "Overnight oats com frutas",
    kcal: 380,
    done: true,
  },
  {
    type: "Almoço",
    icon: Utensils,
    time: "12:00",
    recipe: "Frango grelhado com arroz integral",
    kcal: 650,
    done: true,
  },
  {
    type: "Lanche",
    icon: Apple,
    time: "15:30",
    recipe: "Iogurte grego com granola",
    kcal: 210,
    done: false,
  },
  {
    type: "Jantar",
    icon: Sandwich,
    time: "19:00",
    recipe: "Salmão ao forno com legumes",
    kcal: 520,
    done: false,
  },
]

const suggestedRecipes = [
  {
    name: "Risotto de Cogumelos",
    time: "35 min",
    kcal: "480 kcal",
    rating: 4.8,
    tags: ["Vegetariano", "Fácil"],
    emoji: "🍄",
    gradient: "from-amber-500/20 to-orange-500/10",
  },
  {
    name: "Salada Caesar",
    time: "15 min",
    kcal: "320 kcal",
    rating: 4.6,
    tags: ["Leve", "Rápido"],
    emoji: "🥗",
    gradient: "from-green-500/20 to-emerald-500/10",
  },
  {
    name: "Frango Tikka Masala",
    time: "40 min",
    kcal: "580 kcal",
    rating: 4.9,
    tags: ["Proteico", "Exótico"],
    emoji: "🍛",
    gradient: "from-red-500/20 to-orange-500/10",
  },
]

export default function Home() {
  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite"

  const dateStr = now.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })

  return (
    <AppLayout pageTitle="Início">
      <div className="mx-auto max-w-5xl space-y-8 px-4 py-6 sm:px-6 md:px-8 lg:px-10">
        {/* ── Saudação ── */}
        <section style={{ animation: "fadeUp 0.4s ease-out both" }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground capitalize">
                {dateStr}
              </p>
              <h1 className="mt-1 text-2xl leading-tight font-extrabold text-foreground sm:text-3xl">
                {greeting}, Usuário! 👋
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Você tem{" "}
                <span className="font-semibold text-dish-primary dark:text-dish-leaf">
                  2 refeições
                </span>{" "}
                planejadas hoje à tarde.
              </p>
            </div>

            {/* Avatar desktop */}
            <div className="hidden flex-col items-center gap-1 md:flex">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-dish-primary/15 text-xl font-bold text-dish-primary dark:bg-dish-leaf/15 dark:text-dish-leaf">
                U
              </div>
            </div>
          </div>
        </section>

        {/* ── Estatísticas ── */}
        <section style={{ animation: "fadeUp 0.4s ease-out 0.1s both" }}>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {statsCards.map((card) => {
              const Icon = card.icon
              return (
                <div
                  key={card.label}
                  className={cn(
                    "group rounded-2xl border p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md",
                    "bg-card",
                    card.border
                  )}
                >
                  <div
                    className={cn(
                      "mb-3 flex h-9 w-9 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
                      card.bg
                    )}
                  >
                    <Icon className={cn("h-4.5 w-4.5", card.color)} />
                  </div>
                  <p className="mb-1 text-2xl leading-none font-extrabold text-foreground">
                    {card.value}
                  </p>
                  <p className="mb-1.5 text-xs leading-tight font-semibold text-muted-foreground">
                    {card.label}
                  </p>
                  {card.change && (
                    <p
                      className={cn(
                        "text-[10px] font-medium",
                        card.positive === true
                          ? "text-dish-leaf-dark dark:text-dish-leaf"
                          : "text-muted-foreground"
                      )}
                    >
                      {card.positive === true && "↑ "}
                      {card.change}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {/* ── Cardápio de hoje ── */}
        <section style={{ animation: "fadeUp 0.4s ease-out 0.2s both" }}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-extrabold text-foreground">
              <CalendarDays className="h-5 w-5 text-dish-primary dark:text-dish-leaf" />
              Cardápio de hoje
            </h2>
            <button className="flex items-center gap-1 text-xs font-semibold text-dish-primary transition-all hover:underline dark:text-dish-leaf">
              Ver semana
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {todayMeals.map((meal) => {
              const Icon = meal.icon
              return (
                <div
                  key={meal.type}
                  className={cn(
                    "group flex items-center gap-4 rounded-2xl border p-4 transition-all duration-300 hover:shadow-md",
                    "border-border bg-card",
                    meal.done && "opacity-70"
                  )}
                >
                  {/* Ícone da refeição */}
                  <div
                    className={cn(
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105",
                      meal.done
                        ? "bg-muted"
                        : "bg-dish-primary/10 dark:bg-dish-leaf/15"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-5 w-5",
                        meal.done
                          ? "text-muted-foreground"
                          : "text-dish-primary dark:text-dish-leaf"
                      )}
                    />
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="mb-0.5 flex items-center gap-2">
                      <p className="text-xs font-semibold text-muted-foreground">
                        {meal.type}
                      </p>
                      {meal.done && (
                        <span className="rounded-full bg-dish-leaf/15 px-1.5 py-0.5 text-[10px] font-bold text-dish-leaf">
                          ✓ Feito
                        </span>
                      )}
                    </div>
                    <p className="truncate text-sm font-semibold text-foreground">
                      {meal.recipe}
                    </p>
                    <div className="mt-1 flex items-center gap-3">
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {meal.time}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Flame className="h-3 w-3" />
                        {meal.kcal} kcal
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Adicionar refeição */}
          <button
            className={cn(
              "mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed py-3",
              "border-border hover:border-dish-primary/40 dark:hover:border-dish-leaf/40",
              "text-sm font-semibold text-muted-foreground hover:text-dish-primary dark:hover:text-dish-leaf",
              "transition-all duration-200"
            )}
          >
            <Plus className="h-4 w-4" />
            Adicionar refeição
          </button>
        </section>

        {/* ── Receitas Sugeridas ── */}
        <section style={{ animation: "fadeUp 0.4s ease-out 0.3s both" }}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-extrabold text-foreground">
              <Sparkles className="h-5 w-5 text-dish-accent" />
              Sugestões para você
            </h2>
            <button className="flex items-center gap-1 text-xs font-semibold text-dish-primary transition-all hover:underline dark:text-dish-leaf">
              Ver mais
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Scroll horizontal no mobile / grid no desktop */}
          <div className="-mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-3 md:grid md:grid-cols-3 md:overflow-visible md:pb-0">
            {suggestedRecipes.map((recipe) => (
              <div
                key={recipe.name}
                className={cn(
                  "group w-60 shrink-0 snap-start md:w-auto",
                  "overflow-hidden rounded-2xl border border-border bg-card",
                  "cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                )}
              >
                {/* Capa */}
                <div
                  className={cn(
                    "flex h-28 items-center justify-center text-5xl",
                    `bg-linear-to-br ${recipe.gradient}`,
                    "border-b border-border"
                  )}
                >
                  {recipe.emoji}
                </div>

                {/* Conteúdo */}
                <div className="p-4">
                  <h3 className="mb-2 text-sm leading-tight font-bold text-foreground">
                    {recipe.name}
                  </h3>

                  <div className="mb-3 flex items-center gap-3">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {recipe.time}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Flame className="h-3 w-3" />
                      {recipe.kcal}
                    </span>
                    <span className="ml-auto flex items-center gap-1 text-xs font-semibold text-dish-accent">
                      <Star className="h-3 w-3 fill-dish-accent" />
                      {recipe.rating}
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {recipe.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Quick Actions ── */}
        <section
          className="pb-4"
          style={{ animation: "fadeUp 0.4s ease-out 0.4s both" }}
        >
          <h2 className="mb-4 flex items-center gap-2 text-lg font-extrabold text-foreground">
            <Plus className="h-5 w-5 text-dish-primary dark:text-dish-leaf" />
            Ações rápidas
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              {
                label: "Nova receita",
                icon: ChefHat,
                color: "text-dish-accent",
                bg: "bg-dish-accent/10",
                border: "border-dish-accent/20",
              },
              {
                label: "Planejar semana",
                icon: CalendarDays,
                color: "text-dish-primary dark:text-dish-leaf",
                bg: "bg-dish-primary/10 dark:bg-dish-leaf/15",
                border: "border-dish-primary/20 dark:border-dish-leaf/20",
              },
              {
                label: "Atualizar lista",
                icon: ShoppingCart,
                color: "text-dish-leaf-dark dark:text-dish-leaf-light",
                bg: "bg-dish-leaf/10",
                border: "border-dish-leaf/20",
              },
              {
                label: "Ver progresso",
                icon: TrendingUp,
                color: "text-orange-500 dark:text-orange-400",
                bg: "bg-orange-500/10",
                border: "border-orange-500/20",
              },
            ].map(({ label, icon: Icon, color, bg, border }) => (
              <button
                key={label}
                className={cn(
                  "group flex flex-col items-center gap-3 rounded-2xl border bg-card p-4",
                  "transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md",
                  border
                )}
              >
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
                    bg
                  )}
                >
                  <Icon className={cn("h-5 w-5", color)} />
                </div>
                <span className="text-center text-xs leading-tight font-semibold text-foreground">
                  {label}
                </span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  )
}
