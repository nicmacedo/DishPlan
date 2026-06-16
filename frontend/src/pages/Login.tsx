import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { GoogleButton } from "@/components/ui/google-button"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react"
import AuthLayout from "@/components/layout/AuthLayout"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useGoogleLogin } from "@react-oauth/google"
import { AuthService } from "@/services/auth.service"
import { useAuthStore } from "@/stores/authStore"

const loginSchema = z.object({
  email: z.string().min(1, "E-mail é obrigatório").email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
})

type LoginForm = z.infer<typeof loginSchema>

export default function Login() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const loginStore = useAuthStore((state) => state.login)
  const [isLoading, setIsLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, dirtyFields },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  })

  const onSubmit = async (data: LoginForm) => {
    try {
      setIsLoading(true)
      setAuthError(null)
      
      const tokens = await AuthService.login({
        email: data.email,
        password: data.password
      })
      
      useAuthStore.getState().setTokens(tokens)
      
      const user = await AuthService.getProfile()
      loginStore(tokens, user)
      
      navigate("/")
    } catch (error) {
      console.error("Erro no login:", error)
      const err = error as { response?: { data?: { detail?: string } } };
      setAuthError(err.response?.data?.detail || "Erro ao fazer login. Verifique suas credenciais.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async ({ code }) => {
      try {
        setIsLoading(true)
        setAuthError(null)
        const { user, ...tokens } = await AuthService.googleLogin(code)
        loginStore(tokens, user)
        navigate("/")
      } catch {
        setAuthError("Não foi possível entrar com Google. Tente novamente.")
      } finally {
        setIsLoading(false)
      }
    },
    onError: () => setAuthError("Login com Google cancelado ou falhou."),
  })

  return (
    <AuthLayout subtitle="Bem-vindo de volta!" panelTitle="Entre na sua conta">
      <div className="animate-[fadeUp_0.5s_ease-out_forwards]">
        {/* Cabeçalho do formulário */}
        <div className="mb-8">
          <h2 className="mb-2 text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
            Olá, de volta! 👋
          </h2>
          <p className="text-sm text-muted-foreground">
            Entre com suas credenciais para continuar
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
          noValidate
        >
          {/* Campo E-mail */}
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-foreground/80"
            >
              E-mail
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="email"
                type="email"
                placeholder="seu@email.com"
                autoComplete="email"
                {...register("email")}
                className={cn(
                  "w-full rounded-xl border py-3.5 pr-4 pl-11 text-sm font-medium transition-all duration-200",
                  "bg-muted/50 placeholder:text-muted-foreground/60",
                  "focus:bg-background focus:ring-2 focus:outline-none",
                  errors.email
                    ? "border-destructive/60 focus:border-destructive focus:ring-destructive/20"
                    : dirtyFields.email && !errors.email
                      ? "border-dish-leaf/70 focus:border-dish-primary focus:ring-dish-primary/20"
                      : "border-border hover:border-border/80 focus:border-dish-primary focus:ring-dish-primary/20"
                )}
              />
              {dirtyFields.email && !errors.email && (
                <span className="absolute top-1/2 right-4 -translate-y-1/2 text-xs font-bold text-dish-leaf">
                  ✓
                </span>
              )}
            </div>
            {errors.email && (
              <p className="mt-1 animate-[fadeUp_0.2s_ease-out] text-xs font-medium text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Campo Senha */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-foreground/80"
              >
                Senha
              </label>
              <a
                href="#"
                className="text-xs font-semibold text-dish-primary transition-all hover:underline dark:text-dish-leaf"
              >
                Esqueceu a senha?
              </a>
            </div>
            <div className="relative">
              <Lock className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="current-password"
                {...register("password")}
                className={cn(
                  "w-full rounded-xl border py-3.5 pr-12 pl-11 text-sm font-medium transition-all duration-200",
                  "bg-muted/50 placeholder:text-muted-foreground/60",
                  "focus:bg-background focus:ring-2 focus:outline-none",
                  errors.password
                    ? "border-destructive/60 focus:border-destructive focus:ring-destructive/20"
                    : "border-border hover:border-border/80 focus:border-dish-primary focus:ring-dish-primary/20"
                )}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 right-4 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 animate-[fadeUp_0.2s_ease-out] text-xs font-medium text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>
          
          {authError && (
            <p className="animate-[fadeUp_0.2s_ease-out] text-sm font-medium text-center text-destructive">
              {authError}
            </p>
          )}

          {/* Botão de login */}
          <Button
            type="submit"
            disabled={!isValid || isLoading}
            className={cn(
              "mt-2 w-full rounded-xl py-6 text-sm font-bold tracking-wide transition-all duration-200",
              "bg-dish-primary text-white hover:bg-dish-primary/90",
              "shadow-[0_4px_16px_rgba(24,70,66,0.3)] hover:shadow-[0_6px_24px_rgba(24,70,66,0.4)]",
              "active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none",
              "group flex items-center justify-center gap-2 hover:cursor-pointer"
            )}
          >
            Entrar
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Button>

          {/* Divisor */}
          <div className="relative flex items-center py-1">
            <div className="grow border-t border-border" />
            <span className="mx-4 shrink-0 text-xs font-medium text-muted-foreground">
              ou continue com
            </span>
            <div className="grow border-t border-border" />
          </div>

          {/* Google */}
          <GoogleButton onClick={() => handleGoogleLogin()} />
        </form>

        {/* Rodapé */}
        <p className="mt-8 text-center text-sm font-medium text-muted-foreground">
          Não tem uma conta?{" "}
          <Link
            to="/register"
            className="font-bold text-dish-primary transition-all hover:underline dark:text-dish-leaf"
          >
            Criar conta grátis
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
