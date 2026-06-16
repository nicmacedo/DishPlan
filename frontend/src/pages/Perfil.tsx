import {
  Mail,
  Users,
  LogOut,
  ShieldCheck,
  Share2,
  Loader2,
  CalendarDays,
  Plus,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuthStore } from "@/stores/authStore"
import { groupsService } from "@/services/groups.service"
import { recipesService } from "@/services/recipes.service"
import { useEffect, useState } from "react"
import type { Grupo } from "@/types/groups"
import type { CompartilhamentoReceita } from "@/types/recipes"

export default function Perfil() {
  const { user, logout } = useAuthStore()
  const [grupos, setGrupos] = useState<Grupo[]>([])
  const [loadingGrupos, setLoadingGrupos] = useState(true)

  const [compartilhamentos, setCompartilhamentos] = useState<
    CompartilhamentoReceita[]
  >([])
  const [loadingCompartilhamentos, setLoadingCompartilhamentos] = useState(true)

  const [createGroupOpen, setCreateGroupOpen] = useState(false)
  const [newGroupName, setNewGroupName] = useState("")
  const [creatingGroup, setCreatingGroup] = useState(false)

  const [removingMemberId, setRemovingMemberId] = useState<number | null>(null)
  const [deletingGroupId, setDeletingGroupId] = useState<number | null>(null)

  const loadGrupos = async () => {
    try {
      const groupsResponse = await groupsService.getGroups()
      setGrupos(groupsResponse)
    } catch (err) {
      console.error("Erro ao carregar grupos:", err)
      setGrupos([])
    } finally {
      setLoadingGrupos(false)
    }
  }

  const loadCompartilhamentos = async () => {
    try {
      setLoadingCompartilhamentos(true)
      const res = await recipesService.getCompartilhamentos()

      // Extrai os dados corretamente da chave .results do DRF
      const data = Array.isArray(res.data)
        ? res.data
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        : (res.data as any).results || []

      setCompartilhamentos(data)
    } catch (err) {
      console.error("Erro ao buscar compartilhamentos", err)
    } finally {
      setLoadingCompartilhamentos(false)
    }
  }

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadGrupos()
      loadCompartilhamentos()
    }
  }, [user])

  const handleLogout = () => {
    logout()
  }

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) return
    setCreatingGroup(true)
    try {
      await groupsService.createGroup({ nome: newGroupName.trim() })
      setNewGroupName("")
      setCreateGroupOpen(false)
      loadGrupos()
    } catch (err) {
      console.error("Erro ao criar grupo:", err)
    } finally {
      setCreatingGroup(false)
    }
  }

  const handleRemoveMember = async (groupId: number, memberId: number) => {
    setRemovingMemberId(memberId)
    try {
      await groupsService.removeMember(groupId, memberId)
      loadGrupos()
    } catch (err) {
      console.error("Erro ao remover membro:", err)
    } finally {
      setRemovingMemberId(null)
    }
  }

  const handleDeleteGroup = async (groupId: number) => {
    if (
      !confirm(
        "Tem certeza que deseja excluir o grupo? Esta ação não pode ser desfeita."
      )
    )
      return

    setDeletingGroupId(groupId)
    try {
      await groupsService.deleteGroup(groupId)
      loadGrupos()
    } catch (err) {
      console.error("Erro ao excluir grupo:", err)
    } finally {
      setDeletingGroupId(null)
    }
  }

  if (!user) return null

  return (
    <>
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-4 md:p-6 lg:p-8">
        {/* Cabeçalho do Perfil */}
        <div className="flex items-center gap-5 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-dish-primary/10 text-2xl font-bold text-dish-primary">
            {user.nome.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">{user.nome}</h1>
            <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
              <Mail className="h-3.5 w-3.5" />
              {user.email}
            </p>
            {user.data_nascimento && (
              <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                <CalendarDays className="h-3.5 w-3.5" />
                {new Date(
                  user.data_nascimento + "T00:00:00"
                ).toLocaleDateString("pt-BR")}
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Seção Meus Grupos */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
                <Users className="h-5 w-5 text-dish-accent" />
                Meus Grupos
              </h2>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => setCreateGroupOpen(true)}
              >
                <Plus className="h-4 w-4" /> Novo Grupo
              </Button>
            </div>

            {loadingGrupos ? (
              <div className="flex justify-center rounded-2xl border border-border bg-card p-8 shadow-sm">
                <Loader2 className="h-6 w-6 animate-spin text-dish-primary" />
              </div>
            ) : grupos.length > 0 ? (
              grupos.map((grupo) => (
                <GroupCard
                  key={grupo.id}
                  grupo={grupo}
                  user={user}
                  onRefresh={loadGrupos}
                  onRemoveMember={(memberId) =>
                    handleRemoveMember(grupo.id, memberId)
                  }
                  onDeleteGroup={() => handleDeleteGroup(grupo.id)}
                  removingMemberId={removingMemberId}
                  deletingGroupId={deletingGroupId}
                />
              ))
            ) : (
              <div className="overflow-hidden rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
                <p className="mb-4 text-sm text-muted-foreground">
                  Você não participa de nenhum grupo ainda.
                </p>
                <Button
                  className="w-full bg-dish-primary text-white hover:bg-dish-primary/90"
                  onClick={() => setCreateGroupOpen(true)}
                  disabled={creatingGroup}
                >
                  Criar meu primeiro grupo
                </Button>
              </div>
            )}
          </div>

          {/* Sessão de Compartilhamentos Ativos */}
          <div className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
                  <Share2 className="h-5 w-5 text-dish-primary" />
                  Compartilhamentos Ativos
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Receitas pessoais que você disponibilizou para os seus grupos.
                </p>
              </div>
            </div>

            {loadingCompartilhamentos ? (
              <div className="flex justify-center py-6">
                <Loader2 className="h-6 w-6 animate-spin text-dish-primary" />
              </div>
            ) : compartilhamentos.length === 0 ? (
              <p className="rounded-xl border border-dashed p-4 text-center text-sm text-muted-foreground italic">
                Você ainda não compartilhou nenhuma receita.
              </p>
            ) : (
              <div className="grid gap-3">
                {compartilhamentos.map((comp) => (
                  <div
                    key={comp.id}
                    className="flex items-center justify-between rounded-xl border bg-muted/10 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-dish-primary/10 p-2">
                        <Share2 className="h-4 w-4 text-dish-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {comp.receita_titulo}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Compartilhado com:{" "}
                          <span className="font-medium text-foreground">
                            {comp.grupo_nome}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* (Opcional) Botão para remover o compartilhamento */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      title="Remover compartilhamento"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Zona de Perigo / LogOut */}
        <div className="mt-4 flex justify-center md:justify-start">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="gap-2 text-red-500 hover:cursor-pointer hover:bg-red-500/10 hover:text-red-600"
          >
            <LogOut className="h-4 w-4" />
            Sair do DishPlan
          </Button>
        </div>
      </div>

      {/* Modal Criar Grupo */}
      {createGroupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold text-foreground">
              Criar Novo Grupo
            </h2>
            <Input
              type="text"
              placeholder="Nome do grupo"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              className="mb-4"
              disabled={creatingGroup}
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setCreateGroupOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleCreateGroup}
                disabled={creatingGroup || !newGroupName.trim()}
                className={`bg-dish-primary text-white hover:bg-dish-primary/90 ${!newGroupName.trim() || creatingGroup ? "cursor-not-allowed opacity-50" : ""}`}
              >
                {creatingGroup && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Criar Grupo
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ── Subcomponente GroupCard ──────────────────────────────────────────────────

function GroupCard({
  grupo,
  user,
  onRefresh,
  onRemoveMember,
  onDeleteGroup,
  removingMemberId,
  deletingGroupId,
}: {
  grupo: Grupo
  user: { email: string }
  onRefresh: () => void
  onRemoveMember: (id: number) => void
  onDeleteGroup: () => void
  removingMemberId: number | null
  deletingGroupId: number | null
}) {
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteLoading, setInviteLoading] = useState(false)

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return
    setInviteLoading(true)
    try {
      await groupsService.addMember(grupo.id, inviteEmail.trim())
      setInviteEmail("")
      onRefresh()
    } catch (err) {
      console.error("Erro ao convidar membro:", err)
    } finally {
      setInviteLoading(false)
    }
  }

  const isDeletingThis = deletingGroupId === grupo.id

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border/50 bg-muted/20 p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-dish-accent/10 p-1.5 text-dish-accent">
            <Users className="h-4 w-4" />
          </div>
          <h2 className="text-sm font-semibold text-foreground">
            {grupo.nome}
          </h2>
        </div>

        {/* Botão de Excluir Grupo (Apenas para o dono) */}
        {grupo.meu_papel === "dono" && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={onDeleteGroup}
            disabled={isDeletingThis}
          >
            {isDeletingThis ? (
              <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />
            ) : (
              <Trash2 className="mr-1.5 h-3 w-3" />
            )}
            Excluir
          </Button>
        )}
      </div>

      <div className="space-y-4 p-4">
        <div className="space-y-3">
          <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
            Membros ({grupo.membros.length})
          </p>
          {grupo.membros.map((membro) => {
            const isRemovingThis = removingMemberId === membro.id
            const canRemove =
              // Dono pode remover qualquer membro (exceto a si mesmo, o dono nunca pode ser removido, só excluindo o grupo)
              (grupo.meu_papel === "dono" && membro.papel !== "dono") ||
              // Membro comum pode sair do grupo
              (membro.email === user.email && membro.papel !== "dono")

            return (
              <div
                key={membro.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-muted-foreground uppercase">
                    {membro.nome ? membro.nome.charAt(0) : "U"}
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {membro.nome}{" "}
                    {membro.email === user.email && (
                      <span className="font-normal text-muted-foreground">
                        (Você)
                      </span>
                    )}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {membro.papel === "dono" && (
                    <span className="flex items-center gap-1 rounded-full bg-dish-primary/10 px-2 py-0.5 text-[10px] font-bold tracking-wider text-dish-primary uppercase">
                      <ShieldCheck className="h-3 w-3" /> Dono
                    </span>
                  )}

                  {canRemove && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => onRemoveMember(membro.id)}
                      disabled={isRemovingThis}
                      title={
                        membro.email === user.email
                          ? "Sair do grupo"
                          : "Remover membro"
                      }
                    >
                      {isRemovingThis ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Trash2 className="h-3 w-3" />
                      )}
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Formulário de Convite (Apenas dono) */}
        {grupo.meu_papel === "dono" && (
          <div className="border-t border-border/50 pt-3">
            <p className="mb-2 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
              Convidar Membro
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="E-mail"
                className="h-8 text-xs"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                disabled={inviteLoading}
              />
              <Button
                size="sm"
                className="h-8 bg-dish-primary text-xs text-white hover:bg-dish-primary/90 disabled:opacity-50"
                onClick={handleInvite}
                disabled={inviteLoading || !inviteEmail.trim()}
              >
                {inviteLoading ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  "Enviar"
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
