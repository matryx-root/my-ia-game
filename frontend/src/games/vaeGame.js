import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


const ANIMALES = [
  { nombre: "Gato", head: "gato-head.png", body: "gato-body.png", feet: "gato-feet.png" },
  { nombre: "Perro", head: "perro-head.png", body: "perro-body.png", feet: "perro-feet.png" },
  { nombre: "Pajaro", head: "pajaro-head.png", body: "pajaro-body.png", feet: "pajaro-feet.png" }
];


function getRandomIndex() {
  return Math.floor(Math.random() * ANIMALES.length);
}

export default function VAEGame({ usuario }) {
  const navigate = useNavigate();
  const [instruccion, setInstruccion] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [criaturas, setCriaturas] = useState([]);
  const [seleccion, setSeleccion] = useState({ idxHead: 0, idxBody: 0, idxFeet: 0 });
  const [juegoKey, setJuegoKey] = useState(0);

  
  useEffect(() => {
    if (!instruccion) {
      setSeleccion({
        idxHead: getRandomIndex(),
        idxBody: getRandomIndex(),
        idxFeet: getRandomIndex(),
      });
    }
  }, [instruccion, juegoKey]);

  
  const headImg = `/games-images/${ANIMALES[seleccion.idxHead].head}`;
  const bodyImg = `/games-images/${ANIMALES[seleccion.idxBody].body}`;
  const feetImg = `/games-images/${ANIMALES[seleccion.idxFeet].feet}`;

  const iniciarJuego = () => setInstruccion(false);

  const handleCambiar = (parte) => {
    setSeleccion(sel => {
      let next = { ...sel };
      
      let idx;
      do {
        idx = getRandomIndex();
      } while (idx === sel[`idx${parte.charAt(0).toUpperCase() + parte.slice(1)}`]);
      next[`idx${parte.charAt(0).toUpperCase() + parte.slice(1)}`] = idx;
      return next;
    });
  };

  const handleGuardar = () => {
    const { idxHead, idxBody, idxFeet } = seleccion;
    if (idxHead === idxBody && idxHead === idxFeet) {
      setFeedback(`¡Combinación lógica! Has creado un ${ANIMALES[idxHead].nombre}. Así aprende un VAE a reconstruir imágenes completas a partir de partes.`);
    } else {
      setFeedback("¡Has creado una criatura inventada! Así también pueden nacer cosas nuevas y creativas con un VAE.");
    }
    setCriaturas(prev => [
      ...prev,
      {
        head: `/games-images/${ANIMALES[idxHead].head}`,
        body: `/games-images/${ANIMALES[idxBody].body}`,
        feet: `/games-images/${ANIMALES[idxFeet].feet}`,
        nombre: (idxHead === idxBody && idxHead === idxFeet) ? ANIMALES[idxHead].nombre : "Inventado"
      }
    ]);
  };

  const volverCategoria = () => navigate(-1);

  const handleReset = () => {
    setFeedback(null);
    setCriaturas([]);
    setJuegoKey(k => k + 1);
    setInstruccion(true);
  };

  return (
    <div>
      
      {instruccion && (
        <div className="modal show d-block" tabIndex="-1" style={{
          background: 'rgba(0,0,0,0.3)',
          position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', zIndex: 1000
        }}>
          <div className="modal-dialog" style={{ marginTop: 80 }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">¿Qué es un VAE?</h5>
              </div>
              <div className="modal-body">
                <p>
                  <b>Un Autoencoder Variacional (VAE)</b> es una IA que aprende a recomponer o imaginar cosas nuevas usando partes conocidas.<br />
                  <b>¡Intenta crear un animal lógico!</b> o prueba mezclando para inventar criaturas nuevas.<br />
                  <b>Las partes de la criatura están mezcladas aleatoriamente. ¡Encuentra la combinación correcta!</b>
                </p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={iniciarJuego}>¡Jugar!</button>
              </div>
            </div>
          </div>
        </div>
      )}

      
      {!instruccion && (
        <div style={{
          display: "flex", justifyContent: "center", alignItems: "center",
          minHeight: 390, maxWidth: 650, margin: "auto", gap: 24
        }}>
          
          <div>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 18 }}>
              <img src={headImg} alt="cabeza" style={{ width: 56, height: 44, marginRight: 12, borderRadius: 7, border: "1.5px solid #ffd54f" }} />
              <button className="btn btn-warning" style={{ width: 140, fontWeight: 600, textAlign: "center" }}
                onClick={() => handleCambiar("head")}>
                Cambiar cabeza
              </button>
            </div>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 18 }}>
              <img src={bodyImg} alt="cuerpo" style={{ width: 56, height: 44, marginRight: 12, borderRadius: 7, border: "1.5px solid #81d4fa" }} />
              <button className="btn btn-info" style={{ width: 140, fontWeight: 600, textAlign: "center" }}
                onClick={() => handleCambiar("body")}>
                Cambiar cuerpo
              </button>
            </div>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 30 }}>
              <img src={feetImg} alt="pies" style={{ width: 56, height: 38, marginRight: 12, borderRadius: 7, border: "1.5px solid #a5d6a7" }} />
              <button className="btn btn-success" style={{ width: 140, fontWeight: 600, textAlign: "center" }}
                onClick={() => handleCambiar("feet")}>
                Cambiar pies
              </button>
            </div>
            <div style={{ textAlign: "center" }}>
              <button className="btn btn-teal" style={{
                background: "#80cbc4", width: 180, fontWeight: 600, fontSize: 18
              }} onClick={handleGuardar}>
                Guardar criatura
              </button>
            </div>
          </div>
          
          <div style={{
            border: "2px dashed #b0bec5", borderRadius: 12, padding: 12,
            minWidth: 120, minHeight: 180, background: "#fafdff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
          }}>
            <img src={headImg} alt="vista-previa-head" style={{ width: 62, height: 48 }} />
            <img src={bodyImg} alt="vista-previa-body" style={{ width: 58, height: 44 }} />
            <img src={feetImg} alt="vista-previa-feet" style={{ width: 48, height: 36 }} />
          </div>
        </div>
      )}

      
      {feedback && (
        <div className="alert alert-info mt-3" style={{ maxWidth: 700, margin: "auto" }}>
          {feedback}
        </div>
      )}
      {criaturas.length > 0 && (
        <div className="mt-4" style={{ maxWidth: 700, margin: "auto" }}>
          <div className="mb-2 fw-bold">Tus criaturas creadas:</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
            {criaturas.map((c, idx) => (
              <div key={idx} style={{
                border: "1px solid #b0bec5", borderRadius: 8, padding: 10, background: "#e0f2f1", width: 90, textAlign: "center"
              }}>
                <img src={c.head} alt="head" style={{ width: 38, height: 34 }} /><br />
                <img src={c.body} alt="body" style={{ width: 36, height: 30 }} /><br />
                <img src={c.feet} alt="feet" style={{ width: 34, height: 23 }} /><br />
                <small>{c.nombre}</small>
              </div>
            ))}
          </div>
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
