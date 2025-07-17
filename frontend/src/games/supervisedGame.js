import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api'; // Asegúrate de tenerlo

export default function SupervisedGame({ usuario }) {
  const gameRef = useRef(null);
  const navigate = useNavigate();
  const [instruccion, setInstruccion] = useState(true);
  const [resultado, setResultado] = useState(null);
  const [ejemplo, setEjemplo] = useState(0);
  const [juegoKey, setJuegoKey] = useState(0);

  // Nuevos estados para progreso/logros
  const [puedeGuardar, setPuedeGuardar] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [errorGuardar, setErrorGuardar] = useState(null);
  const [desaciertos, setDesaciertos] = useState(0);
  const [mostroLogro, setMostroLogro] = useState(false);
  const [historialProgreso, setHistorialProgreso] = useState([]);

  // Constantes del juego
  const SUP_GAME_ID = 3; // Usa el ID real en tu DB
  const NOMBRE_LOGRO = "Puntaje Perfecto Supervisado";
  const DESC_LOGRO = "Identificaste todas las frutas correctamente en el juego supervisado.";
  const TOTAL_FRUTAS = 5;

  const frutas = [
    { nombre: 'Manzana', emoji: '🍎' },
    { nombre: 'Plátano', emoji: '🍌' },
    { nombre: 'Uva', emoji: '🍇' },
    { nombre: 'Sandía', emoji: '🍉' },
    { nombre: 'Pera', emoji: '🍐' }
  ];

  // Cargar historial de partidas
  const cargarHistorial = async () => {
    if (!usuario || !usuario.id) return;
    try {
      const prog = await api.get(`/juegos/progreso/${usuario.id}`);
      setHistorialProgreso(
        Array.isArray(prog)
          ? prog.filter(p => p.juegoId === SUP_GAME_ID)
          : []
      );
    } catch {
      setHistorialProgreso([]);
    }
  };

  // Juego Phaser
  useEffect(() => {
    if (!instruccion && !gameRef.current) {
      let currentFruitIdx = ejemplo;
      let completed = false;

      gameRef.current = new Phaser.Game({
        type: Phaser.AUTO,
        width: 600,
        height: 400,
        parent: 'game-container-supervised',
        backgroundColor: '#fffde7',
        scene: {
          create: function () {
            this.add.text(300, 36, "🍎 Juego Supervisado: ¿Qué fruta es?", {
              fontSize: '23px', fill: '#333', fontFamily: 'Arial', fontStyle: 'bold'
            }).setOrigin(0.5);

            const fruta = frutas[currentFruitIdx];
            this.add.text(300, 120, fruta.emoji, { fontSize: '110px' }).setOrigin(0.5);

            let feedback = this.add.text(300, 320, '', { fontSize: '21px', fill: '#388e3c', fontFamily: 'Arial' }).setOrigin(0.5);

            frutas.forEach((f, idxBtn) => {
              const bx = 170 + idxBtn * 80;
              let btn = this.add.circle(bx, 230, 42, 0xa5d6a7)
                .setStrokeStyle(4, 0x388e3c)
                .setInteractive({ useHandCursor: true });
              let label = this.add.text(bx, 230, f.nombre, {
                fontSize: '16px',
                color: '#333',
                fontFamily: 'Arial'
              }).setOrigin(0.5);

              btn.on('pointerover', () => btn.setFillStyle(0xdcedc8));
              btn.on('pointerout', () => btn.setFillStyle(0xa5d6a7));
              btn.on('pointerdown', () => {
                if (completed) return;
                if (f.nombre === fruta.nombre) {
                  btn.setFillStyle(0x81c784).setStrokeStyle(4, 0x1b5e20);
                  label.setColor('#1b5e20');
                  feedback.setText('¡Correcto! Así aprende una IA con ejemplos.');
                  completed = true;
                  setTimeout(() => {
                    if (currentFruitIdx + 1 < TOTAL_FRUTAS) {
                      setEjemplo(e => e + 1);
                      setResultado(null);
                      if (gameRef.current) {
                        gameRef.current.destroy(true);
                        gameRef.current = null;
                      }
                    } else {
                      setResultado("¡Terminaste todos los ejemplos! Así entrenan las IA: ¡con muchos ejemplos y etiquetas!");
                      setPuedeGuardar(true);
                    }
                  }, 900);
                } else {
                  btn.setFillStyle(0xffb3b3).setStrokeStyle(4, 0xb71c1c);
                  label.setColor('#b71c1c');
                  feedback.setText('Intenta otra vez...');
                  setDesaciertos(d => d + 1);
                  setTimeout(() => {
                    btn.setFillStyle(0xa5d6a7).setStrokeStyle(4, 0x388e3c);
                    label.setColor('#333');
                  }, 700);
                }
              });
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
  }, [instruccion, juegoKey, ejemplo]); // eslint-disable-line

  // Cargar historial cada vez que cambia usuario o reinicias
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
        juegoId: SUP_GAME_ID,
        avance: 100,
        completado: true,
        aciertos: TOTAL_FRUTAS - desaciertos,
        desaciertos
      };
      await api.post('/juegos/progreso', progresoPayload);

      if (desaciertos === 0) {
        await api.post("/usuarios/achievement", {
          usuarioId: usuario.id,
          juegoId: SUP_GAME_ID,
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

  // Reiniciar juego
  const handleReset = () => {
    setInstruccion(true);
    setResultado(null);
    setEjemplo(0);
    setJuegoKey(k => k + 1);
    setPuedeGuardar(false);
    setGuardado(false);
    setErrorGuardar(null);
    setMostroLogro(false);
    setDesaciertos(0);
    if (gameRef.current) {
      gameRef.current.destroy(true);
      gameRef.current = null;
    }
  };

  const volverCategoria = () => navigate(-1);

  // --- RENDER ---
  return (
    <div>
      {instruccion && (
        <div className="modal show d-block" tabIndex="-1" style={{
          background: 'rgba(0,0,0,0.3)',
          position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', zIndex: 1000
        }}>
          <div className="modal-dialog" style={{ marginTop: 90 }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">¿Qué es Aprendizaje Supervisado?</h5>
              </div>
              <div className="modal-body">
                <p>
                  <b>Aprendizaje supervisado</b> es cuando una IA aprende con muchos ejemplos y sus respuestas correctas.
                </p>
                <ul>
                  <li>Ejemplo: “Esto es una manzana 🍎”, “Esto es un plátano 🍌”</li>
                  <li>Así la IA aprende a reconocer objetos o palabras según las etiquetas</li>
                  <li>Sirve para clasificadores de imágenes, spam, diagnósticos y más</li>
                </ul>
                <p>Tu reto: <b>Clasifica la fruta correctamente</b>. ¡Estás entrenando tu propio mini-modelo!</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={() => { setInstruccion(false); setResultado(null); setEjemplo(0); setJuegoKey(k => k + 1); }}>¡Jugar!</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div id="game-container-supervised" style={{
        margin: '30px auto 0 auto',
        minHeight: 400,
        maxWidth: 680,
        background: '#fffde7',
        borderRadius: 14,
        boxShadow: '0 2px 8px #fff9c4'
      }} />

      {resultado && (
        <div className="alert alert-success mt-3 text-center" style={{ maxWidth: 600, margin: "auto" }}>
          {resultado}
          <br />
          <small>
            Así se entrenan modelos de IA: ¡Con ejemplos y respuestas correctas!
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
            Guardar progreso {desaciertos === 0 && "y registrar logro"}
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
                  <td>{typeof p.desaciertos === "number" ? (TOTAL_FRUTAS - p.desaciertos) : "-"}</td>
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
            ← Volver a Categoría
          </button>
          <button className="btn btn-primary" onClick={handleReset}>
            Jugar de nuevo
          </button>
        </div>
      )}
    </div>
  );
}
