import { createContext, useState } from "react";
import axios from "axios";
import { format } from "date-fns";

export const MainContext = createContext();

export function MainContextProvider({ children }) {

  const [consulta, setConsulta] = useState({
    tipo: "inbox",
    dato: {},
  });

  const enviarConsulta = (tipo, dato) => {
    setConsulta({
      tipo,
      dato: dato && dato,
    });
  };

  const [actualizacion, setActualizacion] = useState(false);

  const actualizarTareas = () => setActualizacion(true);

  //Esta funcion simplemente estiliza las fechas dentro de <Tarea/>
  const formatearFechas = (array) => {
    return array.map((tarea, i) => {
      if (tarea.fecha !== null) {
        const fechaBack = new Date(tarea.fecha);
        const fechaVista = format(fechaBack, "dd/MM/yy");
        const fechaValue = format(fechaBack, "yyyy-MM-dd");
        tarea.fechaVista = fechaVista;
        tarea.fecha = fechaValue;
        return tarea;
      } else return tarea;
    });
  };

  const [etiquetas, setEtiquetas] = useState([]);

  const getEtiquetas = async () => {
    console.log("Se ha ejecutado getEtiquetas()")
    axios
      .get("http://localhost:3001/etiquetas")
      .then((res) => {
        console.log(res)
        setEtiquetas(res.data.result);
      })
      .catch((err) =>
        console.log("Ha ocurrido un error en getEtiquetas(): ", err)
      );
  };

  return (
    <MainContext.Provider
      value={{
        consulta,
        setConsulta,
        enviarConsulta,
        actualizacion,
        setActualizacion,
        actualizarTareas,
        formatearFechas,
        etiquetas,
        getEtiquetas,
      }}
    >
      {children}
    </MainContext.Provider>
  );
}
