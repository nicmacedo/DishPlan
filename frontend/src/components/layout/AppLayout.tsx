import { Link, useLocation, Outlet } from "react-router-dom"
import { Moon, Sun, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/theme-provider"
import BottomBar from "@/components/layout/BottomBar"
import { navItems } from "@/constants"
import { useAuthStore } from "@/stores/authStore"

export default function AppLayout() {
  const { pathname } = useLocation()
  const { theme, setTheme } = useTheme()
  const user = useAuthStore((state) => state.user)

  const currentNav = navItems.find((item) =>
    item.to === "/" ? pathname === "/" : pathname.startsWith(item.to)
  )
  const pageTitle = currentNav?.label || "DishPlan"

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark")

  return (
    <div className="flex min-h-dvh bg-background text-foreground">
      {/* Sidebar - Apenas Desktop (md+) */}
      <aside
        className={cn(
          "hidden flex-col md:flex",
          "w-64 shrink-0 border-r border-sidebar-border bg-sidebar lg:w-72",
          "sticky top-0 z-40 h-screen"
        )}
      >
        <div className="border-b border-sidebar-border px-6 py-5">
          <Link to="/" className="group flex items-center gap-3">
            <div className="shadow-dish flex h-9 w-9 items-center justify-center rounded-xl bg-dish-primary p-1.5 transition-transform duration-200 group-hover:scale-105">
              <img
                src="/logo-default.png"
                alt="DishPlan"
                className="h-full w-full object-contain brightness-[5]"
              />
            </div>
            <div>
              <span className="block text-base leading-none font-extrabold tracking-tight text-sidebar-foreground">
                DishPlan
              </span>
              <span className="text-[10px] font-medium text-sidebar-foreground/50">
                Planejamento alimentar
              </span>
            </div>
          </Link>
        </div>

        {/* Navegação */}
        <nav className="scrollbar-thin flex-1 space-y-1 overflow-y-auto px-3 py-4">
          <p className="px-3 pb-2 text-[10px] font-bold tracking-widest text-sidebar-foreground/40 uppercase">
            Menu
          </p>
          {navItems.map(({ to, icon: Icon, label }) => {
            const isActive =
              to === "/" ? pathname === "/" : pathname.startsWith(to)
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200",
                  isActive
                    ? "shadow-dish bg-dish-primary text-white"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                <Icon
                  className={cn(
                    "h-4.5 w-4.5 transition-transform duration-200 group-hover:scale-110",
                    isActive ? "stroke-[2.2]" : "stroke-[1.7]"
                  )}
                />
                <span className="text-sm font-semibold">{label}</span>
                {isActive && (
                  <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-60" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer da Sidebar — Tema + Perfil */}
        <div className="space-y-1 border-t border-sidebar-border px-3 py-4">
          <button
            onClick={toggleTheme}
            className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sidebar-foreground/70 transition-all duration-200 hover:cursor-pointer hover:bg-sidebar-accent hover:text-sidebar-foreground"
            aria-label="Alternar tema"
          >
            {theme === "dark" ? (
              <Sun className="h-4.5 w-4.5 transition-transform duration-200 group-hover:scale-110" />
            ) : (
              <Moon className="h-4.5 w-4.5 transition-transform duration-200 group-hover:scale-110" />
            )}
            <span className="text-sm font-semibold">
              {theme === "dark" ? "Tema Claro" : "Tema Escuro"}
            </span>
          </button>

          {/* Avatar do usuário */}
          <div className="mt-2 flex items-center gap-3 rounded-xl bg-sidebar-accent px-3 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-dish-primary/20 text-sm font-bold text-dish-primary dark:text-dish-leaf">
              {user?.nome?.charAt(0)?.toUpperCase() ?? "U"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-sidebar-foreground">
                {user?.nome ?? "Usuário"}
              </p>
              <p className="truncate text-xs text-sidebar-foreground/50">
                {user?.email ?? ""}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Conteúdo */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header Mobile (escondido no desktop) */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/95 px-5 py-4 backdrop-blur-lg md:hidden">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-dish-primary p-1.5">
              <img
                src="/logo-default.png"
                alt="DishPlan"
                className="h-full w-full object-contain brightness-[5]"
              />
            </div>
            <span className="text-sm font-extrabold text-foreground">
              {pageTitle}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle tema */}
            <button
              onClick={toggleTheme}
              aria-label="Alternar tema"
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-muted text-muted-foreground transition-all hover:bg-muted/80 hover:text-foreground"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>

            {/* Avatar */}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-dish-primary/20 text-xs font-bold text-dish-primary dark:text-dish-leaf">
              {user?.nome?.charAt(0)?.toUpperCase() ?? "U"}
            </div>
          </div>
        </header>

        {/* Conteúdo da Página */}
        <main className="mb-safe scrollbar-thin flex-1 overflow-y-auto md:mb-0">
          <Outlet />
        </main>
      </div>

      {/* BottomBar — mobile only */}
      <BottomBar />
    </div>
  )
}
