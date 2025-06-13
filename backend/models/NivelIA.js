class NivelIA {
  constructor({ id, nombre, descripcion, preguntas = [] }) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.preguntas = preguntas;
  }
}
module.exports = NivelIA;
