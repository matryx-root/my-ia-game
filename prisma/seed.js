const seedUsuarios = require('./seedUsuarios');
const seedColegios = require("./seedColegios");
const seedJuegos = require("./seedJuegos");
const seedLogError = require("./seedLogError");
const seedLogIngreso = require("./seedLogIngreso");
const seedLogJuego = require("./seedLogJuego");

(async () => {
  try {
    await seedUsuarios();
    await seedColegios();
    await seedJuegos();
    await seedLogError();
    await seedLogIngreso();
    await seedLogJuego();
    console.log("✅ Todas las seeds ejecutadas correctamente.");
  } catch (e) {
    console.error("Error ejecutando seeds:", e);
    process.exit(1);
  } finally {
    process.exit(0);
  }
})();
