// data/categoriasJuegos.js

const categoriasJuegos = {
  iaReactiva: {
    nombre: "IA Reactiva",
    juegos: [
      {
        key: "iaGame",
        nombre: "IA Simbólica y Sistemas Expertos",
        archivo: "iaGame",
        descripcion: "Toma decisiones usando reglas fijas, sin aprendizaje ni memoria."
      }
    ]
  },
  iaConMemoria: {
    nombre: "IA con Memoria Limitada",
    juegos: [
      { key: "mlGame", nombre: "Machine Learning", archivo: "mlGame", descripcion: "Aprende patrones a partir de datos históricos." },
      { key: "supervisedGame", nombre: "Supervised Learning", archivo: "supervisedGame", descripcion: "Aprendizaje supervisado con datos etiquetados." },
      { key: "unsupervisedGame", nombre: "Unsupervised Learning", archivo: "unsupervisedGame", descripcion: "Aprende patrones en datos no etiquetados." },
      { key: "semiSupervisedGame", nombre: "Semi-Supervised Learning", archivo: "semiSupervisedGame", descripcion: "Combina datos etiquetados y no etiquetados." },
      { key: "rlGame", nombre: "Reinforcement Learning", archivo: "rlGame", descripcion: "Aprende mediante recompensas y penalizaciones." },
      { key: "dlGame", nombre: "Deep Learning", archivo: "dlGame", descripcion: "Utiliza redes neuronales profundas para tareas complejas." },
      { key: "selfSupervisedGame", nombre: "Self-Supervised Learning", archivo: "selfSupervisedGame", descripcion: "Aprende generando sus propias etiquetas a partir de los datos." },
      { key: "transferLearningGame", nombre: "Transfer Learning", archivo: "transferLearningGame", descripcion: "Reutiliza conocimiento adquirido en otras tareas." },
      { key: "federatedLearningGame", nombre: "Federated Learning", archivo: "federatedLearningGame", descripcion: "Entrenamiento distribuido sin centralizar los datos." },
      { key: "computerVisionGame", nombre: "Computer Vision", archivo: "computerVisionGame", descripcion: "Interpretación y análisis automático de imágenes o videos." },
      { key: "nlpGame", nombre: "Natural Language Processing", archivo: "nlpGame", descripcion: "Procesamiento y análisis de lenguaje humano." }
    ]
  },
  iaEstrecha: {
    nombre: "ANI (IA Estrecha)",
    juegos: [
      { key: "ganGame", nombre: "GANs (Generative Adversarial Networks)", archivo: "ganGame", descripcion: "Genera imágenes, audio o datos simulando creatividad." },
      { key: "vaeGame", nombre: "VAEs (Variational Autoencoders)", archivo: "vaeGame", descripcion: "Compresión y generación eficiente de datos." },
      { key: "diffusionGame", nombre: "Diffusion Models", archivo: "diffusionGame", descripcion: "Generación de contenido mediante procesos de difusión." },
      { key: "generativeGame", nombre: "Generative AI", archivo: "generativeGame", descripcion: "Modelos que crean nuevo contenido (texto, imágenes, audio, etc)." }
    ]
  },
  iaConTeoriaMente: {
    nombre: "IA con Teoría de la Mente",
    juegos: [
      {
        key: "theoryOfMindGame",
        nombre: "Teoría de la Mente (Demo)",
        archivo: "theoryOfMindGame",
        descripcion: "Simulación de empatía, emociones o intenciones (en desarrollo)."
      }
    ]
  }
};

// Exportar el mapa de categorías
export default categoriasJuegos;

// Exportar solo los IDs (claves)
export const idsCategorias = Object.keys(categoriasJuegos);

// Exportar nombres legibles
export const nombresCategorias = idsCategorias.map(id => categoriasJuegos[id].nombre);