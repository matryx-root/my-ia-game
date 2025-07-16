import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { useNavigate, useParams } from 'react-router-dom';

export default function FederatedLearningGame() {
  const gameRef = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const [instruccion, setInstruccion] = useState(true);
  const [resultado, setResultado] = useState(null);

  const iniciarJuego = () => setInstruccion(false);

  useEffect(() => {
    if (!instruccion && !gameRef.current) {
      gameRef.current = new Phaser.Game({
        type: Phaser.AUTO,
        width: 720,
        height: 430,
        parent: 'game-container-federated',
        backgroundColor: '#f9fbe7',
        scene: {
          create: function () {
            this.add.text(60, 38, "🌐 Federated Learning: ¡Colabora sin perder tu privacidad!", {
              fontSize: '20px', fill: '#333'
            });

            let linesDrawn = 0;
            let clients = [];
            let locks = [];
            let faces = [];
            let mensaje = null;

            
            for (let i = 0; i < 5; i++) {
              const x = 100 + i * 120;
              const y = 170;
              
              const c = this.add.circle(x, y, 35, 0x8bc34a).setInteractive();
              
              const lock = this.add.text(x - 11, y - 55, "🔒", { fontSize: '28px' });
              
              const face = this.add.text(x - 13, y - 18, "", { fontSize: '29px' });
              
              this.add.text(x - 15, y + 47, `Cliente ${i + 1}`, { fontSize: '13px', fill: '#333' });
              clients.push(c);
              locks.push(lock);
              faces.push(face);
            }

            
            const server = this.add.rectangle(360, 330, 100, 54, 0x1976d2, 0.97)
              .setStrokeStyle(3, 0x115293);
            this.add.text(336, 318, 'Servidor', { fontSize: '16px', fill: '#fff' });

            
            clients.forEach((c, i) => {
              c.on('pointerdown', () => {
                if (!c.sent) {
                  c.sent = true;
                  c.setFillStyle(0x388e3c); 
                  locks[i].setText("");      
                  faces[i].setText("😊");    
                  
                  this.tweens.addCounter({
                    from: 0,
                    to: 1,
                    duration: 400,
                    onUpdate: tween => {
                      const progress = tween.getValue();
                      const x2 = c.x + (server.x - c.x) * progress;
                      const y2 = c.y + (server.y - c.y) * progress;
                      if (progress === 1) {
                        this.add.line(0, 0, c.x, c.y, server.x, server.y, 0x222222).setLineWidth(3);
                      }
                    }
                  });
                  linesDrawn++;
                  if (linesDrawn === 5 && !mensaje) {
                    mensaje = this.add.text(98, 385, '¡Aprendizaje completado! Todos colaboraron y tus datos quedaron protegidos 🔒', {
                      fontSize: '18px',
                      fill: '#2e7d32'
                    });
                    setResultado("¡Completaste el aprendizaje federado! 😊 Así las IA aprenden de muchos, pero tus datos secretos quedan protegidos con un candado. ¡Bien hecho!");
                  }
                }
              });
            });

            
            this.add.text(154, 372, "Haz clic en los clientes para 'enviar' aprendizaje (tu secreto está protegido)", {
              fontSize: '16px', fill: '#555'
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
  }, [instruccion]);

  
  const handleReset = () => {
    setInstruccion(true);
    setResultado(null);
    if (gameRef.current) {
      gameRef.current.destroy(true);
      gameRef.current = null;
    }
  };
  const volverCategoria = () => { navigate(-1); };

  return (
    <div>
      
      {instruccion && (
        <div className="modal show d-block" tabIndex="-1" style={{
          background: 'rgba(0,0,0,0.3)', position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', zIndex: 1000
        }}>
          <div className="modal-dialog" style={{ marginTop: 100 }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">¿Qué es Federated Learning?</h5>
              </div>
              <div className="modal-body">
                <p>
                  <b>Aprendizaje federado</b> permite que muchas personas o dispositivos (llamados "clientes") ayuden a entrenar una IA <b>¡sin enviar sus datos privados!</b>
                </p>
                <ul>
                  <li>Se usa en celulares para predecir texto o mejorar fotos, sin que tus datos salgan del teléfono 📱</li>
                  <li>Los hospitales pueden colaborar en IA médica, ¡pero los datos de los pacientes nunca salen del hospital! 🏥</li>
                </ul>
                <p>Tu reto: <b>Haz clic en todos los clientes</b> para que colaboren con el servidor central, ¡sin compartir tus datos personales!</p>
                <p style={{color: "#1976d2"}}><b>Fíjate en el candado: ¡tu secreto está seguro!</b></p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={iniciarJuego}>¡Jugar!</button>
              </div>
            </div>
          </div>
        </div>
      )}

      
      <div id="game-container-federated" style={{ margin: 'auto', minHeight: 430 }} />
      
      {resultado && (
        <div className="alert alert-success mt-3" style={{ maxWidth: 720, margin: "auto" }}>
          {resultado}
          <br />
          <small>¿Dónde más podríamos usar esto en la vida real? 🚗📱🏥</small>
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
