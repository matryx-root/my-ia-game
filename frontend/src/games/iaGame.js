import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import Phaser from "phaser";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function IAGameBrainNetwork({ usuario }) {
  const gameRef = useRef(null);
  const navigate = useNavigate();
  const [instruccion, setInstruccion] = useState(true);
  const [resultado, setResultado] = useState(null);
  const [juegoKey, setJuegoKey] = useState(0);
  const [puedeGuardar, setPuedeGuardar] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [mostroLogro, setMostroLogro] = useState(false);
  const [errorGuardar, setErrorGuardar] = useState(null);
  const [errores, setErrores] = useState(0);

  // ID y datos de logro
  const IA_GAME_ID = 1;
  const NOMBRE_LOGRO = "Red Neuronal Perfecta";
  const DESC_LOGRO = "Conectaste todos los nodos de la red neuronal sin errores.";

  // Nodos del cerebro (memorizados)
  const brainNodes = useMemo(() => [
    { x: 210, y: 210 }, { x: 250, y: 180 }, { x: 300, y: 150 }, { x: 370, y: 140 },
    { x: 440, y: 150 }, { x: 510, y: 180 }, { x: 570, y: 230 }, { x: 600, y: 300 },
    { x: 600, y: 380 }, { x: 570, y: 430 }, { x: 510, y: 470 }, { x: 440, y: 490 },
    { x: 370, y: 480 }, { x: 300, y: 470 }, { x: 250, y: 430 }, { x: 220, y: 370 },
    { x: 230, y: 290 }, { x: 340, y: 230 }, { x: 470, y: 230 }, { x: 370, y: 310 }
  ], []);

  const TOTAL_CONEXIONES = brainNodes.length - 1;

  // Cargar historial
  const cargarHistorial = useCallback(async () => {
    if (!usuario || !usuario.id) return;
    try {
      const prog = await api.get(`/juegos/progreso/${usuario.id}`);
      setHistorialProgreso(
        Array.isArray(prog)
          ? prog.filter(p => p.juegoId === IA_GAME_ID)
          : []
      );
    } catch {
      setHistorialProgreso([]);
    }
  }, [usuario, IA_GAME_ID]);

  useEffect(() => {
    if (usuario && usuario.id) cargarHistorial();
  }, [usuario]);

  // Iniciar juego
  const iniciarJuego = () => setInstruccion(false);

  // Calcular tamaño del canvas responsivo
  const getGameSize = () => {
    const width = Math.min(window.innerWidth * 0.95, 820);
    const height = Math.min(window.innerHeight * 0.8, 600);
    return { width, height };
  };

  // Phaser GAME
  useEffect(() => {
    if (gameRef.current) {
      gameRef.current.destroy(true);
      gameRef.current = null;
    }

    setPuedeGuardar(false);
    setGuardado(false);
    setErrorGuardar(null);
    setErrores(0);
    setMostroLogro(false);

    if (instruccion) return;

    const { width, height } = getGameSize();

    let connectedPairs = [];
    let lastIdx = null;
    let circuits = [];
    let erroresTemp = 0;

    gameRef.current = new Phaser.Game({
      type: Phaser.AUTO,
      width,
      height,
      parent: 'game-container-ia-network',
      backgroundColor: '#fff3e0',
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      },
      scene: {
        create: function () {
          this.completed = false;
          circuits = [];
          connectedPairs = [];
          lastIdx = null;
          erroresTemp = 0;

          const graphics = this.add.graphics();

          // Título responsivo
          const titleSize = Math.min(width * 0.04, 24);
          this.add.text(20, 20, '🤖 Juego IA: ¡Une los puntos para simular una red neuronal cerebral!', {
            fontFamily: 'Montserrat, monospace',
            fontSize: `${titleSize}px`,
            fill: '#333',
            wordWrap: { width: width - 40 }
          });

          // Barra de progreso
          const barHeight = height * 0.03;
          const barWidth = width * 0.6;
          const barX = width / 2;
          const barY = height - barHeight * 2;

          this.add.rectangle(barX, barY, barWidth, barHeight, 0xe1bee7).setOrigin(0.5);
          this.barraRelleno = this.add.rectangle(barX - barWidth / 2, barY, 0, barHeight, 0x7e57c2).setOrigin(0, 0.5);

          const progressSize = Math.min(width * 0.035, 18);
          const textoProgreso = this.add.text(width - 120, barY - barHeight / 2 - 5, `0/${TOTAL_CONEXIONES}`, {
            fontFamily: 'monospace',
            fontSize: `${progressSize}px`,
            fill: '#333'
          });

          // Crear nodos
          brainNodes.forEach((coord, i) => {
            const nodeRadius = Math.min(width * 0.03, 20);
            const circuit = this.add.circle(coord.x, coord.y, nodeRadius, 0x9575cd, 0.9)
              .setStrokeStyle(Math.max(2, Math.floor(width * 0.003)), 0x512da8)
              .setInteractive({ useHandCursor: true });

            circuit.index = i;
            circuit.connected = false;

            circuit.on('pointerover', () => {
              if (!this.completed && !circuit.connected) circuit.setScale(1.3);
            });

            circuit.on('pointerout', () => {
              if (!this.completed && !circuit.connected) circuit.setScale(1.0);
            });

            circuit.on('pointerdown', () => {
              if (this.completed) return;

              if (lastIdx === null) {
                lastIdx = i;
                circuit.setFillStyle(0xffe082, 1);
              } else if (
                lastIdx !== i &&
                !connectedPairs.find(p => (p[0] === lastIdx && p[1] === i) || (p[0] === i && p[1] === lastIdx))
              ) {
                // Conexión correcta
                connectedPairs.push([lastIdx, i]);
                circuit.setFillStyle(0xffe082, 1);
                circuits[lastIdx].setFillStyle(0xffe082, 1);
                circuits[lastIdx].connected = true;
                circuit.connected = true;

                graphics.clear();
                connectedPairs.forEach(([a, b], idx) => {
                  const c1 = circuits[a];
                  const c2 = circuits[b];
                  graphics.lineStyle(
                    Math.max(3, Math.floor(width * 0.004)),
                    0x9575cd,
                    0.65 + idx / brainNodes.length
                  );
                  graphics.strokeLineShape(new Phaser.Geom.Line(c1.x, c1.y, c2.x, c2.y));
                });

                // Actualizar barra
                this.barraRelleno.width = (connectedPairs.length / TOTAL_CONEXIONES) * barWidth;
                textoProgreso.setText(`${connectedPairs.length}/${TOTAL_CONEXIONES}`);

                if (connectedPairs.length === TOTAL_CONEXIONES) {
                  this.completed = true;
                  const msgSize = Math.min(width * 0.05, 28);
                  this.add.text(width * 0.15, height * 0.85, '¡Conectaste todos los nodos de la red neuronal cerebral! 🧠✨', {
                    fontFamily: 'Montserrat, monospace',
                    fontSize: `${msgSize}px`,
                    fill: '#388e3c',
                    fontWeight: 'bold'
                  });

                  setResultado(
                    "¡Así se construye una red neuronal artificial! Más nodos, más conexiones... más inteligencia. ¿Cuántas conexiones crees que hay en tu cerebro real?"
                  );
                  setPuedeGuardar(true);
                  setErrores(erroresTemp);
                }
                lastIdx = null;
              } else {
                erroresTemp++;
              }
            });

            circuits.push(circuit);
          });
        }
      }
    });

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [instruccion, juegoKey, brainNodes, TOTAL_CONEXIONES]);

  // Guardar progreso/logro
  const guardarProgresoYLogro = async () => {
    if (!usuario || !usuario.id) {
      setErrorGuardar('No hay usuario logueado.');
      return;
    }
    setErrorGuardar(null);
    try {
      const progresoPayload = {
        usuarioId: usuario.id,
        juegoId: IA_GAME_ID,
        avance: 100,
        completado: true,
        aciertos: TOTAL_CONEXIONES - errores,
        desaciertos: errores
      };
      await api.post('/juegos/progreso', progresoPayload);

      if (errores === 0) {
        await api.post("/usuarios/achievement", {
          usuarioId: usuario.id,
          juegoId: IA_GAME_ID,
          nombre: NOMBRE_LOGRO,
          descripcion: DESC_LOGRO
        });
        setMostroLogro(true);
      }

      setGuardado(true);
      setPuedeGuardar(false);
      cargarHistorial();
    } catch (err) {
      setErrorGuardar("Error al guardar: " + (err?.message || (err?.error ?? "")));
      setGuardado(false);
      setPuedeGuardar(true);
    }
  };

  // Reiniciar juego
  const handleReset = () => {
    setInstruccion(true);
    setResultado(null);
    setJuegoKey(k => k + 1);
    setPuedeGuardar(false);
    setGuardado(false);
    setErrorGuardar(null);
    setErrores(0);
    setMostroLogro(false);
    if (gameRef.current) {
      gameRef.current.destroy(true);
      gameRef.current = null;
    }
  };

  return (
    <div
      className="game-container"
      style={{
        width: '100%',
        maxWidth: 'clamp(300px, 95vw, 900px)',
        margin: 'clamp(20px, 5vw, 40px) auto',
        padding: '0 10px'
      }}
    >
      {/* Modal de instrucción */}
      {instruccion && (
        <div className="modal show d-block" tabIndex="-1" style={{
          background: 'rgba(0,0,0,0.4)',
          position: 'fixed',
          inset: 0,
          zIndex: 1050
        }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">¿Cómo es una red neuronal?</h5>
              </div>
              <div className="modal-body">
                <p>
                  <b>Una red neuronal artificial</b> se inspira en el cerebro, donde cada nodo es como una neurona y las conexiones son como sinapsis.
                </p>
                <p>
                  <b>Tu reto:</b> Une todos los puntos del “cerebro” conectando pares uno a uno para completar la red.
                </p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={iniciarJuego}>¡Jugar!</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contenedor del juego */}
      <div
        id="game-container-ia-network"
        style={{
          width: '100%',
          minHeight: 'clamp(300px, 80vh, 600px)',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          background: '#fff'
        }}
      />

      {/* Resultado */}
      {resultado && (
        <div
          className="alert alert-success mt-3"
          style={{
            maxWidth: 'clamp(300px, 90vw, 800px)',
            margin: 'clamp(20px, 5vw, 40px) auto',
            fontSize: 'clamp(0.9rem, 4vw, 1.1rem)',
            textAlign: 'center'
          }}
        >
          {resultado}
          <br />
          <small style={{ fontSize: '0.9em' }}>
            Así funcionan las IA modernas: ¡Miles de nodos y millones de conexiones como tu cerebro!
          </small>
        </div>
      )}

      {/* Logro ganado */}
      {mostroLogro && (
        <div
          className="alert alert-info text-center mt-3 fw-bold"
          style={{
            maxWidth: 'clamp(300px, 90vw, 500px)',
            margin: 'auto',
            fontSize: 'clamp(0.9rem, 4vw, 1.1rem)'
          }}
        >
          <i className="bi bi-trophy-fill text-warning me-2"></i>
          ¡FELICITACIONES! Lograste el <span className="text-success">Puntaje Perfecto</span> y ganaste un logro 🏆
        </div>
      )}

      {/* Botón guardar */}
      {puedeGuardar && !guardado && (
        <div className="d-flex justify-content-center mt-4">
          <button
            className="btn btn-success"
            onClick={guardarProgresoYLogro}
            style={{
              fontSize: 'clamp(0.9rem, 4vw, 1.1rem)',
              padding: '0.6em 1.5em'
            }}
          >
            Guardar progreso {errores === 0 && "y registrar logro"}
          </button>
        </div>
      )}

      {/* Historial */}
      {historialProgreso.length > 0 && (
        <div
          className="my-4"
          style={{ maxWidth: 'clamp(300px, 90vw, 800px)', margin: 'auto' }}
        >
          <h5 className="text-center mb-3">Historial de partidas</h5>
          <div className="table-responsive">
            <table className="table table-bordered table-sm">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Completado</th>
                  <th>Fecha</th>
                  <th>Aciertos</th>
                  <th>Desaciertos</th>
                </tr>
              </thead>
              <tbody>
                {historialProgreso.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.completado ? "✅" : "❌"}</td>
                    <td>{new Date(p.fechaActualizacion).toLocaleString()}</td>
                    <td>{TOTAL_CONEXIONES - (p.desaciertos || 0)}</td>
                    <td>{p.desaciertos ?? 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Error */}
      {errorGuardar && (
        <div
          className="alert alert-danger mt-3 text-center"
          style={{
            maxWidth: 'clamp(300px, 90vw, 500px)',
            margin: 'auto',
            fontSize: 'clamp(0.9rem, 4vw, 1.1rem)'
          }}
        >
          {errorGuardar}
        </div>
      )}

      {/* Botones de navegación */}
      {!instruccion && (
        <div className="d-flex justify-content-center mt-4 gap-3 flex-wrap">
          <button
            className="btn btn-secondary"
            onClick={() => navigate(-1)}
            style={{ fontSize: 'clamp(0.9rem, 4vw, 1rem)' }}
          >
            Volver a Categoría
          </button>
          <button
            className="btn btn-primary"
            onClick={handleReset}
            style={{ fontSize: 'clamp(0.9rem, 4vw, 1rem)' }}
          >
            Jugar de nuevo
          </button>
        </div>
      )}
    </div>
  );
}