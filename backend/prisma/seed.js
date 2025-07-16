

const seedColegios = require("./seedColegios");
const seedJuegos = require("./seedJuegos");
const seedLogError = require("./seedLogError");
const seedLogIngreso = require("./seedLogIngreso");
const seedLogJuego = require("./seedLogJuego");

(async () => {
  await seedColegios();
  await seedJuegos();
  await seedLogError();
  await seedLogIngreso();
  await seedLogJuego();
  console.log("✅ Todas las seeds ejecutadas correctamente.");
  process.exit(0);
})();
