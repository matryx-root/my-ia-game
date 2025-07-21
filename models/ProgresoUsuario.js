class ProgresoUsuario {
  constructor({
    id, usuarioId, juegoId, avance = null, completado = null, fechaActualizacion
  }) {
    this.id = id;
    this.usuarioId = usuarioId;
    this.juegoId = juegoId;
    this.avance = avance;
    this.completado = completado;
    this.fechaActualizacion = fechaActualizacion;
  }
}
module.exports = ProgresoUsuario;
