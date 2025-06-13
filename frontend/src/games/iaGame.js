import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { useNavigate } from 'react-router-dom';

export default function IAGameBrainNetwork() {
  const gameRef = useRef(null);
  const navigate = useNavigate();
  const [instruccion, setInstruccion] = useState(true);
  const [resultado, setResultado] = useState(null);
  const [juegoKey, setJuegoKey] = useState(0);

  const iniciarJuego = () => setInstruccion(false);

  // Coordenadas de 20 nodos con forma de cerebro (puedes ajustar las posiciones para mejorar)
  const brainNodes = [
    { x: 210, y: 210 }, { x: 250, y: 180 }, { x: 300, y: 150 }, { x: 370, y: 140 },
    { x: 440, y: 150 }, { x: 510, y: 180 }, { x: 570, y: 230 }, { x: 600, y: 300 },
    { x: 600, y: 380 }, { x: 570, y: 430 }, { x: 510, y: 470 }, { x: 440, y: 490 },
    { x: 370, y: 480 }, { x: 300, y: 470 }, { x: 250, y: 430 }, { x: 220, y: 370 },
    { x: 230, y: 290 }, { x: 340, y: 230 }, { x: 470, y: 230 }, { x: 370, y: 310 }
  ];
  const totalNodes = brainNodes.length;
  const maxConnections = totalNodes - 1;

  useEffect(() => {
    if (!instruccion && !gameRef.current) {
      let circuits = [];
      let connectedPairs = [];
      let lastIdx = null;
      let graphics;
      let barraProgreso;
      let textoProgreso;

      gameRef.current = new Phaser.Game({
        type: Phaser.AUTO,
        width: 820,
        height: 600,
        parent: 'game-container-ia',
        backgroundColor: '#fff3e0',
        scene: {
          preload: function () {
            this.load.image('circuit', 'https://labs.phaser.io/assets/sprites/purple_ball.png');
          },
          create: function () {
            this.completed = false;
            graphics = this.add.graphics();
            circuits = [];
            connectedPairs = [];
            lastIdx = null;

            this.add.text(60, 20, '🤖 Juego IA: ¡Une los puntos para simular una red neuronal cerebral!', {
              fontFamily: 'monospace',
              fontSize: '22px',
              fill: '#333'
            });

            // Barra de progreso
            barraProgreso = this.add.rectangle(410, 570, 480, 22, 0xe1bee7).setOrigin(0.5);
            this.barraRelleno = this.add.rectangle(170, 570, 0, 22, 0x7e57c2).setOrigin(0, 0.5);
            textoProgreso = this.add.text(680, 565, `0/${maxConnections} conexiones`, {
              fontFamily: 'monospace',
              fontSize: '16px',
              fill: '#333'
            });

            // Dibuja nodos en forma de cerebro
            brainNodes.forEach((coord, i) => {
              const circuit = this.add.image(coord.x, coord.y, 'circuit')
                .setScale(1)
                .setAlpha(0.92)
                .setInteractive({ useHandCursor: true });
              circuit.index = i;
              circuit.connected = false;

              // Hover visual
              circuit.on('pointerover', function () {
                if (!this.connected) circuit.setScale(1.28);
              });
              circuit.on('pointerout', function () {
                if (!this.connected) circuit.setScale(1.0);
              });

              // On click: conectar con el anterior
              circuit.on('pointerdown', () => {
                if (this.completed) return;

                if (lastIdx === null) {
                  lastIdx = i;
                  circuit.setTint(0xffe082);
                } else if (
                  lastIdx !== i &&
                  !connectedPairs.find(p => (p[0] === lastIdx && p[1] === i) || (p[0] === i && p[1] === lastIdx))
                ) {
                  // Conecta los dos nodos (lastIdx y i)
                  connectedPairs.push([lastIdx, i]);
                  circuit.setTint(0xffe082);
                  circuits[lastIdx].setTint(0xffe082);
                  circuits[lastIdx].connected = true;
                  circuit.connected = true;

                  // Dibuja línea animada
                  let progress = { t: 0 };
                  let x1 = circuits[lastIdx].x, y1 = circuits[lastIdx].y;
                  let x2 = circuits[i].x, y2 = circuits[i].y;
                  this.tweens.add({
                    targets: progress,
                    t: 1,
                    duration: 300,
                    onUpdate: () => {
                      graphics.clear();
                      // Redibuja todas las líneas anteriores
                      connectedPairs.forEach(([a, b], idx) => {
                        let c1 = circuits[a], c2 = circuits[b];
                        graphics.lineStyle(5, 0x7e57c2, 0.44 + idx / totalNodes);
                        graphics.strokeLineShape(new Phaser.Geom.Line(c1.x, c1.y, c2.x, c2.y));
                      });
                      // Dibuja la animación de la línea actual
                      graphics.lineStyle(4, 0x8d5fe7, 1);
                      graphics.strokeLineShape(new Phaser.Geom.Line(x1, y1, x1 + progress.t * (x2 - x1), y1 + progress.t * (y2 - y1)));
                    },
                    onComplete: () => {
                      graphics.clear();
                      // Redibuja todas las líneas completas
                      connectedPairs.forEach(([a, b], idx) => {
                        let c1 = circuits[a], c2 = circuits[b];
                        graphics.lineStyle(5, 0x7e57c2, 0.44 + idx / totalNodes);
                        graphics.strokeLineShape(new Phaser.Geom.Line(c1.x, c1.y, c2.x, c2.y));
                      });
                    }
                  });

                  // Progreso
                  this.barraRelleno.width = (connectedPairs.length / maxConnections) * 480;
                  textoProgreso.setText(`${connectedPairs.length}/${maxConnections} conexiones`);

                  if (connectedPairs.length === maxConnections) {
                    this.completed = true;
                    this.add.text(120, 520, '¡Conectaste todos los nodos de la red neuronal cerebral! 🧠✨', {
                      fontFamily: 'monospace',
                      fontSize: '28px',
                      fill: '#388e3c',
                      fontStyle: 'bold'
                    });
                    setResultado(
                      "¡Así se construye una red neuronal artificial! Más nodos, más conexiones... más inteligencia. ¿Cuántas conexiones crees que hay en tu cerebro real?"
                    );
                  }
                  lastIdx = null;
                }
              });
              circuits.push(circuit);
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
    // eslint-disable-next-line
  }, [instruccion, juegoKey]);

  // Reset
  const handleReset = () => {
    setInstruccion(true);
    setResultado(null);
    setJuegoKey(k => k + 1);
    if (gameRef.current) {
      gameRef.current.destroy(true);
      gameRef.current = null;
    }
  };

  const volverCategoria = () => navigate(-1);

  return (
    <div>
      {/* Modal explicativo antes de jugar */}
      {instruccion && (
        <div className="modal show d-block" tabIndex="-1" style={{
          background: 'rgba(0,0,0,0.3)',
          position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', zIndex: 1000
        }}>
          <div className="modal-dialog" style={{ marginTop: 100 }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">¿Cómo es una red neuronal?</h5>
              </div>
              <div className="modal-body">
                <p>
                  <b>Una red neuronal artificial</b> se inspira en el cerebro, donde cada nodo es como una neurona y las conexiones son como sinapsis.<br />
                  <b>Tu reto:</b> Une todos los puntos del “cerebro” conectando pares uno a uno para completar la red.
                </p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={iniciarJuego}>¡Jugar!</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Contenedor del juego */}
      <div id="game-container-ia" style={{ margin: 'auto', minHeight: 420, maxWidth: 840 }} />
      {/* Mensaje de aprendizaje al terminar */}
      {resultado && (
        <div className="alert alert-success mt-3" style={{ maxWidth: 800, margin: "auto" }}>
          {resultado}
          <br />
          <small>
            Así funcionan las IA modernas: ¡Miles de nodos y millones de conexiones como tu cerebro!
          </small>
        </div>
      )}
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
