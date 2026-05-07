import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GoogleButton } from "@/components/ui/google-button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import AuthLayout from "@/components/layout/AuthLayout";

const registerSchema = z.object({
  name: z.string().min(2, "Nome é obrigatório"),
  email: z.string().min(1, "E-mail é obrigatório").email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
  birthdate: z.string().min(1, "Data de nascimento é obrigatória"),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
  });

  const nextStep = async () => {
    let isValid = false;
    if (step === 1) isValid = await trigger(["name", "email"]);
    if (step === 2) isValid = await trigger("password");
    
    if (isValid) {
      setStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = (data: RegisterForm) => {
    console.log("Conta criada:", data);
    // Integração com backend para criar conta
    navigate("/");
  };

  const handleGoogleRegister = () => {
    // Integração com Google OAuth para registro
    console.log("Registrando com Google");
    navigate("/");
  };

  return (
    <AuthLayout subtitle="Junte-se ao DishPlan hoje">
      <div className="w-full bg-white md:bg-transparent rounded-3xl md:rounded-none p-2 sm:p-4 shadow-sm md:shadow-none">
        
        {/* Header Mobile / Navigation Interna */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={step > 1 ? prevStep : () => navigate("/welcome")}
            className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-full shadow-sm text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-col items-end">
            <span className="font-extrabold text-sm text-dish-primary">
              Passo {step} de {totalSteps}
            </span>
            <span className="text-xs font-medium text-slate-400">Criar conta</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-2 mb-10 overflow-hidden relative">
          <div 
            className="bg-dish-accent h-full rounded-full transition-all duration-500 ease-out absolute left-0 top-0" 
            style={{ width: `${(step / totalSteps) * 100}%` }}
          ></div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Step 1: Nome e Email */}
          <div className={step === 1 ? "block animate-in fade-in slide-in-from-right-4 duration-300" : "hidden"}>
            <h2 className="text-2xl font-extrabold mb-6 text-slate-800">Informações básicas</h2>
            <div className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-semibold text-slate-700">
                  Nome completo
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Seu nome"
                  {...register("name")}
                  className={`w-full px-5 py-3.5 sm:py-4 rounded-2xl border text-base focus:outline-none focus:ring-2 focus:ring-dish-primary/20 focus:border-dish-primary transition-all ${errors.name ? 'border-red-500' : 'border-slate-200 hover:border-slate-300 bg-slate-50 focus:bg-white'}`}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700">
                  E-mail
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  {...register("email")}
                  className={`w-full px-5 py-3.5 sm:py-4 rounded-2xl border text-base focus:outline-none focus:ring-2 focus:ring-dish-primary/20 focus:border-dish-primary transition-all ${errors.email ? 'border-red-500' : 'border-slate-200 hover:border-slate-300 bg-slate-50 focus:bg-white'}`}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>
            </div>
          </div>

          {/* Step 2: Password */}
          <div className={step === 2 ? "block animate-in fade-in slide-in-from-right-4 duration-300" : "hidden"}>
            <h2 className="text-2xl font-extrabold mb-6 text-slate-800">Crie uma senha segura</h2>
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                Senha
              </label>
              <input
                id="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                {...register("password")}
                className={`w-full px-5 py-3.5 sm:py-4 rounded-2xl border text-base focus:outline-none focus:ring-2 focus:ring-dish-primary/20 focus:border-dish-primary transition-all ${errors.password ? 'border-red-500' : 'border-slate-200 hover:border-slate-300 bg-slate-50 focus:bg-white'}`}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>
          </div>

          {/* Step 3: Birthdate */}
          <div className={step === 3 ? "block animate-in fade-in slide-in-from-right-4 duration-300" : "hidden"}>
            <h2 className="text-2xl font-extrabold mb-6 text-slate-800">Data de nascimento</h2>
            <div className="space-y-2">
              <label htmlFor="birthdate" className="block text-sm font-semibold text-slate-700">
                Sua data de nascimento
              </label>
              <input
                id="birthdate"
                type="date"
                {...register("birthdate")}
                className={`w-full px-5 py-3.5 sm:py-4 rounded-2xl border text-base focus:outline-none focus:ring-2 focus:ring-dish-primary/20 focus:border-dish-primary transition-all ${errors.birthdate ? 'border-red-500' : 'border-slate-200 hover:border-slate-300 bg-slate-50 focus:bg-white'}`}
              />
              {errors.birthdate && <p className="text-red-500 text-sm mt-1">{errors.birthdate.message}</p>}
            </div>
          </div>

          {step < totalSteps && (
            <Button 
              type="button" 
              onClick={nextStep}
              className="w-full bg-dish-primary hover:bg-dish-primary/95 text-white rounded-2xl py-6 sm:py-7 text-base font-bold transition-all active:scale-[0.98] hover:cursor-pointer mt-8"
            >
              Continuar
            </Button>
          )}

          {step === totalSteps && (
            <Button 
              type="submit" 
              className="w-full bg-dish-primary hover:bg-dish-primary/95 text-white rounded-2xl py-6 sm:py-7 text-base font-bold transition-all active:scale-[0.98] hover:cursor-pointer mt-8"
            >
              Criar conta
            </Button>
          )}

          {step === 1 && (
            <div className="mt-8 animate-in fade-in duration-500">
              <div className="relative flex items-center py-2 mb-6">
                <div className="grow border-t border-slate-200"></div>
                <span className="shrink-0 mx-4 text-slate-400 text-sm font-medium">Ou inscreva-se com</span>
                <div className="grow border-t border-slate-200"></div>
              </div>

              <GoogleButton onClick={handleGoogleRegister} />
            </div>
          )}
        </form>

        <p className="mt-10 text-center text-sm font-medium text-slate-500">
          Já tem uma conta?{" "}
          <Link to="/login" className="text-dish-accent font-bold hover:underline transition-all">
            Fazer login
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
