import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api'; // Importa tu módulo api

export default function SelfSupervisedGame({ usuario }) {
  const gameRef = useRef(null);
  const navigate = useNavigate();
  const [instruccion, setInstruccion] = useState(true);
  const [resultado, setResultado] = useState(null);
  const [juegoKey, setJuegoKey] = useState(0);
  const [fraseActual, setFraseActual] = useState(0);

  // Progreso y logros
  const [puedeGuardar, setPuedeGuardar] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [errorGuardar, setErrorGuardar] = useState(null);
  const [mostroLogro, setMostroLogro] = useState(false);

  // IDs únicos para este juego
  const SELF_GAME_ID = 7;
  const NOMBRE_LOGRO = "Self-Supervised Completo";
  const DESC_LOGRO = "Completaste todas las frases en el juego de Self-Supervised.";

  const frases = [
    { texto: "El gato está _____ en el tejado.", opciones: ["saltando", "nadando", "volando"], respuesta: "saltando" },
    { texto: "El auto está _____ por la carretera.", opciones: ["corriendo", "volando", "rodando"], respuesta: "rodando" },
    { texto: "La niña está _____ un libro.", opciones: ["leyendo", "comiendo", "pintando"], respuesta: "leyendo" },
    { texto: "El sol sale por el _____.", opciones: ["este", "árbol", "techo"], respuesta: "este" },
    { texto: "Los pájaros están _____ en el cielo.", opciones: ["volando", "corriendo", "nadando"], respuesta: "volando" },
    { texto: "El niño está _____ la pelota.", opciones: ["pateando", "leyendo", "cantando"], respuesta: "pateando" },
    { texto: "La casa es de color _____.", opciones: ["rojo", "perro", "mar"], respuesta: "rojo" },
    { texto: "La vaca da _____.", opciones: ["leche", "plumas", "queso"], respuesta: "leche" },
    { texto: "Los árboles tienen _____.", opciones: ["hojas", "zapatos", "pelo"], respuesta: "hojas" },
    { texto: "El pez nada en el _____.", opciones: ["agua", "cielo", "pastel"], respuesta: "agua" }
  ];

  const iniciarJuego = () => {
    setInstruccion(false);
    setFraseActual(0);
    setResultado(null);
    setJuegoKey(k => k + 1);
    setPuedeGuardar(false);
    setGuardado(false);
    setErrorGuardar(null);
    setMostroLogro(false);
  };

  const sceneRef = useRef(null);

  useEffect(() => {
    if (!instruccion && !gameRef.current) {
      let idx = fraseActual;
      let completando = false;

      gameRef.current = new Phaser.Game({
        type: Phaser.AUTO,
        width: 750,
        height: 440,
        parent: 'game-container-selfsupervised',
        backgroundColor: '#ffe0b2',
        scene: {
          create: function () {
            sceneRef.current = this;
            this.fondo = this.add.rectangle(375, 220, 650, 390, 0xffffec).setAlpha(0.25);
            this.add.text(60, 40, "🧠 Self-Supervised: ¿Qué falta en la frase?", {
              fontFamily: "Courier New",
              fontSize: '24px',
              color: "#333"
            });

            this.frase = this.add.text(375, 120, frases[idx].texto, {
              fontFamily: "Arial",
              fontSize: '30px',
              color: "#111",
              align: "center"
            }).setOrigin(0.5);

            this.resultadoText = this.add.text(375, 320, "", {
              fontFamily: "Arial",
              fontSize: '22px',
              color: "#2e7d32",
              align: "center"
            }).setOrigin(0.5);

            this.botones = [];
            frases[idx].opciones.forEach((op, i) => {
              const x = 220 + i * 155;
              const y = 200;

              let btn = this.add.rectangle(x, y, 120, 55, 0xffecb3, 1)
                .setStrokeStyle(4, 0xffb300)
                .setInteractive({ useHandCursor: true });

              btn.defaultColor = 0xffecb3;

              let textoBtn = this.add.text(x, y, op, {
                fontFamily: "Arial",
                fontSize: '21px',
                color: "#212121"
              }).setOrigin(0.5);

              btn.on('pointerover', () => { btn.setFillStyle(0xffe082); });
              btn.on('pointerout', () => { btn.setFillStyle(btn.defaultColor); });

              btn.on('pointerdown', () => {
                if (completando) return;
                if (op === frases[idx].respuesta) {
                  completando = true;
                  btn.setFillStyle(0xa5d6a7);
                  btn.setStrokeStyle(5, 0x388e3c);
                  textoBtn.setColor("#2e7d32");
                  this.resultadoText.setText("¡Correcto! Has predicho la palabra oculta. 😃");

                  setResultado("¡Así aprende una IA a predecir lo que falta! Este tipo de IA se usa para autocompletar, traducir y restaurar información.");

                  this.tweens.add({
                    targets: [this.frase, ...this.botones.map((b, k) => k === i ? b : null).filter(Boolean)],
                    alpha: 0.5,
                    duration: 700
                  });

                  this.time.delayedCall(1700, () => {
                    completando = false;

                    if (idx + 1 < frases.length) {
                      setFraseActual(f => f + 1);
                      setResultado(null);
                      if (gameRef.current) {
                        gameRef.current.destroy(true);
                        gameRef.current = null;
                      }
                    } else {
                      setResultado("¡Completaste todas las frases! Eres un experto en predicción como una IA. 🎉");
                      setPuedeGuardar(true); // Permite guardar progreso/logro al finalizar
                    }
                  });
                } else {
                  btn.setFillStyle(0xef9a9a);
                  btn.setStrokeStyle(5, 0xb71c1c);
                  textoBtn.setColor("#b71c1c");
                  this.resultadoText.setText("Intenta otra vez.");
                  setTimeout(() => {
                    btn.setFillStyle(btn.defaultColor);
                    btn.setStrokeStyle(4, 0xffb300);
                    textoBtn.setColor("#212121");
                  }, 700);
                }
              });

              this.botones.push(btn);
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
  }, [instruccion, juegoKey, fraseActual]);

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
        juegoId: SELF_GAME_ID,
        avance: 100,
        completado: true,
        aciertos: frases.length,
        desaciertos: 0
      };
      await api.post('/juegos/progreso', progresoPayload);

      await api.post("/usuarios/achievement", {
        usuarioId: usuario.id,
        juegoId: SELF_GAME_ID,
        nombre: NOMBRE_LOGRO,
        descripcion: DESC_LOGRO
      });
      setMostroLogro(true);
      setGuardado(true);
      setPuedeGuardar(false);
      // cargarHistorial(); // Si usas historial, lo puedes activar aquí
    } catch (err) {
      setErrorGuardar("Error al guardar: " + (err?.message || (err?.error ?? "")));
      setGuardado(false);
      setPuedeGuardar(true);
    }
  };

  const handleReset = () => {
    setInstruccion(true);
    setResultado(null);
    setFraseActual(0);
    setJuegoKey(k => k + 1);
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
                <h5 className="modal-title">¿Qué es Self-Supervised Learning?</h5>
              </div>
              <div className="modal-body">
                <p>
                  <b>Self-Supervised Learning</b> es cuando la IA aprende a adivinar lo que falta usando lo que ya sabe.<br />
                  Así puede autocompletar mensajes, traducir textos o completar partes de fotos.
                </p>
                <ul>
                  <li>Autocompletar frases en el chat 📱</li>
                  <li>Restaurar fotos dañadas 🖼️</li>
                  <li>Traducir o predecir palabras en tu idioma 🌎</li>
                </ul>
                <p><b>Tu reto:</b> Elige la palabra correcta para completar la frase. ¿Cuántas logras en una ronda?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={iniciarJuego}>¡Jugar!</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div id="game-container-selfsupervised" style={{
        margin: '30px auto 0 auto',
        minHeight: 420,
        maxWidth: 800,
        background: '#ffe0b2',
        borderRadius: 16,
        boxShadow: '0 2px 8px #ddd'
      }} />

      {resultado && (
        <div className="alert alert-info mt-3 text-center" style={{ maxWidth: 800, margin: "auto" }}>
          {resultado}
          <br />
          <small>
            ¿Dónde más crees que podemos usar IA auto-supervisada? ¡Seguro la has visto en buscadores o editores de texto!
          </small>
        </div>
      )}

      {mostroLogro && (
        <div className="alert alert-success mt-3 text-center fw-bold" style={{ maxWidth: 500, margin: "auto" }}>
          <i className="bi bi-trophy-fill text-warning me-2"></i>
          ¡LOGRO GANADO! Self-Supervised Completo 🏆
        </div>
      )}

      {errorGuardar && (
        <div className="alert alert-danger mt-3 text-center" style={{ maxWidth: 500, margin: "auto" }}>
          {errorGuardar}
        </div>
      )}

      {puedeGuardar && !guardado && (
        <div className="d-flex justify-content-center mt-4">
          <button className="btn btn-success" onClick={guardarProgresoYLogro}>
            Guardar progreso y registrar logro
          </button>
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
