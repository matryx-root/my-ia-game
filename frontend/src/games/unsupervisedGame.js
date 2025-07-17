import React, { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import { useNavigate } from "react-router-dom";
import api from "../utils/api"; // IMPORTANTE: ajusta si tu path es diferente

export default function UnsupervisedGame({ usuario }) {
  const gameRef = useRef(null);
  const navigate = useNavigate();
  const [fase, setFase] = useState("intro");
  const [colorActual, setColorActual] = useState(0);
  const [resultado, setResultado] = useState(null);
  const [juegoKey, setJuegoKey] = useState(0);

  // Estados para progreso/logro
  const [desaciertos, setDesaciertos] = useState(0);
  const [puedeGuardar, setPuedeGuardar] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [errorGuardar, setErrorGuardar] = useState(null);
  const [mostroLogro, setMostroLogro] = useState(false);
  const [historialProgreso, setHistorialProgreso] = useState([]);

  // Constantes del juego
  const UNSUP_GAME_ID = 4; // Cambia por el ID real en tu BD
  const NOMBRE_LOGRO = "Puntaje Perfecto Unsupervised";
  const DESC_LOGRO = "Agrupaste todos los colores sin errores en el juego no supervisado.";
  const TOTAL_FASES = 3;

  const colores = [
    { color: 0xff0000, nombre: "rojo", rgb: "#ff0000" },
    { color: 0x00ff00, nombre: "verde", rgb: "#00ff00" },
    { color: 0x0000ff, nombre: "azul", rgb: "#0000ff" },
  ];

  // Historial de partidas
  const cargarHistorial = async () => {
    if (!usuario || !usuario.id) return;
    try {
      const prog = await api.get(`/juegos/progreso/${usuario.id}`);
      setHistorialProgreso(
        Array.isArray(prog)
          ? prog.filter(p => p.juegoId === UNSUP_GAME_ID)
          : []
      );
    } catch {
      setHistorialProgreso([]);
    }
  };

  useEffect(() => {
    if (fase === "jugar" && !gameRef.current) {
      gameRef.current = new Phaser.Game({
        type: Phaser.AUTO,
        width: 600,
        height: 400,
        parent: "game-container-unsupervised",
        backgroundColor: "#e8eaf6",
        scene: {
          create: function () {
            this.add.text(60, 30, `Encuentra los 3 círculos ${colores[colorActual].nombre}s`, {
              fontSize: "22px",
              fill: "#222",
            });

            let circulos = [];
            let indices = [0, 1, 2, 0, 1, 2, 0, 1, 2];
            Phaser.Utils.Array.Shuffle(indices);
            let seleccionados = 0;

            indices.forEach((idx, i) => {
              let circ = this.add.circle(
                100 + (i % 3) * 150,
                120 + Math.floor(i / 3) * 90,
                35,
                colores[idx].color
              ).setInteractive({ useHandCursor: true });

              circ.esObjetivo = idx === colorActual;
              circ.seleccionado = false;

              circ.on("pointerdown", () => {
                if (fase !== "jugar") return;
                if (circ.esObjetivo && !circ.seleccionado) {
                  circ.setStrokeStyle(6, 0xffe082);
                  circ.seleccionado = true;
                  seleccionados++;
                  if (seleccionados === 3) {
                    setTimeout(() => {
                      if (colorActual < 2) {
                        setColorActual((c) => c + 1);
                        setFase("jugar");
                        if (gameRef.current) {
                          gameRef.current.destroy(true);
                          gameRef.current = null;
                        }
                      } else {
                        setResultado(
                          "¡Excelente! Agrupaste los colores igual que una IA. Así, la IA puede descubrir patrones sin saber los nombres."
                        );
                        setFase("fin");
                        setPuedeGuardar(true);
                        if (gameRef.current) {
                          gameRef.current.destroy(true);
                          gameRef.current = null;
                        }
                      }
                    }, 650);
                  }
                } else if (!circ.esObjetivo && !circ.seleccionado) {
                  circ.setStrokeStyle(6, 0xe57373);
                  circ.seleccionado = true;
                  setDesaciertos(d => d + 1);
                  setTimeout(() => {
                    circ.setStrokeStyle(0, 0x000000);
                    circ.seleccionado = false;
                  }, 650);
                }
              });
            });
            this.add.text(60, 340, "Haz clic solo en los del color pedido.", {
              fontSize: "18px",
              fill: "#555",
            });
          },
        },
      });
    }
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [fase, colorActual, juegoKey]); // eslint-disable-line

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
        juegoId: UNSUP_GAME_ID,
        avance: 100,
        completado: true,
        aciertos: TOTAL_FASES * 3 - desaciertos,
        desaciertos
      };
      await api.post('/juegos/progreso', progresoPayload);

      if (desaciertos === 0) {
        await api.post("/usuarios/achievement", {
          usuarioId: usuario.id,
          juegoId: UNSUP_GAME_ID,
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

  const volverCategoria = () => navigate(-1);

  const handleReset = () => {
    setColorActual(0);
    setResultado(null);
    setFase("jugar");
    setJuegoKey((k) => k + 1);
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

  // --- RENDER ---
  return (
    <div>
      {/* Modal de introducción */}
      {fase === "intro" && (
        <div className="modal show d-block" tabIndex="-1" style={{
          background: 'rgba(0,0,0,0.3)',
          position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', zIndex: 1000
        }}>
          <div className="modal-dialog" style={{ marginTop: 100 }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Agrupamiento automático</h5>
              </div>
              <div className="modal-body">
                <p>
                  <b>Aprendizaje no supervisado</b> es cuando la IA <b>agrupa</b> cosas parecidas, ¡pero nadie le dice cómo se llaman!
                </p>
                <ul>
                  <li>Tu reto: <b>Haz clic solo en los 3 del mismo color</b>. Así, la IA agrupa por similitud.</li>
                  <li>La IA usa esto para clasificar fotos, sonidos, y más, aunque no tenga etiquetas.</li>
                </ul>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={() => { setColorActual(0); setFase("jugar"); }}>¡Empezar!</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contenedor de juego */}
      <div id="game-container-unsupervised" style={{ margin: 'auto', minHeight: 400, maxWidth: 620 }} />

      {/* Vista final */}
      {fase === "fin" && (
        <div>
          <div style={{ textAlign: "center", margin: "20px 0" }}>
            <div style={{ display: "flex", justifyContent: "center", gap: 40 }}>
              {colores.map((c, i) => (
                <div key={c.nombre}>
                  <div>
                    {[0, 1, 2].map(j => (
                      <span key={c.nombre + j} style={{
                        display: "inline-block",
                        width: 35, height: 35, borderRadius: "50%",
                        background: c.rgb, margin: "0 2px"
                      }} />
                    ))}
                  </div>
                  <div style={{ fontSize: 14, color: c.rgb }}>Grupo {c.nombre.charAt(0).toUpperCase() + c.nombre.slice(1)}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="alert alert-success mt-3" style={{ maxWidth: 600, margin: "auto" }}>
            {resultado}
            <br />
            <small>
              ¿Dónde podrías usar esto? Por ejemplo, agrupar fotos, notas o canciones por similitud, ¡sin saber sus nombres!
            </small>
          </div>
        </div>
      )}

      {/* Logro */}
      {mostroLogro && (
        <div className="alert alert-info text-center mt-3 fw-bold" style={{ maxWidth: 500, margin: "auto" }}>
          <i className="bi bi-trophy-fill text-warning me-2"></i>
          ¡FELICITACIONES! Lograste el <span className="text-success">Puntaje Perfecto</span> y ganaste un logro 🏆
        </div>
      )}

      {/* Guardar progreso */}
      {puedeGuardar && !guardado && (
        <div className="d-flex justify-content-center mt-4">
          <button className="btn btn-success" onClick={guardarProgresoYLogro}>
            Guardar progreso {desaciertos === 0 && "y registrar logro"}
          </button>
        </div>
      )}

      {/* Historial de partidas */}
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
                  <td>{typeof p.desaciertos === "number" ? (TOTAL_FASES * 3 - p.desaciertos) : "-"}</td>
                  <td>{p.desaciertos ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Errores */}
      {errorGuardar && (
        <div className="alert alert-danger mt-3 text-center" style={{ maxWidth: 500, margin: "auto" }}>
          {errorGuardar}
        </div>
      )}

      {/* Botones de control */}
      {fase !== "intro" && (
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
