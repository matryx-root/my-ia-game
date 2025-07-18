import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { useNavigate } from "react-router-dom";
import api from '../utils/api'; // Ajusta la ruta si es necesario

export default function DLGame({ usuario }) {
  const navigate = useNavigate();
  const gameRef = useRef(null);

  // Estados
  const [instruccion, setInstruccion] = useState(true);
  const [resultado, setResultado] = useState(null);
  const [juegoKey, setJuegoKey] = useState(0);
  const [aciertos, setAciertos] = useState(0);
  const [puedeGuardar, setPuedeGuardar] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [errorGuardar, setErrorGuardar] = useState(null);
  const [mostroLogro, setMostroLogro] = useState(false);
  const [historialProgreso, setHistorialProgreso] = useState([]);

  // Datos para progreso/logros
  const DL_GAME_ID = 5; // Cambia este ID según tu BD
  const TOTAL_NEURONAS = 10;
  const NOMBRE_LOGRO = "Red Profunda Perfecta";
  const DESC_LOGRO = "Activaste todas las neuronas sin fallos ni clicks dobles en Deep Learning.";

  // Cargar historial
  const cargarHistorial = async () => {
    if (!usuario || !usuario.id) return;
    try {
      const prog = await api.get(`/juegos/progreso/${usuario.id}`);
      setHistorialProgreso(
        Array.isArray(prog)
          ? prog.filter(p => p.juegoId === DL_GAME_ID)
          : []
      );
    } catch {
      setHistorialProgreso([]);
    }
  };

  // Phaser: Juego DL
  useEffect(() => {
    if (!instruccion && !gameRef.current) {
      let completed = false;
      let neurons = [];
      let clicks = 0;

      gameRef.current = new Phaser.Game({
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: 'game-container-dl',
        backgroundColor: '#ede7f6',
        scene: {
          preload: function() {
            this.load.image('neuron', 'https://labs.phaser.io/assets/particles/blue.png');
          },
          create: function() {
            this.add.text(40, 30, '🧠 Deep Learning: Haz clic en las neuronas para activarlas', { fontSize: '22px', fill: '#333' });
            neurons = [];
            completed = false;
            clicks = 0;

            for (let i = 0; i < TOTAL_NEURONAS; i++) {
              const x = Phaser.Math.Between(100, 700);
              const y = Phaser.Math.Between(100, 500);
              const neuron = this.add.image(x, y, 'neuron').setScale(1.6).setAlpha(0.85);
              neurons.push(neuron);
              neuron.setInteractive();
              neuron.input.enabled = true;
              neuron.on('pointerdown', () => {
                if (!neuron.input.enabled) return;
                neuron.setTint(0xffe082);
                neuron.setAlpha(0.3);
                neuron.input.enabled = false;
                clicks++;
                // Si todos están deshabilitados...
                if (neurons.every(n => !n.input.enabled) && !completed) {
                  completed = true;
                  this.add.text(200, 540, '¡Activaste toda la red neuronal!', { fontSize: '30px', fill: '#388e3c', fontStyle: 'bold' });
                  setResultado(
                    "¡Felicidades! Has activado todas las neuronas de la red, igual que una IA cuando aprende a resolver un problema."
                  );
                  setAciertos(TOTAL_NEURONAS);
                  setPuedeGuardar(true);
                }
              });
            }
          },
          update: function() {
            neurons.forEach(n => {
              if (n.input && n.input.enabled) n.rotation += 0.015;
            });
          }
        }
      });
    }
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [instruccion, juegoKey]);

  useEffect(() => {
    if (usuario && usuario.id) cargarHistorial();
  }, [usuario, juegoKey]);

// Guardar progreso y logro
const guardarProgresoYLogro = async () => {
  if (!usuario || !usuario.id) {
    setErrorGuardar('No hay usuario logueado.');
    return;
  }
  setErrorGuardar(null);

  try {
    const progresoPayload = {
      usuarioId: usuario.id,
      juegoId: DL_GAME_ID,
      avance: 100,
      completado: true,
      aciertos: TOTAL_NEURONAS,
      desaciertos: 0
    };
    await api.post('/juegos/progreso', progresoPayload);

    // Si hubo 0 errores, registra logro. Si quieres registrar logro sólo cuando acierta todo:
    if (TOTAL_NEURONAS > 0) {
      await api.post("/usuarios/achievement", {
        usuarioId: usuario.id,
        juegoId: DL_GAME_ID,
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

    // Opcional: Si el error es por token, api.js ya redirige, pero puedes limpiar localStorage aquí si quieres
    // if (err.message && err.message.toLowerCase().includes("token")) {
    //   localStorage.removeItem("token");
    // }
  }
};


  const handleReset = () => {
    setInstruccion(true);
    setResultado(null);
    setAciertos(0);
    setPuedeGuardar(false);
    setGuardado(false);
    setErrorGuardar(null);
    setMostroLogro(false);
    if (gameRef.current) {
      gameRef.current.destroy(true);
      gameRef.current = null;
    }
    setJuegoKey(k => k + 1);
  };

  const volverCategoria = () => navigate(-1);

  return (
    <div>
      {instruccion &&
        <div className="modal show d-block" tabIndex="-1" style={{
          background: 'rgba(0,0,0,0.3)',
          position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', zIndex: 1000
        }}>
          <div className="modal-dialog" style={{ marginTop: 100 }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">¿Qué es Deep Learning?</h5>
              </div>
              <div className="modal-body">
                <p>
                  <b>Deep Learning</b> es una técnica de inteligencia artificial donde muchas “neuronas” trabajan juntas para aprender.
                </p>
                <ul>
                  <li>Cada neurona es como un pequeño “cable” que ayuda a entender imágenes, textos o sonidos.</li>
                  <li>Las redes profundas pueden reconocer animales, caras, voces ¡y hasta ganarle a campeones de ajedrez!</li>
                </ul>
                <p>
                  <b>Tu reto:</b> Haz clic en cada neurona para “activarlas” y ver cómo funciona una red de IA.
                </p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={() => { setInstruccion(false); setJuegoKey(k => k + 1); }}>¡Jugar!</button>
              </div>
            </div>
          </div>
        </div>
      }

      <div id="game-container-dl" style={{ margin: 'auto', minHeight: 600 }} />

      {resultado && (
        <div className="alert alert-info mt-3" style={{ maxWidth: 800, margin: "auto" }}>
          {resultado}
          <br />
          <small>
            Así trabajan las redes neuronales profundas para aprender tareas difíciles. ¡Eres parte de la IA del futuro!
          </small>
        </div>
      )}

      {mostroLogro && (
        <div className="alert alert-info text-center mt-3 fw-bold" style={{ maxWidth: 500, margin: "auto" }}>
          <i className="bi bi-trophy-fill text-warning me-2"></i>
          ¡FELICITACIONES! Lograste el <span className="text-success">Logro de Deep Learning</span> y ganaste un logro 🏆
        </div>
      )}

      {puedeGuardar && !guardado && (
        <div className="d-flex justify-content-center mt-4">
          <button className="btn btn-success" onClick={guardarProgresoYLogro}>
            Guardar progreso y registrar logro
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
                  <td>{p.aciertos ?? "-"}</td>
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
          <button className="btn btn-secondary" onClick={volverCategoria}>
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
