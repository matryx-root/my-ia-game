// src/components/JuegoPage.js
import React from "react";
import { useParams } from "react-router-dom";

// Importación de componentes de juegos (asegúrate que existan y estén bien exportados)
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
// ...agrega aquí más imports de juegos según vayas creando

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
  // ...agrega aquí nuevos juegos
};

export default function JuegoPage() {
  const { juego } = useParams();
  const GameComponent = juegosComponentes[juego];

  return (
    <div>
      {GameComponent ? (
        <GameComponent />
      ) : (
        <div className="alert alert-danger text-center my-5" style={{ fontSize: 22 }}>
          Juego no encontrado.
        </div>
      )}
    </div>
  );
}
