import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { useNavigate, useParams } from 'react-router-dom';

export default function NLPGame() {
  const navigate = useNavigate();
  const { id } = useParams();
  const gameRef = useRef(null);
  const [instruccion, setInstruccion] = useState(true);
  const [resultado, setResultado] = useState(null);
  const [juegoKey, setJuegoKey] = useState(0);

  const iniciarJuego = () => setInstruccion(false);

  useEffect(() => {
    if (!instruccion && !gameRef.current) {
      let escena = this;
      let timeoutRef = null;
      gameRef.current = new Phaser.Game({
        type: Phaser.AUTO,
        width: 650,
        height: 400,
        parent: 'game-container-nlp',
        backgroundColor: '#fff8e1',
        scene: {
          create: function () {
            // Centramos los textos y elementos
            this.cameras.main.setBackgroundColor('#fff8e1');

            // Frases ampliadas
            const frases = [
              {
                texto: "El perro está ____ en el parque.",
                opciones: ["jugando", "comiendo", "durmiendo"],
                respuesta: "jugando"
              },
              {
                texto: "María come una ____ en el desayuno.",
                opciones: ["manzana", "cama", "camisa"],
                respuesta: "manzana"
              },
              {
                texto: "El sol brilla en el ____.",
                opciones: ["cielo", "zapato", "pan"],
                respuesta: "cielo"
              },
              {
                texto: "Pedro lee un ____ en la biblioteca.",
                opciones: ["libro", "gato", "silla"],
                respuesta: "libro"
              },
              {
                texto: "Los pájaros vuelan en el ____.",
                opciones: ["aire", "agua", "bosque"],
                respuesta: "aire"
              }
            ];

            let fraseIdx = Phaser.Math.Between(0, frases.length - 1);

            const showFrase = (idx) => {
              this.children.removeAll();

              this.add.text(40, 38, "💬 NLP: Elige la palabra que completa la frase", {
                fontFamily: "monospace", fontSize: '20px', fill: '#333'
              });

              // Frase centrada horizontalmente
              this.add.text(this.cameras.main.centerX, 110, frases[idx].texto, {
                fontFamily: "monospace", fontSize: '24px', fill: '#222'
              }).setOrigin(0.5);

              let feedback = this.add.text(this.cameras.main.centerX, 240, '', {
                fontSize: '20px', fill: '#1565c0', fontFamily: "monospace"
              }).setOrigin(0.5);

              // Opciones tipo tarjeta, centradas
              const opBaseX = this.cameras.main.centerX - 130;
              frases[idx].opciones.forEach((op, i) => {
                const btn = this.add.rectangle(opBaseX + i * 130, 180, 110, 50, 0xffecb3, 0.96)
                  .setStrokeStyle(3, 0xffb300)
                  .setInteractive({ useHandCursor: true });
                const btnText = this.add.text(opBaseX + i * 130, 180, op, {
                  fontSize: '21px', fill: '#222', fontFamily: "monospace"
                }).setOrigin(0.5);

                btn.on('pointerover', () => {
                  btn.setStrokeStyle(3, 0xff6f00);
                  btn.setScale(1.08);
                  btnText.setColor('#d84315');
                });
                btn.on('pointerout', () => {
                  btn.setStrokeStyle(3, 0xffb300);
                  btn.setScale(1);
                  btnText.setColor('#222');
                });

                btn.on('pointerdown', () => {
                  if (op === frases[idx].respuesta) {
                    feedback.setText('¡Correcto! 😍');
                    btn.setFillStyle(0xa5d6a7);
                    btnText.setColor('#388e3c');
                    setResultado("¡Has usado el razonamiento del lenguaje natural! Así funcionan los traductores y asistentes de voz.");
                    // Deshabilitar todas las opciones
                    this.children.list.filter(child => child.input && child.input.enabled).forEach(child => {
                      child.disableInteractive && child.disableInteractive();
                    });
                    // Espera 3s y muestra nueva frase
                    timeoutRef = setTimeout(() => {
                      fraseIdx = Phaser.Math.Between(0, frases.length - 1);
                      feedback.setText('');
                      setResultado(null);
                      showFrase(fraseIdx);
                    }, 3000);
                  } else {
                    feedback.setText('Intenta otra vez.');
                    btn.setFillStyle(0xffccbc);
                    btnText.setColor('#d32f2f');
                    setResultado(null);
                  }
                });
              });
            };

            showFrase(fraseIdx);
          }
        }
      });
      // Limpieza si se desmonta o reinicia
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

  // Reset (nueva frase)
  const handleReset = () => {
    setInstruccion(true);
    setResultado(null);
    setJuegoKey(k => k + 1);
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
      {/* Modal explicativo */}
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
                  <b>Procesamiento del Lenguaje Natural (NLP)</b> es la tecnología que permite a las computadoras entender, generar y completar frases, como si fueran humanos.
                </p>
                <ul>
                  <li>Lo usan los traductores automáticos 🌍</li>
                  <li>También asistentes de voz como Alexa o Siri 🎤</li>
                  <li>Y los chatbots que responden tus preguntas 🤖</li>
                </ul>
                <p>Tu reto: <b>Completa correctamente la frase</b>. Así las IA aprenden a comprender el lenguaje.</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={iniciarJuego}>¡Jugar!</button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div id="game-container-nlp" style={{ margin: 'auto', minHeight: 400, maxWidth: 660 }} />
      {resultado && (
        <div className="alert alert-success mt-3" style={{ maxWidth: 600, margin: "auto" }}>
          {resultado}
          <br />
          <small>
            ¿Dónde crees que usas NLP en tu día a día? ¡Quizás en tu traductor favorito, o al dictar un mensaje!
          </small>
        </div>
      )}
      {/* Botones de navegación */}
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
