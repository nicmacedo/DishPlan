// ── Helpers ──────────────────────────────────────────────────────────────────

import type { Refeicao } from "@/types/planning"

export function getWeekMonday(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  d.setDate(d.getDate() + (day === 0 ? -6 : 1 - day))
  d.setHours(0, 0, 0, 0)
  return d
}

export function toLocalISODate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

export const JS_DAY_TO_API: Record<number, Refeicao["dia_da_semana"]> = {
  0: "domingo",
  1: "segunda",
  2: "terca",
  3: "quarta",
  4: "quinta",
  5: "sexta",
  6: "sabado",
}

export const CAT_INGREDIENTES: Record<string, string> = {
  carnes:        "Carnes",
  hortifruti:    "Hortifrúti",
  laticinios:    "Laticínios",
  graos_cereais: "Grãos e Cereais",
  temperos:      "Temperos e Condimentos",
  bebidas:       "Bebidas",
  padaria:       "Padaria",
  enlatados:     "Enlatados e Conservas",
  congelados:    "Congelados",
  doces:         "Doces e Sobremesas",
  outros:        "Outros",
}