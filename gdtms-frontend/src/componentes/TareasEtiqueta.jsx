import { useContext, useEffect, useState } from "react";
import { Tarea } from "./Tarea";
import { MainContext } from "../contexts/MainContext";
import axios from "axios";
import { TokenContext } from "../contexts/TokenContext";

export function TareasEtiqueta({ id_etiqueta }) {

  const { actualizacion, setActualizacion, formatearFechas } = useContext(MainContext);

  const [tareas, setTareas] = useState();

  const { userData } = useContext(TokenContext);

  const getTareas = async () => {
    axios
      .get(
        `http://localhost:3001/tareas/etiqueta/${id_etiqueta}`,
        {headers: {"id-usuario": userData.id}}
      )
      .then((res) => {
        if (res) {
          const etiquetaArray = res.data.result;
          formatearFechas(etiquetaArray);
          etiquetaArray.sort((a, b) => a.prioridad - b.prioridad);
          setTareas(etiquetaArray);
        } else {
          console.log("No hubo respuesta etiqueta desde el backend");
        }
      })
      .catch((err) => {
        console.log(`getTareas x idEtiqueta error: ${err}`);
      });
  };

  useEffect(() => {
    getTareas();
  }, [id_etiqueta]);

  //Forzar actualizacion del componente
  useEffect(() => {
    if (actualizacion === true) {
      getTareas();
      setActualizacion(false);
      console.log("Se ha re-renderizado el componente con las tareas actualizadas.");
    } else return;
  }, [actualizacion]);

  return (
    <ul className="listaTareas col">
      <p className="p-3 text-xl text-black">
        {tareas && tareas.length > 0
          ? `Tareas Totales: ${tareas.length}`
          : "No hay tareas"}
      </p>
      {tareas && tareas.length > 0 && (
        tareas.map((tarea, i) => (
          <Tarea
            key={i}
            estadoTarea={tarea.estado}
            prioridad={tarea.prioridad}
            nombre={tarea.nombre}
            fecha={tarea.fecha}
            fechaVista={tarea.fechaVista}
            idTarea={tarea.id_tarea}
            idEtiqueta={tarea.id_etiqueta}
            descripcion={tarea.descripcion}
            idUsuario={tarea.id_usuario}
          />
        ))
      )}
    </ul>
  );
}
