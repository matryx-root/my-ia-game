import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { useNavigate } from 'react-router-dom';

export default function SupervisedGame() {
  const gameRef = useRef(null);
  const navigate = useNavigate();
  const [instruccion, setInstruccion] = useState(true);
  const [resultado, setResultado] = useState(null);
  const [ejemplo, setEjemplo] = useState(0);
  const [juegoKey, setJuegoKey] = useState(0);

  
  const frutas = [
    { nombre: 'Manzana', emoji: '🍎' },
    { nombre: 'Plátano', emoji: '🍌' },
    { nombre: 'Uva', emoji: '🍇' },
    { nombre: 'Sandía', emoji: '🍉' },
    { nombre: 'Pera', emoji: '🍐' }
  ];

  const iniciarJuego = () => {
    setInstruccion(false);
    setResultado(null);
    setEjemplo(0);
    setJuegoKey(k => k + 1);
  };

  useEffect(() => {
    if (!instruccion && !gameRef.current) {
      let idx = ejemplo;
      let frutaActual = Phaser.Math.Between(0, frutas.length - 1);
      let completed = false;

      gameRef.current = new Phaser.Game({
        type: Phaser.AUTO,
        width: 600,
        height: 400,
        parent: 'game-container-supervised',
        backgroundColor: '#fffde7',
        scene: {
          create: function () {
            
            this.add.text(300, 36, "🍎 Juego Supervisado: ¿Qué fruta es?", {
              fontSize: '23px', fill: '#333', fontFamily: 'Arial', fontStyle: 'bold'
            }).setOrigin(0.5);

            
            const fruta = frutas[frutaActual];
            this.add.text(300, 120, fruta.emoji, { fontSize: '110px' }).setOrigin(0.5);

            
            let feedback = this.add.text(300, 320, '', { fontSize: '21px', fill: '#388e3c', fontFamily: 'Arial' }).setOrigin(0.5);

            
            frutas.forEach((f, idxBtn) => {
              const bx = 170 + idxBtn * 80;
              let btn = this.add.circle(bx, 230, 42, 0xa5d6a7)
                .setStrokeStyle(4, 0x388e3c)
                .setInteractive({ useHandCursor: true });
              let label = this.add.text(bx, 230, f.nombre, {
                fontSize: '16px',
                color: '#333',
                fontFamily: 'Arial'
              }).setOrigin(0.5);

              btn.on('pointerover', () => btn.setFillStyle(0xdcedc8));
              btn.on('pointerout', () => btn.setFillStyle(0xa5d6a7));
              btn.on('pointerdown', () => {
                if (completed) return;
                if (f.nombre === fruta.nombre) {
                  btn.setFillStyle(0x81c784).setStrokeStyle(4, 0x1b5e20);
                  label.setColor('#1b5e20');
                  feedback.setText('¡Correcto! Así aprende una IA con ejemplos.');
                  setResultado('¡Acertaste! Así funciona el aprendizaje supervisado: la IA aprende a clasificar por ejemplos.');
                  completed = true;
                  
                  this.time.delayedCall(1500, () => {
                    if (idx + 1 < 5) {
                      setEjemplo(e => e + 1);
                      setResultado(null);
                      if (gameRef.current) {
                        gameRef.current.destroy(true);
                        gameRef.current = null;
                      }
                    } else {
                      setResultado("¡Terminaste todos los ejemplos! Así entrenan las IA: ¡con muchos ejemplos y etiquetas!");
                    }
                  });
                } else {
                  btn.setFillStyle(0xffb3b3).setStrokeStyle(4, 0xb71c1c);
                  label.setColor('#b71c1c');
                  feedback.setText('Intenta otra vez...');
                  setTimeout(() => {
                    btn.setFillStyle(0xa5d6a7).setStrokeStyle(4, 0x388e3c);
                    label.setColor('#333');
                  }, 700);
                }
              });
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
    
  }, [instruccion, juegoKey, ejemplo]);

  
  const handleReset = () => {
    setInstruccion(true);
    setResultado(null);
    setEjemplo(0);
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
                <h5 className="modal-title">¿Qué es Aprendizaje Supervisado?</h5>
              </div>
              <div className="modal-body">
                <p>
                  <b>Aprendizaje supervisado</b> es cuando una IA aprende con muchos ejemplos y sus respuestas correctas.
                </p>
                <ul>
                  <li>Ejemplo: “Esto es una manzana 🍎”, “Esto es un plátano 🍌”</li>
                  <li>Así la IA aprende a reconocer objetos o palabras según las etiquetas</li>
                  <li>Sirve para clasificadores de imágenes, spam, diagnósticos y más</li>
                </ul>
                <p>Tu reto: <b>Clasifica la fruta correctamente</b>. ¡Estás entrenando tu propio mini-modelo!</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={iniciarJuego}>¡Jugar!</button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div id="game-container-supervised" style={{
        margin: '30px auto 0 auto',
        minHeight: 400,
        maxWidth: 680,
        background: '#fffde7',
        borderRadius: 14,
        boxShadow: '0 2px 8px #fff9c4'
      }} />
      
      {resultado && (
        <div className="alert alert-success mt-3 text-center" style={{ maxWidth: 600, margin: "auto" }}>
          {resultado}
          <br />
          <small>
            Así se entrenan modelos de IA: ¡Con ejemplos y respuestas correctas!
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
