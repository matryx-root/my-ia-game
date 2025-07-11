// src/components/JuegoPage.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Importa todos los componentes de juegos según tengas implementados
import IaGame from "../games/iaGame";
import MlGame from "../games/mlGame";
import NlpGame from "../games/nlpGame";
import DlGame from "../games/dlGame";
import RlGame from "../games/rlGame";
import GenerativeGame from "../games/generativeGame";
import SupervisedGame from "../games/supervisedGame";
import UnsupervisedGame from "../games/unsupervisedGame";
import SemiSupervisedGame from "../games/semiSupervisedGame";
import TransferLearningGame from "../games/transferLearningGame";
import FederatedLearningGame from "../games/federatedLearningGame";
import ComputerVisionGame from "../games/computerVisionGame";
import GanGame from "../games/ganGame";
import VaeGame from "../games/vaeGame";
import DiffusionGame from "../games/diffusionGame";
import SelfSupervisedGame from "../games/selfSupervisedGame";
// ...agrega aquí más imports si tienes más juegos

// Relaciona el string del "archivo" con el componente React correspondiente
const juegosComponentes = {
  iaGame: IaGame,
  mlGame: MlGame,
  nlpGame: NlpGame,
  dlGame: DlGame,
  rlGame: RlGame,
  generativeGame: GenerativeGame,
  supervisedGame: SupervisedGame,
  unsupervisedGame: UnsupervisedGame,
  semiSupervisedGame: SemiSupervisedGame,
  transferLearningGame: TransferLearningGame,
  federatedLearningGame: FederatedLearningGame,
  computerVisionGame: ComputerVisionGame,
  ganGame: GanGame,
  vaeGame: VaeGame,
  diffusionGame: DiffusionGame,
  selfSupervisedGame: SelfSupervisedGame,
  // ...agrega aquí más si tienes más juegos
};

export default function JuegoPage() {
  const { juego } = useParams();
  const navigate = useNavigate();

  // Estado para usuario logueado
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    // Carga el usuario desde localStorage en el primer render
    let user = null;
    try {
      const raw = localStorage.getItem("usuario");
      if (raw) {
        user = JSON.parse(raw);
        if (!user?.id) user = null;
      }
    } catch {
      user = null;
    }
    setUsuario(user);
  }, []);

  // Si no hay usuario logueado, muestra mensaje y botón de login
  if (!usuario) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning text-center" style={{ fontSize: 20 }}>
          Debes iniciar sesión para jugar.
        </div>
        <div className="d-flex justify-content-center mt-4">
          <button className="btn btn-primary" onClick={() => navigate("/login")}>
            Ir a Login
          </button>
        </div>
      </div>
    );
  }

  // Busca el componente del juego correspondiente
  const GameComponent = juegosComponentes[juego];

  return (
    <div>
      {GameComponent ? (
        <GameComponent usuario={usuario} juegoKey={juego}/>
      ) : (
        <div className="alert alert-danger text-center my-5" style={{ fontSize: 22 }}>
          Juego no encontrado.
        </div>
      )}
    </div>
  );
}
