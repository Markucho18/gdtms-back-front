const express = require('express');
const db = require('../db');
const router = express.Router();

router.get("/", (req, res)=>{
    const query = "SELECT * FROM paises"
    db.query(query, (err, result)=>{
        if(!err) res.send(result)
        else console.log("Hubo un error en paises: ", err)
    })
})

module.exports = router;