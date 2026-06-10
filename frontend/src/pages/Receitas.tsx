import { Plus, Clock, Flame, MoreVertical, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"

const receitas = [
  {
    id: 1,
    titulo: "Frango Grelhado com Legumes",
    tempoPreparo: "30 min",
    dificuldade: "Fácil",
    porcoes: 2,
  },
  {
    id: 2,
    titulo: "Salmão ao Forno",
    tempoPreparo: "45 min",
    dificuldade: "Médio",
    porcoes: 4,
  },
  {
    id: 3,
    titulo: "Salada de Quinoa",
    tempoPreparo: "15 min",
    dificuldade: "Fácil",
    porcoes: 2,
  },
  {
    id: 4,
    titulo: "Escondidinho de Batata Doce",
    tempoPreparo: "60 min",
    dificuldade: "Médio",
    porcoes: 6,
  },
]

export default function Receitas() {
  return (
    <>
      <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8">
        
        {/* Header e Botão */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Minhas Receitas</h1>
            <p className="text-sm text-muted-foreground mt-1">Gerencie suas receitas e crie novas opções deliciosas.</p>
          </div>
          <Button className="hidden md:flex gap-2">
            <Plus className="h-4 w-4" />
            Nova Receita
          </Button>
        </div>

        {/* Lista/Grid de Receitas */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {receitas.map((receita) => (
            <div 
              key={receita.id} 
              className="flex flex-col p-4 bg-card rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow relative"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-dish-primary/10 text-dish-primary">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-card-foreground leading-tight">{receita.titulo}</h3>
                </div>
                <button className="text-muted-foreground hover:text-foreground shrink-0 rounded-full p-1 hover:bg-muted transition-colors">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
              
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5 bg-muted/50 px-2.5 py-1 rounded-md">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{receita.tempoPreparo}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-muted/50 px-2.5 py-1 rounded-md">
                  <Flame className="h-3.5 w-3.5" />
                  <span>{receita.dificuldade}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-muted/50 px-2.5 py-1 rounded-md">
                  <span>{receita.porcoes} porções</span>
                </div>
              </div>
            </div>
          ))}
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
