//app.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 3001; 

//Resuelve el problema de origen cruzado (puertos diferentes)
app.use(cors());

//Traduce lo que llegue de la request de cualquier ruta al tipo de archivo correspondiente.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/usuarios', require('./routes/usuarios'));

app.use('/register', require('./routes/register'));

app.use('/login', require('./routes/login'));

app.use('/token', require('./routes/token'));

app.use('/tareas', require('./routes/tareas'));

app.use('/etiquetas', require('./routes/etiquetas'));

app.use('/paises', require('./routes/paises'))

app.use((req, res)=> res.send("Pagina no encontrada"));

app.listen(port, ()=> console.log(`Server listening on port: ${port}`));


