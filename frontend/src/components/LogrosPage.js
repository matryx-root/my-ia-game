// src/components/LogrosPage.js
import React, { useEffect, useState } from "react";
import api from "../utils/api";

export default function LogrosPage({ usuario }) {
  const [logros, setLogros] = useState([]);

  useEffect(() => {
    if (usuario)
      api.get(`/usuarios/achievement/${usuario.id}`)
        .then(setLogros)
        .catch(() => setLogros([]));
  }, [usuario]);

  return (
    <div>
      <h2>Mis Logros</h2>
      <ul>
        {logros.map(l => (
          <li key={l.id}>{l.nombre} - {l.descripcion} ({new Date(l.fechaHora).toLocaleString()})</li>
        ))}
      </ul>
    </div>
  );
}
