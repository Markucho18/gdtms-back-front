import { createContext, useState} from "react";

export const ModalContext = createContext();

export function ModalContextProvider({children}){

  const [ modalAbierto , setModalAbierto ] = useState({
    abierto: false,
    tipo: "crear",
    datos: {}
  }) 

  const cerrarModalTarea = () => setModalAbierto(prev =>{
    return {...prev, abierto: false}
  })

  const abrirModalTarea = (tipo, datos) => {
    setModalAbierto(prev => {
      return {
        abierto: true,
        tipo,
        datos: datos && datos
      }
    })
  }

  return (
      <ModalContext.Provider 
        value={{
            modalAbierto,
            setModalAbierto, 
            cerrarModalTarea, 
            abrirModalTarea
        }}
      >
        {children}
      </ModalContext.Provider>
  )
}