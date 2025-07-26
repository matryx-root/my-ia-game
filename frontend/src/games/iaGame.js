import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';

import Phaser from 'phaser';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';



export default function IAGameBrainNetwork({ usuario }) {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const gameRef = useRef(null);

  // Estado principal
  const [instruccion, setInstruccion] = useState(true);
  const [resultado, setResultado] = useState(null);
  const [juegoKey, setJuegoKey] = useState(0);
  const [puedeGuardar, setPuedeGuardar] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [errorGuardar, setErrorGuardar] = useState(null);
  const [errores, setErrores] = useState(0);
  const [mostroLogro, setMostroLogro] = useState(false);
  const [historialProgreso, setHistorialProgreso] = useState([]);

  // ID y datos de logro
  const IA_GAME_ID = 1;
  const NOMBRE_LOGRO = "Red Neuronal Perfecta";
  const DESC_LOGRO = "Conectaste todos los nodos de la red neuronal sin errores.";
  const brainNodes = useMemo(() => [
    { x: 210, y: 210 }, { x: 250, y: 180 }, { x: 300, y: 150 }, { x: 370, y: 140 },
    { x: 440, y: 150 }, { x: 510, y: 180 }, { x: 570, y: 230 }, { x: 600, y: 300 },
    { x: 600, y: 380 }, { x: 570, y: 430 }, { x: 510, y: 470 }, { x: 440, y: 490 },
    { x: 370, y: 480 }, { x: 300, y: 470 }, { x: 250, y: 430 }, { x: 220, y: 370 },
    { x: 230, y: 290 }, { x: 340, y: 230 }, { x: 470, y: 230 }, { x: 370, y: 310 }
  ], []);
  const TOTAL_CONEXIONES = brainNodes.length - 1;

  // Cargar historial (memoizado para evitar warning)
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

  // Iniciar juego
  const iniciarJuego = () => setInstruccion(false);

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

    let connectedPairs = [];
    let lastIdx = null;
    let circuits = [];
    let erroresTemp = 0;
    let width = 820, height = 600;

    gameRef.current = new Phaser.Game({
      type: Phaser.AUTO,
      width,
      height,
      parent: 'game-container-ia-network',
      backgroundColor: '#fff3e0',
      scene: {
        create: function () {
          this.completed = false;
          circuits = [];
          connectedPairs = [];
          lastIdx = null;
          erroresTemp = 0;
          let graphics = this.add.graphics();

          this.add.text(60, 20, '🤖 Juego IA: ¡Une los puntos para simular una red neuronal cerebral!', {
            fontFamily: 'monospace',
            fontSize: '22px',
            fill: '#333'
          });

          this.add.rectangle(410, 570, 480, 22, 0xe1bee7).setOrigin(0.5);
          this.barraRelleno = this.add.rectangle(170, 570, 0, 22, 0x7e57c2).setOrigin(0, 0.5);
          let textoProgreso = this.add.text(680, 565, `0/${TOTAL_CONEXIONES} conexiones`, {
            fontFamily: 'monospace',
            fontSize: '16px',
            fill: '#333'
          });

          brainNodes.forEach((coord, i) => {
            const circuit = this.add.circle(coord.x, coord.y, 20, 0x9575cd, 0.9)
              .setStrokeStyle(2, 0x512da8)
              .setInteractive({ useHandCursor: true });
            circuit.index = i;
            circuit.connected = false;

            circuit.on('pointerover', function () {
              if (!this.connected) circuit.setScale(1.28);
            });
            circuit.on('pointerout', function () {
              if (!this.connected) circuit.setScale(1.0);
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
                // Correcta
                connectedPairs.push([lastIdx, i]);
                circuit.setFillStyle(0xffe082, 1);
                circuits[lastIdx].setFillStyle(0xffe082, 1);
                circuits[lastIdx].connected = true;
                circuit.connected = true;

                graphics.clear();
                connectedPairs.forEach(([a, b], idx) => {
                  let c1 = circuits[a], c2 = circuits[b];
                  graphics.lineStyle(4, 0x9575cd, 0.65 + idx/brainNodes.length);
                  graphics.strokeLineShape(new Phaser.Geom.Line(c1.x, c1.y, c2.x, c2.y));
                });

                this.barraRelleno.width = (connectedPairs.length / TOTAL_CONEXIONES) * 480;
                textoProgreso.setText(`${connectedPairs.length}/${TOTAL_CONEXIONES} conexiones`);

                if (connectedPairs.length === TOTAL_CONEXIONES) {
                  this.completed = true;
                  this.add.text(120, 520, '¡Conectaste todos los nodos de la red neuronal cerebral! 🧠✨', {
                    fontFamily: 'monospace',
                    fontSize: '28px',
                    fill: '#388e3c',
                    fontStyle: 'bold'
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
  }, [instruccion, juegoKey, usuario, brainNodes, TOTAL_CONEXIONES]);

  // Cargar historial de progreso
  useEffect(() => {
    if (usuario && usuario.id) cargarHistorial();
  }, [usuario, juegoKey, cargarHistorial]);

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
      } else {
        setMostroLogro(false);
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

  // Resetear juego
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
    <div ref={containerRef} style={{ width: "100%", maxWidth: 900, margin: "auto" }}>
      {instruccion && (
        <div className="modal show d-block" tabIndex="-1" style={{
          background: 'rgba(0,0,0,0.3)',
          position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', zIndex: 1000
        }}>
          <div className="modal-dialog" style={{ marginTop: 80 }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">¿Cómo es una red neuronal?</h5>
              </div>
              <div className="modal-body">
                <p>
                  <b>Una red neuronal artificial</b> se inspira en el cerebro, donde cada nodo es como una neurona y las conexiones son como sinapsis.<br />
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

      <div id="game-container-ia-network" style={{ margin: 'auto', minHeight: 350 }} />

      {resultado && (
        <div className="alert alert-success mt-3" style={{ maxWidth: 800, margin: "auto" }}>
          {resultado}
          <br />
          <small>
            Así funcionan las IA modernas: ¡Miles de nodos y millones de conexiones como tu cerebro!
          </small>
        </div>
      )}

      {mostroLogro && (
        <div className="alert alert-info text-center mt-3 fw-bold" style={{ maxWidth: 500, margin: "auto" }}>
          <i className="bi bi-trophy-fill text-warning me-2"></i>
          ¡FELICITACIONES! Lograste el <span className="text-success">Puntaje Perfecto</span> y ganaste un logro 🏆
        </div>
      )}

      {puedeGuardar && !guardado && (
        <div className="d-flex justify-content-center mt-4">
          <button className="btn btn-success" onClick={guardarProgresoYLogro}>
            Guardar progreso {errores === 0 && "y registrar logro"}
          </button>
        </div>
      )}

      {historialProgreso.length > 0 && (
        <div className="my-4" style={{ maxWidth: 800, margin: "auto" }}>
          <h5>Historial de partidas</h5>
          <table className="table table-bordered table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>Avance</th>
                <th>Completado</th>
                <th>Fecha y Hora</th>
                <th>Aciertos</th>
                <th>Desaciertos</th>
              </tr>
            </thead>
            <tbody>
              {historialProgreso.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.avance ?? "-"}</td>
                  <td>{p.completado ? "✅" : "❌"}</td>
                  <td>{new Date(p.fechaActualizacion).toLocaleString()}</td>
                  <td>{typeof p.desaciertos === "number" ? (TOTAL_CONEXIONES - p.desaciertos) : "-"}</td>
                  <td>{p.desaciertos ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {errorGuardar && (
        <div className="alert alert-danger mt-3 text-center" style={{ maxWidth: 500, margin: "auto" }}>
          {errorGuardar}
        </div>
      )}

      {!instruccion && (
        <div className="d-flex justify-content-center mt-4 gap-3">
          <button className="btn btn-secondary" onClick={() => navigate(-1)}>
            Volver a Categoría
          </button>
          <button className="btn btn-primary" onClick={handleReset}>
            Jugar de nuevo
          </button>
        </div>
      )}
    </div>
  );
}
