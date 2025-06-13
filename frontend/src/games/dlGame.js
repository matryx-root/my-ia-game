import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { useNavigate, useParams } from "react-router-dom";

export default function DLGame() {
  const navigate = useNavigate();
  const { id } = useParams();
  const gameRef = useRef(null);
  const [instruccion, setInstruccion] = useState(true);
  const [resultado, setResultado] = useState(null);

  const iniciarJuego = () => setInstruccion(false);

  // Limpia y crea el juego
  useEffect(() => {
    if (!instruccion && !gameRef.current) {
      let completed = false;
      let neurons = [];

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
            for (let i = 0; i < 10; i++) {
              const x = Phaser.Math.Between(100, 700);
              const y = Phaser.Math.Between(100, 500);
              const neuron = this.add.image(x, y, 'neuron').setScale(1.6).setAlpha(0.85);
              neurons.push(neuron);
              neuron.setInteractive();
              neuron.on('pointerdown', () => {
                neuron.setTint(0xffe082);
                neuron.setAlpha(0.3);
                neuron.disableInteractive();
                if (neurons.every(n => n.input.enabled === false) && !completed) {
                  completed = true;
                  this.add.text(200, 540, '¡Activaste toda la red neuronal!', { fontSize: '30px', fill: '#388e3c', fontStyle: 'bold' });
                  setResultado(
                    "¡Felicidades! Has activado todas las neuronas de la red, igual que una IA cuando aprende a resolver un problema."
                  );
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
  }, [instruccion]);

  // Botón reset: recarga solo este juego
  const handleReset = () => {
    setInstruccion(true);
    setResultado(null);
    if (gameRef.current) {
      gameRef.current.destroy(true);
      gameRef.current = null;
    }
  };

  return (
    <div>
      {/* Modal de instrucción */}
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
                <button className="btn btn-primary" onClick={iniciarJuego}>¡Jugar!</button>
              </div>
            </div>
          </div>
        </div>
      }

      {/* Contenedor del juego */}
      <div id="game-container-dl" style={{ margin: 'auto', minHeight: 600 }} />

      {/* Feedback final después de jugar */}
      {resultado && (
        <div className="alert alert-info mt-3" style={{ maxWidth: 800, margin: "auto" }}>
          {resultado}
          <br />
          <small>
            Así trabajan las redes neuronales profundas para aprender tareas difíciles. ¡Eres parte de la IA del futuro!
          </small>
        </div>
      )}

      {/* Botones SIEMPRE visibles bajo el juego */}
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
