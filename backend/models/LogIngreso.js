class LogIngreso {
  constructor({
    id, usuarioId, fechaHora, ip, userAgent
  }) {
    this.id = id;
    this.usuarioId = usuarioId;
    this.fechaHora = fechaHora;
    this.ip = ip;
    this.userAgent = userAgent;
  }
}
module.exports = LogIngreso;
