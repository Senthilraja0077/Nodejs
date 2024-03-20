const http = require("http"); // predefined function call to call the http method
const request_handler=require('./routes');

/*
function request_listener(request,response){
console.log(request)
}
const server=http.createServer(request_listener);
*/

const server = http.createServer(request_handler);
Http2ServerRequest.
server.listen(3000); // port number for request and response
