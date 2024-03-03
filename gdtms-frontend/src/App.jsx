import { useContext, useState, useEffect } from "react";
import { Login } from "./componentes/Login";
import { Register } from "./componentes/Register";
import { Header } from "./componentes/Header";
import { Sidebar } from "./componentes/Sidebar";
import { ModalTarea } from "./componentes/ModalTarea";
import {TareasInbox} from "./componentes/TareasInbox"
import {TareasHoy} from "./componentes/TareasHoy"
import {TareasProximo} from "./componentes/TareasProximo"
import {TareasEtiqueta} from "./componentes/TareasEtiqueta"
import {TareasBusqueda} from "./componentes/TareasBusqueda"
import { TareasCompletas } from "./componentes/TareasCompletas";
import { ModalContext } from './contexts/ModalContext';
import { TokenContext } from "./contexts/TokenContext";
import { MainContext } from "./contexts/MainContext";

function App() {

  const { consulta, getEtiquetas} = useContext(MainContext);

  const { tokenValido } = useContext(TokenContext);

  const { modalAbierto } = useContext(ModalContext);

  const [formulario, setFormulario] = useState("login");
  const toggleForm = () => formulario === "login" ? setFormulario("register") : setFormulario("login");

  const filtrarConsultas = () => {
    const filtro = {
      inbox: <TareasInbox/>,
      hoy: <TareasHoy/>,
      proximo: <TareasProximo/>,
      completas: <TareasCompletas/>,
      etiqueta: <TareasEtiqueta {...consulta.dato}/>,
      busqueda: <TareasBusqueda textoBusqueda={consulta.dato}/>
    }
    return filtro[consulta.tipo]
  }
  
  useEffect(()=>{
    getEtiquetas()
  },[])

  return (
    <div className="flex flex-col w-screen h-screen font-arial">

      {tokenValido === false && (
        (formulario === "login" && <Login toggleForm={toggleForm} />) ||
        (formulario === "register" && <Register toggleForm={toggleForm} />)
      )}

      {modalAbierto.abierto === true && (
        modalAbierto === "crear" ? (
          <ModalTarea />
        ) 
        : <ModalTarea datos={modalAbierto.datos}/>
      )}

      {tokenValido === true && (
        <>
          <Header />
          <div className="flex h-full overflow-hidden">
            <Sidebar />
            <main className="flex flex-col grow overflow-y-auto">
              {filtrarConsultas()}
            </main>
          </div>
        </>
      )}
    </div>
  );
}

export default App;