const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt');
const db = require('../db');

router.get("/", (req, res)=> res.send("Estas en /login"))

//VALIDAR CONTRASEÑA
router.post("/password", (req, res)=>{
    const password = req.body.password;
    const query = 'SELECT password FROM usuarios WHERE username = ?'
    db.query(query, [req.body.username], (err, result)=>{
        if(err) res.json({mensaje: "Hubo un error al consultar SQL", error: err})
        else if(result.length > 0){
            const hashedPassword = result[0].password
            bcrypt.compare(password, hashedPassword, (compError, passwordMatch) =>{
                if (compError) res.status(500).json({ mensaje: "Error al comparar contraseñas", error: compError });
                else if (passwordMatch) res.send(true);
                else res.send(false);
            }) 
        }
        else res.json({mensaje: "No se encontro nada", resultado: result})
    })
})

module.exports = router;
