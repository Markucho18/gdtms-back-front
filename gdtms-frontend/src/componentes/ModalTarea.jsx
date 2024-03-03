import { useContext, useEffect } from "react";
import { TokenContext } from "../contexts/TokenContext";
import { ModalContext } from "../contexts/ModalContext";
import { MainContext } from "../contexts/MainContext";
import axios from "axios";
import { useForm } from "react-hook-form";

export function ModalTarea({ datos }) {
  const { modalAbierto, cerrarModalTarea } = useContext(ModalContext);

  const initialFormData =
    modalAbierto.tipo === "editar"
      ? datos
      : {
          nombre: "",
          fecha: "",
          prioridad: 1,
          idEtiqueta: 1,
          descripcion: null,
        };

  const { handleSubmit, register, reset } = useForm({
    defaultValues: initialFormData,
  });

  const onSubmit = handleSubmit((data) => {
    if (modalAbierto.tipo === "crear") crearTarea(data);
    else editarTarea(data);
    reset();
  });

  const { validarToken, userData } = useContext(TokenContext);

  const { actualizarTareas, etiquetas, getEtiquetas } = useContext(MainContext);

  useEffect(() => {
    getEtiquetas();
  }, []);

  const crearTarea = async (formData) => {
    console.log(formData);
    try {
      const tokenValido = await validarToken(userData.token);
      if (tokenValido === true) {
        if (formData.nombre.length < 5)
          throw new Error("La tarea debe contener un nombre");
        else {
          axios
            .post(
              "http://localhost:3001/tareas/crear",
              { ...formData },
              { headers: { "id-usuario": userData.id } }
            )
            .then((res) => {
              alert("Tarea creada correctamente");
              actualizarTareas();
              cerrarModalTarea();
            })
            .catch((err) => {
              console.log("Hubo un error al consultar tareas/crear");
            });
        }
      } else throw new Error("El token es invalido");
    } catch (err) {
      console.log("Hubo un error al crear la tarea: ", err);
    }
  };

  const editarTarea = async (formData) => {
    try {
      const tokenValido = await validarToken(userData.token);
      if (tokenValido === true) {
        if (formData.nombre.length < 5)
          throw new Error("La tarea debe contener un nombre");
        else {
          axios
            .put(
              "http://localhost:3001/tareas",
              { ...formData },
              {headers: { "id-usuario": userData.id }}
            )
            .then((res) => {
              console.log(res.data)
              alert("Tarea Editada correctamente");
              actualizarTareas();
              cerrarModalTarea();
            })
            .catch((err) =>
              console.log("Hubo un error al consultar /tareas (PUT): ", err)
            );
        }
      } else throw new Error("El token es invalido");
    } catch (err) {
      alert(err);
      console.log("Hubo un error al editar la tarea", err);
    }
  };

  return (
    <div className="flex flex-col z-10 items-center justify-center fixed size-full top-0 left-0 bg-black/30">
      <form
        onSubmit={onSubmit}
        className="flex flex-col items-center justify-center w-[450px] h-[500px] rounded-lg px-3 gap-5 border-2 border-blue-500 bg-white text-lg"
      >
        <label className="flex items-center justify-start w-full gap-1">
          <p className="w-1/4">Nombre:</p>
          <input
            type="text"
            className="grow border-2 border-black rounded px-1 focus:outline-none modal"
            {...register("nombre")}
          />
        </label>
        <label className="flex items-center justify-start w-full gap-1">
          <p className="w-1/4">Fecha:</p>
          <input
            type="date"
            className="grow text-center border-2 border-black rounded focus:outline-none modal"
            {...register("fecha")}
          />
        </label>
        <label className="flex items-center justify-start w-full gap-1">
          <p className="w-1/4">Prioridad:</p>
          <select
            className="w-1/4 px-2 py-1 text-center rounded border-2 border-zinc-300 modal"
            {...register("prioridad")}
          >
            <option value={1} className="bg-red-500 text-center">
              1
            </option>
            <option value={2} className="bg-orange-500 text-center">
              2
            </option>
            <option value={3} className="bg-yellow-500 text-center">
              3
            </option>
            <option value={4} className="bg-sky-500 text-center">
              4
            </option>
          </select>
        </label>
        <label className="flex items-center justify-start w-full gap-1">
          <p className="w-1/4">Etiqueta:</p>
          <select
            className="w-2/4 text-center px-2 py-1 rounded border-2 border-zinc-300 modal"
            {...register("idEtiqueta")}
          >
            {etiquetas ? (
              etiquetas.map((etiqueta, i) => (
                <option
                  key={i}
                  style={{ color: etiqueta.color }}
                  className="w-full bg-white"
                  value={etiqueta.id_etiqueta}
                >
                  {etiqueta.nombre}
                </option>
              ))
            ) : (
              <option>...</option>
            )}
          </select>
        </label>
        <label className="flex flex-col items-center justify-start w-full gap-1">
          <p>Descripcion:</p>
          <textarea
            className="w-full h-24 resize-none focus:outline-none border-2 border-sky-500 p-2 text-zinc-600 text-sm modal"
            maxLength={130}
            {...register("descripcion")}
          ></textarea>
        </label>
        <footer className="flex w-full gap-3">
          <button
            className="text-lg border-non w-full py-3 rounded bg-sky-500 text-white hover:bg-sky-600"
            onClick={cerrarModalTarea}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="text-lg border-none w-full py-3 rounded bg-sky-500 text-white hover:bg-sky-600"
          >
            {modalAbierto === "editar" ? "Editar" : "Guardar"}
          </button>
        </footer>
      </form>
    </div>
  );
}
