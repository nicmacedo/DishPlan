import { Plus, Coffee, Utensils, Sandwich, CalendarDays, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const diasSemana = [
  { dia: "Seg", data: "08", ativo: false },
  { dia: "Ter", data: "09", ativo: true },
  { dia: "Qua", data: "10", ativo: false },
  { dia: "Qui", data: "11", ativo: false },
  { dia: "Sex", data: "12", ativo: false },
  { dia: "Sáb", data: "13", ativo: false },
  { dia: "Dom", data: "14", ativo: false },
]

const refeicoesMock = [
  {
    turno: "Café da manhã",
    icon: Coffee,
    receitas: ["Overnight oats com frutas"],
  },
  {
    turno: "Almoço",
    icon: Utensils,
    receitas: ["Frango grelhado com arroz integral", "Salada fresca"],
  },
  {
    turno: "Lanche",
    icon: Sandwich,
    receitas: [],
  },
  {
    turno: "Jantar",
    icon: Utensils,
    receitas: ["Salmão ao forno com legumes"],
  },
]

export default function Cardapio() {
  return (
    <>
      <div className="flex flex-col h-full bg-background">
        
        {/* Header e Seleção de Dias (Fixo no topo da tela) */}
        <div className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b border-border p-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-foreground">
              <CalendarDays className="h-5 w-5" />
              <h1 className="text-xl font-bold tracking-tight">Setembro 2026</h1>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 scrollbar-none">
            {diasSemana.map((d) => (
              <button
                key={d.dia}
                className={cn(
                  "flex flex-col items-center justify-center min-w-12 p-2 rounded-2xl transition-colors",
                  d.ativo 
                    ? "bg-dish-primary text-white shadow-dish shadow-dish-primary/30" 
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                <span className="text-[10px] font-semibold uppercase tracking-wider">{d.dia}</span>
                <span className={cn("text-base font-bold mt-0.5", d.ativo && "text-white")}>{d.data}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Refeições do Dia */}
        <div className="flex-1 p-4 md:p-6 lg:p-8 space-y-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Refeições de Terça-feira</h2>
            <Button variant="outline" size="sm" className="hidden md:flex gap-2">
              <Plus className="h-4 w-4" />
              Adicionar ao dia
            </Button>
          </div>

          <div className="grid gap-4">
            {refeicoesMock.map((ref, idx) => {
              const Icon = ref.icon
              const hasRecipes = ref.receitas.length > 0

              return (
                <div 
                  key={idx} 
                  className={cn(
                    "flex flex-col bg-card rounded-2xl border p-4 shadow-sm relative overflow-hidden transition-all",
                    hasRecipes ? "border-border" : "border-dashed border-border"
                  )}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        <Icon className="h-4 w-4" />
                      </div>
                      <h3 className="font-semibold text-card-foreground text-sm">{ref.turno}</h3>
                    </div>
                    
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-dish-primary hover:text-dish-primary/90 hover:bg-dish-primary/10">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {hasRecipes ? (
                    <div className="space-y-2">
                      {ref.receitas.map((receita, rIdx) => (
                        <div key={rIdx} className="bg-muted/50 rounded-xl px-4 py-3 border border-border/50">
                          <span className="text-sm font-medium text-foreground">{receita}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-4 text-center">
                      <p className="text-sm text-muted-foreground">Nenhuma refeição planejada</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* FAB (Floating Action Button) Mobile */}
        <Button 
          size="icon" 
          className="fixed bottom-20 right-4 h-14 w-14 rounded-full shadow-lg md:hidden z-40 bg-dish-primary hover:bg-dish-primary/90 text-white"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </>
  )
}
