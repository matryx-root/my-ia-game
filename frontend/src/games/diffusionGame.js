import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { useNavigate, useParams } from 'react-router-dom';

export default function DiffusionGame() {
  const gameRef = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const [instruccion, setInstruccion] = useState(true);
  const [resultado, setResultado] = useState(null);

  const iniciarJuego = () => setInstruccion(false);

  useEffect(() => {
    if (!instruccion && !gameRef.current) {
      let terminado = false;
      let blur = 0;
      let img = null;

      function onBlur(scene) {
        if (terminado) return;
        blur += 0.25;
        img.setAlpha(Math.max(0.1, 1 - blur * 0.2));
        if (blur >= 4) {
          terminado = true;
          scene.add.text(90, 380, "¡Imagen completamente difusa! Así 'aprende' un modelo de difusión.", {
            fontSize: '20px', fill: '#6d4c41'
          });
          setResultado(
            "¡Lo lograste! Los modelos de difusión aprenden a transformar imágenes paso a paso, como cuando desenfocas una foto poco a poco."
          );
        }
      }

      gameRef.current = new Phaser.Game({
        type: Phaser.AUTO,
        width: 650,
        height: 430,
        parent: 'game-container-diffusion',
        backgroundColor: '#eceff1',
        scene: {
          preload: function () {
            this.load.image('apple', 'https://labs.phaser.io/assets/sprites/apple.png');
          },
          create: function () {
            this.add.text(90, 35, "🌫️ Diffusion Model: Difumina la imagen paso a paso", { fontSize: '19px', fill: '#333' });
            img = this.add.image(325, 200, 'apple').setScale(2);

            // Botón profesional y didáctico
            const boton = this.add.container(325, 330);

            // Fondo del botón (azul, grande y redondeado)
            const bg = this.add.rectangle(0, 0, 240, 54, 0x1976d2, 0.95)
              .setStrokeStyle(3, 0x1565c0)
              .setInteractive({ useHandCursor: true });

            // Emoji y texto
            const icono = this.add.text(-105, -15, "✨", { fontSize: "28px" });
            const txt = this.add.text(-75, -15, "Difuminar manzana", {
              fontFamily: 'monospace',
              fontSize: "20px",
              color: "#fff",
              fontStyle: "bold"
            });

            boton.add([bg, icono, txt]);

            // Animación hover
            bg.on("pointerover", () => {
              bg.setFillStyle(0x2196f3, 1);
              bg.setScale(1.08);
              txt.setFontStyle("bold");
              icono.setFontSize("32px");
            });
            bg.on("pointerout", () => {
              bg.setFillStyle(0x1976d2, 0.95);
              bg.setScale(1);
              txt.setFontStyle("bold");
              icono.setFontSize("28px");
            });

            // Clic difuminar
            bg.on("pointerdown", () => onBlur(this));
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

  // Reset: vuelve a mostrar instrucciones y reinicia juego
  const handleReset = () => {
    setInstruccion(true);
    setResultado(null);
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
      {/* Modal de instrucción */}
      {instruccion &&
        <div className="modal show d-block" tabIndex="-1" style={{
          background: 'rgba(0,0,0,0.3)',
          position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', zIndex: 1000
        }}>
          <div className="modal-dialog" style={{ marginTop: 100 }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">¿Qué es un Diffusion Model?</h5>
              </div>
              <div className="modal-body">
                <p>
                  <b>Los modelos de difusión</b> son como magos que pueden <b>transformar imágenes</b> paso a paso, difuminando y luego creando cosas nuevas.<br />
                  <br />
                  <b>¿Dónde los encuentras?</b>
                  <ul>
                    <li>En IA generativa (como DALL-E o Stable Diffusion), que crea imágenes desde cero.</li>
                    <li>En efectos de desenfoque de apps de fotos y filtros.</li>
                  </ul>
                  <b>Tu reto:</b> Haz clic para ver cómo una imagen se va "difuminando" poco a poco.<br />
                  Así, las IAs aprenden a mezclar, transformar y luego crear cosas nuevas.
                </p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={iniciarJuego}>¡Probar!</button>
              </div>
            </div>
          </div>
        </div>
      }

      {/* Contenedor del juego */}
      <div id="game-container-diffusion" style={{ margin: 'auto', minHeight: 440 }} />
      {/* Feedback final después de jugar */}
      {resultado && (
        <div className="alert alert-info mt-3" style={{ maxWidth: 650, margin: "auto" }}>
          {resultado}
          <br />
          <small>
            Cuando una IA termina de "difuminar", también puede aprender a reconstruir imágenes, <b>¡así se crean fotos nuevas con IA!</b>
          </small>
        </div>
      )}

      {/* Botones debajo del juego, solo si NO está en la instrucción */}
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
