class Achievement {
  constructor({
    id, usuarioId, juegoId, nombre, descripcion, fechaHora
  }) {
    this.id = id;
    this.usuarioId = usuarioId;
    this.juegoId = juegoId;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.fechaHora = fechaHora;
  }
}
module.exports = Achievement;
