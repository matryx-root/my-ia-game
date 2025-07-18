import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { useNavigate, useParams } from 'react-router-dom';

// Figuras
const figurasReales = [
  { tipo: "circle", color: 0x00bfae, label: "Círculo", texto: "Real" },
  { tipo: "square", color: 0xffb300, label: "Cuadrado", texto: "Real" },
  { tipo: "triangle", color: 0x43a047, label: "Triángulo", texto: "Real" }
];
const figurasFalsas = [
  { tipo: "star", color: 0xf06292, label: "Estrella", texto: "Falsa" },
  { tipo: "hexagon", color: 0x5e35b1, label: "Hexágono", texto: "Falsa" },
  { tipo: "emoji", color: 0xffffff, label: "Emoji", texto: "Falsa", emoji: "🤖" }
];

export default function GANGame() {
  const gameRef = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const [instruccion, setInstruccion] = useState(true);
  const [resultado, setResultado] = useState(null);
  const [juegoKey, setJuegoKey] = useState(0);

  const iniciarJuego = () => setInstruccion(false);

  useEffect(() => {
    if (!instruccion && !gameRef.current) {
      const figuraReal = figurasReales[Math.floor(Math.random() * figurasReales.length)];
      const figuraFalsa = figurasFalsas[Math.floor(Math.random() * figurasFalsas.length)];
      const realFirst = Math.random() < 0.5;

      gameRef.current = new Phaser.Game({
        type: Phaser.AUTO,
        width: 650,
        height: 400,
        parent: 'game-container-gan',
        backgroundColor: '#ffe0b2',
        scene: {
          create: function() {
            // CENTRAR TÍTULO EN TODAS LAS RESOLUCIONES
            this.add.text(325, 52, "👾 GANs: ¿Cuál es la imagen falsa (generada)?", {
              fontSize: '20px', fill: '#333'
            }).setOrigin(0.5);

            // Posiciones X centradas horizontalmente para las figuras
            const posX = [230, 420];

            // Dibuja una figura
            function drawFigura(fig, x, y) {
              let objeto;
              if (fig.tipo === "circle") {
                objeto = this.add.circle(x, y, 50, fig.color).setInteractive({ useHandCursor: true });
              } else if (fig.tipo === "square") {
                objeto = this.add.rectangle(x, y, 100, 100, fig.color).setInteractive({ useHandCursor: true });
              } else if (fig.tipo === "triangle") {
                const graphics = this.add.graphics();
                graphics.fillStyle(fig.color, 1);
                graphics.beginPath();
                graphics.moveTo(x, y - 60);
                graphics.lineTo(x - 50, y + 45);
                graphics.lineTo(x + 50, y + 45);
                graphics.closePath();
                graphics.fillPath();
                objeto = graphics.setInteractive(new Phaser.Geom.Polygon([
                  x, y - 60,
                  x - 50, y + 45,
                  x + 50, y + 45
                ]), Phaser.Geom.Polygon.Contains);
              } else if (fig.tipo === "star") {
                objeto = this.add.star(x, y, 5, 50, 30, fig.color).setInteractive({ useHandCursor: true });
              } else if (fig.tipo === "hexagon") {
                objeto = this.add.star(x, y, 6, 50, 44, fig.color).setInteractive({ useHandCursor: true });
              } else if (fig.tipo === "emoji") {
                objeto = this.add.text(x - 44, y - 50, fig.emoji, { fontSize: "95px" })
                  .setInteractive({ useHandCursor: true });
              }

              // Etiqueta
              this.add.text(x - 30, y + 60, fig.texto, {
                fontSize: '16px',
                fill: fig.texto === "Real" ? '#00897b' : '#c2185b'
              });
              return objeto;
            }

            // Lógica: decide cuál figura va a la izquierda o derecha
            let figuras = [];
            if (realFirst) {
              figuras = [
                drawFigura.call(this, figuraReal, posX[0], 180),
                drawFigura.call(this, figuraFalsa, posX[1], 180)
              ];
            } else {
              figuras = [
                drawFigura.call(this, figuraFalsa, posX[0], 180),
                drawFigura.call(this, figuraReal, posX[1], 180)
              ];
            }

            let mensaje = null;

            figuras.forEach((fig, idx) => {
              fig.on('pointerover', function () {
                fig.setStrokeStyle?.(6, idx === (realFirst ? 1 : 0) ? 0xc2185b : 0x00897b);
                fig.setScale?.(1.09);
              });
              fig.on('pointerout', function () {
                fig.setStrokeStyle?.();
                fig.setScale?.(1);
              });
            });

            // Falsa (GAN): click correcto
            figuras[realFirst ? 1 : 0].on('pointerdown', () => {
              if (!mensaje) {
                mensaje = this.add.text(325, 320, "¡Correcto! Esa fue creada por una IA (GAN)", {
                  fontSize: '19px',
                  fill: '#43a047'
                }).setOrigin(0.5);
                figuras[realFirst ? 1 : 0].setFillStyle?.(0xba68c8);
                setResultado("¡Excelente! Descubriste la imagen generada. Así funcionan los GANs: crean imágenes tan buenas que pueden engañarnos.");
              }
            });
            // Real: click incorrecto
            figuras[realFirst ? 0 : 1].on('pointerdown', () => {
              if (!mensaje) {
                mensaje = this.add.text(325, 320, "¡Esa es real! Intenta descubrir la imagen generada...", {
                  fontSize: '19px',
                  fill: '#d84315'
                }).setOrigin(0.5);
                figuras[realFirst ? 0 : 1].setFillStyle?.(0x009688);
                setResultado("¡Casi! La IA engañó bien, sigue practicando para detectar imágenes falsas.");
              }
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
  }, [instruccion, juegoKey]);

  // Botones
  const handleReset = () => {
    setInstruccion(true);
    setResultado(null);
    setJuegoKey((k) => k + 1);
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
      {/* MODAL INSTRUCCIONES */}
      {instruccion &&
        <div className="modal show d-block" tabIndex="-1" style={{
          background: 'rgba(0,0,0,0.3)',
          position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', zIndex: 1000
        }}>
          <div className="modal-dialog" style={{ marginTop: 100 }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">¿Qué es un GAN?</h5>
              </div>
              <div className="modal-body">
                <p>
                  <b>GAN</b> significa <b>Generative Adversarial Network</b>.<br />
                  Son redes de inteligencia artificial que pueden <b>crear imágenes, caras o dibujos que parecen reales</b>.<br />
                  ¡A veces es muy difícil notar la diferencia!
                </p>
                <ul>
                  <li>Se usan para crear <b>caras de personas que no existen</b>.</li>
                  <li>Generan obras de arte o imágenes de animales, coches, paisajes y más.</li>
                </ul>
                <p>
                  <b>¿Puedes descubrir cuál imagen es falsa?</b><br />
                  Haz clic en la imagen que creas que fue generada por la IA.
                </p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={iniciarJuego}>¡Jugar!</button>
              </div>
            </div>
          </div>
        </div>
      }

      {/* CENTRAR CANVAS Y MÁRGENES */}
      <div id="game-container-gan"
        style={{
          margin: '40px auto 0 auto',
          minHeight: 400,
          maxWidth: 700,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }} />

      {/* MENSAJE FINAL */}
      {resultado && (
        <div className="alert alert-success mt-3" style={{ maxWidth: 650, margin: "auto" }}>
          {resultado}
          <br />
          <small>
            Los GANs se usan hoy para crear fotos, dibujos y hasta videos falsos. ¿En qué otras situaciones crees que sería importante distinguir lo real de lo generado por IA?
          </small>
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
