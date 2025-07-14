// src/games/mlGame.js
import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function MLClusterGame({ usuario }) {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const gameRef = useRef(null);
  const [instruccion, setInstruccion] = useState(true);
  const [resultado, setResultado] = useState(null);
  const [juegoKey, setJuegoKey] = useState(0);
  const [puedeGuardar, setPuedeGuardar] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [errorGuardar, setErrorGuardar] = useState(null);
  const [desaciertos, setDesaciertos] = useState(0);
  const [mostroLogro, setMostroLogro] = useState(false);
  const [historialProgreso, setHistorialProgreso] = useState([]);

  const ML_GAME_ID = 2;
  const TOTAL_PUNTOS = 12;
  const NOMBRE_LOGRO = "Puntaje Perfecto ML";
  const DESC_LOGRO = "Obtuviste 12/12 aciertos en el juego de Clustering.";

  // Función para obtener tamaño responsivo
  const getResponsiveSize = () => {
    const minWidth = 340; // para móviles
    const maxWidth = 900;
    let width = window.innerWidth;
    let height = window.innerHeight;
    if (containerRef.current) {
      const bounds = containerRef.current.getBoundingClientRect();
      width = Math.max(minWidth, Math.min(maxWidth, bounds.width));
      height = Math.max(350, Math.min(700, Math.round(bounds.width * 0.75)));
    }
    if (width > maxWidth) width = maxWidth;
    return { width, height };
  };

  // Cargar historial de partidas
  const cargarHistorial = async () => {
    if (!usuario || !usuario.id) return;
    try {
      const prog = await api.get(`/juegos/progreso/${usuario.id}`);
      setHistorialProgreso(
        Array.isArray(prog)
          ? prog.filter(p => p.juegoId === ML_GAME_ID)
          : []
      );
    } catch {
      setHistorialProgreso([]);
    }
  };

  const iniciarJuego = () => setInstruccion(false);

  // Destruye Phaser cuando cambia el tamaño, la instrucción o el usuario
  useEffect(() => {
    if (gameRef.current) {
      gameRef.current.destroy(true);
      gameRef.current = null;
    }
    setPuedeGuardar(false);
    setGuardado(false);
    setErrorGuardar(null);
    setDesaciertos(0);
    setMostroLogro(false);
    // eslint-disable-next-line
  }, [instruccion, juegoKey, usuario]);

  // Crea el juego cuando instrucción está cerrada
  useEffect(() => {
    if (instruccion) return;

    let clusters = [
      { color: 0x29b6f6, name: 'Azul' },
      { color: 0x66bb6a, name: 'Verde' },
      { color: 0xffca28, name: 'Amarillo' }
    ];
    let puntos = [];
    let desaciertosTemp = 0;

    let { width, height } = getResponsiveSize();

    // Calcula posiciones y radios proporcionalmente
    const clusterRadius = Math.max(40, Math.floor(width / 10));
    const pointRadius = Math.max(15, Math.floor(width / 35));
    const baseY = height - clusterRadius - 30;

    // Phaser game
    gameRef.current = new Phaser.Game({
      type: Phaser.AUTO,
      width,
      height,
      parent: 'game-container-ml-cluster',
      backgroundColor: '#f3f7fa',
      scale: { mode: Phaser.Scale.NONE },
      scene: {
        create: function () {
          this.completed = false;
          this.asignados = 0;
          puntos = [];
          desaciertosTemp = 0;

          this.add.text(25, 20, '🤖 ML: Agrupa los puntos por color (Clustering)', { fontSize: `${Math.max(14, Math.floor(width/36))}px`, fill: '#333' });
          this.add.text(40, 45, 'Haz clic en cada punto y arrástralo al grupo correcto', { fontSize: `${Math.max(12, Math.floor(width/46))}px`, fill: '#444' });

          clusters.forEach((cl, idx) => {
            // Los círculos y textos se distribuyen proporcionalmente
            const cx = (width/(clusters.length+1)) * (idx+1);
            this.add.circle(cx, baseY, clusterRadius, cl.color, 0.18).setStrokeStyle(3, cl.color);
            this.add.text(cx - 30, baseY + clusterRadius + 7, cl.name, { fontSize: Math.max(14, Math.floor(width/46)), fill: '#555' });
          });

          for (let i = 0; i < TOTAL_PUNTOS; i++) {
            const clusterIdx = Phaser.Math.Between(0, clusters.length - 1);
            const color = clusters[clusterIdx].color;
            const px = Phaser.Math.Between(pointRadius + 10, width - pointRadius - 10);
            const py = Phaser.Math.Between(70, baseY - clusterRadius - 20);
            const punto = this.add.circle(
              px, py, pointRadius, color
            ).setStrokeStyle(2, 0x555555).setAlpha(0.95).setInteractive({ draggable: true, useHandCursor: true });

            punto.setData('clusterIdx', clusterIdx);

            this.input.setDraggable(punto);
            puntos.push(punto);

            punto.on('pointerover', function () { punto.setScale(1.18); });
            punto.on('pointerout', function () { punto.setScale(1); });

            punto.on('drag', (pointer, dragX, dragY) => {
              punto.x = dragX;
              punto.y = dragY;
            });

            // eslint-disable-next-line no-loop-func
            punto.on('dragend', (pointer) => {
              let correcto = false;
              clusters.forEach((cl, idx) => {
                const cx = (width/(clusters.length+1)) * (idx+1);
                const dist = Math.sqrt((punto.x - cx) ** 2 + (punto.y - baseY) ** 2);
                if (dist < clusterRadius && idx === punto.getData('clusterIdx') && punto.visible) {
                  correcto = true;
                  punto.setVisible(false);
                  this.asignados++;
                  this.add.text(punto.x - 32, punto.y - 25, "¡Correcto!", { fontSize: Math.max(10, Math.floor(width/64)), fill: "#388e3c" }).setDepth(10);
                }
              });

              if (!correcto && punto.visible) {
                desaciertosTemp++;
                this.tweens.add({
                  targets: punto,
                  x: punto.input.dragStartX,
                  y: punto.input.dragStartY,
                  duration: 240,
                  ease: 'Sine.easeInOut'
                });
              }

              if (this.asignados === TOTAL_PUNTOS && !this.completed) {
                this.completed = true;
                this.add.text(40, baseY - clusterRadius - 30, '¡Muy bien! Agrupaste los datos como una IA de clustering', { fontSize: Math.max(14, Math.floor(width/30)), fill: '#00796B' });
                setResultado(
                  "¡Aprendiste cómo las IA de ML pueden agrupar datos automáticamente por similitud! Así organizan fotos, canciones y mucho más."
                );
                setDesaciertos(desaciertosTemp);
                setPuedeGuardar(true);
                setGuardado(false);
                setErrorGuardar(null);
                setMostroLogro(false);
                console.log('[MLClusterGame] Juego completado: puedes guardar progreso.');
              }
            });
          }
          this.puntos = puntos;
        },
        update: function () {
          this.puntos.forEach(pt => { if (pt.visible) pt.rotation += 0.006; });
        }
      }
    });

    // Limpieza al desmontar
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
    // eslint-disable-next-line
  }, [instruccion, juegoKey, usuario]);

  // Redimensionar canvas al cambiar el tamaño de la ventana
  useEffect(() => {
    if (instruccion) return;
    function onResize() {
      setJuegoKey(k => k + 1); // fuerza recarga del juego con nuevo tamaño
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
    // eslint-disable-next-line
  }, [instruccion, usuario]);

  useEffect(() => {
    if (usuario && usuario.id) cargarHistorial();
    // eslint-disable-next-line
  }, [usuario, juegoKey]);

  // Acción del botón de guardar progreso + logro si corresponde
  const guardarProgresoYLogro = async () => {
    if (!usuario || !usuario.id) {
      setErrorGuardar('No hay usuario logueado.');
      return;
    }
    setErrorGuardar(null);

    try {
      // Guardar progreso normal
      const progresoPayload = {
        usuarioId: usuario.id,
        juegoId: ML_GAME_ID,
        avance: 100,
        completado: true,
        aciertos: TOTAL_PUNTOS - desaciertos,
        desaciertos
      };
      await api.post('/juegos/progreso', progresoPayload);

      // Si puntaje perfecto, guardar logro
      if (desaciertos === 0) {
        await api.post("/usuarios/achievement", {
          usuarioId: usuario.id,
          juegoId: ML_GAME_ID,
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

  // Reset
  const handleReset = () => {
    setInstruccion(true);
    setResultado(null);
    setJuegoKey(k => k + 1);
    setPuedeGuardar(false);
    setGuardado(false);
    setErrorGuardar(null);
    setDesaciertos(0);
    setMostroLogro(false);
    if (gameRef.current) {
      gameRef.current.destroy(true);
      gameRef.current = null;
    }
  };

  return (
    <div ref={containerRef} style={{ width: "100%", maxWidth: 900, margin: "auto" }}>
      {/* Modal explicativo antes de jugar */}
      {instruccion && (
        <div className="modal show d-block" tabIndex="-1" style={{
          background: 'rgba(0,0,0,0.3)',
          position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', zIndex: 1000
        }}>
          <div className="modal-dialog" style={{ marginTop: 80 }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">¿Qué es el “clustering” en ML?</h5>
              </div>
              <div className="modal-body">
                <p>
                  <b>Clustering</b> es una técnica de Machine Learning donde la IA aprende a <b>agrupar datos similares</b> sin que nadie le diga cómo.<br />
                  Por ejemplo, agrupa fotos por caras, canciones por estilo o documentos por tema.
                </p>
                <ul>
                  <li>En fotos, agrupa personas parecidas 👧👦</li>
                  <li>En música, canciones similares 🎵</li>
                  <li>En compras, productos que se parecen 🛒</li>
                </ul>
                <p>Tu reto: <b>Arrastra cada punto a su grupo de color.</b> Así “aprende” una IA a organizar datos por similitud.</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={iniciarJuego}>¡Jugar!</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contenedor del juego */}
      <div id="game-container-ml-cluster" style={{ margin: 'auto', minHeight: 350 }} />

      {/* Mensaje de aprendizaje al terminar */}
      {resultado && (
        <div className="alert alert-success mt-3" style={{ maxWidth: 800, margin: "auto" }}>
          {resultado}
          <br />
          <small>
            Las IAs de clustering se usan para organizar todo tipo de datos. ¿Dónde más crees que se usan?
          </small>
        </div>
      )}

      {/* Badge de logro por puntaje perfecto */}
      {mostroLogro && (
        <div className="alert alert-info text-center mt-3 fw-bold" style={{ maxWidth: 500, margin: "auto" }}>
          <i className="bi bi-trophy-fill text-warning me-2"></i>
          ¡FELICITACIONES! Lograste el <span className="text-success">Puntaje Perfecto</span> y ganaste un logro 🏆
        </div>
      )}

      {/* Botón para guardar progreso */}
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
                  <td>{typeof p.desaciertos === "number" ? (TOTAL_PUNTOS - p.desaciertos) : "-"}</td>
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

      {/* Botones debajo del juego */}
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
