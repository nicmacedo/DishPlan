import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation
} from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Welcome from "./pages/Welcome"
import Home from "./pages/Home"
import Receitas from "./pages/Receitas"
import Cardapio from "./pages/Cardapio"
import Compras from "./pages/Compras"
import Perfil from "./pages/Perfil"
import AppLayout from "./components/layout/AppLayout"
import { useAuthStore } from "./stores/authStore"

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/welcome" state={{ from: location }} replace />
  }

  return <>{children}</>
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  if (isAuthenticated) {
    const from = location.state?.from?.pathname || "/";
    return <Navigate to={from} replace />
  }

  return <>{children}</>
}

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/welcome" element={<PublicRoute><Welcome /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        {/* Protected Routes */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/receitas" element={<Receitas />} />
          <Route path="/cardapio" element={<Cardapio />} />
          <Route path="/compras" element={<Compras />} />
          <Route path="/perfil" element={<Perfil />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
