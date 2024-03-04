import { useEffect, useState, useContext } from "react";
import { Tarea } from "./Tarea";
import { MainContext } from "../contexts/MainContext";
import { TokenContext } from "../contexts/TokenContext";
import axios from "axios";

export function TareasBusqueda({ textoBusqueda }) {
  const { actualizacion, setActualizacion, formatearFechas } =
    useContext(MainContext);

  const { userData } = useContext(TokenContext);

  const [tareas, setTareas] = useState();

  const getTareas = async () => {
    axios
      .post(
        "http://localhost:3001/tareas/buscar",
        { textoBusqueda },
        { headers: { "id-usuario": userData.id } }
      )
      .then((res) => {
        if (res) {
          const busquedaArray = res.data.result;
          formatearFechas(busquedaArray);
          busquedaArray.sort((a, b) => a.prioridad - b.prioridad);
          setTareas(busquedaArray);
        } else console.log("No hubo respuesta BUSQUEDA desde el backend");
      })
      .catch((err) => {
        console.log("tareasBusqueda error: ", err);
      });
  };

  useEffect(() => {
    getTareas();
  }, [textoBusqueda]);

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
          ? `Coincidencias: ${tareas.length}`
          : "No se encontraron coincidencias"}
      </p>
      {tareas &&
        tareas.length > 0 &&
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
