var connect = require('connect');

var server = connect(
  connect.static(__dirname)
);

server.listen(8000);

