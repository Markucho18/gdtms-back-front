import { MdOutlineKeyboardArrowDown } from "react-icons/md";

export function SidebarSeccion({  texto, color, click, children}) {

  return (
    <button
      className="flex items-center w-full h-16 text-white text-lg gap-3 py-5 px-3  box-border border-b-2 border-black hover:bg-zinc-500 hover:h-[70px] transition-height duration-300 ease-in-out"
      onClick={click}
    >
      {children}
      <span style={color && color}>{texto}</span>
      {texto === "Etiquetas" ? (
        <MdOutlineKeyboardArrowDown className="size-8"/>
      ) : null}
    </button>
  );
}
