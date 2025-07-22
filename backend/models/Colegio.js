class Colegio {
  constructor({
    id, nombre, nivel, usuarios = []
  }) {
    this.id = id;
    this.nombre = nombre;
    this.nivel = nivel; 
    this.usuarios = usuarios; 
  }
}
module.exports = Colegio;
