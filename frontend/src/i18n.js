import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  es: {
    translation: {
      bienvenida: "Bienvenido",
      salir: "Salir",
      categorias: "Categorías",
      // ...
    }
  },
  en: {
    translation: {
      bienvenida: "Welcome",
      salir: "Logout",
      categorias: "Categories",
      // ...
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "es", // idioma por defecto
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
