import { Home, BookOpen, CalendarDays, ShoppingCart, User } from "lucide-react"

export const navItems = [
  { to: "/", icon: Home, label: "Início" },
  { to: "/receitas", icon: BookOpen, label: "Receitas" },
  { to: "/cardapio", icon: CalendarDays, label: "Cardápio" },
  { to: "/compras", icon: ShoppingCart, label: "Compras" },
  { to: "/perfil", icon: User, label: "Perfil" },
]
