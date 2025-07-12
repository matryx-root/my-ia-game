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

// Juegos por clave para uso dinámico
export const juegosComponentes = {
  iaGame: <IAGame />,
  mlGame: <MLGame />,
  dlGame: <DLGame />,
  rlGame: <RLGame />,
  generativeGame: <GenerativeGame />,
  supervisedGame: <SupervisedGame />,
  unsupervisedGame: <UnsupervisedGame />,
  semiSupervisedGame: <SemiSupervisedGame />,
  transferLearningGame: <TransferLearningGame />,
  federatedLearningGame: <FederatedLearningGame />,
  nlpGame: <NLPGame />,
  computerVisionGame: <ComputerVisionGame />,
  ganGame: <GANGame />,
  vaeGame: <VAEGame />,
  diffusionGame: <DiffusionGame />,
  selfSupervisedGame: <SelfSupervisedGame />,
  // ...agrega más aquí si creas otros archivos de juegos
};

// Rutas protegidas
function RutaPrivada({ usuario, children }) {
  if (!usuario) return <Navigate to="/login" />;
  return children;
}

function App() {
  const [usuario, setUsuario] = useState(null);
  const [configuracion, setConfiguracion] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar perfil y configuración al montar
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.get("/usuarios/perfil/me")
        .then(res => {
          if (res && !res.error) {
            setUsuario(res);
            // Cargar configuración de usuario (ajusta si tu ruta es diferente)
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

  // Aplicar tema visual al <body>

useEffect(() => {
  let claseTema = "theme-default";
  if (configuracion) {
    if (configuracion.tema === "Oscuro") claseTema = "theme-dark";
    else if (configuracion.tema === "Claro") claseTema = "theme-light";
    else claseTema = "theme-default";
  }
  document.body.className = claseTema;
}, [configuracion]);

  // Cuando haces login, actualiza estado y guarda id (el token ya está guardado)
  const handleLogin = (user) => {
    setUsuario(user);
    localStorage.setItem("userId", user.id);
    // Cargar configuración al iniciar sesión
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

  if (loading)
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
      {/* NavBar siempre visible */}
      <NavBar usuario={usuario} onLogout={handleLogout} configuracion={configuracion} />

      <Routes>
        {/* LANDING: siempre accesible */}
        <Route path="/" element={<LandingPage />} />

        {/* LOGIN */}
        <Route
          path="/login"
          element={
            usuario ? <Navigate to="/categorias" /> : <Login onLogin={handleLogin} />
          }
        />

        {/* REGISTRO */}
        <Route
          path="/register"
          element={
            usuario ? <Navigate to="/categorias" /> : <Registro onRegister={() => {}} />
          }
        />

        {/* CATEGORÍAS */}
        <Route
          path="/categorias"
          element={
            <RutaPrivada usuario={usuario}>
              <CategoriasPage configuracion={configuracion} />
            </RutaPrivada>
          }
        />

        {/* DETALLE CATEGORÍA */}
        <Route
          path="/categoria/:id"
          element={
            <RutaPrivada usuario={usuario}>
              <CategoriaDetallePage configuracion={configuracion} />
            </RutaPrivada>
          }
        />

        {/* JUEGO DINÁMICO */}
        <Route
          path="/juego/:juego"
          element={
            <RutaPrivada usuario={usuario}>
              <JuegoPage configuracion={configuracion} />
            </RutaPrivada>
          }
        />

        {/* PANEL ADMIN - solo admin */}
        <Route
          path="/admin"
          element={
            <RutaPrivada usuario={usuario && usuario.rol === "admin"}>
              <PanelAdmin usuario={usuario} configuracion={configuracion} />
            </RutaPrivada>
          }
        />

        {/* CONFIGURACIÓN USUARIO */}
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

        {/* PANEL JUEGOS POR USUARIO - solo admin o docente */}
        <Route
          path="/panel-game"
          element={
            <RutaPrivada usuario={usuario && (usuario.rol === "admin" || usuario.rol === "docente")}>
              <PanelGame usuario={usuario} configuracion={configuracion} />
            </RutaPrivada>
          }
        />

        {/* DASHBOARD ADMIN - solo admin */}
        <Route
          path="/dashboard-admin"
          element={
            <RutaPrivada usuario={usuario && usuario.rol === "admin"}>
              <DashboardAdmin usuario={usuario} configuracion={configuracion} />
            </RutaPrivada>
          }
        />

        {/* MENSAJE SOPORTE - alumnos, docentes, admin */}
        <Route
          path="/mensajes-soporte"
          element={
            <RutaPrivada usuario={usuario}>
              <MensajeSoportePage usuario={usuario} configuracion={configuracion} />
            </RutaPrivada>
          }
        />

        {/* Cualquier otra ruta -> vuelve a landing */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
