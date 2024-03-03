const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt');
const db = require('../db');

const saltRounds = 10;

const hashPassword = async (password)=>{
  try {
    // Generar un salt
    const salt = await bcrypt.genSalt(saltRounds);
    // Hash de la contraseña con el salt
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    console.error('Error al hashear la contraseña:', error);
  }
}

//COMPROBAR SI EL USERNAME ESTA OCUPADO
router.post("/username", (req, res)=>{
    try{
        const {username} = req.body
        const query = "SELECT username FROM usuarios WHERE username = ? "
        db.query(query, [username], (err, result) =>{
            if(err) res.json({mensaje: "Hubo un error", error: err});
            else if(result.length > 0){
                res.json({mensaje: "Se encontro coincidencia de username", usado: true});
            }
            else res.json({mensaje:"No se encontro coincidencia de username", usado: false});
        })
    }
    catch(err){
        res.json({mensaje: "Hubo un error al comprobar el username", error: err});
    }
})


//COMPRAR SI EL EMAIL ESTA EN USO
router.post("/email", (req, res)=>{
    try{
        const query = "SELECT `e-mail` FROM usuarios WHERE `e-mail` = ? "
        db.query(query, [req.body.email], (err, result) =>{
            if(err) return res.json({mensaje: "Hubo un error", error: err});
            else if(result.length > 0){
                res.json({message: "Se encontro coincidencia de email", resultado: result});
            }
            else res.json({mensaje:"No se encontro coincidencia de email", resultado: result});
        })
    }
    catch(err){
        res.json({mensaje: "Hubo un error al comprobar el email", error: err});
    }
})

//MIDDLEWARE ENCRIPTAR CONTRASEÑA
router.use("/", async (req, res, next)=>{
    try{
        if(req.body.password.length < 8) throw new Error("No hay contraseña");
        else{
            req.body.password = await hashPassword(req.body.password);
            console.log("Contraseña encriptada");
            next();
        }
    }
    catch(err){
        res.json({mensaje: "Ha ocurrido un error con el hash de contraseña:", error: "No hay contraseña"});
    }
})

//CREAR USUARIO EN LA BASE DE DATOS
router.post("/", (req, res)=>{
    console.log("Datos recibidos:", req.body);
    const {username, email, pais, password} = req.body
    const query = "INSERT INTO usuarios (username, password, `e-mail`, id_pais) VALUES (?, ?, ?, ?) "
    db.query(query, [username, password, email, pais], (err, result)=>{
        if (err) {
            res.json({mensaje: "Error SQL al registrar usuario:", error: err});
          }
        else res.json({mensaje: "Usuario creado correctamente:", resultado: result.affectedRows});
    })
})

module.exports = router;