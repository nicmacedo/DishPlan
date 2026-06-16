import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Edit2, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ItemCompra } from "@/types/api"

interface ShoppingListItemProps {
  item: ItemCompra
  onToggle: (id: number, currentStatus: boolean) => void
  onEdit: (item: ItemCompra) => void
  onDelete: (id: number) => void
}

export default function ShoppingListItem({
  item,
  onToggle,
  onEdit,
  onDelete,
}: ShoppingListItemProps) {
  const nomeDisplay =
    item.nome_display || item.ingrediente_nome || item.nome_manual

  return (
    <div
      className={cn(
        "group flex items-center gap-3 rounded-xl border p-3.5 transition-all",
        item.comprado
          ? "border-border bg-muted/40 opacity-60 shadow-sm"
          : "border-border/80 bg-card shadow-sm hover:border-dish-primary/50"
      )}
    >
      <Checkbox
        checked={item.comprado}
        onCheckedChange={() => onToggle(item.id, item.comprado)}
        className={cn(
          "h-5 w-5 cursor-pointer rounded-md transition-colors",
          item.comprado &&
            "data-[state=checked]:border-muted-foreground data-[state=checked]:bg-muted-foreground"
        )}
      />

      <div
        className="min-w-0 flex-1 cursor-pointer"
        onClick={() => onToggle(item.id, item.comprado)}
      >
        <p
          className={cn(
            "truncate text-sm font-semibold transition-all duration-200",
            item.comprado
              ? "text-muted-foreground line-through"
              : "text-foreground"
          )}
        >
          {nomeDisplay}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {item.quantidade} {item.unidade}
        </p>
      </div>

      {/* Botões de Ação Avulsa */}
      <div className="flex shrink-0 items-center gap-1 opacity-60 transition-opacity group-hover:opacity-100">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:bg-dish-primary/10 hover:text-dish-primary"
          onClick={() => onEdit(item)}
          title="Editar item"
        >
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          onClick={() => onDelete(item.id)}
          title="Excluir item"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
