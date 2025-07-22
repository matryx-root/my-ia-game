class MensajeSoporte {
  constructor({
    id, usuarioId, mensaje, fechaHora, estado = "pendiente", respuesta = null
  }) {
    this.id = id;
    this.usuarioId = usuarioId;
    this.mensaje = mensaje;
    this.fechaHora = fechaHora;
    this.estado = estado;
    this.respuesta = respuesta;
  }
}
module.exports = MensajeSoporte;
