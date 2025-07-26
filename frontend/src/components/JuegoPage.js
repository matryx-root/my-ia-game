import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Importar todos los juegos
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

// Mapeo de juegos
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
  const [config, setConfig] = useState(null);

  // Cargar usuario y configuración desde localStorage
  useEffect(() => {
    let user = null;
    try {
      const raw = localStorage.getItem("usuario");
      if (raw) {
        user = JSON.parse(raw);
        if (!user?.id) user = null;
      }
    } catch (e) {
      console.error("Error al parsear usuario:", e);
    }
    setUsuario(user);

    let cfg = null;
    try {
      const rawCfg = localStorage.getItem("configuracion");
      if (rawCfg) {
        cfg = JSON.parse(rawCfg);
      }
    } catch (e) {
      console.error("Error al parsear configuración:", e);
    }
    setConfig(cfg);
  }, []);

  // Si no hay usuario, mostrar mensaje
  if (!usuario) {
    return (
      <div className="container-fluid py-4 px-3">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div
              className="alert alert-warning text-center"
              style={{
                fontSize: 'clamp(1rem, 4vw, 1.2rem)',
                padding: '1.5em',
                borderRadius: '1rem'
              }}
            >
              <h5 className="mb-2">🔒 Sesión requerida</h5>
              <p style={{ margin: 0 }}>
                    Debes iniciar sesión para jugar.
              </p>
            </div>
            <div className="d-flex justify-content-center mt-3">
              <button
                className="btn btn-primary"
                onClick={() => navigate("/login")}
                style={{
                  fontSize: 'clamp(0.9rem, 4vw, 1.1rem)',
                  padding: '0.6em 1.5em'
                }}
              >
                Ir a Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Validar si el juego existe
  const GameComponent = juegosComponentes[juego];

  if (!GameComponent) {
    return (
      <div className="container-fluid py-5 px-3">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div
              className="alert alert-danger text-center"
              style={{
                fontSize: 'clamp(1.1rem, 5vw, 1.4rem)',
                fontWeight: 500,
                padding: '1.8em',
                borderRadius: '1rem'
              }}
            >
              <h5 className="mb-2">⚠️ Juego no encontrado</h5>
              <p style={{ margin: 0, fontSize: 'clamp(0.9rem, 4vw, 1rem)' }}>
                El juego <code style={{ padding: '0.2em 0.4em', background: '#fff3cd', borderRadius: '0.3em' }}>{juego}</code> no existe o no está disponible.
              </p>
            </div>
            <div className="d-flex justify-content-center mt-4 gap-3 flex-wrap">
              <button
                className="btn btn-secondary"
                onClick={() => navigate(-1)}
                style={{
                  fontSize: 'clamp(0.9rem, 4vw, 1rem)'
                }}
              >
                Volver atrás
              </button>
              <button
                className="btn btn-primary"
                onClick={() => navigate("/categorias")}
                style={{
                  fontSize: 'clamp(0.9rem, 4vw, 1rem)'
                }}
              >
                Ver categorías
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Renderizar el juego
  return (
    <div
      className="game-container"
      style={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 'clamp(20px, 5vw, 40px)',
        paddingBottom: 'clamp(30px, 6vw, 50px)'
      }}
    >
      <GameComponent usuario={usuario} config={config} juegoKey={juego} />
    </div>
  );
}