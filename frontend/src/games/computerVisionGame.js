// src/games/computerVisionGame.js
import React, { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import { useNavigate, useParams } from "react-router-dom";

export default function ComputerVisionGame() {
  const gameRef = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const [nivel, setNivel] = useState(0); // 0 = rojo, 1 = amarillo, 2 = verde
  const [fase, setFase] = useState("intro"); // intro, jugar, fin
  const [resultado, setResultado] = useState(null);

  const colores = [
    { color: 0xff0000, nombre: "rojo", accion: "Detenerse 🛑" },
    { color: 0xffeb3b, nombre: "amarillo", accion: "Precaución ⚠️" },
    { color: 0x00e676, nombre: "verde", accion: "Avanzar 🚗💨" }
  ];

  useEffect(() => {
    if ((fase === "jugar" || fase === "fin") && !gameRef.current) {
      gameRef.current = new Phaser.Game({
        type: Phaser.AUTO,
        width: 400,
        height: 480,
        parent: "game-container-computervision",
        backgroundColor: "#f3e5f5",
        scene: {
          create: function () {
            this.add.text(30, 30, `🚦 Computer Vision: Semáforo - Nivel ${fase === "fin" ? "Final" : nivel + 1}`, {
              fontFamily: "monospace",
              fontSize: "20px",
              fill: "#222",
              align: "center",
              wordWrap: { width: 340 }
            });
            this.add.text(30, 65, fase === "fin"
              ? "¡Observa el semáforo completo!"
              : `Selecciona el círculo ${colores[nivel].nombre}`, {
              fontFamily: "monospace",
              fontSize: "18px",
              fill: "#333",
              align: "center",
              wordWrap: { width: 340 }
            });

            this.add.rectangle(200, 240, 22, 285, 0x333333).setDepth(-1);

            const posiciones = [135, 240, 345];
            let circulos = [];
            const resaltar = fase === "fin" ? -1 : nivel;

            for (let i = 0; i < 3; i++) {
              let alpha = resaltar === -1 ? 1 : (i === resaltar ? 1 : 0.35);
              let circ = this.add.circle(200, posiciones[i], 60, colores[i].color)
                .setAlpha(alpha)
                .setInteractive({ useHandCursor: fase !== "fin" });

              circulos.push(circ);

              if (fase !== "fin") {
                circ.on("pointerdown", () => {
                  if (i === nivel) {
                    circ.setStrokeStyle(7, 0x388e3c);
                    this.add.text(110, 405, colores[i].accion, {
                      fontSize: "28px",
                      fill: "#388e3c",
                      fontFamily: "monospace"
                    });
                    setTimeout(() => {
                      if (nivel < 2) {
                        setNivel((n) => n + 1);
                        setFase("jugar");
                      } else {
                        setFase("fin");
                        setResultado("¡Felicidades! Has aprendido a reconocer el semáforo como un auto inteligente. Así es como los autos autónomos, robots y cámaras inteligentes usan la visión computacional para tomar decisiones.");
                      }
                    }, 900);
                  } else {
                    circ.setStrokeStyle(7, 0xd32f2f);
                    this.add.text(100, 420, "¡No es el color correcto!", {
                      fontSize: "18px",
                      fill: "#d32f2f",
                      fontFamily: "monospace"
                    });
                    setTimeout(() => {
                      circ.setStrokeStyle();
                      // Limpia el error
                      this.children.list
                        .filter(t => t.text && t.text.startsWith("¡No es el color"))
                        .forEach(t => t.destroy());
                    }, 700);
                  }
                });
              }
            }
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
  }, [fase, nivel]);

  // Volver a jugar
  function reiniciar() {
    setNivel(0);
    setFase("jugar");
    setResultado(null);
    if (gameRef.current) {
      gameRef.current.destroy(true);
      gameRef.current = null;
    }
  }

  // Vuelve a la categoría anterior
  function volverCategoria() {
    navigate(-1); // Puedes cambiarlo por navigate("/categorias") si prefieres ruta fija
  }

  return (
    <div>
      {/* Modal de bienvenida */}
      {fase === "intro" && (
        <div className="modal show d-block" tabIndex="-1" style={{
          background: 'rgba(0,0,0,0.3)',
          position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', zIndex: 1000
        }}>
          <div className="modal-dialog" style={{ marginTop: 100 }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">¿Cómo "ven" los autos el semáforo?</h5>
              </div>
              <div className="modal-body">
                <p>
                  <b>Visión computacional</b> permite a los autos autónomos, robots y cámaras inteligentes "ver" el semáforo, identificar el color y decidir qué hacer: avanzar, detenerse o tener precaución.
                </p>
                <ul>
                  <li>Rojo: Detenerse</li>
                  <li>Amarillo: Precaución</li>
                  <li>Verde: Avanzar</li>
                </ul>
                <p>
                  Tu reto: <b>Selecciona el color correcto del semáforo en cada nivel.</b>
                </p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={() => setFase("jugar")}>¡Jugar!</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Phaser game container */}
      <div
        id="game-container-computervision"
        style={{
          margin: '40px auto',
          minHeight: 480,
          maxWidth: 430,
          background: "#fff",
          borderRadius: 18,
          boxShadow: "0 2px 14px 2px #e0e0e0"
        }}
      />

      {/* Mensaje final */}
      {fase === "fin" && resultado && (
        <div className="alert alert-success mt-3" style={{ maxWidth: 600, margin: "40px auto", textAlign: "center" }}>
          <div style={{ fontSize: 28, marginBottom: 10 }}>🚦</div>
          <b>
            ¡Felicidades! Has aprendido a reconocer el semáforo como un auto inteligente.
          </b>
          <p style={{ margin: "10px 0" }}>
            Así es como los autos autónomos, robots y cámaras inteligentes usan la visión computacional para tomar decisiones.
          </p>
          <b>¿Puedes ver el semáforo y decidir qué hacer como un auto inteligente?</b>
        </div>
      )}

      {/* Botones de navegación SIEMPRE visibles cuando no es intro */}
      {fase !== "intro" && (
        <div className="d-flex justify-content-center mt-4 gap-3">
          <button className="btn btn-secondary" onClick={volverCategoria}>
            Volver a Categoría
          </button>
          <button className="btn btn-primary" onClick={reiniciar}>
            Jugar de nuevo
          </button>
        </div>
      )}
    </div>
  );
}
