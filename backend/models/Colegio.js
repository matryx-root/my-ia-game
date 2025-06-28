class Colegio {
  constructor({
    id, nombre, nivel, usuarios = []
  }) {
    this.id = id;
    this.nombre = nombre;
    this.nivel = nivel; // "Primaria" o "Secundaria"
    this.usuarios = usuarios; // Array opcional para popular relaciones
  }
}
module.exports = Colegio;
