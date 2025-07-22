const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedJuegos() {
  await prisma.juego.createMany({
    data: [
      { nombre: "IA Simbólica y Sistemas Expertos", descripcion: "Toma decisiones usando reglas fijas, sin aprendizaje ni memoria." },
      { nombre: "Machine Learning", descripcion: "Aprende patrones a partir de datos históricos." },
      { nombre: "Supervised Learning", descripcion: "Aprendizaje supervisado con datos etiquetados." },
      { nombre: "Unsupervised Learning", descripcion: "Aprendizaje no supervisado, encuentra patrones en datos no etiquetados." },
      { nombre: "Semi-Supervised Learning", descripcion: "Combina datos etiquetados y no etiquetados." },
      { nombre: "Reinforcement Learning", descripcion: "Aprende mediante recompensas y penalizaciones." },
      { nombre: "Deep Learning", descripcion: "Utiliza redes neuronales profundas para tareas complejas." },
      { nombre: "Self-Supervised Learning", descripcion: "Aprende generando sus propias etiquetas a partir de los datos." },
      { nombre: "Transfer Learning", descripcion: "Reutiliza conocimiento adquirido en otras tareas." },
      { nombre: "Federated Learning", descripcion: "Entrenamiento distribuido sin centralizar los datos." },
      { nombre: "Computer Vision", descripcion: "Interpretación y análisis automático de imágenes o videos." },
      { nombre: "Natural Language Processing", descripcion: "Procesamiento y análisis de lenguaje humano." },
      { nombre: "GANs (Generative Adversarial Networks)", descripcion: "Genera imágenes, audio o datos simulando creatividad." },
      { nombre: "VAEs (Variational Autoencoders)", descripcion: "Compresión y generación eficiente de datos." },
      { nombre: "Diffusion Models", descripcion: "Generación de contenido mediante procesos de difusión." },
      { nombre: "Generative AI", descripcion: "Modelos que crean nuevo contenido (texto, imágenes, audio, etc)." },
      { nombre: "Teoría de la Mente (Demo)", descripcion: "Simulación de empatía, emociones o intenciones (en desarrollo)." }
    ],
    skipDuplicates: true
  });
}

module.exports = seedJuegos;
