import { useState } from "react"
import { ShoppingCart, RefreshCw, Plus, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const comprasMock = [
  { id: 1, categoria: "Carnes", itens: [
    { id: 101, nome: "Frango", quantidade: 1.5, unidade: "kg", checked: false },
    { id: 102, nome: "Salmão", quantidade: 800, unidade: "g", checked: true },
  ]},
  { id: 2, categoria: "Hortifruti", itens: [
    { id: 201, nome: "Batata Doce", quantidade: 1, unidade: "kg", checked: false },
    { id: 202, nome: "Limão", quantidade: 6, unidade: "un", checked: false },
    { id: 203, nome: "Maçã", quantidade: 1, unidade: "kg", checked: true },
  ]},
  { id: 3, categoria: "Despensa", itens: [
    { id: 301, nome: "Arroz Integral", quantidade: 1, unidade: "pct", checked: false },
    { id: 302, nome: "Grão de Bico", quantidade: 500, unidade: "g", checked: false },
  ]},
]

export default function Compras() {
  const [list, setList] = useState(comprasMock)

  const toggleCheck = (catId: number, itemId: number) => {
    setList(prev => prev.map(cat => {
      if (cat.id !== catId) return cat
      return {
        ...cat,
        itens: cat.itens.map(item => 
          item.id === itemId ? { ...item, checked: !item.checked } : item
        )
      }
    }))
  }

  return (
    <>
      <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8">
        
        {/* Header */}
        <div className="flex items-start md:items-center justify-between flex-col md:flex-row gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <ShoppingCart className="h-6 w-6 text-dish-primary" />
              Lista de Compras
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Sua lista baseada no cardápio da semana.</p>
          </div>
          
          <div className="flex w-full md:w-auto items-center gap-2">
            <Button variant="outline" className="flex-1 md:flex-none gap-2">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Adicionar Item</span>
            </Button>
            <Button className="flex-1 md:flex-none gap-2 flex bg-dish-primary hover:bg-dish-primary/90 text-white shadow-dish">
              <RefreshCw className="h-4 w-4" />
              Gerar Lista
            </Button>
          </div>
        </div>

        {/* Lista de Itens */}
        <div className="space-y-6">
          {list.map(categoria => (
            <div key={categoria.id} className="space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground pl-1">
                {categoria.categoria}
              </h2>
              
              <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                {categoria.itens.map((item, idx) => (
                  <div 
                    key={item.id}
                    onClick={() => toggleCheck(categoria.id, item.id)}
                    className={cn(
                      "flex items-center gap-4 px-4 py-4 cursor-pointer transition-colors hover:bg-muted/50",
                      idx !== categoria.itens.length - 1 && "border-b border-border/50",
                      item.checked && "opacity-60 bg-muted/30"
                    )}
                  >
                    <div 
                      className={cn(
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all",
                        item.checked 
                          ? "bg-dish-leaf border-none text-white" 
                          : "border-muted-foreground/30 text-transparent"
                      )}
                    >
                      <Check className="h-4 w-4" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "text-[15px] font-medium leading-none transition-all",
                        item.checked ? "text-muted-foreground line-through" : "text-foreground"
                      )}>
                        {item.nome}
                      </p>
                    </div>

                    <div className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                      {item.quantidade} {item.unidade}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </>
  )
}
