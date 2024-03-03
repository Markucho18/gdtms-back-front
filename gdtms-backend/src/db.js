//db.js
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'ctpoba.ar',
    user: 'sosam',
    password: '45888295',
    database: '72_F'
})

connection.connect((err) => {
    if (err) {
      console.error('Error al conectar a la base de datos:', err);
      return;
    }
    console.log('Conexión a la base de datos establecida');
  });

module.exports = connection;