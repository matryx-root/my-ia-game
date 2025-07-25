import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
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

// Importar todos los juegos aquí
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

function RutaPrivada({ usuario, children }) {
  const location = useLocation();
  if (!usuario && location.pathname === "/") return children;
  if (!usuario) return <Navigate to="/login" />;
  return children;
}

function App() {
  const [usuario, setUsuario] = useState(null);
  const [configuracion, setConfiguracion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [juegosCargados, setJuegosCargados] = useState(false);

  // Utilidad para normalizar el nombre del juego
  function toKey(nombre) {
    return nombre
      .toLowerCase()
      .replace(/á/g, "a").replace(/é/g, "e").replace(/í/g, "i").replace(/ó/g, "o").replace(/ú/g, "u")
      .replace(/ñ/g, "n").replace(/[^a-z0-9]/g, "");
  }

  // Carga usuario y configuración al iniciar
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.get("/usuarios/perfil/me")
        .then(res => {
          if (res && !res.error) {
            setUsuario(res);
            return api.get(`/configuracion/${res.id}`);
          } else {
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            setUsuario(null);
            setConfiguracion(null);
          }
        })
        .then(cfg => {
          if (cfg) setConfiguracion(cfg);
        })
        .catch(() => {
          setUsuario(null);
          setConfiguracion(null);
        })
        .finally(() => setLoading(false));
    } else {
      setUsuario(null);
      setConfiguracion(null);
      setLoading(false);
    }
  }, []);

  // Carga listado de juegos al iniciar
  useEffect(() => {
    async function fetchJuegos() {
      try {
        const juegos = await api.get("/juegos");
        for (let juego of juegos) {
          if (juego.archivo) juegosMap[juego.archivo.replace(/\.js$/, "")] = juego.id;
          else if (juego.nombre && juegosComponentes[toKey(juego.nombre)]) {
            juegosMap[toKey(juego.nombre)] = juego.id;
          }
        }
        setJuegosCargados(true);
      } catch (err) {
        console.error("Error cargando juegos:", err);
        setJuegosCargados(true);
      }
    }
    fetchJuegos();
  }, []);

  // Aplica tema visual al body según config
  useEffect(() => {
    let claseTema = "theme-default";
    if (configuracion) {
      if (configuracion.tema === "Oscuro") claseTema = "theme-dark";
      else if (configuracion.tema === "Claro") claseTema = "theme-light";
    }
    document.body.className = claseTema;
  }, [configuracion]);

  // Login exitoso: guarda usuario y trae config
  const handleLogin = (user) => {
    setUsuario(user);
    localStorage.setItem("userId", user.id);
    api.get(`/configuracion/${user.id}`).then(cfg => {
      if (cfg) setConfiguracion(cfg);
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

  // Cargando inicial
  if (loading || !juegosCargados) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 28,
          color: "#888",
        }}
      >
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
          element={usuario ? <Navigate to="/categorias" /> : <Login onLogin={handleLogin} />}
        />
        <Route
          path="/register"
          element={usuario ? <Navigate to="/categorias" /> : <Registro onRegister={() => {}} />}
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
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
