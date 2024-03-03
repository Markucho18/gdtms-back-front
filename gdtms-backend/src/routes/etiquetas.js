//etiquetas.js
const express = require('express');
const db = require('../db');
const router = express.Router();

router.get("/", (req, res)=>{
    const query = 'SELECT * FROM etiquetas'
    db.query(query, (err, result)=>{
        if(err) res.json({msg: "Ha occurido un error: ", err});
        else res.json({msg:"La consulta get en /etiquetas ha sido exitosa: ", result })
    })
})

module.exports = router;