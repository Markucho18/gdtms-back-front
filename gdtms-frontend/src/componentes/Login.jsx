import { useState, useContext} from "react";
import axios from "axios";
import { TokenContext } from "../contexts/TokenContext";
import { useForm } from "react-hook-form"

export function Login({ toggleForm }) {

  const { handleSubmit, register, reset } = useForm({
    username: "",
    password: ""
  })
  
  const { getUserData, crearToken, validarToken, setTokenValido } = useContext(TokenContext);
  
  const [msgError, setMsgError] = useState("");

  const onSubmit = handleSubmit(async (data)=>{
    try {
      const usernameRes = await axios.post("http://localhost:3001/usuarios/validarUsername", data);
      const usernameExiste = usernameRes.data.usado
      if (!usernameExiste) {
        throw new Error("El username no es correcto");
      } else {
        const passwordRes = await axios.post("http://localhost:3001/usuarios/validarPassword", data);
        console.log(passwordRes)
        const passwordValida = passwordRes.data
        if (passwordValida === false) {
          throw new Error("La contraseña no es correcta");
        }
        else {
          if (msgError) setMsgError("");
          reset()
          const token = await crearToken(data);
          const tokenValido = await validarToken(token);
          if(tokenValido === true) await getUserData(data.username)
          else console.log("El token es invalido")
          setTokenValido(tokenValido)
        }
      }
    } catch (err) {
      setMsgError(err.message)
    }
  })

  return (
    <div className="flex flex-col items-center justify-center size-full bg-sky-500">
      <main
        className="flex flex-col text-center bg-white rounded-xl p-5 border-2 border-black"
        style={{boxShadow: "0px 0px 10px 1px rgba(0, 0, 0, 70%)"}}
      >
        <h1 className="text-4xl text-sky-800">Login</h1>
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
            Contraseña:
            <input
              className="border-b-2 border-b-black px-1 focus:outline-none"
              type="password"
              {...register("password")}
            />
          </label>
          <button
            type="submit"
            className="bg-sky-500 text-center py-3 w-full text-white  hover:bg-sky-600"
          >
            INICIAR SESION
          </button>
          <a href="#" className="text-blue-500" onClick={toggleForm}>
            Registrarse
          </a>
        </form>
      </main>
      {msgError.length > 0 ? (
        <span className="text-red-700 mt-3 text-xl">{msgError}</span>
      ) : null}
    </div>
  );
}

