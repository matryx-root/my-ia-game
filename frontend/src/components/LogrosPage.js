
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
          <li key={l.id}>
            <b>{l.nombre}</b>
            <br />
            {l.descripcion}
            <br />
            <span className="text-muted">{new Date(l.fechaHora).toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
