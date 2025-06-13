import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import Registro from "./components/Registro";
import PanelAdmin from "./components/PanelAdmin";
import NavBar from "./components/NavBar";
import CategoriasPage from "./components/CategoriasPage";
import CategoriaDetallePage from "./components/CategoriaDetallePage";
import JuegoPage from "./components/JuegoPage";

// Juegos IA
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

// Juegos por clave
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

  return (
    <Router>
      {/* El NavBar SIEMPRE visible. El botón 'Salir' debe navegar a "/" */}
      <NavBar usuario={usuario} onLogout={() => setUsuario(null)} />

      <Routes>
        {/* LANDING: siempre accesible */}
        <Route path="/" element={<LandingPage />} />

        {/* LOGIN */}
        <Route path="/login" element={
          usuario ? <Navigate to="/categorias" /> : <Login onLogin={u => setUsuario(u)} />
        } />

        {/* REGISTRO */}
        <Route path="/register" element={
          usuario ? <Navigate to="/categorias" /> : <Registro onRegister={() => {}} />
        } />

        {/* CATEGORÍAS */}
        <Route path="/categorias" element={
          <RutaPrivada usuario={usuario}>
            <CategoriasPage />
          </RutaPrivada>
        } />

        {/* DETALLE CATEGORÍA */}
        <Route path="/categoria/:id" element={
          <RutaPrivada usuario={usuario}>
            <CategoriaDetallePage />
          </RutaPrivada>
        } />

        {/* JUEGO DINÁMICO */}
        <Route path="/juego/:juego" element={
          <RutaPrivada usuario={usuario}>
            <JuegoPage />
          </RutaPrivada>
        } />

        {/* PANEL ADMIN */}
        <Route path="/admin" element={
          <RutaPrivada usuario={usuario && usuario.rol === "admin"}>
            <PanelAdmin />
          </RutaPrivada>
        } />

        {/* Cualquier otra ruta -> vuelve a landing */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
