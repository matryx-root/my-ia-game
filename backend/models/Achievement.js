class Achievement {
  constructor({
    id, usuarioId, juegoId = null, nombre, descripcion = null, fechaHora
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
