import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { GoogleButton } from "@/components/ui/google-button"
import { DatePicker } from "@/components/ui/date-picker"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  ChevronLeft,
  User,
  Mail,
  Lock,
  Calendar,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
} from "lucide-react"
import AuthLayout from "@/components/layout/AuthLayout"
import { cn } from "@/lib/utils"
import { useGoogleLogin } from "@react-oauth/google"
import { AuthService } from "@/services/auth.service"
import { useAuthStore } from "@/stores/authStore"

const registerSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().min(1, "E-mail é obrigatório").email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
  birthdate: z.string().min(1, "Data de nascimento é obrigatória"),
})

type RegisterForm = z.infer<typeof registerSchema>

const steps = [
  {
    id: 1,
    title: "Sobre você",
    description: "Como devemos te chamar?",
    icon: User,
  },
  {
    id: 2,
    title: "Acesso seguro",
    description: "Crie uma senha forte",
    icon: Lock,
  },
  {
    id: 3,
    title: "Quase lá!",
    description: "Só mais um detalhe",
    icon: Calendar,
  },
]

export default function Register() {
  const navigate = useNavigate()
  const loginStore = useAuthStore((state) => state.login)
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const totalSteps = steps.length

  const {
    register,
    handleSubmit,
    trigger,
    control,
    formState: { errors, dirtyFields, touchedFields },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: { name: "", email: "", password: "", birthdate: "" },
  })

  const nextStep = async () => {
    let isValid = false
    if (step === 1) isValid = await trigger(["name", "email"])
    if (step === 2) isValid = await trigger("password")
    if (isValid) setStep((prev) => Math.min(prev + 1, totalSteps))
  }

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1))

  const onSubmit = async (data: RegisterForm) => {
    try {
      setIsLoading(true)
      setAuthError(null)
      await AuthService.register({
        email: data.email,
        nome: data.name,
        password: data.password,
        data_nascimento: data.birthdate,
      })
      const tokens = await AuthService.login({ email: data.email, password: data.password })
      const user = await AuthService.getProfile()
      loginStore(tokens, user)
      navigate("/")
    } catch (error) {
      const err = error as { response?: { data?: Record<string, string[]> } }
      const firstError = err.response?.data
        ? Object.values(err.response.data).flat()[0]
        : null
      setAuthError(firstError || "Erro ao criar conta. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleRegister = useGoogleLogin({
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

  const currentStep = steps[step - 1]
  const StepIcon = currentStep.icon

  return (
    <AuthLayout subtitle="Junte-se ao DishPlan hoje" panelTitle="Criar conta">
      <div className="mt-8 animate-[fadeUp_0.5s_ease-out_forwards] sm:mt-0">
        {/* ── Cabeçalho de Navegação ── */}
        <div className="mb-6 flex items-center justify-between">
          <button
            type="button"
            onClick={step > 1 ? prevStep : () => navigate("/welcome")}
            className={cn(
              "flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl transition-all duration-200",
              "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground",
              "border border-border"
            )}
            aria-label="Voltar"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* Step indicators */}
          <div className="flex items-center gap-1.5">
            {steps.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => s.id < step && setStep(s.id)}
                className={cn(
                  "rounded-full transition-all duration-300",
                  s.id === step
                    ? "h-2 w-6 bg-dish-primary dark:bg-dish-leaf"
                    : s.id < step
                      ? "h-2 w-2 cursor-pointer bg-dish-leaf"
                      : "h-2 w-2 cursor-default bg-muted"
                )}
              />
            ))}
          </div>

          <span className="text-xs font-semibold text-muted-foreground tabular-nums">
            {step}/{totalSteps}
          </span>
        </div>

        {/* ── Cabeçalho do Step ── */}
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-dish-primary/10 dark:bg-dish-leaf/15">
            <StepIcon className="h-5 w-5 text-dish-primary dark:text-dish-leaf" />
          </div>
          <div>
            <h2 className="text-xl leading-tight font-extrabold text-foreground">
              {currentStep.title}
            </h2>
            <p className="text-sm text-muted-foreground">
              {currentStep.description}
            </p>
          </div>
        </div>

        {/* ── Formulário ── */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
          noValidate
        >
          {/* Step 1 — Nome e Email */}
          {step === 1 && (
            <div className="animate-[slideInRight_0.3s_ease-out] space-y-5">
              {/* Nome */}
              <div className="space-y-1.5">
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-foreground/80"
                >
                  Nome completo
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="name"
                    type="text"
                    placeholder="Seu nome"
                    autoComplete="name"
                    {...register("name")}
                    className={cn(
                      "w-full rounded-xl border py-3.5 pr-4 pl-11 text-sm font-medium transition-all duration-200",
                      "bg-muted/50 placeholder:text-muted-foreground/60",
                      "focus:bg-background focus:ring-2 focus:outline-none",
                      errors.name
                        ? "border-destructive/60 focus:border-destructive focus:ring-destructive/20"
                        : dirtyFields.name && !errors.name
                          ? "border-dish-leaf/70 focus:border-dish-primary focus:ring-dish-primary/20"
                          : "border-border hover:border-border/80 focus:border-dish-primary focus:ring-dish-primary/20"
                    )}
                  />
                  {dirtyFields.name && !errors.name && (
                    <CheckCircle2 className="absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2 text-dish-leaf" />
                  )}
                </div>
                {errors.name && (
                  <p className="animate-[fadeUp_0.2s_ease-out] text-xs font-medium text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
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
                    <CheckCircle2 className="absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2 text-dish-leaf" />
                  )}
                </div>
                {errors.email && (
                  <p className="animate-[fadeUp_0.2s_ease-out] text-xs font-medium text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step 2 — Senha */}
          {step === 2 && (
            <div className="animate-[slideInRight_0.3s_ease-out] space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-foreground/80"
                >
                  Senha
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mínimo 6 caracteres"
                    autoComplete="new-password"
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
                  <p className="animate-[fadeUp_0.2s_ease-out] text-xs font-medium text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Indicador de força da senha */}
              <div className="space-y-2 rounded-xl border border-border bg-muted/60 p-4">
                <p className="text-xs font-semibold text-muted-foreground">
                  Sua senha deve conter:
                </p>
                {[
                  "Pelo menos 6 caracteres",
                  "Letras e números (recomendado)",
                  "Um caractere especial (recomendado)",
                ].map((tip) => (
                  <div key={tip} className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-dish-leaf/70" />
                    <span className="text-xs text-muted-foreground">{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3 — Data de Nascimento */}
          {step === 3 && (
            <div className="animate-[slideInRight_0.3s_ease-out] space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="birthdate"
                  className="block text-sm font-semibold text-foreground/80"
                >
                  Data de nascimento
                </label>

                {/* DatePicker via Controller para integração com react-hook-form */}
                <div className="relative">
                  <Controller
                    name="birthdate"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        id="birthdate"
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        hasError={
                          !!errors.birthdate && !!touchedFields.birthdate
                        }
                        fromYear={1900}
                        toYear={new Date().getFullYear() - 5}
                      />
                    )}
                  />
                </div>

                {errors.birthdate && (
                  <p className="animate-[fadeUp_0.2s_ease-out] text-xs font-medium text-destructive">
                    {errors.birthdate.message}
                  </p>
                )}
              </div>

              {/* Aviso de privacidade */}
              <p className="rounded-xl border border-border bg-muted/60 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
                🔒 Seus dados pessoais são protegidos e nunca serão
                compartilhados com terceiros.
              </p>
            </div>
          )}

          {/* ── Botão de Ação ── */}
          {authError && (
            <p className="animate-[fadeUp_0.2s_ease-out] text-sm font-medium text-center text-destructive">
              {authError}
            </p>
          )}

          {step < totalSteps ? (
            <Button
              type="button"
              onClick={nextStep}
              className={cn(
                "mt-6 w-full rounded-xl py-6 text-sm font-bold tracking-wide transition-all duration-200",
                "bg-dish-primary text-white hover:bg-dish-primary/90",
                "shadow-[0_4px_16px_rgba(24,70,66,0.3)] hover:shadow-[0_6px_24px_rgba(24,70,66,0.4)]",
                "group flex items-center justify-center gap-2 hover:cursor-pointer active:scale-[0.98]"
              )}
            >
              Continuar
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isLoading}
              className={cn(
                "mt-6 w-full rounded-xl py-6 text-sm font-bold tracking-wide transition-all duration-200",
                "bg-dish-accent text-white hover:bg-dish-accent/90",
                "shadow-[0_4px_16px_rgba(212,163,69,0.35)] hover:shadow-[0_6px_24px_rgba(212,163,69,0.5)]",
                "group flex items-center justify-center gap-2 hover:cursor-pointer active:scale-[0.98]",
                "disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
              )}
            >
              {isLoading ? "Criando conta..." : "Criar minha conta 🎉"}
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Button>
          )}

          {/* Divisor + Google */}
          {step === 1 && (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    ou inscreva-se com
                  </span>
                </div>
              </div>

              <GoogleButton onClick={() => handleGoogleRegister()} />
            </>
          )}
        </form>

        {/* Rodapé */}
        <p className="mt-8 text-center text-sm font-medium text-muted-foreground">
          Já tem uma conta?{" "}
          <Link
            to="/login"
            className="font-bold text-dish-primary transition-all hover:underline dark:text-dish-leaf"
          >
            Fazer login
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
