import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { useNavigate } from 'react-router-dom';

export default function SemiSupervisedGame() {
  const gameRef = useRef(null);
  const navigate = useNavigate();
  const [instruccion, setInstruccion] = useState(true);
  const [resultado, setResultado] = useState(null);
  const [ejemploActual, setEjemploActual] = useState(0);
  const [juegoKey, setJuegoKey] = useState(0);

  
  const ejemplos = [
    [
      { icon: '🐱', label: 'Gato' },
      { icon: '🐶', label: '' },
      { icon: '🐭', label: 'Ratón' }
    ],
    [
      { icon: '🦊', label: 'Zorro' },
      { icon: '🐻', label: '' },
      { icon: '🐨', label: 'Koala' }
    ],
    [
      { icon: '🦁', label: 'León' },
      { icon: '🐷', label: 'Cerdo' },
      { icon: '🐸', label: '' }
    ],
    [
      { icon: '🐢', label: '' },
      { icon: '🐦', label: 'Pájaro' },
      { icon: '🐠', label: 'Pez' }
    ],
    [
      { icon: '🐘', label: '' },
      { icon: '🐼', label: 'Panda' },
      { icon: '🦓', label: 'Cebra' }
    ]
  ];

  
  const respuestas = ['Perro', 'Oso', 'Rana', 'Tortuga', 'Elefante'];

  
  const opciones = [
    ['Gato', 'Perro', 'Ratón'],
    ['Oso', 'Zorro', 'Koala'],
    ['León', 'Rana', 'Cerdo'],
    ['Tortuga', 'Pez', 'Pájaro'],
    ['Cebra', 'Elefante', 'Panda']
  ];

  const iniciarJuego = () => {
    setInstruccion(false);
    setResultado(null);
    setEjemploActual(0);
    setJuegoKey(k => k + 1);
  };

  
  useEffect(() => {
    if (!instruccion && !gameRef.current) {
      let idx = ejemploActual;
      let completed = false;

      gameRef.current = new Phaser.Game({
        type: Phaser.AUTO,
        width: 650,
        height: 430,
        parent: 'game-container-semisupervised',
        backgroundColor: '#ffe0e0',
        scene: {
          create: function () {
            
            this.add.text(60, 30, "🧩 Semi-Supervised: ¿Quién es el animal sin pista?", {
              fontFamily: 'Courier New',
              fontSize: '22px',
              color: '#b71c1c'
            });

            
            let yBase = 120;
            let xBase = 140;
            ejemplos[idx].forEach((em, i) => {
              this.add.text(xBase + i * 130, yBase, em.icon, { fontSize: '60px' }).setOrigin(0.5);
              if (em.label)
                this.add.text(xBase + i * 130, yBase + 60, em.label, { fontSize: '18px', color: '#333' }).setOrigin(0.5);
            });

            
            this.add.text(325, 210, '¿Quién es el animal sin etiqueta?', {
              fontFamily: 'Arial',
              fontSize: '19px',
              color: '#ad1457'
            }).setOrigin(0.5);

            
            let feedback = this.add.text(325, 340, '', { fontSize: '21px', color: '#1976d2' }).setOrigin(0.5);

            
            let buttons = [];
            opciones[idx].forEach((op, i) => {
              const bx = 210 + i * 110, by = 270;
              let btn = this.add.rectangle(bx, by, 90, 45, 0xffb3b3)
                .setStrokeStyle(3, 0xd32f2f)
                .setInteractive({ useHandCursor: true });
              let label = this.add.text(bx, by, op, { fontSize: '20px', color: '#333' }).setOrigin(0.5);

              btn.on('pointerover', () => btn.setFillStyle(0xffcdd2));
              btn.on('pointerout', () => btn.setFillStyle(0xffb3b3));
              btn.on('pointerdown', () => {
                if (completed) return;
                if (op === respuestas[idx]) {
                  btn.setFillStyle(0xa5d6a7).setStrokeStyle(4, 0x388e3c);
                  label.setColor('#2e7d32');
                  feedback.setText('¡Correcto! ' + emojify(op) + ' es el animal sin etiqueta. 🏆');
                  setResultado('¡Acertaste! Así aprende una IA semi-supervisada: algunas cosas tienen pista, otras no.');

                  completed = true;
                  
                  this.time.delayedCall(1800, () => {
                    if (idx + 1 < ejemplos.length) {
                      setEjemploActual(e => e + 1);
                      setResultado(null);
                      if (gameRef.current) {
                        gameRef.current.destroy(true);
                        gameRef.current = null;
                      }
                    } else {
                      setResultado("¡Terminaste todos los ejemplos! Ahora sabes cómo aprende una IA con ejemplos mezclados.");
                    }
                  });
                } else {
                  btn.setFillStyle(0xef9a9a).setStrokeStyle(4, 0xb71c1c);
                  label.setColor('#b71c1c');
                  feedback.setText('Intenta otra vez...');
                  setTimeout(() => {
                    btn.setFillStyle(0xffb3b3).setStrokeStyle(3, 0xd32f2f);
                    label.setColor('#333');
                  }, 800);
                }
              });
              buttons.push(btn);
            });

            function emojify(txt) {
              switch (txt.toLowerCase()) {
                case 'perro': return '🐶';
                case 'oso': return '🐻';
                case 'rana': return '🐸';
                case 'tortuga': return '🐢';
                case 'elefante': return '🐘';
                default: return txt;
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
    
  }, [instruccion, juegoKey, ejemploActual]);

  const handleReset = () => {
    setInstruccion(true);
    setResultado(null);
    setEjemploActual(0);
    setJuegoKey(k => k + 1);
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
          <div className="modal-dialog" style={{ marginTop: 90 }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">¿Qué es Semi-Supervised Learning?</h5>
              </div>
              <div className="modal-body">
                <p>
                  <b>Aprendizaje semi-supervisado</b> es cuando la IA aprende con algunos ejemplos que tienen pista y otros no.
                </p>
                <ul>
                  <li>¡Ayuda a la IA cuando etiquetar todo es muy difícil!</li>
                  <li>Así puede adivinar lo que falta basándose en pocas pistas</li>
                </ul>
                <p>Tu reto: <b>Adivina el animal sin etiqueta usando las pistas.</b></p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={iniciarJuego}>¡Jugar!</button>
              </div>
            </div>
          </div>
        </div>
      )}

      
      <div id="game-container-semisupervised" style={{
        margin: '30px auto 0 auto',
        minHeight: 400,
        maxWidth: 680,
        background: '#ffe0e0',
        borderRadius: 14,
        boxShadow: '0 2px 8px #ef9a9a'
      }} />

      
      {resultado && (
        <div className="alert alert-info mt-3 text-center" style={{ maxWidth: 650, margin: "auto" }}>
          {resultado}
          <br />
          <small>
            Así los algoritmos pueden aprender de poquitas pistas y adivinar el resto, ¡como tú!
          </small>
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
