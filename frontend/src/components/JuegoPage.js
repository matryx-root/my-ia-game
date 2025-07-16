
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";


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
  
};

export default function JuegoPage() {
  const { juego } = useParams();
  const navigate = useNavigate();

  
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    
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
