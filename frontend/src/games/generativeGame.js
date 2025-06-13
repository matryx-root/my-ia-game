import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { useNavigate, useParams } from 'react-router-dom';

const ejemplos = [
  { frase: "El robot saltó sobre la luna.", imgKey: "robot", imgUrl: "/games-images/robot-luna.png" },
  { frase: "Un perro azul bailando.", imgKey: "perro", imgUrl: "/games-images/perro-azul.png" },
  { frase: "Un auto con alas.", imgKey: "auto", imgUrl: "/games-images/auto-alas.png" },
  { frase: "Un dragón tocando guitarra.", imgKey: "dragon", imgUrl: "/games-images/dragon-guitarra.png" }
];

export default function GenerativeGame() {
  const gameRef = useRef(null);
  const navigate = useNavigate();
  const [instruccion, setInstruccion] = useState(true);
  const [resultado, setResultado] = useState(null);
  const [juegoKey, setJuegoKey] = useState(0);
  const [currentIdx, setCurrentIdx] = useState(() => Math.floor(Math.random() * ejemplos.length));
  const [estado, setEstado] = useState("frase"); // "frase" o "imagen"

  const iniciarJuego = () => setInstruccion(false);

  useEffect(() => {
    if (!instruccion && !gameRef.current) {
      let fraseText, imgSprite, btn, generating = false;

      gameRef.current = new Phaser.Game({
        type: Phaser.AUTO,
        width: 720,
        height: 430,
        parent: 'game-container-generative',
        backgroundColor: '#e3f2fd',
        scene: {
          preload: function () {
            ejemplos.forEach(ej => this.load.image(ej.imgKey, ej.imgUrl));
          },
          create: function () {
            // Botón Generar/Siguiente
            btn = this.add.rectangle(360, 60, 180, 60, 0x90caf9)
              .setInteractive({ useHandCursor: true });
            let btnText = this.add.text(305, 45, "Generar", { font: "24px Arial", fill: "#0d47a1" });

            // Frase alineada a la izquierda, centrada vertical
            fraseText = this.add.text(60, 200, ejemplos[currentIdx].frase, {
              font: "32px Arial",
              fill: "#111",
              wordWrap: { width: 280 }
            });
            fraseText.setOrigin(0, 0.5);

            // Imagen a la derecha, inicialmente invisible
            imgSprite = this.add.image(540, 215, ejemplos[currentIdx].imgKey)
              .setDisplaySize(290, 200)
              .setAlpha(0)
              .setOrigin(0.5, 0.5);

            let estadoActual = "frase"; // Local del juego

            btn.on('pointerdown', () => {
              if (generating) return;

              if (estadoActual === "frase") {
                generating = true;
                btnText.setText("Siguiente");
                setResultado("La IA está generando una nueva imagen...");
                // Mostrar imagen después de 2s con fade-in
                this.time.delayedCall(2000, () => {
                  this.tweens.add({
                    targets: imgSprite,
                    alpha: 1,
                    duration: 900,
                    onComplete: () => {
                      setResultado("¡La IA generó una creación nueva!");
                      generating = false;
                      estadoActual = "imagen";
                      setEstado("imagen");
                    }
                  });
                });
              } else {
                // Elegir otra frase al azar, ocultar imagen, actualizar frase
                let idx = Phaser.Math.Between(0, ejemplos.length - 1);
                while (idx === currentIdx) idx = Phaser.Math.Between(0, ejemplos.length - 1);
                setCurrentIdx(idx);
                fraseText.setText(ejemplos[idx].frase);
                imgSprite.setAlpha(0);
                imgSprite.setTexture(ejemplos[idx].imgKey);
                btnText.setText("Generar");
                setResultado(null);
                estadoActual = "frase";
                setEstado("frase");
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
    // eslint-disable-next-line
  }, [instruccion, juegoKey, currentIdx]);

  // Reiniciar
  const handleReset = () => {
    setInstruccion(true);
    setResultado(null);
    setJuegoKey(k => k + 1);
    setCurrentIdx(Math.floor(Math.random() * ejemplos.length));
    setEstado("frase");
    if (gameRef.current) {
      gameRef.current.destroy(true);
      gameRef.current = null;
    }
  };

  const volverCategoria = () => navigate(-1);

  return (
    <div>
      {/* Modal explicativo */}
      {instruccion &&
        <div className="modal show d-block" tabIndex="-1" style={{
          background: 'rgba(0,0,0,0.3)',
          position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', zIndex: 1000
        }}>
          <div className="modal-dialog" style={{ marginTop: 80 }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">¿Qué es Generative AI?</h5>
              </div>
              <div className="modal-body">
                <p>
                  <b>Generative AI</b> crea cosas nuevas combinando ideas, imágenes o sonidos.<br />
                  Es como una máquina creativa digital.<br /><br />
                  <b>¿Cómo funciona?</b> Primero aprende de muchos ejemplos y luego <b>genera</b> algo que nunca ha visto antes.
                </p>
                <ul>
                  <li>Puede inventar historias, dibujos, música o imágenes.</li>
                  <li>La usan herramientas como ChatGPT, DALL-E y más.</li>
                </ul>
                <p>
                  Haz clic en <b>Generar</b> para ver cómo la IA crea imágenes a partir de una frase.
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
      <div id="game-container-generative" style={{ margin: 'auto', minHeight: 430 }} />

      {/* Feedback educativo */}
      {resultado && (
        <div className="alert alert-info mt-3" style={{ maxWidth: 700, margin: "auto" }}>
          {resultado}
          <br />
          <small>
            Las IA generativas combinan ideas para crear nuevas imágenes y frases. ¡Eso es creatividad digital!
          </small>
        </div>
      )}

      {/* Botones debajo del juego */}
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
