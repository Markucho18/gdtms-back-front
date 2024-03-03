import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const TokenContext = createContext();

export function TokenContextProvider({ children }) {

  const [userData, setUserData] = useState({});

  const [tokenValido, setTokenValido] = useState(false);

  const crearToken = async (formData) => {
    try {
      const tokenRes = await axios.post("http://localhost:3001/token/crear", formData);
      console.log(tokenRes.data)
      return tokenRes.data.token;
    } catch (err) {
      console.log("Hubo un error al crear el token: ", err);
    }
  };

  const validarToken = async (token) => {
    try {
      const tokenRes = await axios.post("http://localhost:3001/token/validar", { token });
      return tokenRes.data.valido
    } catch (err) {
      console.log("Hubo un error al verificar el token", err);
    }
  };

  const getUserData = async (username) => {
    const res = await axios.get(`http://localhost:3001/usuarios/${username}`);
    setUserData({
      id: res.data[0].id_usuario,
      username: res.data[0].username,
      password: res.data[0].password,
      email: res.data[0]["e-mail"],
      token: res.data[0].token
    });
  }
  

  return (
    <TokenContext.Provider
      value={{
        userData,
        crearToken,
        validarToken,
        tokenValido,
        setTokenValido,
        getUserData
      }}
    >
      {children}
    </TokenContext.Provider>
  );
}
