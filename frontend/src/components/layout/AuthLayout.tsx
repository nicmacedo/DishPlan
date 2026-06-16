import { Link } from "react-router-dom"
import type { ReactNode } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

interface AuthLayoutProps {
  children: ReactNode
  subtitle?: string
  panelTitle?: string
}

export default function AuthLayout({
  children,
  subtitle = "Organize suas refeições e compras",
}: AuthLayoutProps) {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <div className="flex min-h-dvh flex-col overflow-hidden font-sans md:flex-row">
      {/* ── Painel Esquerdo (Branding) ── */}
      <div className="relative flex shrink-0 flex-col items-center justify-center overflow-hidden bg-dish-primary py-10 text-white md:w-5/12 md:py-0 lg:w-[42%] xl:w-5/12">
        {/* Orbs decorativos de fundo */}
        <div
          className="absolute -top-20 -left-20 h-72 w-72 rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, #9FC184 0%, transparent 70%)",
            animation: "orbMove 12s ease-in-out infinite",
          }}
        />
        <div
          className="absolute right-0 bottom-10 h-56 w-56 rounded-full opacity-15"
          style={{
            background: "radial-gradient(circle, #D4A345 0%, transparent 70%)",
            animation: "orbMove 9s ease-in-out infinite reverse",
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #2e8c82 0%, transparent 70%)",
            animation: "orbMove 15s ease-in-out infinite 3s",
          }}
        />

        {/* Divisor ondulado direito — desktop */}
        <div className="absolute top-0 right-0 bottom-0 z-10 hidden w-20 md:block">
          <svg
            viewBox="0 0 80 800"
            preserveAspectRatio="none"
            className="h-full w-full"
          >
            <path
              d="M0,0 Q40,100 0,200 Q40,300 0,400 Q40,500 0,600 Q40,700 0,800 L80,800 L80,0 Z"
              className="fill-background"
            />
          </svg>
        </div>

        {/* Divisor ondulado inferior — mobile */}
        <div className="absolute right-0 bottom-0 left-0 z-10 h-10 md:hidden">
          <svg
            viewBox="0 0 400 40"
            preserveAspectRatio="none"
            className="h-full w-full"
          >
            <path
              d="M0,0 Q100,40 200,20 Q300,0 400,30 L400,40 L0,40 Z"
              className="fill-background"
            />
          </svg>
        </div>

        {/* Conteúdo Branding */}
        <div className="relative z-20 flex max-w-sm flex-col items-center px-8 text-center">
          <Link to="/welcome" className="group flex flex-col items-center">
            {/* Logo */}
            <div
              className="mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-white p-2.5 shadow-2xl transition-transform duration-300 group-hover:scale-105 md:h-28 md:w-28"
              style={{ animation: "float 6s ease-in-out infinite" }}
            >
              <img
                src="/logo-default.png"
                alt="DishPlan Logo"
                className="h-full w-full object-contain"
              />
            </div>

            <h1 className="mb-3 text-4xl font-extrabold tracking-tight md:text-5xl">
              DishPlan
            </h1>
          </Link>

          <p className="max-w-60 text-sm leading-relaxed font-medium text-dish-leaf/90 md:text-base">
            {subtitle}
          </p>

          {/* Feature pills — desktop only */}
          <div className="mt-10 hidden w-full flex-col gap-3 md:flex">
            {[
              { emoji: "🍽️", text: "Cardápio semanal personalizado" },
              { emoji: "🛒", text: "Lista de compras automática" },
              { emoji: "📖", text: "Catálogo de receitas" },
            ].map((item) => (
              <div
                key={item.text}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-left backdrop-blur-sm"
              >
                <span className="text-xl">{item.emoji}</span>
                <span className="text-sm font-medium text-white/90">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Painel Direito (Formulário) ── */}
      <div className="relative z-20 -mt-3 flex flex-1 flex-col justify-center rounded-t-[2rem] bg-background px-5 py-8 sm:px-8 md:mt-0 md:rounded-none lg:px-12 xl:px-16">
        {/* Botão toggle de tema */}
        <button
          onClick={toggleTheme}
          aria-label="Alternar tema"
          className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground transition-all duration-200 hover:bg-muted/80 hover:text-foreground md:top-6 md:right-8"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </button>

        <div className="mx-auto w-full max-w-md">{children}</div>
      </div>
    </div>
  )
}
