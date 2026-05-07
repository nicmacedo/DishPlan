import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-dish-primary px-6 py-12 font-sans text-white text-center relative overflow-hidden">
      {/* Background Decorativo */}
      <div className="absolute top-1/4 left-0 w-full h-full opacity-10 pointer-events-none">
        <svg viewBox="0 0 1000 1000" className="w-full h-full absolute scale-150 -translate-x-12 translate-y-24">
          <path d="M0,500 Q250,700 500,500 T1000,500 L1000,1000 L0,1000 Z" fill="currentColor"/>
        </svg>
      </div>

      <div className="flex-1 flex flex-col md:flex-row items-center justify-center w-full max-w-4xl relative z-10 gap-12 md:gap-4 px-4">
        {/* Lado Esquerdo no Desktop / Superior no Mobile */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left flex-1">
          <div className="w-28 h-28 md:w-36 md:h-36 bg-white rounded-xl flex items-center justify-center mb-8 shadow-2xl p-2">
            <img 
              src="/logo-default.png" 
              alt="DishPlan Logo" 
              className="w-full h-full object-contain rounded-xl"
            />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4">DishPlan</h1>
          <p className="text-dish-leaf text-lg md:text-xl md:mb-0 mb-4 max-w-xs">
            Sua vida na cozinha,<br/> organizadamente deliciosa.
          </p>
        </div>

        {/* Lado Direito no Desktop / Inferior no Mobile */}
        <div className="w-full max-w-sm space-y-4 flex-1">
          <Button 
            onClick={() => navigate("/register")}
            className="w-full bg-dish-accent hover:bg-dish-accent/90 text-white rounded-2xl py-7 text-lg font-bold transition-all active:scale-[0.98] shadow-lg shadow-dish-accent/20 hover:cursor-pointer"
          >
            Começar Grátis
          </Button>

          <Button 
            onClick={() => navigate("/login")}
            variant="outline"
            className="w-full bg-transparent border-2 border-white/30 hover:bg-white/10 text-white rounded-2xl py-7 text-lg font-bold transition-all active:scale-[0.98] hover:cursor-pointer"
          >
            Já tenho uma conta
          </Button>
        </div>
      </div>
    </div>
  );
}