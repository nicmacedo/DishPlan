/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, Share2 } from "lucide-react"
import { api } from "@/lib/axios"
import { recipesService } from "@/services/recipes.service"

interface ShareRecipeModalProps {
  open: boolean
  onClose: () => void
  recipeId: number
  recipeTitle: string
}

export default function ShareRecipeModal({
  open,
  onClose,
  recipeId,
  recipeTitle,
}: ShareRecipeModalProps) {
  const [grupos, setGrupos] = useState<any[]>([])
  const [selectedGrupo, setSelectedGrupo] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [sharing, setSharing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Busca os grupos do usuário sempre que o modal abrir
  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(true)
      setError(null)
      api
        .get("/api/grupos/")
        .then((res) => {
          const data = Array.isArray(res.data)
            ? res.data
            : (res.data as any).results || []
          setGrupos(data)
        })
        .catch((err) => {
          console.error("Erro ao buscar grupos", err)
          setError("Não foi possível carregar seus grupos.")
        })
        .finally(() => setLoading(false))
    } else {
      setSelectedGrupo("")
    }
  }, [open])

  const handleShare = async () => {
    if (!selectedGrupo) return
    try {
      setSharing(true)
      setError(null)

      await recipesService.createCompartilhamento({
        receita: recipeId,
        grupo: Number(selectedGrupo),
      } as any)

      onClose()
    } catch (err: any) {
      console.error("Erro ao compartilhar", err)

      // Captura o erro específico de duplicidade do Django (unique_together)
      if (err.response?.data?.non_field_errors) {
        setError("Esta receita já está compartilhada com este grupo!")
      }
      // Captura outros erros genéricos da API
      else {
        setError(
          err.response?.data?.detail ||
            "Erro ao compartilhar a receita. Tente novamente."
        )
      }
    } finally {
      setSharing(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="rounded-2xl sm:max-w-100">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-dish-primary" />
            Compartilhar Receita
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            Compartilhando:{" "}
            <span className="font-semibold text-foreground">{recipeTitle}</span>
          </p>

          {loading ? (
            <div className="flex justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-dish-primary" />
            </div>
          ) : grupos.length === 0 ? (
            <p className="text-sm font-semibold text-destructive">
              Você não pertence a nenhum grupo no momento.
            </p>
          ) : (
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Selecione o grupo destino:
              </label>
              <Select value={selectedGrupo} onValueChange={setSelectedGrupo}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um grupo..." />
                </SelectTrigger>
                <SelectContent>
                  {grupos.map((g) => (
                    <SelectItem key={g.id} value={g.id.toString()}>
                      {g.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={sharing}>
            Cancelar
          </Button>
          <Button
            onClick={handleShare}
            disabled={!selectedGrupo || sharing || grupos.length === 0}
            className="bg-dish-primary text-white hover:bg-dish-primary/90"
          >
            {sharing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Compartilhar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
