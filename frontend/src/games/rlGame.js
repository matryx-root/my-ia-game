import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api'; // Ajusta el path si es necesario

export default function RLGame({ usuario }) {
  const gameRef = useRef(null);
  const navigate = useNavigate();

  // Estados generales
  const [instruccion, setInstruccion] = useState(true);
  const [resultado, setResultado] = useState(null);
  const [juegoKey, setJuegoKey] = useState(0);

  // Estados para progreso y logros
  const [intentos, setIntentos] = useState(0);
  const [puedeGuardar, setPuedeGuardar] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [errorGuardar, setErrorGuardar] = useState(null);
  const [mostroLogro, setMostroLogro] = useState(false);
  const [historialProgreso, setHistorialProgreso] = useState([]);

  // Datos para el sistema de progreso/logros
  const RL_GAME_ID = 4; // Cambia este ID según tu BD
  const NOMBRE_LOGRO = "Premio RL Experto";
  const DESC_LOGRO = "Adivinaste el botón correcto en el primer intento en RL.";
  const TOTAL_BOTONES = 5;

  // Cargar historial de partidas
  const cargarHistorial = async () => {
    if (!usuario || !usuario.id) return;
    try {
      const prog = await api.get(`/juegos/progreso/${usuario.id}`);
      setHistorialProgreso(
        Array.isArray(prog)
          ? prog.filter(p => p.juegoId === RL_GAME_ID)
          : []
      );
    } catch {
      setHistorialProgreso([]);
    }
  };

  const iniciarJuego = () => {
    setInstruccion(false);
    setResultado(null);
    setIntentos(0);
    setPuedeGuardar(false);
    setGuardado(false);
    setErrorGuardar(null);
    setMostroLogro(false);
    setJuegoKey(k => k + 1);
  };

  // Phaser: Juego RL
  useEffect(() => {
    if (!instruccion && !gameRef.current) {
      let terminado = false;
      let intentosLocal = 0;
      let botonGanador = Phaser.Math.Between(1, TOTAL_BOTONES);

      gameRef.current = new Phaser.Game({
        type: Phaser.AUTO,
        width: 900,
        height: 480,
        parent: 'game-container-rl',
        backgroundColor: '#ffe0b2',
        scene: {
          create: function () {
            this.add.text(450, 60, "💪 RL: ¡Encuentra el botón ganador por prueba y error!", {
              fontFamily: "Arial",
              fontSize: '28px',
              color: "#444",
            }).setOrigin(0.5);

            let feedback = this.add.text(450, 380, "", {
              fontFamily: "Arial",
              fontSize: '26px',
              color: "#1976d2"
            }).setOrigin(0.5);

            for (let i = 1; i <= TOTAL_BOTONES; i++) {
              const x = 120 + (i - 1) * 160; 
              const y = 210;

              const btn = this.add.circle(x, y, 60, 0x64b5f6).setInteractive({ useHandCursor: true });
              btn.setStrokeStyle(5, 0x1976d2);
              btn.defaultColor = 0x64b5f6;

              this.add.text(x, y - 15, i, {
                fontFamily: "Arial Black",
                fontSize: '40px',
                color: "#fff"
              }).setOrigin(0.5);

              this.add.text(x, y + 32, "🔘", { fontSize: '28px' }).setOrigin(0.5);

              btn.on('pointerover', () => {
                if (!terminado) btn.setFillStyle(0x90caf9);
              });
              btn.on('pointerout', () => {
                if (!terminado) btn.setFillStyle(btn.defaultColor);
              });

              btn.on('pointerdown', () => {
                if (terminado) return;
                intentosLocal++;
                setIntentos(intentosLocal);
                if (i === botonGanador) {
                  btn.setFillStyle(0x43a047);
                  btn.setStrokeStyle(6, 0x2e7d32);
                  feedback.setText(`¡Correcto! Ganaste en ${intentosLocal} intento${intentosLocal > 1 ? "s" : ""} 🏆`);
                  terminado = true;
                  setResultado(
                    "Así aprende la IA con refuerzo: prueba muchas veces, recibe premios si acierta y aprende qué opción es mejor. ¡Cuantas más veces juega, más aprende a ganar!"
                  );
                  setPuedeGuardar(true);

                  for (let s = 0; s < 10; s++) {
                    const star = this.add.star(x, y, 6, 5, 18, 0xffeb3b);
                    this.tweens.add({
                      targets: star,
                      x: x + Math.cos((Math.PI * 2 * s) / 10) * 90,
                      y: y + Math.sin((Math.PI * 2 * s) / 10) * 90,
                      alpha: 0,
                      duration: 900,
                      onComplete: () => star.destroy()
                    });
                  }
                } else {
                  btn.setFillStyle(0xef5350); 
                  feedback.setText("No era ese. ¡Sigue probando…! 🔄");
                  setTimeout(() => btn.setFillStyle(btn.defaultColor), 600);
                }
              });
            }
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
        juegoId: RL_GAME_ID,
        avance: 100,
        completado: true,
        aciertos: 1, // RL clásico: 1 partida ganada
        desaciertos: intentos > 0 ? intentos - 1 : 0 // fallos antes de acertar
      };
      await api.post('/juegos/progreso', progresoPayload);

      if (intentos === 1) {
        await api.post("/usuarios/achievement", {
          usuarioId: usuario.id,
          juegoId: RL_GAME_ID,
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

  const handleReset = () => {
    setInstruccion(true);
    setResultado(null);
    setJuegoKey(k => k + 1);
    setIntentos(0);
    setPuedeGuardar(false);
    setGuardado(false);
    setErrorGuardar(null);
    setMostroLogro(false);
    if (gameRef.current) {
      gameRef.current.destroy(true);
      gameRef.current = null;
    }
  };

  const volverCategoria = () => navigate(-1);

  // --- Render ---
  return (
    <div>
      {instruccion && (
        <div className="modal show d-block" tabIndex="-1" style={{
          background: 'rgba(0,0,0,0.3)',
          position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', zIndex: 1000
        }}>
          <div className="modal-dialog" style={{ marginTop: 100 }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-center w-100">¿Cómo aprende una IA con RL?</h5>
              </div>
              <div className="modal-body text-center">
                <p>
                  <b>Aprendizaje por Refuerzo</b> (RL) es cuando una IA prueba distintas opciones y aprende cuál es la mejor.<br />
                  <span style={{ fontSize: 18 }}>
                    Si acierta, ¡recibe un premio!<br /> Si falla, lo intenta de nuevo y aprende para la próxima.
                  </span>
                </p>
                <ul style={{ textAlign: 'left', maxWidth: 350, margin: '0 auto', fontSize: 17 }}>
                  <li>Como cuando buscas la puerta correcta en un laberinto 🏰</li>
                  <li>O pruebas qué comida te gusta más 🍦</li>
                  <li>Los robots y videojuegos inteligentes aprenden así 🤖🎮</li>
                </ul>
                <p>
                  <b>Tu reto:</b> Descubre el botón ganador.<br />
                  ¡Cuantas más veces juegues, más fácil lo harás!
                </p>
              </div>
              <div className="modal-footer justify-content-center">
                <button className="btn btn-primary btn-lg px-4" onClick={iniciarJuego}>¡Jugar!</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div id="game-container-rl" style={{
        margin: '30px auto 0 auto',
        minHeight: 480,
        maxWidth: 980,
        background: '#ffe0b2',
        borderRadius: 16,
        boxShadow: '0 2px 8px #ccc'
      }} />

      {resultado && (
        <div className="alert alert-success mt-3 text-center" style={{ maxWidth: 780, margin: "auto" }}>
          <b>¡Así aprende una IA real!</b>
          <br />
          {resultado}
          <br />
          <small>
            ¿Cuándo en tu vida aprendiste algo probando muchas veces?
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
            Guardar progreso {intentos === 1 && "y registrar logro"}
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
                <th>Intentos</th>
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
                  <td>{(p.desaciertos !== undefined) ? p.desaciertos + 1 : "-"}</td>
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
          <button className="btn btn-secondary btn-lg" onClick={volverCategoria}>
            ← Volver a Categoría
          </button>
          <button className="btn btn-primary btn-lg" onClick={handleReset}>
            Jugar de nuevo
          </button>
        </div>
      )}
    </div>
  );
}
