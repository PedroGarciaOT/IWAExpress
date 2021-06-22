const config = require('config');
const mysql = require('mysql');
const fs = require('fs');
const path = require('path');

const dbConfig = config.get('App.dbConfig');
const connection = mysql.createConnection({
    host: dbConfig.host,
    port: dbConfig.port,
    user: 'root',
    password: 'root',
    database: '',
    multipleStatements: true
});

const schema = fs.readFileSync(path.join(__dirname, './schema.sql')).toString();
var query = connection.query(schema,  (err, result) => {
    if (err){
          throw err;
    } else {
        console.log('Database schema created successfully.');
    }
});

const data = fs.readFileSync(path.join(__dirname, './data.sql')).toString();
query = connection.query(data,  (err, result) => {
    if (err){
          throw err;
    } else {
        console.log('Database populated successfully.');
    }
});

connection.end(function(err) {
  if (err) {
    return console.log(err.message);
  }
});

