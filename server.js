var connect = require('connect');

var server = connect(
  connect.static(__dirname)
).listen(8000);

console.log('Servidor iniciado: http://localhost:8000');

