import { Tarea } from "./Tarea";
import { useVisible } from "../hooks/useVisible";
import { IoIosArrowDown } from "react-icons/io";

export function ProximoSeccion({ fecha, tareas }) {

  //Devuelve un string de la fecha que mostrara la interfaz en base a la fecha recibida.
  function obtenerFecha(fecha) {
    const diasSemana = [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ];
    const dia = diasSemana[new Date(fecha).getDay()];
    const numFecha = new Date(fecha).getDate();
    const meses = [
      "Enero",
      "Febrero",
      "Mayo",
      "Abril",
      "Marzo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];
    const mes = meses[new Date(fecha).getMonth()];
    const anio = new Date(fecha).getFullYear();
    return `${dia}, ${numFecha} de ${mes} de ${anio}`;
    //Ejemplo: Martes, 19 de Diciembre de 2023
  }

  //Un custom hook que permite que cada seccion maneje su propia variable para mostrar/ocultar.
  //Si cada ProximoSeccion renderizado usara una variable propia del componente se alterarian entre si, o eso me pasó.
  const { visible, handleVisible } = useVisible(false);

  //Ordena las fechas al renderizar

  return (
    <>
      <div>
        {fecha.length > 0 ? (
          <div className="flex justify-between border-2 border-black p-3 m-1 text-xl">
            <span>{`(${tareas.length}) ${obtenerFecha(fecha)}`}</span>
            <button onClick={handleVisible} >
              <IoIosArrowDown className="size-6" />
            </button>
          </div>
        ) : (
          <p>No se recibio fecha</p>
        )}
        {visible === true && (
          <ul className="flex flex-col gap-1 overflow-y-auto [&>li]:ml-5">
            {tareas && tareas.length > 0 ? (
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
            ) : (
              <p>No hay tareas...</p>
            )}
          </ul>
        )}
      </div>
    </>
  );
}
