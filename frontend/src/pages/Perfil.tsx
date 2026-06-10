import { Mail, Settings, Users, LogOut, ArrowRight, ShieldCheck, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const userMock = {
  nome: "Felipe",
  email: "felipe@dishplan.com",
}

const grupoMock = {
  nome: "Família Silva",
  membros: [
    { id: 1, nome: "Felipe (Você)", role: "admin" },
    { id: 2, nome: "Alice", role: "membro" },
  ]
}

const compartilhamentosMock = [
  { id: 1, grupo: "Amigos do Churras", receitas: 12 },
  { id: 2, grupo: "Receitas Fit", receitas: 45 },
]

export default function Perfil() {
  return (
    <>
      <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 max-w-4xl mx-auto w-full">
        
        {/* Cabeçalho do Perfil */}
        <div className="flex items-center gap-5 bg-card p-6 rounded-2xl border border-border shadow-sm">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-dish-primary/10 text-2xl font-bold text-dish-primary">
            {userMock.nome.charAt(0)}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">{userMock.nome}</h1>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
              <Mail className="h-3.5 w-3.5" />
              {userMock.email}
            </p>
          </div>
          <Button variant="outline" size="icon" className="hidden sm:flex rounded-full">
            <Settings className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Seção Meu Grupo / Família */}
          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="p-5 border-b border-border/50 flex items-center gap-3 bg-muted/20">
              <div className="p-2 bg-dish-accent/10 text-dish-accent rounded-lg">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">Meu Grupo / Família</h2>
                <p className="text-xs text-muted-foreground">{grupoMock.nome}</p>
              </div>
            </div>
            
            <div className="p-5 space-y-4">
              <div className="space-y-3">
                {grupoMock.membros.map((membro) => (
                  <div key={membro.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                        {membro.nome.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-foreground">{membro.nome}</span>
                    </div>
                    {membro.role === "admin" && (
                      <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-dish-primary bg-dish-primary/10 px-2 py-0.5 rounded-full">
                         <ShieldCheck className="h-3 w-3" /> Admin
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-border/50">
                <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">Convidar Membro</p>
                <div className="flex gap-2">
                  <Input type="email" placeholder="E-mail do convidado" className="h-9" />
                  <Button className="h-9 w-24 bg-dish-primary hover:bg-dish-primary/90 text-white">
                    Enviar
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Seção Compartilhamentos */}
          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="p-5 border-b border-border/50 flex items-center gap-3 bg-muted/20">
              <div className="p-2 bg-dish-leaf/10 text-dish-leaf-dark dark:text-dish-leaf rounded-lg">
                <Share2 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">Compartilhamentos Ativos</h2>
                <p className="text-xs text-muted-foreground">Grupos que você participa</p>
              </div>
            </div>

            <div className="p-0">
               {compartilhamentosMock.map((comp, idx) => (
                 <div 
                   key={comp.id} 
                   className={`flex items-center justify-between p-5 hover:bg-muted/30 cursor-pointer transition-colors ${idx !== compartilhamentosMock.length - 1 ? 'border-b border-border/50' : ''}`}
                 >
                   <div>
                     <h3 className="font-medium text-sm text-foreground">{comp.grupo}</h3>
                     <p className="text-xs text-muted-foreground mt-0.5">{comp.receitas} receitas compartilhadas</p>
                   </div>
                   <ArrowRight className="h-4 w-4 text-muted-foreground opacity-50" />
                 </div>
               ))}
               
               <div className="p-4 bg-muted/10 text-center">
                 <Button variant="link" className="text-sm h-auto p-0 text-dish-primary">
                    Ver todos os compartilhamentos
                 </Button>
               </div>
            </div>
          </div>

        </div>

        {/* Zona de Perigo / LogOut */}
        <div className="mt-4 flex justify-center md:justify-start">
          <Button variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-500/10 gap-2">
            <LogOut className="h-4 w-4" />
            Sair do DishPlan
          </Button>
        </div>

      </div>
    </>
  )
}
