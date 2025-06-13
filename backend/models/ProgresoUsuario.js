class ProgresoUsuario {
  constructor({
    id, usuarioId, juegoId, preguntaId, avance, completado, fechaActualizacion
  }) {
    this.id = id;
    this.usuarioId = usuarioId;
    this.juegoId = juegoId;
    this.preguntaId = preguntaId;
    this.avance = avance;
    this.completado = completado;
    this.fechaActualizacion = fechaActualizacion;
  }
}
module.exports = ProgresoUsuario;
