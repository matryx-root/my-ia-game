class ConfiguracionUsuario {
  constructor({
    id, usuarioId, tema, idioma, sonido, notificaciones
  }) {
    this.id = id;
    this.usuarioId = usuarioId;
    this.tema = tema;
    this.idioma = idioma;
    this.sonido = sonido;
    this.notificaciones = notificaciones;
  }
}
module.exports = ConfiguracionUsuario;
