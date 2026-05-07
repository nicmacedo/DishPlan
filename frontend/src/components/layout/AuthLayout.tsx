import { Link } from "react-router-dom";
import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  subtitle?: string;
  showClouds?: boolean;
}

export default function AuthLayout({ children, subtitle = "Organize suas refeições e compras", showClouds = true }: AuthLayoutProps) {
  return (
    <div className="min-h-dvh flex flex-col md:flex-row bg-dish-bg font-sans text-slate-800">
      <div className="relative flex flex-col items-center justify-center bg-dish-primary md:w-5/12 lg:w-4/12 shrink-0 text-white py-12 md:py-0 overflow-hidden">
        
        {/* Divisor "Nuvem" - Visível apenas se ativado */}
        {showClouds && (
          <>
            {/* Desktop Cloud Divider */}
            <div className="hidden md:block absolute right-0 top-0 bottom-0 w-24 translate-x-12">
              <svg viewBox="0 0 100 1000" preserveAspectRatio="none" className="h-full w-full text-dish-bg fill-current opacity-20">
                 <path d="M0,0 Q50,100 0,200 T0,400 Q50,500 0,600 T0,800 Q50,900 0,1000 L100,1000 L100,0 Z" />
              </svg>
              <svg viewBox="0 0 100 1000" preserveAspectRatio="none" className="absolute top-0 left-0 h-full w-full text-dish-bg fill-current translate-x-4">
                 <path d="M10,0 Q60,100 10,200 T10,400 Q60,500 10,600 T10,800 Q60,900 10,1000 L100,1000 L100,0 Z" />
              </svg>
            </div>
            
            {/* Mobile Cloud Divider */}
            <div className="md:hidden absolute bottom-0 left-0 right-0 h-10 translate-y-0.5">
              <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className="h-full w-full text-dish-bg fill-current opacity-20">
                 <path d="M0,0 Q100,60 200,0 T400,0 Q500,60 600,0 T800,0 Q900,60 1000,0 L1000,100 L0,100 Z" />
              </svg>
              <svg viewBox="0 0 1000 100" preserveAspectRatio="none" className="absolute top-0 left-0 h-full w-full text-dish-bg fill-current translate-y-3">
                 <path d="M0,10 Q100,70 200,10 T400,10 Q500,70 600,10 T800,10 Q900,70 1000,10 L1000,100 L0,100 Z" />
              </svg>
            </div>
          </>
        )}

        <div className="relative z-10 flex flex-col items-center px-4 max-w-sm text-center">
          <Link to="/" className="flex flex-col items-center group">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-xl flex items-center justify-center mb-6 shadow-xl p-2 md:p-3 overflow-hidden transition-transform duration-300 group-hover:scale-105">
              <img 
                src="/logo-default.png" 
                alt="DishPlan Logo" 
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2">DishPlan</h1>
            <p className="text-dish-leaf/90 text-sm md:text-base font-medium max-w-xs">{subtitle}</p>
          </Link>
        </div>
      </div>

      {/* Painel do Conteúdo (Formulários) */}
      <div className="flex-1 flex flex-col justify-center px-4 py-8 sm:px-6 lg:px-8 xl:px-16 md:bg-dish-bg bg-white relative z-20 rounded-t-[2.5rem] -mt-6 md:mt-0 md:rounded-none">
        <div className="mx-auto w-full max-w-md xl:max-w-lg">
          {children}
        </div>
      </div>
    </div>
  );
}