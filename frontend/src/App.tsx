import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
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

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  // Colocar a lógica real de autenticação aqui dps
  const isAuthenticated = true

  if (!isAuthenticated) {
    return <Navigate to="/welcome" replace />
  }

  return <>{children}</>
}

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

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
