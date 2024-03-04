import { useContext, useEffect, useState } from "react";
import { ProximoSeccion } from "./ProximoSeccion";
import { MainContext } from "../contexts/MainContext";
import { TokenContext } from "../contexts/TokenContext";
import { useForm } from "react-hook-form"
import axios from "axios";

export function TareasProximo() {

  const { actualizacion, setActualizacion, formatearFechas } = useContext(MainContext);

  const { userData } = useContext(TokenContext);

  const [ datos, setDatos ] = useState([])

  const getDatos = async () => {
    axios.
      get("http://localhost:3001/tareas/proximo", {headers: { "id-usuario": userData.id }})
      .then((res)=>{
        const tareas = res.data.result
        setDatos(filtrarFechas(tareas))
      })
      .catch((err) => console.log("tareasProximo error: ", err))
  }

  const filtrarFechas = (datos) => {
    const fechasUnicas = [...new Set(datos.map(dato => dato.fecha))]
    const datosFiltrados = fechasUnicas.map(fecha => {
      const tareasFecha = datos.filter(dato => dato.fecha === fecha)
      tareasFecha.sort((a, b) => a.prioridad - b.prioridad)
      formatearFechas(tareasFecha)
      return {fecha, tareas: tareasFecha}
    })
    datosFiltrados.sort((a, b) => {
      const dateA = new Date(a.fecha);
      const dateB = new Date(b.fecha);
      return dateA - dateB;
    })
    return datosFiltrados
  }

  const { register, handleSubmit} = useForm({fecha: ""})

  const filtrarPorFecha = handleSubmit((data)=>{
    const tareasDeLaFecha = datos.filter(dato => data.fecha === dato.tareas[0].fecha)
    console.log(tareasDeLaFecha)
    setDatos(tareasDeLaFecha)
  })


  useEffect(() => {
    getDatos()
  }, []);

  //Forzar actualizacion del componente
  useEffect((e) => {
    if (actualizacion === true) {
      getDatos()
      setActualizacion(false);
      console.log(
        "Se ha re-renderizado el componente con las tareas actualizadas."
      );
    }
  },[actualizacion]);

  return (
    <div className="tareas">
      <form onSubmit={filtrarPorFecha} className="flex items-center justify-center m-3 gap-3 text-lg">
        <input type="date" className="border-2 border-black rounded" {...register("fecha")} />
        <button type="submit" className="border-2 border-black px-3 rounded bg-black/15 hover:bg-black/10" >Buscar Tareas</button>
        <button onClick={getDatos}>X</button>
      </form>
      {datos.length > 0 ? (
        datos.map((dato, i) => (
          <ProximoSeccion key={i} fecha={dato.fecha} tareas={dato.tareas} />
        ))
      ) : (
        <p className="tareasTotales">No tienes tareas</p>
      )}
    </div>
  );
}
