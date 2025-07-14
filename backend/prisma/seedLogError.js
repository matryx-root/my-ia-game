await prisma.logError.createMany({
  data: [
    { usuarioId: 1, juegoId: 2, fechaHora: new Date(), mensaje: 'No se pudo guardar', detalle: 'DB timeout' },
    { usuarioId: null, juegoId: null, fechaHora: new Date(), mensaje: 'Error general', detalle: 'Fallo inesperado' },
    // ...más registros
  ]
});
