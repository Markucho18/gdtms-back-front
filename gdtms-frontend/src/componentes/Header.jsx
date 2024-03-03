import { useContext } from 'react';
import { ModalContext } from '../contexts/ModalContext';
import {Busqueda} from './Busqueda';
import tskLogo from '../assets/TskLogo.png';
import { FaPlus } from "react-icons/fa6";

export function Header(){

    const {abrirModalTarea} = useContext(ModalContext);

    return (
        <header className="flex items-center justify-between px-5 py-10 w-full h-16 text-white bg-sky-300 border-b-2 border-black ">
            <section className='flex items-center justify-center gap-5 ladoIzquierdo row cen'>
                <img className='size-14' src={tskLogo} alt="logo"/>
                <Busqueda/>
            </section>
            <section className='acciones row cen'>
                <button
                  className="bg-red-500 text-3xl p-2 rounded-full transition-transform duration-300 ease-in-out hover:bg-red-600 hover:scale-110"
                  onClick={()=> abrirModalTarea("crear")}
                >
                  <FaPlus />
                </button>
            </section>
        </header>
    )
}