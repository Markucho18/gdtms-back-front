import { useContext, useState, useEffect } from "react";
import { Tarea } from "./Tarea";
import { MainContext } from "../contexts/MainContext";
import { TokenContext } from "../contexts/TokenContext";
import { MdDeleteSweep } from "react-icons/md";
import axios from "axios";

export function TareasCompletas() {
  const { actualizacion, setActualizacion, actualizarTareas, formatearFechas } =
    useContext(MainContext);

  const [tareas, setTareas] = useState([]);

  const { userData } = useContext(TokenContext);

  const getTareas = () => {
    axios
      .get(`http://localhost:3001/tareas/completas`, {headers: {'id-usuario': userData.id}})
      .then((res) => {
        if (res) {
          const completasArray = res.data.result;
          formatearFechas(completasArray);
          const completasOrdenadas = completasArray.sort((a, b) => {
            const dateA = new Date(a.fecha);
            const dateB = new Date(b.fecha);
            return dateA - dateB;
          });
          setTareas(completasOrdenadas);
        } else
          console.log("No hubo respuesta TareasCompletas desde el backend");
      })
      .catch((err) =>
        console.log(
          "Ha ocurrido un error en getTareas() (TareasCompletas): ",
          err
        )
      );
  };

  const limpiarTareas = () => {
    let confirmar = window.confirm(
      "Estas seguro de eliminar todas las tareas completas"
    );
    if (confirmar === true) {
      axios
        .delete(`http://localhost:3001/tareas/completas`, {headers: {'id-usuario': userData.id}})
        .then((res) => {
          console.log(res.data)
          if (res) actualizarTareas();
          else console.log("No hubo respuesta limpiarTareas() desde el backend");
        })
        .catch((err) =>
          console.log("Ha ocurrido un error en limpiarTareas(): ", err)
        );
    } else return;
  };

  useEffect(() => {
    getTareas();
  }, []);

  //Forzar actualizacion del componente:
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
      <div className="flex items-center justify-center">
        <p className="p-3 text-xl text-black">
          {tareas && tareas.length > 0
            ? `Tareas Totales: ${tareas.length}`
            : "No hay tareas"}
        </p>
        <button onClick={limpiarTareas} >
          <MdDeleteSweep className="size-6" />
        </button>
      </div>
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
          ))
        }
    </ul>
  );
}
