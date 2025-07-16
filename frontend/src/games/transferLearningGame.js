import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { useNavigate } from 'react-router-dom';

export default function TransferLearningGame() {
  const gameRef = useRef(null);
  const navigate = useNavigate();
  const [fase, setFase] = useState('intro'); 
  const [aciertos, setAciertos] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [resultado, setResultado] = useState(null);
  const [juegoKey, setJuegoKey] = useState(0);

  useEffect(() => {
    if (fase !== 'intro' && !gameRef.current) {
      let escena = {};

      
      if (fase === 'entrenamiento') {
        escena = {
          create: function () {
            this.add.text(325, 40, "Fase 1: ¿Es un GATO?", { fontSize: '28px', fill: '#6c1ba1', fontFamily: 'monospace', fontStyle: 'bold' }).setOrigin(0.5);
            let index = 0;
            const ejemplos = [
              { emoji: "🐱", esGato: true },
              { emoji: "🐶", esGato: false },
              { emoji: "🐱", esGato: true },
              { emoji: "🦁", esGato: false }
            ];
            let texto = this.add.text(325, 140, ejemplos[index].emoji, { fontSize: '110px' }).setOrigin(0.5);
            let msg = this.add.text(325, 210, '', { fontSize: '22px', fill: '#1b5e20' }).setOrigin(0.5);

            
            const btnSi = this.add.rectangle(235, 300, 120, 60, 0xa5d6a7).setInteractive({ useHandCursor: true });
            const btnNo = this.add.rectangle(415, 300, 120, 60, 0xffccbc).setInteractive({ useHandCursor: true });
            this.add.text(207, 288, "Gato", { fontSize: '24px', fill: '#222', fontFamily: 'monospace' });
            this.add.text(387, 288, "No Gato", { fontSize: '24px', fill: '#222', fontFamily: 'monospace' });

            let terminado = false;

            const responder = (respuesta) => {
              if (terminado) return;
              if (respuesta === ejemplos[index].esGato) {
                msg.setText('¡Correcto!');
                setAciertos(prev => prev + 1);
              } else {
                msg.setText('Intenta otra vez.');
              }
              setTimeout(() => {
                index++;
                if (index < ejemplos.length) {
                  texto.setText(ejemplos[index].emoji);
                  msg.setText('');
                } else {
                  terminado = true;
                  setTimeout(() => setFase('transferencia'), 950);
                }
              }, 950);
            };

            btnSi.on('pointerdown', () => responder(true));
            btnNo.on('pointerdown', () => responder(false));
          }
        };
      }

      
      if (fase === 'transferencia') {
        escena = {
          create: function () {
            this.add.text(325, 40, "Fase 2: ¿Lo aprendido ayuda?", { fontSize: '28px', fill: '#6c1ba1', fontFamily: 'monospace', fontStyle: 'bold' }).setOrigin(0.5);
            let index = 0;
            const ejemplos = [
              { emoji: "🐯", label: "Tigre", esGato: true },
              { emoji: "🐭", label: "Ratón", esGato: false },
              { emoji: "🐯", label: "Tigre", esGato: true }
            ];
            let texto = this.add.text(325, 140, ejemplos[index].emoji, { fontSize: '110px' }).setOrigin(0.5);
            let msg = this.add.text(325, 210, '', { fontSize: '22px', fill: '#1b5e20' }).setOrigin(0.5);

            const btnParecido = this.add.rectangle(235, 300, 150, 60, 0xc5e1a5).setInteractive({ useHandCursor: true });
            const btnNo = this.add.rectangle(415, 300, 150, 60, 0xef9a9a).setInteractive({ useHandCursor: true });
            this.add.text(185, 288, "Como gato", { fontSize: '22px', fill: '#222', fontFamily: 'monospace' });
            this.add.text(382, 288, "Diferente", { fontSize: '22px', fill: '#222', fontFamily: 'monospace' });

            let terminado = false;

            const responder = (respuesta) => {
              if (terminado) return;
              if (respuesta === ejemplos[index].esGato) {
                msg.setText('¡Exacto! Lo aprendido de gatos ayuda con tigres.');
                setFeedback("¡Usaste el aprendizaje anterior!");
              } else {
                msg.setText('Inténtalo otra vez...');
              }
              setTimeout(() => {
                index++;
                if (index < ejemplos.length) {
                  texto.setText(ejemplos[index].emoji);
                  msg.setText('');
                } else {
                  terminado = true;
                  setTimeout(() => setFase('resultado'), 950);
                }
              }, 950);
            };

            btnParecido.on('pointerdown', () => responder(true));
            btnNo.on('pointerdown', () => responder(false));
          }
        };
      }

      
      if (fase === 'resultado') {
        escena = {
          create: function () {
            this.add.text(325, 120, "¡Transferencia de conocimiento lograda! 🎉", {
              fontSize: '26px',
              fill: '#4a148c',
              fontFamily: 'Arial'
            }).setOrigin(0.5);
            this.add.text(325, 220, "Así una IA puede aprender más rápido usando ejemplos previos.", {
              fontSize: '19px',
              fill: '#222',
              fontFamily: 'Arial',
              wordWrap: { width: 600 }
            }).setOrigin(0.5);
          }
        };
        setResultado("¿Ves cómo los humanos y las IAs pueden aprender cosas nuevas usando lo que ya saben?\n¡Eso es Transfer Learning!");
      }

      gameRef.current = new Phaser.Game({
        type: Phaser.AUTO,
        width: 650,
        height: 400,
        parent: 'game-container-transferlearning',
        backgroundColor: '#f3e5f5',
        scene: escena
      });
    }
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
    
  }, [fase, juegoKey]);

  
  const volverCategoria = () => navigate(-1);
  const handleReset = () => {
    setAciertos(0);
    setFeedback('');
    setResultado(null);
    setJuegoKey(k => k + 1);
    setFase('entrenamiento');
    if (gameRef.current) {
      gameRef.current.destroy(true);
      gameRef.current = null;
    }
  };

  return (
    <div>
      
      {fase === 'intro' && (
        <div className="modal show d-block" tabIndex="-1" style={{
          background: 'rgba(0,0,0,0.3)',
          position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', zIndex: 1000
        }}>
          <div className="modal-dialog" style={{ marginTop: 100 }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">¿Qué es Transfer Learning?</h5>
              </div>
              <div className="modal-body">
                <p>
                  <b>Transfer Learning</b> permite a una IA usar lo que aprendió en una tarea para otra tarea parecida. Así aprende más rápido y necesita menos ejemplos nuevos.
                </p>
                <p>Primero, <b>ayuda a la IA a reconocer gatos</b>. Luego… ¡veamos si lo aprendido sirve para reconocer tigres!</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={() => setFase('entrenamiento')}>¡Empezar!</button>
              </div>
            </div>
          </div>
        </div>
      )}

      
      <div
        id="game-container-transferlearning"
        style={{
          margin: '32px auto',
          minHeight: 400,
          maxWidth: 700,
          background: '#faf7fd',
          borderRadius: 22,
          boxShadow: "0 4px 32px #e2d7f5",
          padding: 10
        }}
      />

      
      {feedback && fase === "transferencia" && (
        <div className="alert alert-info mt-3" style={{ maxWidth: 650, margin: "auto" }}>
          {feedback}
        </div>
      )}
      {resultado && fase === "resultado" && (
        <div className="alert alert-success mt-3" style={{ maxWidth: 650, margin: "auto" }}>
          {resultado}
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
