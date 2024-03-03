import { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form"

export function Register({ toggleForm }) {

  const { handleSubmit, register, reset } = useForm({
    username: "",
    email: "",
    pais: 0,
    password: "",
    confPassword: "",
  })

  const [msgError, setMsgError] = useState("");

  const onSubmit = handleSubmit( async (data)=>{
    try {
      //Valida el usuario:
      const userRes = await axios.post("http://localhost:3001/usuarios/validarUsername", data);
      const usuarioUsado = userRes.data.usado
      if (usuarioUsado === true) {
        throw new Error("El username ya está en uso");
      }
      const emailRes = await axios.post("http://localhost:3001/register/email", data);
      const emailUsado = emailRes.data.usado
      if (emailUsado === true) {
        throw new Error("El e-mail ya está en uso");
      }
      const datosValidos = validarDatos(data);
      if(datosValidos.validos){
        setMsgError("");
        await axios.post("http://localhost:3001/usuarios/registrar", data);
        reset();
        alert("Datos enviados correctamente");
        toggleForm();
      }
      else {
        throw new Error(datosValidos.msg)
      }
  
    } catch (err) {
      setMsgError(err.message);
    }
  })

  const validarDatos = (formData) => {
    if (formData.username.length < 3) {
      return({ validos: false, msg: "El username debe tener al menos 3 caracteres"});
    }
    if (!formData.email.includes("@"  || formData.email.length < 10)) {
      return({ validos: false, msg: "Debes ingresar un e-mail válido"});
    }
    if (formData.pais === 0) {
      return({ validos: false, msg: "Debes elegir un país"});
    }
    if (formData.password.length < 8) {
      return({ validos: false, msg: "La contraseña debe tener al menos 8 caracteres"});
    }
    if (formData.password !== formData.confPassword) {
      return({ validos: false, msg: "Las contraseñas no coinciden"});
    }
    return({validos: true})
  }

  const [paises, setPaises] = useState()
  const getPaises = async () => {
    axios.get("http://localhost:3001/paises")
    .then((res)=> setPaises(res.data) )
    .catch((err)=> console.log("Ocurrio un error al solicitar paises: ", err))
  };

  useEffect(()=>{
    getPaises()
  },[])

  return (
    <div className="flex flex-col items-center justify-center size-full bg-sky-500">
      <main
        className="flex flex-col text-center bg-white rounded-xl py-5 px-10 border-2 border-black "
        style={{boxShadow: "0px 0px 10px 1px rgba(0, 0, 0, 70%)"}}
      >
        <h1 className="text-4xl text-sky-800">Registro</h1>
        <form
          onSubmit={onSubmit}
          className="flex flex-col gap-3 text-xl w-full"
        >
          <label className="flex flex-col gap-3 w-full">
            Username:
            <input
              className="border-b-2 border-b-black px-1 focus:outline-none"
              type="text"
              {...register("username")}
            />
          </label>
          <label className="flex flex-col gap-3 w-full">
            E-Mail:
            <input
              className="border-b-2 border-b-black px-1 focus:outline-none"
              type="text"
              {...register("email")}
            />
          </label>
          <label className="flex flex-col gap-3 w-full">
            Pais:
            <select
              className="text-center px-2 py-1 rounded border-2 border-zinc-300"
              {...register("pais")}
            >
              {paises && paises.map(pais =>(
                <option key={pais.id} value={pais.id}>{pais.nombre}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-3 w-full">
            Contraseña:
            <input
              className="border-b-2 border-b-black px-1 focus:outline-none"
              type="password"
              {...register("password")}
            />
          </label>
          <label className="flex flex-col gap-3 w-full">
            Confirmar contraseña:
            <input
              className="border-b-2 border-b-black px-1 focus:outline-none"
              type="password"
              {...register("confPassword")}
            />
          </label>
          <button
            type="submit"
            className="bg-sky-500 text-center py-3 w-full text-white hover:bg-sky-600"
          >
            CREAR CUENTA
          </button>
          <a href="#" className="text-blue-500" onClick={toggleForm}>
            Iniciar sesion
          </a>
        </form>
      </main>
      {msgError.length > 0 ? (
        <span className="text-red-500 mt-3 text-xl">{msgError}</span>
      ) : null}
    </div>
  );
}
