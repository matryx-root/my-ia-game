import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import './App.css';
import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import Registro from "./components/Registro";
import PanelAdmin from "./components/PanelAdmin";
import PanelGame from "./components/PanelGame";
import DashboardAdmin from "./components/DashboardAdmin";
import NavBar from "./components/NavBar";
import CategoriasPage from "./components/CategoriasPage";
import CategoriaDetallePage from "./components/CategoriaDetallePage";
import JuegoPage from "./components/JuegoPage";
import MensajeSoportePage from "./components/MensajeSoporte";
import ConfiguracionUsuarioPage from "./components/ConfiguracionUsuarioPage";
import LogsJuegoPage from "./components/LogsJuegoPage";
import LogsErrorPage from "./components/LogsErrorPage";
import MisJuegos from "./components/MisJuegos";
import JuegosAdmin from "./components/JuegosAdmin";
import api from "./utils/api";

// Importar todos los juegos
import IAGame from "./games/iaGame";
import MLGame from "./games/mlGame";
import DLGame from "./games/dlGame";
import RLGame from "./games/rlGame";
import GenerativeGame from "./games/generativeGame";
import SupervisedGame from "./games/supervisedGame";
import UnsupervisedGame from "./games/unsupervisedGame";
import SemiSupervisedGame from "./games/semiSupervisedGame";
import TransferLearningGame from "./games/transferLearningGame";
import FederatedLearningGame from "./games/federatedLearningGame";
import NLPGame from "./games/nlpGame";
import ComputerVisionGame from "./games/computerVisionGame";
import GANGame from "./games/ganGame";
import VAEGame from "./games/vaeGame";
import DiffusionGame from "./games/diffusionGame";
import SelfSupervisedGame from "./games/selfSupervisedGame";

import "bootstrap-icons/font/bootstrap-icons.css";

// Mapeo de componentes de juegos
export const juegosComponentes = {
  iaGame: IAGame,
  mlGame: MLGame,
  dlGame: DLGame,
  rlGame: RLGame,
  generativeGame: GenerativeGame,
  supervisedGame: SupervisedGame,
  unsupervisedGame: UnsupervisedGame,
  semiSupervisedGame: SemiSupervisedGame,
  transferLearningGame: TransferLearningGame,
  federatedLearningGame: FederatedLearningGame,
  nlpGame: NLPGame,
  computerVisionGame: ComputerVisionGame,
  ganGame: GANGame,
  vaeGame: VAEGame,
  diffusionGame: DiffusionGame,
  selfSupervisedGame: SelfSupervisedGame,
};
export const juegosMap = {};

// Componente para rutas protegidas
function RutaPrivada({ usuario, children }) {
  const location = useLocation();
  if (!usuario && location.pathname === "/") return children;
  if (!usuario) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  const [usuario, setUsuario] = useState(null);
  const [configuracion, setConfiguracion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [juegosCargados, setJuegosCargados] = useState(false);

  // Normaliza nombres de juegos para mapeo
  function toKey(nombre) {
    return nombre
      .toLowerCase()
      .replace(/á/g, "a").replace(/é/g, "e").replace(/í/g, "i").replace(/ó/g, "o").replace(/ú/g, "u")
      .replace(/ñ/g, "n").replace(/[^a-z0-9]/g, "");
  }

  // Cargar usuario y configuración al iniciar
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      setUsuario(null);
      setConfiguracion(null);
      setLoading(false);
      return;
    }

    api.get("/usuarios/perfil/me")
      .then(user => {
        if (user && user.id) {
          setUsuario(user);
          return api.get(`/configuracion/${user.id}`);
        } else {
          throw new Error("Usuario no válido");
        }
      })
      .then(cfg => {
        if (cfg) {
          setConfiguracion(cfg);
        }
      })
      .catch(err => {
        console.error("Error al cargar usuario o configuración:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        setUsuario(null);
        setConfiguracion(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Cargar lista de juegos
  useEffect(() => {
    async function fetchJuegos() {
      try {
        const juegos = await api.get("/juegos");
        juegos.forEach(juego => {
          if (juego.archivo) {
            juegosMap[juego.archivo.replace(/\.js$/, "")] = juego.id;
          } else if (juego.nombre) {
            const key = toKey(juego.nombre);
            if (juegosComponentes[key]) {
              juegosMap[key] = juego.id;
            }
          }
        });
        setJuegosCargados(true);
      } catch (err) {
        console.error("Error cargando juegos:", err);
        setJuegosCargados(true);
      }
    }
    fetchJuegos();
  }, []);

  // Aplicar tema visual al body
  useEffect(() => {
    let claseTema = "theme-default";
    if (configuracion) {
      if (configuracion.tema === "Oscuro") claseTema = "theme-dark";
      else if (configuracion.tema === "Claro") claseTema = "theme-light";
    }
    document.body.className = claseTema;
  }, [configuracion]);

  // ✅ handleLogin actualizado: guarda token y carga configuración
  const handleLogin = (user, token) => {
    // Validación básica
    if (!user?.id || !token) {
      console.error("Datos de login incompletos");
      return;
    }

    // Guardar en estado y almacenamiento
    setUsuario(user);
    setConfiguracion(prev => prev); // Mantiene configuración previa hasta cargar la nueva

    // Guardar en localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("userId", user.id);

    // Cargar configuración del usuario desde la API
    api.get(`/configuracion/${user.id}`)
      .then(cfg => {
        if (cfg) {
          setConfiguracion(cfg);
        } else {
          // Opcional: crear configuración predeterminada
          console.log("Usuario sin configuración guardada. Usando valores por defecto.");
        }
      })
      .catch(err => {
        console.error("No se pudo cargar la configuración del usuario:", err);
        // Continúa con valores por defecto
      });
  };

  // Logout
  const handleLogout = () => {
    window.location.href = "/";
    setTimeout(() => {
      setUsuario(null);
      setConfiguracion(null);
      localStorage.removeItem("userId");
      localStorage.removeItem("token");
      document.body.className = "theme-default";
    }, 100);
  };

  // Pantalla de carga
  if (loading || !juegosCargados) {
    return (
      <div style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 28,
        color: "#888",
      }}>
        Cargando...
      </div>
    );
  }

  return (
    <Router>
      <NavBar usuario={usuario} onLogout={handleLogout} configuracion={configuracion} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={usuario ? <Navigate to="/categorias" replace /> : <Login onLogin={handleLogin} />}
        />
        <Route
          path="/register"
          element={usuario ? <Navigate to="/categorias" replace /> : <Registro onRegister={() => {}} />}
        />
        <Route
          path="/categorias"
          element={
            <RutaPrivada usuario={usuario}>
              <CategoriasPage configuracion={configuracion} />
            </RutaPrivada>
          }
        />
        <Route
          path="/mis-juegos"
          element={
            <RutaPrivada usuario={usuario}>
              <MisJuegos usuario={usuario} />
            </RutaPrivada>
          }
        />
        <Route
          path="/categoria/:id"
          element={
            <RutaPrivada usuario={usuario}>
              <CategoriaDetallePage configuracion={configuracion} />
            </RutaPrivada>
          }
        />
        <Route
          path="/juego/:juego"
          element={
            <RutaPrivada usuario={usuario}>
              <JuegoPage configuracion={configuracion} />
            </RutaPrivada>
          }
        />
        <Route
          path="/admin"
          element={
            <RutaPrivada usuario={usuario && usuario.rol === "admin"}>
              <PanelAdmin usuario={usuario} configuracion={configuracion} />
            </RutaPrivada>
          }
        />
        <Route
          path="/configuracion"
          element={
            <RutaPrivada usuario={usuario}>
              <ConfiguracionUsuarioPage
                usuario={usuario}
                onConfigChange={setConfiguracion}
              />
            </RutaPrivada>
          }
        />
        <Route
          path="/panel-game"
          element={
            <RutaPrivada usuario={usuario && (usuario.rol === "admin" || usuario.rol === "docente")}>
              <PanelGame usuario={usuario} configuracion={configuracion} />
            </RutaPrivada>
          }
        />
        <Route
          path="/dashboard-admin"
          element={
            <RutaPrivada usuario={usuario && usuario.rol === "admin"}>
              <DashboardAdmin usuario={usuario} configuracion={configuracion} />
            </RutaPrivada>
          }
        />
        <Route
          path="/admin/juegos"
          element={
            <RutaPrivada usuario={usuario && usuario.rol === "admin"}>
              <JuegosAdmin usuario={usuario} />
            </RutaPrivada>
          }
        />
        <Route path="/logs-juego" element={
          <RutaPrivada usuario={usuario && usuario.rol === "admin"}>
            <LogsJuegoPage />
          </RutaPrivada>
        } />
        <Route path="/logs-error" element={
          <RutaPrivada usuario={usuario && usuario.rol === "admin"}>
            <LogsErrorPage />
          </RutaPrivada>
        } />
        <Route
          path="/mensajes-soporte"
          element={
            <RutaPrivada usuario={usuario}>
              <MensajeSoportePage usuario={usuario} configuracion={configuracion} />
            </RutaPrivada>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;