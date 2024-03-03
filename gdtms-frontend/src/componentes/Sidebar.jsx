import { useContext, useState } from "react";
import { SidebarSeccion } from "./SidebarSeccion";
import Icon from "./Icon"
import { MainContext } from "../contexts/MainContext";

export function Sidebar() {

  const { enviarConsulta, etiquetas } = useContext(MainContext)

  const [listaAbierta, setListaAbierta] = useState(false);
  const handleLista = () => setListaAbierta(!listaAbierta)

  return (
    <aside className="flex flex-col bg-zinc-600 h-full min-w-[250px] border-r-2 border-black overflow-y-auto ">
      <SidebarSeccion
        texto="Inbox"
        click={() => enviarConsulta("inbox")}
      >
        <Icon name="inbox"/>
      </SidebarSeccion>
      <SidebarSeccion
        texto="Hoy"
        click={() => enviarConsulta("hoy")}
      >
        <Icon name="hoy"/>
      </SidebarSeccion>
      <SidebarSeccion
        texto="Proximo"
        click={() => enviarConsulta("proximo")}
      >
        <Icon name="proximo"/>
      </SidebarSeccion>
      <SidebarSeccion
        texto="Etiquetas"
        click={handleLista}
      >
        <Icon name="etiquetas"/>
      </SidebarSeccion>
      {listaAbierta === true && (
        <div className="[&>button]:pl-8">
          {etiquetas.length > 0 &&
          etiquetas.map((etiqueta, i) => (
            <SidebarSeccion
              key={i}
              texto={etiqueta.nombre}
              color={{color: etiqueta.color}}
              click={() => enviarConsulta("etiqueta", etiqueta)}
            >
              <Icon
                name={etiqueta.nombre}
                color={etiqueta.color}
              />
            </SidebarSeccion>
          ))}
        </div>
      )}
      <SidebarSeccion
        texto="Completas"
        click={() => enviarConsulta("completas")}
      >
        <Icon name="completas" />
      </SidebarSeccion>
    </aside>
  );
}
