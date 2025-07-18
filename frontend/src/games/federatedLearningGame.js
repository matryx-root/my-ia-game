import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function FederatedLearningGame({ usuario }) {
  const gameRef = useRef(null);
  const navigate = useNavigate();

  const [instruccion, setInstruccion] = useState(true);
  const [resultado, setResultado] = useState(null);
  const [aciertos, setAciertos] = useState(0);

  // Guardado y logros
  const [puedeGuardar, setPuedeGuardar] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [mostroLogro, setMostroLogro] = useState(false);
  const [errorGuardar, setErrorGuardar] = useState(null);

  // Historial
  const [historial, setHistorial] = useState([]);
  const [cargandoHistorial, setCargandoHistorial] = useState(false);

  // IDs y texto
  const FEDERATED_GAME_ID = 9;
  const NOMBRE_LOGRO = "Federated Learning Perfecto";
  const DESC_LOGRO = "Completaste el juego de aprendizaje federado colaborando con todos los clientes.";

  // Función para iniciar el juego
  const iniciarJuego = () => setInstruccion(false);

  // Cargar historial
  const cargarHistorial = async () => {
    if (!usuario || !usuario.id) return;
    setCargandoHistorial(true);
    try {
      const prog = await api.get(`/juegos/progreso/${usuario.id}`);
      setHistorial(
        Array.isArray(prog)
          ? prog.filter(p => p.juegoId === FEDERATED_GAME_ID)
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
    // eslint-disable-next-line
  }, [usuario]);

  // Lógica principal del juego
  useEffect(() => {
    if (!instruccion && !gameRef.current) {
      let linesDrawn = 0;
      let aciertosTemp = 0;

      gameRef.current = new Phaser.Game({
        type: Phaser.AUTO,
        width: 720,
        height: 430,
        parent: 'game-container-federated',
        backgroundColor: '#f9fbe7',
        scene: {
          create: function () {
            this.add.text(60, 38, "🌐 Federated Learning: ¡Colabora sin perder tu privacidad!", {
              fontSize: '20px', fill: '#333'
            });

            let clients = [];
            let locks = [];
            let faces = [];
            let mensaje = null;

            // Clientes y elementos
            for (let i = 0; i < 5; i++) {
              const x = 100 + i * 120;
              const y = 170;
              const c = this.add.circle(x, y, 35, 0x8bc34a).setInteractive();
              const lock = this.add.text(x - 11, y - 55, "🔒", { fontSize: '28px' });
              const face = this.add.text(x - 13, y - 18, "", { fontSize: '29px' });
              this.add.text(x - 15, y + 47, `Cliente ${i + 1}`, { fontSize: '13px', fill: '#333' });
              clients.push(c);
              locks.push(lock);
              faces.push(face);
            }

            // Servidor
            const server = this.add.rectangle(360, 330, 100, 54, 0x1976d2, 0.97)
              .setStrokeStyle(3, 0x115293);
            this.add.text(336, 318, 'Servidor', { fontSize: '16px', fill: '#fff' });

            // Acción cliente
            clients.forEach((c, i) => {
              c.on('pointerdown', () => {
                if (!c.sent) {
                  c.sent = true;
                  c.setFillStyle(0x388e3c); // Verde fuerte
                  locks[i].setText("");      // Quita candado
                  faces[i].setText("😊");    // Cara feliz

                  this.tweens.addCounter({
                    from: 0,
                    to: 1,
                    duration: 400,
                    onUpdate: tween => {
                      const progress = tween.getValue();
                      if (progress === 1) {
                        this.add.line(0, 0, c.x, c.y, server.x, server.y, 0x222222).setLineWidth(3);
                      }
                    }
                  });

                  linesDrawn++;
                  aciertosTemp++;
                  setAciertos(aciertosTemp);

                  // Fin del juego: todos colaboran
                  if (linesDrawn === 5 && !mensaje) {
                    mensaje = this.add.text(98, 385, '¡Aprendizaje completado! Todos colaboraron y tus datos quedaron protegidos 🔒', {
                      fontSize: '18px',
                      fill: '#2e7d32'
                    });
                    setResultado("¡Completaste el aprendizaje federado! 😊 Así las IA aprenden de muchos, pero tus datos secretos quedan protegidos con un candado. ¡Bien hecho!");
                    setPuedeGuardar(true);
                  }
                }
              });
            });

            this.add.text(154, 372, "Haz clic en los clientes para 'enviar' aprendizaje (tu secreto está protegido)", {
              fontSize: '16px', fill: '#555'
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
  }, [instruccion]);

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
        juegoId: FEDERATED_GAME_ID,
        avance: aciertos === 5 ? 100 : Math.round((aciertos / 5) * 100),
        completado: aciertos === 5,
        aciertos,
        desaciertos: 0 // Si agregas fallos, cámbialo
      };
      await api.post('/juegos/progreso', progresoPayload);

      if (aciertos === 5) {
        await api.post("/usuarios/achievement", {
          usuarioId: usuario.id,
          juegoId: FEDERATED_GAME_ID,
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

  // Control de botones
  const handleReset = () => {
    setInstruccion(true);
    setResultado(null);
    setAciertos(0);
    setPuedeGuardar(false);
    setGuardado(false);
    setMostroLogro(false);
    setErrorGuardar(null);
    if (gameRef.current) {
      gameRef.current.destroy(true);
      gameRef.current = null;
    }
  };
  const volverCategoria = () => { navigate(-1); };

  return (
    <div>
      {/* MODAL DE INSTRUCCIÓN */}
      {instruccion && (
        <div className="modal show d-block" tabIndex="-1" style={{
          background: 'rgba(0,0,0,0.3)', position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', zIndex: 1000
        }}>
          <div className="modal-dialog" style={{ marginTop: 100 }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">¿Qué es Federated Learning?</h5>
              </div>
              <div className="modal-body">
                <p>
                  <b>Aprendizaje federado</b> permite que muchas personas o dispositivos (llamados "clientes") ayuden a entrenar una IA <b>¡sin enviar sus datos privados!</b>
                </p>
                <ul>
                  <li>Se usa en celulares para predecir texto o mejorar fotos, sin que tus datos salgan del teléfono 📱</li>
                  <li>Los hospitales pueden colaborar en IA médica, ¡pero los datos de los pacientes nunca salen del hospital! 🏥</li>
                </ul>
                <p>Tu reto: <b>Haz clic en todos los clientes</b> para que colaboren con el servidor central, ¡sin compartir tus datos personales!</p>
                <p style={{ color: "#1976d2" }}><b>Fíjate en el candado: ¡tu secreto está seguro!</b></p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={iniciarJuego}>¡Jugar!</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONTENEDOR DEL JUEGO */}
      <div id="game-container-federated" style={{ margin: 'auto', minHeight: 430 }} />

      {resultado && (
        <div className="alert alert-success mt-3" style={{ maxWidth: 720, margin: "auto" }}>
          {resultado}
          <br />
          <small>¿Dónde más podríamos usar esto en la vida real? 🚗📱🏥</small>
        </div>
      )}

      {puedeGuardar && !guardado && usuario && (
        <div className="d-flex justify-content-center mt-4">
          <button className="btn btn-success" onClick={guardarProgresoYLogro}>
            Guardar progreso y registrar logro
          </button>
        </div>
      )}

      {mostroLogro && (
        <div className="alert alert-success mt-3 text-center fw-bold" style={{ maxWidth: 500, margin: "auto" }}>
          <i className="bi bi-trophy-fill text-warning me-2"></i>
          ¡LOGRO GANADO! Federated Learning Perfecto 🏆
        </div>
      )}

      {errorGuardar && (
        <div className="alert alert-danger mt-3 text-center" style={{ maxWidth: 500, margin: "auto" }}>
          {errorGuardar}
        </div>
      )}

      {/* HISTORIAL DE PARTIDAS */}
      {usuario && (
        <div className="mt-4" style={{ maxWidth: 700, margin: "0 auto" }}>
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
