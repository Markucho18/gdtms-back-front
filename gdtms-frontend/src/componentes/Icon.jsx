import { FaInbox } from "react-icons/fa6";
import { MdPushPin } from "react-icons/md";
import { FaCalendarPlus } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import { FaTags } from "react-icons/fa";
import { FaCode } from "react-icons/fa";
import { FaMusic } from "react-icons/fa6";
import { FaHome } from "react-icons/fa";
import { IoLogoGameControllerB } from "react-icons/io";
import { MdWork } from "react-icons/md";
import { FaBook } from "react-icons/fa";
import { RiMoneyDollarCircleFill } from "react-icons/ri";
import { MdSportsBaseball } from "react-icons/md";
import { BsPeopleFill } from "react-icons/bs";
import { FaPaintBrush } from "react-icons/fa";

export function Icon ({ name, color }){

  return(
    <>
      {
        (name === "inbox" && <FaInbox/>)  || 
        (name === "hoy" && <MdPushPin/>)  ||
        (name === "proximo" && <FaCalendarPlus/>)  || 
        (name === "etiquetas" && <FaTags/>)  || 
        (name === "completas" && <FaCheckCircle/>)  || 
        (name === "completas" && <FaCheckCircle/>)  || 
        (name === "Programacion" && <FaCode style={{color: color}}/>)  || 
        (name === "Musica" && <FaMusic style={{color: color}}/>)  || 
        (name === "Hogar" && <FaHome style={{color: color}}/>)  || 
        (name === "Ocio" && <IoLogoGameControllerB style={{color: color}}/>)  || 
        (name === "Trabajo" && <MdWork style={{color: color}}/>)  || 
        (name === "Estudio" && <FaBook style={{color: color}}/>)  || 
        (name === "Finanzas" && <RiMoneyDollarCircleFill style={{color: color}}/>)  || 
        (name === "Deporte" && <MdSportsBaseball style={{color: color}}/>)  || 
        (name === "Social" && <BsPeopleFill style={{color: color}}/>)  || 
        (name === "Social" && <BsPeopleFill style={{color: color}}/>)  || 
        (name === "Arte" && <FaPaintBrush style={{color: color}}/>)
      }
    </>
  )
}

export default Icon