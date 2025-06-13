class Respuesta {
  constructor({ id, texto, correcta, preguntaId }) {
    this.id = id;
    this.texto = texto;
    this.correcta = correcta;
    this.preguntaId = preguntaId;
  }
}
module.exports = Respuesta;
