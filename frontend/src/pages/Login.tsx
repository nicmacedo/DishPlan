import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GoogleButton } from "@/components/ui/google-button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthLayout from "@/components/layout/AuthLayout";

const loginSchema = z.object({
  email: z.string().min(1, "E-mail é obrigatório").email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginForm) => {
    console.log("Login submetido:", data);
    // Integração com backend para autenticação
    navigate("/");
  };

  const handleGoogleLogin = () => {
    // Integração com Google OAuth para login
    console.log("Login com Google");
    navigate("/");
  };

  return (
    <AuthLayout subtitle="Bem-vindo de volta!">
      <div className="w-full bg-white md:bg-transparent rounded-3xl md:rounded-none p-2 sm:p-4 shadow-sm md:shadow-none">
        <div className="text-center md:text-left mb-8 md:mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-2 text-slate-800">Login</h2>
          <p className="text-slate-500 text-sm sm:text-base">Entre com sua conta para continuar</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">
          <div className="space-y-2 sm:space-y-3">
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

          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                Senha
              </label>
              <a href="#" className="text-sm text-dish-primary font-bold hover:text-dish-primary/80 transition-colors">
                Esqueceu a senha?
              </a>
            </div>
            <input
              id="password"
              type="password"
              {...register("password")}
              className={`w-full px-5 py-3.5 sm:py-4 rounded-2xl border text-base focus:outline-none focus:ring-2 focus:ring-dish-primary/20 focus:border-dish-primary transition-all ${errors.password ? 'border-red-500' : 'border-slate-200 hover:border-slate-300 bg-slate-50 focus:bg-white'}`}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <Button 
            type="submit" 
            className="w-full bg-dish-primary hover:bg-dish-primary/95 text-white rounded-2xl py-6 sm:py-7 text-base font-bold transition-all active:scale-[0.98] hover:cursor-pointer mt-2"
          >
            Entrar
          </Button>

          <div className="relative flex items-center py-2 mt-6">
            <div className="grow border-t border-slate-200"></div>
            <span className="shrink-0 mx-4 text-slate-400 text-sm font-medium">Ou continue com</span>
            <div className="grow border-t border-slate-200"></div>
          </div>

          <GoogleButton onClick={handleGoogleLogin} />
        </form>

        <p className="mt-10 text-center text-sm font-medium text-slate-500">
          Não tem uma conta?{" "}
          <Link to="/register" className="text-dish-accent font-bold hover:underline transition-all">
            Criar conta
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
