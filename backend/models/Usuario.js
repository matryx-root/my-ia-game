class Usuario {
  constructor({
    id, nombre, email, password, rol = "usuario", edad, celular,
    progreso = [], logsIngreso = [], logsJuego = [], mensajes = [],
    configuracion = null, logros = [], errores = []
  }) {
    this.id = id;
    this.nombre = nombre;
    this.email = email;
    this.password = password;
    this.rol = rol;
    this.edad = edad;
    this.celular = celular;
    this.progreso = progreso;
    this.logsIngreso = logsIngreso;
    this.logsJuego = logsJuego;
    this.mensajes = mensajes;
    this.configuracion = configuracion;
    this.logros = logros;
    this.errores = errores;
  }
}
module.exports = Usuario;
