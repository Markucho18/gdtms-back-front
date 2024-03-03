//usuario.js
const express = require("express");
const db = require("../db");
const bcrypt = require("bcrypt");
const router = express.Router();

const saltRounds = 10;

const hashPassword = async (password) => {
  try {
    // Generar un salt
    const salt = await bcrypt.genSalt(saltRounds);
    // Hash de la contraseña con el salt
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    console.error("Error al hashear la contraseña:", error);
  }
};

router.get("/", (req, res) => {
  const query = "SELECT * FROM `usuarios`";
  db.query(query, (err, result) => {
    if (err) return console.error("Error al ejecutar la consulta", err);
    else {
      console.log(result);
      res.status(200).send(result);
    }
  });
});

router.get("/:username", (req, res) => {
  const { username } = req.params;
  const query = "SELECT * FROM usuarios WHERE username = ?";
  db.query(query, [username], (err, result) => {
    if (err) return console.error("Error al ejecutar la consulta", err);
    else {
      console.log(result);
      res.status(200).send(result);
    }
  });
});

//VALIDAR CONTRASEÑA
router.post("/validarPassword", (req, res) => {
  const { username, password } = req.body;
  const query = "SELECT password FROM usuarios WHERE username = ?";
  db.query(query, [username], (err, result) => {
    if (err)
      res.json({ mensaje: "Hubo un error al consultar SQL", error: err });
    else if (result.length > 0) {
      const hashedPassword = result[0].password;
      bcrypt.compare(password, hashedPassword, (compError, passwordMatch) => {
        if (compError)
          res
            .status(500)
            .json({
              mensaje: "Error al comparar contraseñas",
              error: compError,
            });
        else if (passwordMatch) res.send(true);
        else res.send(false);
      });
    } else res.json({ mensaje: "No se encontro nada", resultado: result });
  });
});

//COMPROBAR SI EL USERNAME ESTA EN USO
router.post("/validarUsername", (req, res) => {
  const { username } = req.body;
  const query = "SELECT username FROM usuarios WHERE username = ? ";
  db.query(query, [username], (err, result) => {
    if (err) res.json({ mensaje: "Hubo un error", error: err });
    else if (result.length > 0) {
      res.json({
        mensaje: "Se encontro coincidencia de username",
        usado: true,
      });
    } else
      res.json({
        mensaje: "No se encontro coincidencia de username",
        usado: false,
      });
  });
});

//COMPRAR SI EL EMAIL ESTA EN USO
router.post("/validarEmail", (req, res) => {
  const { email } = req.body;
  const query = "SELECT `e-mail` FROM usuarios WHERE `e-mail` = ? ";
  db.query(query, [email], (err, result) => {
    if (err) return res.json({ mensaje: "Hubo un error", error: err });
    else if (result.length > 0) {
      res.json({
        mensaje: "Se encontro coincidencia de email",
        usado: true
      });
    } else
      res.json({
        mensaje: "No se encontro coincidencia de email",
        usado: false,
      });
  });
});

//MIDDLEWARE ENCRIPTAR CONTRASEÑA
router.use("/registrar", async (req, res, next) => {
  if (req.body.password.length < 8) return res.json({msg: "No hay contraseña"});
  else {
    req.body.password = await hashPassword(req.body.password);
    console.log("Contraseña encriptada");
    next();
  }
});

//CREAR USUARIO EN LA BASE DE DATOS
router.post("/registrar", (req, res) => {
  const { username, email, pais, password } = req.body;
  const query = "INSERT INTO usuarios (username, password, `e-mail`, id_pais) VALUES (?, ?, ?, ?) ";
  db.query(query, [username, password, email, pais], (err, result) => {
    if (err) {
      res.json({ mensaje: "Error SQL al registrar usuario:", error: err });
    } else
      res.json({
        mensaje: "Usuario creado correctamente:",
        resultado: result.affectedRows,
      });
  });
});

module.exports = router;
