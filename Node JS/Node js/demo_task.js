// port  connection
const http =require('http');
const server=http.createServer((request,response)=>{ 
const url=request.url;
if(url==="/user"){
   response.setHeader('Content-Type', 'application/json');
   // response.write(JSON.stringify(list_of_users));
   response.write(JSON.stringify(user_detils));
  return response.end();
 // process.exit();
}
else{
    response.setHeader('Content-Type', 'txt');
   response.write("Nothing here");
   return response.end();
}
})
server.listen(3000)
const user_detils=require('./user.json');

