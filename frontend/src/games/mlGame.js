// src/games/mlGame.js
import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function MLClusterGame({ usuario }) {
  const navigate = useNavigate();
  const gameRef = useRef(null);
  const [instruccion, setInstruccion] = useState(true);
  const [resultado, setResultado] = useState(null);
  const [juegoKey, setJuegoKey] = useState(0);

  // Cambia este valor según el ID REAL del juego en tu tabla Juego
  const ML_GAME_ID = 2;

  const iniciarJuego = () => setInstruccion(false);

  useEffect(() => {
    if (!instruccion && !gameRef.current) {
      let clusters = [
        { color: 0x29b6f6, name: 'Azul' },
        { color: 0x66bb6a, name: 'Verde' },
        { color: 0xffca28, name: 'Amarillo' }
      ];
      let puntos = [];

      gameRef.current = new Phaser.Game({
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: 'game-container-ml-cluster',
        backgroundColor: '#f3f7fa',
        scene: {
          create: function () {
            this.completed = false;
            this.asignados = 0;
            puntos = [];

            this.add.text(50, 20, '🤖 ML: Agrupa los puntos por color (Clustering)', { fontSize: '22px', fill: '#333' });
            this.add.text(70, 65, 'Haz clic en cada punto y arrástralo al grupo correcto', { fontSize: '17px', fill: '#444' });

            clusters.forEach((cl, idx) => {
              this.add.circle(220 + idx * 180, 520, 70, cl.color, 0.18).setStrokeStyle(4, cl.color);
              this.add.text(180 + idx * 180, 580, cl.name, { fontSize: 19, fill: '#555' });
            });

            for (let i = 0; i < 12; i++) {
              const clusterIdx = Phaser.Math.Between(0, clusters.length - 1);
              const color = clusters[clusterIdx].color;
              const punto = this.add.circle(
                Phaser.Math.Between(90, 710),
                Phaser.Math.Between(150, 430),
                22,
                color
              ).setStrokeStyle(3, 0x555555).setAlpha(0.95).setInteractive({ draggable: true, useHandCursor: true });

              punto.setData('clusterIdx', clusterIdx);

              this.input.setDraggable(punto);
              puntos.push(punto);

              punto.on('pointerover', function () { punto.setScale(1.2); });
              punto.on('pointerout', function () { punto.setScale(1); });

              punto.on('drag', (pointer, dragX, dragY) => {
                punto.x = dragX;
                punto.y = dragY;
              });

              punto.on('dragend', (pointer) => {
                let correcto = false;
                clusters.forEach((cl, idx) => {
                  const cx = 220 + idx * 180, cy = 520, r = 70;
                  const dist = Math.sqrt((punto.x - cx) ** 2 + (punto.y - cy) ** 2);
                  if (dist < r && idx === punto.getData('clusterIdx') && punto.visible) {
                    correcto = true;
                    punto.setVisible(false);
                    this.asignados++;
                    this.add.text(punto.x - 40, punto.y - 40, "¡Correcto!", { fontSize: 14, fill: "#388e3c" }).setDepth(10);
                  }
                });

                if (!correcto && punto.visible) {
                  this.tweens.add({
                    targets: punto,
                    x: punto.input.dragStartX,
                    y: punto.input.dragStartY,
                    duration: 280,
                    ease: 'Sine.easeInOut'
                  });
                }

                if (this.asignados === 12 && !this.completed) {
                  this.completed = true;
                  this.add.text(110, 500, '¡Muy bien! Agrupaste los datos como una IA de clustering', { fontSize: '27px', fill: '#00796B' });
                  setResultado(
                    "¡Aprendiste cómo las IA de ML pueden agrupar datos automáticamente por similitud! Así organizan fotos, canciones y mucho más."
                  );

                  // -------- GUARDAR PROGRESO Y LOGRO CORRECTAMENTE --------
                  if (usuario && usuario.id) {
                    // PROGRESO:
                    api.post('/juegos/progreso', {
                      usuarioId: usuario.id,
                      juegoId: ML_GAME_ID, // Usa el ID real de este juego
                      avance: 100,
                      completado: true
                    }).catch(() => {});

                    // LOGRO:
                    api.post('/juegos/logro', {
                      usuarioId: usuario.id,
                      juegoId: ML_GAME_ID,
                      nombre: 'Clustering completado',
                      descripcion: 'Agrupó correctamente los datos por color en ML.'
                    }).catch(() => {});
                  }
                }
              });
            }
            this.puntos = puntos;
          },
          update: function () {
            this.puntos.forEach(pt => { if (pt.visible) pt.rotation += 0.006; });
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
  }, [instruccion, juegoKey, usuario]);

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

  return (
    <div>
      {/* Modal explicativo antes de jugar */}
      {instruccion && (
        <div className="modal show d-block" tabIndex="-1" style={{
          background: 'rgba(0,0,0,0.3)',
          position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', zIndex: 1000
        }}>
          <div className="modal-dialog" style={{ marginTop: 80 }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">¿Qué es el “clustering” en ML?</h5>
              </div>
              <div className="modal-body">
                <p>
                  <b>Clustering</b> es una técnica de Machine Learning donde la IA aprende a <b>agrupar datos similares</b> sin que nadie le diga cómo.<br />
                  Por ejemplo, agrupa fotos por caras, canciones por estilo o documentos por tema.
                </p>
                <ul>
                  <li>En fotos, agrupa personas parecidas 👧👦</li>
                  <li>En música, canciones similares 🎵</li>
                  <li>En compras, productos que se parecen 🛒</li>
                </ul>
                <p>Tu reto: <b>Arrastra cada punto a su grupo de color.</b> Así “aprende” una IA a organizar datos por similitud.</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={iniciarJuego}>¡Jugar!</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contenedor del juego */}
      <div id="game-container-ml-cluster" style={{ margin: 'auto', minHeight: 430 }} />

      {/* Mensaje de aprendizaje al terminar */}
      {resultado && (
        <div className="alert alert-success mt-3" style={{ maxWidth: 800, margin: "auto" }}>
          {resultado}
          <br />
          <small>
            Las IAs de clustering se usan para organizar todo tipo de datos. ¿Dónde más crees que se usan?
          </small>
        </div>
      )}

      {/* Botones debajo del juego */}
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
