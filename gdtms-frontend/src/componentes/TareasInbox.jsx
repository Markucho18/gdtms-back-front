import { useContext, useEffect, useState } from "react";
import { Tarea } from "./Tarea";
import axios from "axios";
import { MainContext } from "../contexts/MainContext";
import { TokenContext } from "../contexts/TokenContext";
import { MdDeleteSweep } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";

export function TareasInbox() {
  
  const { actualizacion, setActualizacion, formatearFechas, actualizarTareas } = useContext(MainContext);

  const { userData } = useContext(TokenContext);

  const [tareasSinFecha, setTareasSinFecha] = useState([]);

  const [tareasCaducadas, setTareasCaducadas] = useState([]);

  const getTareas = async () => {
    console.log(userData.id)
    axios.get("http://localhost:3001/tareas", {
      headers: { 'id-usuario': userData.id },
    })
    .then(res => {
      const tareas = res.data
      const sinFecha = tareas.filter(tarea => tarea.fecha === null)
      sinFecha.sort((a, b) => a.prioridad - b.prioridad);
      setTareasSinFecha(sinFecha)
      const fechaActual = new Date()
      fechaActual.setHours(0, 0, 0, 0)
      const caducadas = tareas.filter(tarea => new Date(tarea.fecha) < fechaActual && tarea.fecha !== null)
      caducadas.sort((a, b) => a.prioridad - b.prioridad)
      setTareasCaducadas(formatearFechas(caducadas))
    })
    .catch(err => console.log("Hubo un error al obtener tareas en Inbox: ", err))
  };

  const limpiarTareas = (tipo) => {
    let confirmar = window.confirm(
      `Estas seguro de limpiar las tareas ${tipo && tipo}?`
    );
    if (confirmar === true) {
      if (tipo == "sinFecha") {
        axios
          .delete("http://localhost:3001/tareas/sinFecha",
          {headers: {'id-usuario': userData.id}})
          .then((res) =>
            console.log(
              "Se han eliminado correctamente las tareas sin fecha",
              res
            )
          )
          .catch((err) =>
            console.log(
              "Ha occurido un error al eliminar las tareas sin fecha",
              err
            )
          );
        actualizarTareas();
      } else if (tipo == "caducadas") {
        axios
          .delete("http://localhost:3001/tareas/caducadas",
          {headers: {'id-usuario': userData.id}})
          .then((res) =>
            console.log(
              "Se han eliminado correctamente las tareas caducadas",
              res
            )
          )
          .catch((err) =>
            console.log(
              "Ha occurido un error al eliminar las tareas caducadas",
              err
            )
          );
        actualizarTareas();
      } else
        console.log("limpiarTareas() no ha recibido ningun tipo", {
          tipo: tipo,
        });
    } else return;
  };

  useEffect(() => {
    console.log("Se ha renderizado <Inbox/>");
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

  //Mostrar o ocultar
  const [sinFecha, setSinFecha] = useState(false);
  const [caducadas, setCaducadas] = useState(false);
  const handleSinFecha = () => setSinFecha(!sinFecha);
  const handleCaducadas = () => setCaducadas(!caducadas);

  return (
    <div>
      <div className="flex justify-between border-2 border-black p-3 m-1 text-xl">
        <p>{`Tareas sin fecha(${tareasSinFecha.length}):`}</p>
        <div className="flex gap-3">
          <button onClick={() => limpiarTareas("sinFecha")}>
            <MdDeleteSweep className="size-6"/>
          </button>
          <button onClick={handleSinFecha}>
            <IoIosArrowDown className="size-6"/>
          </button>
        </div>
      </div>
      <ul className="flex flex-col gap-1 overflow-y-auto [&>li]:ml-5">
        {sinFecha === true &&
          (tareasSinFecha && tareasSinFecha.length > 0 ? (
            tareasSinFecha.map((tarea, i) => (
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
          ) : (
            <p className="p-3 text-xl text-black">No hay tareas...</p>
          ))}
      </ul>
      <div className="flex justify-between border-2 border-black p-3 m-1 text-xl">
        <p>{`Tareas caducadas(${tareasCaducadas.length}):`}</p>
        <div className="flex gap-3">
          <button onClick={() => limpiarTareas("caducadas")}>
            <MdDeleteSweep className="size-6"/>
          </button>
          <button onClick={handleCaducadas}>
            <IoIosArrowDown className="size-6"/>
          </button>
        </div>
      </div>
      <ul className="flex flex-col gap-1 overflow-y-auto [&>li]:ml-5">
        {caducadas === true &&
          (tareasCaducadas && tareasCaducadas.length > 0 ? (
            tareasCaducadas.map((tarea, i) => (
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
          ) : (
            <p className="p-3 text-xl text-black">No hay tareas...</p>
          ))}
      </ul>
    </div>
  );
}
