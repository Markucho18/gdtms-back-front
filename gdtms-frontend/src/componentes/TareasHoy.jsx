import { useContext, useEffect, useState } from "react";
import { Tarea } from "./Tarea";
import { MainContext } from "../contexts/MainContext";
import { TokenContext } from "../contexts/TokenContext";
import axios from "axios";

export function TareasHoy() {
  const { actualizacion, setActualizacion, formatearFechas } =
    useContext(MainContext);

  const { userData } = useContext(TokenContext);

  const [tareas, setTareas] = useState();

  const getTareas = async () => {
    axios
      .get("http://localhost:3001/tareas/hoy", {
        headers: { "id-usuario": userData.id }
      })
      .then((hoyRes) => {
        if (hoyRes) {
          const hoyArray = hoyRes.data.result;
          formatearFechas(hoyArray);
          hoyArray.sort((a, b) => a.prioridad - b.prioridad);
          setTareas(hoyArray);
        } else console.log("No hubo respuesta HOY desde el backend");
      })
      .catch((err) => {
        console.log("tareasHoy error: ", err);
      });
  };

  useEffect(() => {
    console.log("Se ha renderizado <TareasHoy/>");
    getTareas();
  }, []);

  //Forzar actualizacion del componente
  useEffect(() => {
    if (actualizacion === true) {
      getTareas();
      setActualizacion(false);
      console.log(
        "Se ha re-renderizado el componente con las tareas actualizadas."
      );
    } else return;
  }, [actualizacion]);

  return (
    <ul className="flex flex-col gap-1 overflow-y-auto">
      <p className="p-3 text-xl text-black">
        {tareas && tareas.length > 0
          ? `Tareas Totales: ${tareas.length}`
          : "No hay tareas"}
      </p>
      {tareas && tareas.length > 0 &&
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
        ))}
    </ul>
  );
}
