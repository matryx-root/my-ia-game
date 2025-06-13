class Pregunta {
  constructor({
    id, texto, juegoId, nivelIAId, respuestas = [], progreso = []
  }) {
    this.id = id;
    this.texto = texto;
    this.juegoId = juegoId;
    this.nivelIAId = nivelIAId;
    this.respuestas = respuestas;
    this.progreso = progreso;
  }
}
module.exports = Pregunta;
