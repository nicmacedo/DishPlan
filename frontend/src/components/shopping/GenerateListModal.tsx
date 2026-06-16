import { useEffect, useMemo, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  AlertCircle,
  CalendarDays,
  Loader2,
  ShoppingCart,
  Sparkles,
} from "lucide-react"
import { planningService } from "@/services/planning.service"
import { shoppingService } from "@/services/shopping.service"

interface GenerateListModalProps {
  open: boolean
  onClose: () => void
  onSuccess: (novaListaId: number) => void
}

interface PlanoSemanalOption {
  id: number
  semana_referencia: string
}

function formatDateBr(date: string): string {
  return date.split("-").reverse().join("/")
}

function normalizePlanosResponse(data: unknown): PlanoSemanalOption[] {
  if (Array.isArray(data)) {
    return data as PlanoSemanalOption[]
  }

  if (
    data &&
    typeof data === "object" &&
    "results" in data &&
    Array.isArray((data as { results?: unknown }).results)
  ) {
    return (data as { results: PlanoSemanalOption[] }).results
  }

  return []
}

export default function GenerateListModal({
  open,
  onClose,
  onSuccess,
}: GenerateListModalProps) {
  const [planos, setPlanos] = useState<PlanoSemanalOption[]>([])
  const [selectedPlano, setSelectedPlano] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const planosOrdenados = useMemo(() => {
    return [...planos].sort(
      (a, b) =>
        new Date(b.semana_referencia).getTime() -
        new Date(a.semana_referencia).getTime()
    )
  }, [planos])

  const selectedPlanoData = useMemo(() => {
    return planos.find((plano) => plano.id.toString() === selectedPlano)
  }, [planos, selectedPlano])

  useEffect(() => {
    let isMounted = true

    const loadPlanos = async () => {
      setLoading(true)
      setError(null)

      try {
        const res = await planningService.getPlanos()
        const data = normalizePlanosResponse(res.data)

        const sortedData = [...data].sort(
          (a, b) =>
            new Date(b.semana_referencia).getTime() -
            new Date(a.semana_referencia).getTime()
        )

        if (isMounted) {
          setPlanos(sortedData)

          if (sortedData.length > 0) {
            setSelectedPlano(sortedData[0].id.toString())
          }
        }
      } catch (err) {
        console.error("Erro ao carregar planos semanais", err)

        if (isMounted) {
          setError("Erro ao carregar os planos semanais. Tente novamente.")
          setPlanos([])
          setSelectedPlano("")
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    if (open) {
      loadPlanos()
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedPlano("")
      setError(null)
    }

    return () => {
      isMounted = false
    }
  }, [open])

  const handleClose = () => {
    if (generating) return

    setSelectedPlano("")
    setError(null)
    onClose()
  }

  const handleGenerate = async () => {
    if (!selectedPlano || generating) return

    setGenerating(true)
    setError(null)

    try {
      const res = await shoppingService.gerarLista(Number(selectedPlano))

      onSuccess(res.data.id)
      setSelectedPlano("")
      onClose()
    } catch (err) {
      console.error("Erro ao gerar lista", err)
      setError("Erro ao gerar lista automática. Tente novamente.")
    } finally {
      setGenerating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(value) => !value && handleClose()}>
      <DialogContent className="max-h-[90dvh] w-[calc(100vw-1rem)] max-w-170! overflow-x-hidden overflow-y-auto rounded-2xl p-5 sm:w-[calc(100vw-2rem)] sm:p-6">
        <DialogHeader className="space-y-2 pr-6">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold sm:text-2xl">
            <Sparkles className="h-5 w-5 shrink-0 text-dish-primary" />
            <span className="wrap-break-word">Gerar Lista Automática</span>
          </DialogTitle>

          <DialogDescription className="text-sm leading-relaxed">
            Selecione o plano semanal que servirá de base. O sistema vai somar
            os ingredientes e gerar sua lista de compras automaticamente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {loading ? (
            <div className="flex min-h-36 flex-col items-center justify-center gap-3 rounded-xl border bg-muted/20 p-6 text-center">
              <Loader2 className="h-6 w-6 animate-spin text-dish-primary" />
              <p className="text-sm text-muted-foreground">
                Carregando planos semanais...
              </p>
            </div>
          ) : error ? (
            <div className="flex gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p>{error}</p>
            </div>
          ) : planos.length === 0 ? (
            <div className="flex min-h-36 flex-col items-center justify-center gap-2 rounded-xl border bg-muted/20 p-6 text-center">
              <ShoppingCart className="h-8 w-8 text-muted-foreground/70" />

              <p className="text-sm font-medium text-foreground">
                Nenhum plano semanal encontrado.
              </p>

              <p className="max-w-sm text-xs text-muted-foreground">
                Crie um cardápio semanal antes de gerar uma lista automática de
                compras.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-muted-foreground">
                  Plano semanal
                </span>

                <Select
                  value={selectedPlano}
                  onValueChange={setSelectedPlano}
                  disabled={generating}
                >
                  <SelectTrigger className="h-11 w-full min-w-0 rounded-xl bg-background px-3">
                    <div className="flex min-w-0 items-center gap-2">
                      <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <SelectValue placeholder="Selecione a semana..." />
                    </div>
                  </SelectTrigger>

                  <SelectContent className="max-h-80 w-(--radix-select-trigger-width)">
                    {planosOrdenados.map((plano, index) => (
                      <SelectItem
                        key={plano.id}
                        value={plano.id.toString()}
                        textValue={`Semana ${formatDateBr(
                          plano.semana_referencia
                        )}`}
                        className="cursor-pointer"
                      >
                        <div className="flex flex-col py-1">
                          <span className="text-sm font-medium">
                            Semana: {formatDateBr(plano.semana_referencia)}
                          </span>

                          <span className="text-xs text-muted-foreground">
                            {index === 0
                              ? "Plano mais recente"
                              : "Plano alimentar"}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedPlanoData && (
                <div className="rounded-xl border border-dish-primary/30 bg-dish-primary/10 p-3 text-sm">
                  <span className="font-semibold text-foreground">
                    Lista baseada em:
                  </span>{" "}
                  <span className="text-muted-foreground">
                    Semana de{" "}
                    {formatDateBr(selectedPlanoData.semana_referencia)}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col-reverse gap-2 border-t pt-4 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={generating}
            className="w-full sm:w-auto"
          >
            Cancelar
          </Button>

          <Button
            type="button"
            onClick={handleGenerate}
            disabled={
              !selectedPlano || generating || loading || planos.length === 0
            }
            className="w-full bg-dish-primary text-white hover:bg-dish-primary/90 sm:w-auto"
          >
            {generating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Gerar Lista
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
