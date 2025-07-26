import React, { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function ComputerVisionGame({ usuario }) {
  const gameRef = useRef(null);
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const [nivel, setNivel] = useState(0);
  const [fase, setFase] = useState("intro");
  const [resultado, setResultado] = useState(null);
  const [puedeGuardar, setPuedeGuardar] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [mostroLogro, setMostroLogro] = useState(false);
  const [errorGuardar, setErrorGuardar] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [cargandoHistorial, setCargandoHistorial] = useState(false);

  // IDs y textos
  const COMPUTER_VISION_GAME_ID = 11;
  const NOMBRE_LOGRO = "Semáforo Vision Perfecta";
  const DESC_LOGRO = "Completaste el reto de visión computacional reconociendo todos los colores del semáforo.";

  const colores = [
    { color: 0xff0000, nombre: "rojo", accion: "Detenerse 🛑" },
    { color: 0xffeb3b, nombre: "amarillo", accion: "Precaución ⚠️" },
    { color: 0x00e676, nombre: "verde", accion: "Avanzar 🚗💨" }
  ];

  // Cargar historial
  const cargarHistorial = async () => {
    if (!usuario || !usuario.id) return;
    setCargandoHistorial(true);
    try {
      const prog = await api.get(`/juegos/progreso/${usuario.id}`);
      setHistorial(
        Array.isArray(prog)
          ? prog.filter(p => p.juegoId === COMPUTER_VISION_GAME_ID)
          : []
      );
    } catch {
      setHistorial([]);
    } finally {
      setCargandoHistorial(false);
    }
  };

  useEffect(() => {
    if (usuario && usuario.id) cargarHistorial();
  }, [usuario]);

  // Cálculo de tamaño responsivo
  const getGameSize = () => {
    const width = Math.min(
      window.innerWidth * 0.9,
      500
    );
    const height = width * 1.2; // Proporción 5:6
    return { width, height };
  };

  // Lógica Phaser
  useEffect(() => {
    if ((fase === "jugar" || fase === "fin") && !gameRef.current) {
      const { width, height } = getGameSize();

      gameRef.current = new Phaser.Game({
        type: Phaser.AUTO,
        width,
        height,
        parent: "game-container-computervision",
        backgroundColor: "#f3e5f5",
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH
        },
        scene: {
          create: function () {
            // Títulos responsivos
            const titleSize = Math.min(width * 0.05, 24);
            const textSize = Math.min(width * 0.04, 18);

            this.add.text(30, 30, `🚦 Computer Vision: Semáforo - Nivel ${fase === "fin" ? "Final" : nivel + 1}`, {
              fontFamily: "Montserrat, sans-serif",
              fontSize: `${titleSize}px`,
              fill: "#222",
              align: "center",
              wordWrap: { width: width - 60 }
            });

            this.add.text(30, 65, fase === "fin"
              ? "¡Observa el semáforo completo!"
              : `Selecciona el círculo ${colores[nivel].nombre}`, {
              fontFamily: "Montserrat, sans-serif",
              fontSize: `${textSize}px`,
              fill: "#333",
              align: "center",
              wordWrap: { width: width - 60 }
            });

            // Posiciones y radios responsivos
            const rectHeight = height * 0.6;
            const circleRadius = Math.min(width * 0.12, 60);
            const positions = [height * 0.3, height * 0.5, height * 0.7];

            this.add.rectangle(width / 2, height / 2, 22, rectHeight, 0x333333).setDepth(-1);

            const resaltar = fase === "fin" ? -1 : nivel;
            for (let i = 0; i < 3; i++) {
              let alpha = resaltar === -1 ? 1 : (i === resaltar ? 1 : 0.35);
              let circ = this.add.circle(width / 2, positions[i], circleRadius, colores[i].color)
                .setAlpha(alpha)
                .setInteractive({ useHandCursor: fase !== "fin" });

              if (fase !== "fin") {
                circ.on("pointerdown", () => {
                  if (i === nivel) {
                    circ.setStrokeStyle(Math.max(5, Math.floor(width * 0.015)), 0x388e3c);
                    this.add.text(width * 0.2, height * 0.85, colores[i].accion, {
                      fontSize: `${Math.min(width * 0.07, 28)}px`,
                      fill: "#388e3c",
                      fontFamily: "Montserrat, sans-serif"
                    });
                    setTimeout(() => {
                      if (nivel < 2) {
                        setNivel((n) => n + 1);
                        setFase("jugar");
                      } else {
                        setFase("fin");
                        setResultado("¡Felicidades! Has aprendido a reconocer el semáforo como un auto inteligente. Así es como los autos autónomos, robots y cámaras inteligentes usan la visión computacional para tomar decisiones.");
                        setPuedeGuardar(true);
                      }
                    }, 900);
                  } else {
                    circ.setStrokeStyle(Math.max(5, Math.floor(width * 0.015)), 0xd32f2f);
                    this.add.text(width * 0.2, height * 0.9, "¡No es el color correcto!", {
                      fontSize: `${Math.min(width * 0.05, 18)}px`,
                      fill: "#d32f2f",
                      fontFamily: "Montserrat, sans-serif"
                    });
                    setTimeout(() => {
                      circ.setStrokeStyle();
                      this.children.list
                        .filter(t => t.text && t.text.startsWith("¡No es el color"))
                        .forEach(t => t.destroy());
                    }, 700);
                  }
                });
              }
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
  }, [fase, nivel]);

  // Manejo de redimensionado (opcional)
  useEffect(() => {
    const handleResize = () => {
      if (gameRef.current && (fase === "jugar" || fase === "fin")) {
        // Reiniciar el juego para ajustar tamaño
        setFase(f => f);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [fase]);

  // Guardar progreso
  const guardarProgresoYLogro = async () => {
    if (!usuario || !usuario.id) {
      setErrorGuardar('No hay usuario logueado.');
      return;
    }
    setErrorGuardar(null);
    try {
      const progresoPayload = {
        usuarioId: usuario.id,
        juegoId: COMPUTER_VISION_GAME_ID,
        avance: 100,
        completado: true,
        aciertos: 3,
        desaciertos: 0
      };
      await api.post('/juegos/progreso', progresoPayload);
      await api.post("/usuarios/achievement", {
        usuarioId: usuario.id,
        juegoId: COMPUTER_VISION_GAME_ID,
        nombre: NOMBRE_LOGRO,
        descripcion: DESC_LOGRO
      });
      setMostroLogro(true);
      setGuardado(true);
      setPuedeGuardar(false);
      cargarHistorial();
    } catch (err) {
      setErrorGuardar("Error al guardar: " + (err?.message || (err?.error ?? "")));
      setGuardado(false);
      setPuedeGuardar(true);
    }
  };

  const reiniciar = () => {
    setNivel(0);
    setFase("jugar");
    setResultado(null);
    setPuedeGuardar(false);
    setGuardado(false);
    setMostroLogro(false);
    setErrorGuardar(null);
    if (gameRef.current) {
      gameRef.current.destroy(true);
      gameRef.current = null;
    }
  };

  const volverCategoria = () => navigate(-1);

  return (
    <div className="game-container">
      {/* Modal de instrucción */}
      {fase === "intro" && (
        <div className="modal show d-block" tabIndex="-1" style={{
          background: 'rgba(0,0,0,0.4)',
          position: 'fixed',
          inset: 0,
          zIndex: 1050
        }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">¿Cómo "ven" los autos el semáforo?</h5>
              </div>
              <div className="modal-body">
                <p>
                  <b>Visión computacional</b> permite a los autos autónomos, robots y cámaras inteligentes "ver" el semáforo, identificar el color y decidir qué hacer: avanzar, detenerse o tener precaución.
                </p>
                <ul>
                  <li>Rojo: Detenerse</li>
                  <li>Amarillo: Precaución</li>
                  <li>Verde: Avanzar</li>
                </ul>
                <p>
                  Tu reto: <b>Selecciona el color correcto del semáforo en cada nivel.</b>
                </p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={() => setFase("jugar")}>¡Jugar!</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contenedor del juego */}
      <div
        ref={containerRef}
        id="game-container-computervision"
        style={{
          margin: 'clamp(20px, 5vw, 40px) auto',
          minHeight: '400px',
          maxWidth: '100%',
          width: 'clamp(300px, 90vw, 500px)',
          aspectRatio: '5 / 6',
          background: "#fff",
          borderRadius: '18px',
          boxShadow: "0 2px 14px 2px #e0e0e0"
        }}
      />

      {/* Resultado y botones */}
      {fase === "fin" && (
        <>
          <div className="alert alert-success mt-3" style={{
            maxWidth: 'clamp(300px, 90vw, 600px)',
            margin: "clamp(20px, 5vw, 40px) auto",
            textAlign: "center",
            fontSize: 'clamp(0.9rem, 4vw, 1.1rem)'
          }}>
            <div style={{ fontSize: 'clamp(2rem, 8vw, 2.8rem)', marginBottom: 10 }}>🚦</div>
            <b>¡Felicidades! Has aprendido a reconocer el semáforo como un auto inteligente.</b>
            <p style={{ margin: "10px 0" }}>
              Así es como los autos autónomos, robots y cámaras inteligentes usan la visión computacional para tomar decisiones.
            </p>
            <b>¿Puedes ver el semáforo y decidir qué hacer como un auto inteligente?</b>
          </div>

          {puedeGuardar && !guardado && usuario && (
            <div className="d-flex justify-content-center mt-4">
              <button className="btn btn-success" onClick={guardarProgresoYLogro} style={{
                fontSize: 'clamp(1rem, 4vw, 1.2rem)',
                padding: '0.6em 1.5em'
              }}>
                Guardar progreso y registrar logro
              </button>
            </div>
          )}

          {mostroLogro && (
            <div className="alert alert-success mt-3 text-center fw-bold" style={{
              maxWidth: 'clamp(300px, 90vw, 500px)',
              margin: "auto"
            }}>
              <i className="bi bi-trophy-fill text-warning me-2"></i>
              ¡LOGRO GANADO! Semáforo Vision Perfecta 🏆
            </div>
          )}

          {errorGuardar && (
            <div className="alert alert-danger mt-3 text-center" style={{
              maxWidth: 'clamp(300px, 90vw, 500px)',
              margin: "auto"
            }}>
              {errorGuardar}
            </div>
          )}
        </>
      )}

      {/* Historial */}
      {usuario && (
        <div className="mt-4" style={{ maxWidth: 'clamp(300px, 90vw, 700px)', margin: "0 auto" }}>
          <h5 className="text-center mb-3">Historial de partidas</h5>
          {cargandoHistorial ? (
            <div className="text-center">Cargando historial...</div>
          ) : historial.length === 0 ? (
            <div className="text-center text-muted">Aún no tienes registros para este juego.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-striped table-sm">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Fecha</th>
                    <th>Aciertos</th>
                    <th>Desaciertos</th>
                    <th>Completado</th>
                  </tr>
                </thead>
                <tbody>
                  {historial.map((h, i) => (
                    <tr key={h.id || i}>
                      <td>{historial.length - i}</td>
                      <td>{h.fechaActualizacion ? new Date(h.fechaActualizacion).toLocaleString() : "—"}</td>
                      <td>{h.aciertos}</td>
                      <td>{h.desaciertos}</td>
                      <td>{h.completado ? "✅" : "❌"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Botones de navegación */}
      {fase !== "intro" && (
        <div className="d-flex justify-content-center mt-4 gap-3 flex-wrap">
          <button className="btn btn-secondary" onClick={volverCategoria} style={{
            fontSize: 'clamp(0.9rem, 4vw, 1rem)'
          }}>
            Volver a Categoría
          </button>
          <button className="btn btn-primary" onClick={reiniciar} style={{
            fontSize: 'clamp(0.9rem, 4vw, 1rem)'
          }}>
            Jugar de nuevo
          </button>
        </div>
      )}
    </div>
  );
}