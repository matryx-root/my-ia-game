class Juego {
  constructor({
    id, nombre, descripcion,
    logsJuego = [], progreso = [], logros = [], errores = []
  }) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.logsJuego = logsJuego;
    this.progreso = progreso;
    this.logros = logros;
    this.errores = errores;
  }
}
module.exports = Juego;
