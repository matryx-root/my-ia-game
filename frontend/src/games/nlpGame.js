import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function NLPGame({ usuario }) {
  const navigate = useNavigate();
  const gameRef = useRef(null);

  // Estados generales
  const [instruccion, setInstruccion] = useState(true);
  const [resultado, setResultado] = useState(null);
  const [juegoKey, setJuegoKey] = useState(0);

  // Progreso/logros
  const [puedeGuardar, setPuedeGuardar] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [mostroLogro, setMostroLogro] = useState(false);
  const [errorGuardar, setErrorGuardar] = useState(null);

  // Historial
  const [historial, setHistorial] = useState([]);
  const [cargandoHistorial, setCargandoHistorial] = useState(false);

  // Juego ID y progreso local
  const NLP_GAME_ID = 8;
  const NOMBRE_LOGRO = "NLP Dominado";
  const DESC_LOGRO = "Completaste todos los retos variados de NLP.";

  const retos = [
    { tipo: "frase", texto: "El perro está ____ en el parque.", opciones: ["jugando", "comiendo", "durmiendo"], respuesta: "jugando", feedback: "Así la IA aprende a completar frases usando contexto." },
    { tipo: "sentimiento", texto: "¡Me encanta este lugar, es maravilloso!", opciones: ["Positivo", "Negativo", "Neutro"], respuesta: "Positivo", feedback: "El análisis de sentimiento permite saber la emoción del texto." },
    { tipo: "intencion", texto: "¿Puedes decirme la hora, por favor?", opciones: ["Pregunta", "Orden", "Saludo"], respuesta: "Pregunta", feedback: "El reconocimiento de intención ayuda a los asistentes virtuales." },
    { tipo: "entidad", texto: "Pedro viajó a Madrid en 2023.", opciones: ["Pedro", "Madrid", "2023"], respuesta: ["Pedro", "Madrid", "2023"], feedback: "Detectar nombres y lugares es clave en NLP (NER)." },
    { tipo: "sinonimo", texto: "Elige el sinónimo de 'feliz'.", opciones: ["Alegre", "Triste", "Lento"], respuesta: "Alegre", feedback: "Las IA pueden buscar sinónimos y comprender significados." }
  ];

  const [aciertos, setAciertos] = useState(0);
  const [desaciertos, setDesaciertos] = useState(0);

  // Historial carga
  const cargarHistorial = async () => {
    if (!usuario || !usuario.id) return;
    setCargandoHistorial(true);
    try {
      const prog = await api.get(`/juegos/progreso/${usuario.id}`);
      setHistorial(Array.isArray(prog) ? prog.filter(p => p.juegoId === NLP_GAME_ID) : []);
    } catch {
      setHistorial([]);
    } finally {
      setCargandoHistorial(false);
    }
  };

  useEffect(() => {
    if (usuario && usuario.id) cargarHistorial();
  }, [usuario]);

  // --- Phaser GAME ---
  useEffect(() => {
    if (!instruccion && !gameRef.current) {
      let timeoutRef = null;
      let idx = 0; // ÍNDICE CONTROLADO SÓLO EN PHASER
      let aciertosTemp = 0;
      let desaciertosTemp = 0;

      gameRef.current = new Phaser.Game({
        type: Phaser.AUTO,
        width: 680,
        height: 410,
        parent: 'game-container-nlp',
        backgroundColor: '#fff8e1',
        scene: {
          create: function () {
            mostrarReto.call(this, idx);
          }
        }
      });

      const mostrarReto = function(idx) {
        this.children.removeAll();
        const reto = retos[idx];

        // Título
        let titulo = "💬 NLP: ";
        if (reto.tipo === "frase") titulo += "Elige la palabra que completa la frase";
        if (reto.tipo === "sentimiento") titulo += "¿Qué sentimiento expresa?";
        if (reto.tipo === "intencion") titulo += "¿Cuál es la intención de la frase?";
        if (reto.tipo === "entidad") titulo += "¿Qué palabras son entidades?";
        if (reto.tipo === "sinonimo") titulo += reto.texto;

        this.add.text(38, 32, titulo, {
          fontFamily: "monospace", fontSize: '20px', fill: '#333'
        });

        // Texto principal
        let yTexto = 110;
        if (reto.tipo !== "sinonimo") {
          this.add.text(this.cameras.main.centerX, yTexto, reto.texto, {
            fontFamily: "monospace", fontSize: '24px', fill: '#222'
          }).setOrigin(0.5);
        }

        let feedback = this.add.text(this.cameras.main.centerX, 260, '', {
          fontSize: '20px', fill: '#1565c0', fontFamily: "monospace"
        }).setOrigin(0.5);

        // Opciones
        if (reto.tipo === "entidad") {
          let seleccionadas = [];
          reto.opciones.forEach((op, i) => {
            const btn = this.add.rectangle(210 + i * 140, 180, 120, 54, 0xffecb3, 0.97)
              .setStrokeStyle(3, 0xffb300)
              .setInteractive({ useHandCursor: true });
            const btnText = this.add.text(210 + i * 140, 180, op, {
              fontSize: '21px', fill: '#222', fontFamily: "monospace"
            }).setOrigin(0.5);

            btn.on('pointerdown', () => {
              if (!seleccionadas.includes(op)) {
                seleccionadas.push(op);
                btn.setFillStyle(0xa5d6a7);
                btnText.setColor('#388e3c');
              } else {
                seleccionadas = seleccionadas.filter(o => o !== op);
                btn.setFillStyle(0xffecb3);
                btnText.setColor('#222');
              }
              // Sólo cuando todas y sólo las correctas están seleccionadas
              const correcto = seleccionadas.length === reto.respuesta.length &&
                seleccionadas.every(x => reto.respuesta.includes(x));
              if (correcto) {
                feedback.setText('¡Correcto! 👏');
                aciertosTemp += 1;
                this.children.list.forEach(child => child.disableInteractive && child.disableInteractive());
                timeoutRef = setTimeout(() => avanzarOFinalizar.call(this), 1300);
              }
            });
          });
        } else {
          // Unica opción
          const opBaseX = this.cameras.main.centerX - (reto.opciones.length - 1) * 90;
          reto.opciones.forEach((op, i) => {
            const btn = this.add.rectangle(opBaseX + i * 180, 180, 120, 54, 0xffecb3, 0.97)
              .setStrokeStyle(3, 0xffb300)
              .setInteractive({ useHandCursor: true });
            const btnText = this.add.text(opBaseX + i * 180, 180, op, {
              fontSize: '21px', fill: '#222', fontFamily: "monospace"
            }).setOrigin(0.5);

            btn.on('pointerover', () => {
              btn.setStrokeStyle(3, 0xff6f00);
              btn.setScale(1.09);
              btnText.setColor('#d84315');
            });
            btn.on('pointerout', () => {
              btn.setStrokeStyle(3, 0xffb300);
              btn.setScale(1);
              btnText.setColor('#222');
            });

            btn.on('pointerdown', () => {
              if (
                (Array.isArray(reto.respuesta) && reto.respuesta.includes(op)) ||
                op === reto.respuesta
              ) {
                feedback.setText('¡Correcto! 😍');
                btn.setFillStyle(0xa5d6a7);
                btnText.setColor('#388e3c');
                aciertosTemp += 1;
                this.children.list.forEach(child => child.disableInteractive && child.disableInteractive());
                timeoutRef = setTimeout(() => avanzarOFinalizar.call(this), 1100);
              } else {
                feedback.setText('Intenta otra vez.');
                btn.setFillStyle(0xffccbc);
                btnText.setColor('#d32f2f');
                desaciertosTemp += 1;
              }
            });
          });
        }

        // Feedback educativo
        this.add.text(this.cameras.main.centerX, 320, reto.feedback, {
          fontSize: '16px', fill: '#607d8b', fontFamily: "monospace"
        }).setOrigin(0.5);

        // Avanzar
        const avanzarOFinalizar = function () {
          if (idx + 1 < retos.length) {
            idx++;
            mostrarReto.call(this, idx);
          } else {
            setAciertos(aciertosTemp);
            setDesaciertos(desaciertosTemp);
            setResultado("¡Juego completado! Así funcionan los traductores, asistentes de voz, chatbots, análisis de sentimientos, NER y más.");
            setPuedeGuardar(true);
          }
        };
      };

      return () => { if (timeoutRef) clearTimeout(timeoutRef); };
    }
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
    // eslint-disable-next-line
  }, [instruccion, juegoKey]);

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
        juegoId: NLP_GAME_ID,
        avance: 100,
        completado: true,
        aciertos,
        desaciertos
      };
      await api.post('/juegos/progreso', progresoPayload);

      await api.post("/usuarios/achievement", {
        usuarioId: usuario.id,
        juegoId: NLP_GAME_ID,
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

  // Botones
  const handleReset = () => {
    setInstruccion(true);
    setResultado(null);
    setJuegoKey(k => k + 1);
    setAciertos(0);
    setDesaciertos(0);
    setPuedeGuardar(false);
    setGuardado(false);
    setMostroLogro(false);
    setErrorGuardar(null);
    if (gameRef.current) {
      gameRef.current.destroy(true);
      gameRef.current = null;
    }
  };

  const volverCategoria = () => {
    navigate(-1);
  };

  return (
    <div>
      {/* MODAL INSTRUCCIÓN */}
      {instruccion && (
        <div className="modal show d-block" tabIndex="-1" style={{
          background: 'rgba(0,0,0,0.3)',
          position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', zIndex: 1000
        }}>
          <div className="modal-dialog" style={{ marginTop: 100 }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">¿Qué es NLP?</h5>
              </div>
              <div className="modal-body">
                <p>
                  <b>Procesamiento del Lenguaje Natural (NLP)</b> es la tecnología que permite a las computadoras entender, analizar, completar frases, encontrar sentimientos y más.
                </p>
                <ul>
                  <li>Traductores automáticos 🌍</li>
                  <li>Asistentes de voz como Alexa o Siri 🎤</li>
                  <li>Chatbots y análisis de opiniones 🤖</li>
                  <li>Reconocimiento de entidades y sentimiento 🏷️</li>
                </ul>
                <p>Tu reto: <b>Resuelve todos los minijuegos de NLP</b>. Cada uno muestra una aplicación real del lenguaje natural.</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={() => setInstruccion(false)}>¡Jugar!</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONTENEDOR DEL JUEGO */}
      <div id="game-container-nlp" style={{ margin: 'auto', minHeight: 400, maxWidth: 700 }} />

      {/* MENSAJE FINAL */}
      {resultado && (
        <div className="alert alert-success mt-3" style={{ maxWidth: 600, margin: "auto" }}>
          {resultado}
          <br />
          <small>
            ¿Dónde crees que usas NLP en tu día a día? ¡Quizás en tu traductor favorito, o al dictar un mensaje, o usando asistentes de voz!
          </small>
        </div>
      )}

      {/* BOTÓN GUARDAR */}
      {puedeGuardar && !guardado && usuario && (
        <div className="d-flex justify-content-center mt-4">
          <button className="btn btn-success" onClick={guardarProgresoYLogro}>
            Guardar progreso y registrar logro
          </button>
        </div>
      )}

      {/* MENSAJE LOGRO */}
      {mostroLogro && (
        <div className="alert alert-success mt-3 text-center fw-bold" style={{ maxWidth: 500, margin: "auto" }}>
          <i className="bi bi-trophy-fill text-warning me-2"></i>
          ¡LOGRO GANADO! NLP Dominado 🏆
        </div>
      )}

      {/* MENSAJE ERROR */}
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

      {/* BOTONES FINALES */}
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
