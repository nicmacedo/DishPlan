import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { navItems } from "@/constants"

export default function BottomBar() {
  const { pathname } = useLocation()

  return (
    <nav
      className={cn(
        "fixed right-0 bottom-0 left-0 z-50 md:hidden",
        "bg-background/95 backdrop-blur-xl dark:bg-card/95",
        "border-t border-border",
        "shadow-[0_-4px_24px_rgba(0,0,0,0.08)] dark:shadow-[0_-4px_24px_rgba(0,0,0,0.3)]",
        "animate-[bottomBarIn_0.4s_ease-out_forwards]"
      )}
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <ul className="flex items-end justify-around px-2 pt-2">
        {navItems.map(({ to, icon: Icon, label }) => {
          const isActive =
            to === "/" ? pathname === "/" : pathname.startsWith(to)

          return (
            <li key={to} className="flex-1">
              <Link
                to={to}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-2xl px-2 py-1",
                  "group transition-all duration-200 select-none",
                  isActive
                    ? "text-dish-primary dark:text-dish-leaf"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {/* Bolha de destaque no item ativo */}
                <span
                  className={cn(
                    "relative flex h-7 w-11 items-center justify-center rounded-full transition-all duration-300",
                    isActive
                      ? "bg-dish-primary/10 dark:bg-dish-leaf/15"
                      : "group-hover:bg-muted"
                  )}
                >
                  <Icon
                    className={cn(
                      "transition-all duration-300",
                      isActive ? "h-5 w-5 stroke-[2.2]" : "h-5 w-5 stroke-[1.6]"
                    )}
                  />
                </span>

                <span
                  className={cn(
                    "text-[10px] leading-none font-semibold transition-all duration-200",
                    isActive
                      ? "opacity-100"
                      : "opacity-60 group-hover:opacity-80"
                  )}
                >
                  {label}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
