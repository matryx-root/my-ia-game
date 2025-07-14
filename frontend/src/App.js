import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
import LogsErrorPage from "./components/LogsErrorPage"; // ¡No olvides crear este componente!

import api from "./utils/api";

// Importación de juegos
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

// --- Mapa de componentes y mapa de IDs (se debe llenar después del fetch) ---
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
  // ...agrega más aquí si creas otros juegos
};

// Mapa global de archivo (key) a ID (esto se rellenará dinámicamente)
export const juegosMap = {};

function RutaPrivada({ usuario, children }) {
  if (!usuario) return <Navigate to="/login" />;
  return children;
}

function App() {
  const [usuario, setUsuario] = useState(null);
  const [configuracion, setConfiguracion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [juegosCargados, setJuegosCargados] = useState(false);

  // Al montar: carga usuario, config, y lista de juegos
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

  // Cargar IDs de juegos desde backend y armar el juegosMap
  useEffect(() => {
    async function fetchJuegos() {
      try {
        // Backend debe devolver [{id, nombre, ...archivo}]
        const juegos = await api.get("/juegos");
        // Relacionar archivo/key con id
        for (let juego of juegos) {
          // Considera que backend devuelva el campo "archivo" (ej: "mlGame", "vaeGame", etc)
          if (juego.archivo) juegosMap[juego.archivo] = juego.id;
          // Si solo tienes nombre, mapea manual: (ejemplo para "Machine Learning" => "mlGame")
          if (!juego.archivo && juego.nombre && juegosComponentes[toKey(juego.nombre)])
            juegosMap[toKey(juego.nombre)] = juego.id;
        }
        setJuegosCargados(true);
      } catch (err) {
        console.error("Error cargando juegos:", err);
        setJuegosCargados(true);
      }
    }
    fetchJuegos();
  }, []);

  // Utilidad: convertir nombre a key (solo si backend no tiene el campo archivo/key)
  function toKey(nombre) {
    return nombre
      .toLowerCase()
      .replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i').replace(/ó/g, 'o').replace(/ú/g, 'u')
      .replace(/ñ/g, 'n').replace(/[^a-z0-9]/g, '');
  }

  useEffect(() => {
    let claseTema = "theme-default";
    if (configuracion) {
      if (configuracion.tema === "Oscuro") claseTema = "theme-dark";
      else if (configuracion.tema === "Claro") claseTema = "theme-light";
    }
    document.body.className = claseTema;
  }, [configuracion]);

  const handleLogin = (user) => {
    setUsuario(user);
    localStorage.setItem("userId", user.id);
    api.get(`/configuracion/${user.id}`).then(cfg => {
      if (cfg) setConfiguracion(cfg);
    });
  };

  const handleLogout = () => {
    setUsuario(null);
    setConfiguracion(null);
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    document.body.className = "theme-default";
  };

  if (loading || !juegosCargados)
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
                config={configuracion}
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
