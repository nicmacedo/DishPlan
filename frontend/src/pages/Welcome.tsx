import { useNavigate } from "react-router-dom"
import { useTheme } from "@/components/theme-provider"
import {
  Moon,
  Sun,
  ChefHat,
  ShoppingCart,
  CalendarDays,
  Sparkles,
  ArrowRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

const features = [
  {
    icon: CalendarDays,
    title: "Cardápio Semanal",
    description: "Monte seu plano alimentar por dia e tipo de refeição",
    color: "text-dish-primary dark:text-dish-leaf",
    bg: "bg-dish-primary/10 dark:bg-dish-leaf/15",
    delay: "0.1s",
  },
  {
    icon: ChefHat,
    title: "Catálogo de Receitas",
    description:
      "Explore receitas com filtros, tempo de preparo e ingredientes",
    color: "text-dish-accent",
    bg: "bg-dish-accent/10 dark:bg-dish-accent/15",
    delay: "0.2s",
  },
  {
    icon: ShoppingCart,
    title: "Lista de Compras",
    description: "Gerada automaticamente a partir do seu cardápio",
    color: "text-dish-leaf-dark dark:text-dish-leaf-light",
    bg: "bg-dish-leaf/15 dark:bg-dish-leaf/10",
    delay: "0.3s",
  },
]

export default function Welcome() {
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-background text-foreground">
      {/* ── Orbs de fundo ── */}
      <div aria-hidden="true" className="pointer-events-none select-none">
        <div
          className="absolute top-[-10%] right-[-5%] h-125 w-125 rounded-full opacity-[0.08] dark:opacity-[0.12]"
          style={{
            background: "radial-gradient(circle, #184642 0%, transparent 70%)",
            animation: "orbMove 14s ease-in-out infinite",
          }}
        />
        <div
          className="absolute bottom-[5%] left-[-5%] h-100 w-100 rounded-full opacity-[0.07] dark:opacity-[0.10]"
          style={{
            background: "radial-gradient(circle, #D4A345 0%, transparent 70%)",
            animation: "orbMove 10s ease-in-out infinite 2s reverse",
          }}
        />
        <div
          className="absolute top-[40%] left-[30%] h-75 w-75 rounded-full opacity-[0.05] dark:opacity-[0.08]"
          style={{
            background: "radial-gradient(circle, #9FC184 0%, transparent 70%)",
            animation: "orbMove 18s ease-in-out infinite 5s",
          }}
        />
      </div>

      {/* ── Header ── */}
      <header className="relative z-10 flex items-center justify-between px-5 pt-5 sm:px-8 sm:pt-6 md:px-12">
        {/* Logo pequena */}
        <div className="flex items-center gap-2.5">
          <div className="shadow-dish flex h-9 w-9 items-center justify-center rounded-xl bg-dish-primary p-1.5">
            <img
              src="/logo-default.png"
              alt="DishPlan"
              className="h-full w-full object-contain brightness-[5]"
            />
          </div>
          <span className="text-base font-extrabold tracking-tight text-foreground">
            DishPlan
          </span>
        </div>

        {/* Toggle de tema */}
        <button
          onClick={toggleTheme}
          aria-label="Alternar tema"
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200",
            "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground",
            "border border-border hover:cursor-pointer"
          )}
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </button>
      </header>

      {/* ── Conteúdo Principal ── */}
      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center gap-10 px-5 py-8 sm:px-8 md:flex-row md:gap-16 md:px-12 lg:gap-24">
        {/* ── Lado Esquerdo — Hero ── */}
        <div className="flex max-w-lg flex-1 flex-col items-center text-center md:items-start md:text-left">
          {/* Badge */}
          <div
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-dish-primary/20 bg-dish-primary/10 px-4 py-1.5 text-xs font-semibold text-dish-primary dark:border-dish-leaf/20 dark:bg-dish-leaf/15 dark:text-dish-leaf"
            style={{ animation: "fadeUp 0.4s ease-out 0.1s both" }}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Planejamento alimentar inteligente
          </div>

          {/* Logo + Título */}
          <div
            className="flex flex-col items-center md:items-start"
            style={{ animation: "fadeUp 0.5s ease-out 0.2s both" }}
          >
            <div
              className="shadow-dish-lg mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-dish-primary p-3 md:h-24 md:w-24"
              style={{ animation: "float 5s ease-in-out infinite" }}
            >
              <img
                src="/logo-default.png"
                alt="DishPlan Logo"
                className="h-full w-full object-contain brightness-[5]"
              />
            </div>

            <h1 className="mb-5 text-5xl leading-[0.95] font-extrabold tracking-tight sm:text-6xl md:text-7xl">
              <span className="text-gradient-dish">Dish</span>
              <span className="text-foreground">Plan</span>
            </h1>
          </div>

          <p
            className="mb-8 max-w-95 text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl"
            style={{ animation: "fadeUp 0.5s ease-out 0.35s both" }}
          >
            Sua vida na cozinha,{" "}
            <span className="font-semibold text-foreground">
              organizadamente deliciosa.
            </span>{" "}
            Monte cardápios, descubra receitas e automatize sua lista de
            compras.
          </p>

          {/* CTAs */}
          <div
            className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row md:flex-col lg:flex-row"
            style={{ animation: "fadeUp 0.5s ease-out 0.45s both" }}
          >
            <button
              onClick={() => navigate("/register")}
              className={cn(
                "group flex items-center justify-center gap-2",
                "bg-dish-primary text-white hover:bg-dish-primary/90",
                "rounded-2xl px-7 py-4 text-base font-bold transition-all duration-200",
                "shadow-dish hover:shadow-dish-lg active:scale-[0.98]",
                "w-full hover:cursor-pointer sm:w-auto"
              )}
            >
              Começar Grátis
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => navigate("/login")}
              className={cn(
                "flex items-center justify-center gap-2",
                "border-2 border-border bg-background hover:border-dish-primary/40 dark:hover:border-dish-leaf/40",
                "text-foreground hover:text-dish-primary dark:hover:text-dish-leaf",
                "rounded-2xl px-7 py-4 text-base font-bold transition-all duration-200",
                "w-full hover:cursor-pointer active:scale-[0.98] sm:w-auto"
              )}
            >
              Já tenho conta
            </button>
          </div>
        </div>

        {/* ── Lado Direito — Feature Cards ── */}
        <div className="flex w-full max-w-sm flex-col gap-4 md:max-w-xs lg:max-w-sm">
          {features.map((feat) => {
            const Icon = feat.icon
            return (
              <div
                key={feat.title}
                className={cn(
                  "group flex items-start gap-4 rounded-2xl border border-border p-5",
                  "bg-card hover:bg-card/80 dark:bg-card",
                  "shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                )}
                style={{ animation: `fadeUp 0.5s ease-out ${feat.delay} both` }}
              >
                <div
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
                    feat.bg
                  )}
                >
                  <Icon className={cn("h-5 w-5", feat.color)} />
                </div>
                <div>
                  <h3 className="mb-1 text-sm font-bold text-foreground">
                    {feat.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {feat.description}
                  </p>
                </div>
              </div>
            )
          })}

          {/* Stat pill */}
          <div
            className="flex items-center justify-center gap-3 rounded-2xl border border-dish-accent/20 bg-dish-accent/10 px-5 py-3 dark:bg-dish-accent/15"
            style={{ animation: "fadeUp 0.5s ease-out 0.4s both" }}
          >
            <Sparkles className="h-4 w-4 text-dish-accent" />
            <p className="text-xs font-semibold text-dish-accent-dark dark:text-dish-accent">
              Planeje suas refeições de forma inteligente
            </p>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="relative z-10 px-5 pb-6 text-center">
        <p className="text-xs text-muted-foreground">
          © 2025 DishPlan · Feito com ❤️ para a sua saúde
        </p>
      </footer>
    </div>
  )
}
