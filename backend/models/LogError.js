class LogError {
  constructor({
    id, usuarioId = null, juegoId = null, fechaHora, mensaje, detalle
  }) {
    this.id = id;
    this.usuarioId = usuarioId;
    this.juegoId = juegoId;
    this.fechaHora = fechaHora;
    this.mensaje = mensaje;
    this.detalle = detalle;
  }
}
module.exports = LogError;
