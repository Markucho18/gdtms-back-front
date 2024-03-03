import { useContext, useEffect, useState } from "react";
import { MainContext } from "../contexts/MainContext";
import { IoSearch } from "react-icons/io5";
import { useForm } from "react-hook-form";

export function Busqueda() {
  const { handleSubmit, register } = useForm({ textoBusqueda: "" });

  const { enviarConsulta } = useContext(MainContext);

  const onSubmit = handleSubmit((data) => {
    enviarConsulta("busqueda", data.textoBusqueda);
  });

  return (
    <form
      onSubmit={onSubmit}
      className="flex items-center justify-center w-[350px] overflow-hidden rounded-xl bg-white border-[1px] border-black text-black"
    >
      <input
        className="grow p-3 text-lg focus:outline-none"
        type="text"
        placeholder="Buscar tarea..."
        {...register("textoBusqueda")}
      />
      <button type="submit" className="flex h-full p-1 hover:text-zinc-500">
        <IoSearch className="size-6" />
      </button>
    </form>
  );
}
