class LogJuego {
  constructor({
    id, usuarioId, juegoId, fechaHora, accion, detalle, duracion
  }) {
    this.id = id;
    this.usuarioId = usuarioId;
    this.juegoId = juegoId;
    this.fechaHora = fechaHora;
    this.accion = accion;
    this.detalle = detalle;
    this.duracion = duracion;
  }
}
module.exports = LogJuego;
