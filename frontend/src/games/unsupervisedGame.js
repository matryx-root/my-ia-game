import React, { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import { useNavigate } from "react-router-dom";

export default function UnsupervisedGame() {
  const gameRef = useRef(null);
  const navigate = useNavigate();
  const [fase, setFase] = useState("intro"); 
  const [colorActual, setColorActual] = useState(0);
  const [resultado, setResultado] = useState(null);
  const [juegoKey, setJuegoKey] = useState(0);

  
  const colores = [
    { color: 0xff0000, nombre: "rojo", rgb: "#ff0000" },
    { color: 0x00ff00, nombre: "verde", rgb: "#00ff00" },
    { color: 0x0000ff, nombre: "azul", rgb: "#0000ff" },
  ];

  useEffect(() => {
    if (fase === "jugar" && !gameRef.current) {
      gameRef.current = new Phaser.Game({
        type: Phaser.AUTO,
        width: 600,
        height: 400,
        parent: "game-container-unsupervised",
        backgroundColor: "#e8eaf6",
        scene: {
          create: function () {
            this.add.text(60, 30, `Encuentra los 3 círculos ${colores[colorActual].nombre}s`, {
              fontSize: "22px",
              fill: "#222",
            });

            let circulos = [];
            let indices = [0, 1, 2, 0, 1, 2, 0, 1, 2];
            Phaser.Utils.Array.Shuffle(indices);
            let seleccionados = 0;

            indices.forEach((idx, i) => {
              let circ = this.add.circle(
                100 + (i % 3) * 150,
                120 + Math.floor(i / 3) * 90,
                35,
                colores[idx].color
              ).setInteractive({ useHandCursor: true });

              circ.esObjetivo = idx === colorActual;
              circ.seleccionado = false;

              circ.on("pointerdown", () => {
                if (fase !== "jugar") return;
                if (circ.esObjetivo && !circ.seleccionado) {
                  circ.setStrokeStyle(6, 0xffe082);
                  circ.seleccionado = true;
                  seleccionados++;
                  if (seleccionados === 3) {
                    setTimeout(() => {
                      if (colorActual < 2) {
                        setColorActual((c) => c + 1);
                        setFase("jugar");
                        if (gameRef.current) {
                          gameRef.current.destroy(true);
                          gameRef.current = null;
                        }
                      } else {
                        setResultado(
                          "¡Excelente! Agrupaste los colores igual que una IA. Así, la IA puede descubrir patrones sin saber los nombres."
                        );
                        setFase("fin");
                        if (gameRef.current) {
                          gameRef.current.destroy(true);
                          gameRef.current = null;
                        }
                      }
                    }, 650);
                  }
                }
              });
            });
            this.add.text(60, 340, "Haz clic solo en los del color pedido.", {
              fontSize: "18px",
              fill: "#555",
            });
          },
        },
      });
    }
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
    
  }, [fase, colorActual, juegoKey]);

  
  const volverCategoria = () => navigate(-1);

  const handleReset = () => {
    setColorActual(0);
    setResultado(null);
    setFase("jugar");
    setJuegoKey((k) => k + 1);
    if (gameRef.current) {
      gameRef.current.destroy(true);
      gameRef.current = null;
    }
  };

  return (
    <div>
      
      {fase === "intro" && (
        <div className="modal show d-block" tabIndex="-1" style={{
          background: 'rgba(0,0,0,0.3)',
          position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', zIndex: 1000
        }}>
          <div className="modal-dialog" style={{ marginTop: 100 }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Agrupamiento automático</h5>
              </div>
              <div className="modal-body">
                <p>
                  <b>Aprendizaje no supervisado</b> es cuando la IA <b>agrupa</b> cosas parecidas, ¡pero nadie le dice cómo se llaman!
                </p>
                <ul>
                  <li>Tu reto: <b>Haz clic solo en los 3 del mismo color</b>. Así, la IA agrupa por similitud.</li>
                  <li>La IA usa esto para clasificar fotos, sonidos, y más, aunque no tenga etiquetas.</li>
                </ul>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={() => { setColorActual(0); setFase("jugar"); }}>¡Empezar!</button>
              </div>
            </div>
          </div>
        </div>
      )}

      
      <div id="game-container-unsupervised" style={{ margin: 'auto', minHeight: 400, maxWidth: 620 }} />

      
      {fase === "fin" && (
        <div style={{ textAlign: "center", margin: "20px 0" }}>
          <div style={{ display: "flex", justifyContent: "center", gap: 40 }}>
           
            <div>
              <div>
                {[0, 1, 2].map(i => (
                  <span key={"rojo" + i} style={{
                    display: "inline-block",
                    width: 35, height: 35, borderRadius: "50%",
                    background: colores[0].rgb, margin: "0 2px"
                  }} />
                ))}
              </div>
              <div style={{ fontSize: 14, color: colores[0].rgb }}>Grupo Rojo</div>
            </div>
           
            <div>
              <div>
                {[0, 1, 2].map(i => (
                  <span key={"verde" + i} style={{
                    display: "inline-block",
                    width: 35, height: 35, borderRadius: "50%",
                    background: colores[1].rgb, margin: "0 2px"
                  }} />
                ))}
              </div>
              <div style={{ fontSize: 14, color: colores[1].rgb }}>Grupo Verde</div>
            </div>
            
            <div>
              <div>
                {[0, 1, 2].map(i => (
                  <span key={"azul" + i} style={{
                    display: "inline-block",
                    width: 35, height: 35, borderRadius: "50%",
                    background: colores[2].rgb, margin: "0 2px"
                  }} />
                ))}
              </div>
              <div style={{ fontSize: 14, color: colores[2].rgb }}>Grupo Azul</div>
            </div>
          </div>
        </div>
      )}

      
      {fase === "fin" && resultado && (
        <div className="alert alert-success mt-3" style={{ maxWidth: 600, margin: "auto" }}>
          {resultado}
          <br />
          <small>
            ¿Dónde podrías usar esto? Por ejemplo, agrupar fotos, notas o canciones por similitud, ¡sin saber sus nombres!
          </small>
        </div>
      )}

      
      {fase !== "intro" && (
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
