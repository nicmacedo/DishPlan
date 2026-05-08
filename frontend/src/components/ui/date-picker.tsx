import * as React from "react"
import { format, isValid, parse } from "date-fns"
import { ptBR } from "date-fns/locale"
import { DayPicker } from "react-day-picker"
import { Calendar, ChevronLeft, ChevronRight, X } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface DatePickerProps {
  /** Valor atual no formato "YYYY-MM-DD" */
  value?: string
  onChange: (value: string) => void
  onBlur?: () => void
  hasError?: boolean
  placeholder?: string
  id?: string
  fromYear?: number
  toYear?: number
}

export function DatePicker({
  value,
  onChange,
  onBlur,
  hasError,
  placeholder = "Selecione sua data de nascimento",
  id,
  fromYear = 1900,
  toYear = new Date().getFullYear(),
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  // Converte a string "YYYY-MM-DD" para objeto Date
  const selectedDate = React.useMemo(() => {
    if (!value) return undefined
    const parsed = parse(value, "yyyy-MM-dd", new Date())
    return isValid(parsed) ? parsed : undefined
  }, [value])

  const handleDaySelect = (day: Date | undefined) => {
    if (!day) {
      onChange("")
      return
    }
    onChange(format(day, "yyyy-MM-dd"))
    setOpen(false)
    onBlur?.()
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange("")
    onBlur?.()
  }

  const defaultMonth = selectedDate ?? new Date(toYear - 18, 0) // default: ~18 anos atrás

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          id={id}
          type="button"
          onBlur={onBlur}
          aria-haspopup="dialog"
          aria-expanded={open}
          className={cn(
            "flex w-full items-center gap-3 rounded-xl border py-3.5 pr-4 pl-11 text-sm font-medium",
            "cursor-pointer text-left transition-all duration-200",
            "bg-muted/50 focus:bg-background focus:ring-2 focus:outline-none",
            hasError
              ? "border-destructive/60 focus:border-destructive focus:ring-destructive/20"
              : open
                ? "border-dish-primary bg-background ring-2 ring-dish-primary/20 dark:border-dish-leaf"
                : "border-border hover:border-border/80 focus:border-dish-primary focus:ring-dish-primary/20"
          )}
        >
          {/* Ícone do calendário */}
          <Calendar
            className={cn(
              "pointer-events-none absolute left-4 h-4 w-4 transition-colors",
              open
                ? "text-dish-primary dark:text-dish-leaf"
                : "text-muted-foreground"
            )}
          />

          {/* Texto do valor ou placeholder */}
          <span
            className={cn(
              "flex-1",
              selectedDate ? "text-foreground" : "text-muted-foreground/60"
            )}
          >
            {selectedDate
              ? format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
              : placeholder}
          </span>

          {/* Botão de limpar */}
          {selectedDate && (
            <span
              role="button"
              onClick={handleClear}
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Limpar data"
            >
              <X className="h-3.5 w-3.5" />
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="w-auto overflow-hidden rounded-2xl border-border p-0 shadow-xl"
        align="start"
        sideOffset={6}
      >
        <DayPicker
          mode="single"
          locale={ptBR}
          selected={selectedDate}
          onSelect={handleDaySelect}
          defaultMonth={defaultMonth}
          captionLayout="dropdown"
          fromYear={fromYear}
          toYear={toYear}
          classNames={{
            root: "p-4",
            months: "flex flex-col",
            month: "space-y-3",
            month_caption: "flex items-center justify-between mb-2 px-1",
            caption_label: "hidden",
            dropdowns: "flex items-center gap-2",
            dropdown: cn(
              "flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1 text-sm font-semibold",
              "border border-border bg-muted/60 hover:bg-muted",
              "text-foreground focus:ring-2 focus:ring-dish-primary/30 focus:outline-none"
            ),
            nav: "flex items-center gap-1 mb-2",
            button_previous: cn(
              "flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-150",
              "border border-border bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
            ),
            button_next: cn(
              "flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-150",
              "border border-border bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
            ),
            weeks: "space-y-1",
            weekdays: "grid grid-cols-7 mb-1",
            weekday:
              "text-center text-[11px] font-semibold text-muted-foreground py-1",
            week: "grid grid-cols-7",
            day: cn("relative flex items-center justify-center p-0"),
            day_button: cn(
              "flex h-9 w-9 items-center justify-center rounded-xl text-sm font-medium",
              "cursor-pointer transition-all duration-150",
              "hover:bg-dish-primary/10 dark:hover:bg-dish-leaf/15",
              "hover:text-dish-primary dark:hover:text-dish-leaf",
              "focus:ring-2 focus:ring-dish-primary/30 focus:outline-none"
            ),
            selected:
              "bg-dish-primary! text-white! rounded-xl [&>button]:text-white [&>button]:bg-dish-primary [&>button]:hover:bg-dish-primary/90 [&>button]:shadow-dish",
            today:
              "[&>button]:font-extrabold [&>button]:text-dish-primary dark:[&>button]:text-dish-leaf",
            outside: "opacity-40",
            disabled: "opacity-30 cursor-not-allowed",
            range_start: "rounded-l-xl",
            range_end: "rounded-r-xl",
          }}
          components={{
            Chevron: ({ orientation }) =>
              orientation === "left" ? (
                <ChevronLeft className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              ),
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
