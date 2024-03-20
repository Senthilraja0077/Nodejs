 
 const fs = require("fs");

 const request_handler=(request,response)=>{
 //request
  /*
   console.log(request);
   console.log(request.url);  
   console.log(request.method);
   console.log(request.headers);
*/
  // Routing Request

  const url = request.url;
  const method = request.method;
  if (url === "/") {
    response.setHeader("Contet-type", "text/html");
    response.write("<html>");
    response.write("<head><title>Enter details</title><head>");
    response.write(
      '<body><form action="/message" method="POST"><input type="text" name="message"><input type="submit"></form></body>'
    );
    response.write("</html>");
    return response.end();
  }

  // Redirecting request

  /*
if(url==="/message"&& method==="POST"){
   response.setHeader('Location','/');
   response.statusCode='302';
   return response.end();
}
*/

  //Routing Request body
  if (url === "/message" && method === "POST") {
    const body = []; //Store the bufferd data
    request.on("data", (chunk_data) => {
      console.log("data : ", chunk_data);
      body.push(chunk_data);
    });
    request.on("end", () => {
      const parsed_data = Buffer.concat(body).toString();
      const msg = parsed_data.split("=");
      // fs.writeFileSync("Demo.txt", msg[1]);   // syn
      fs.writeFile("Demo.txt", msg[1],(err)=>{
         console.log(err);
      }); // Run Asyn
      console.log(parsed_data);
    });
  }

  // response

  response.setHeader("Contet-type", "text/html");
  response.write("<html>");
  response.write("<head><title>Testing</title><head>");
  response.write("<body><h2>Demo</h2></body>");
  response.write("</html>");
  response.end();
  // process.exit();
 }

 module.exports=request_handler;

 /*
1.Object--->
 module.exports={
  demo1:demo;
  demo2:tessst;
 }
 2.exports method----->
 exports.demo1=demo;
 exports.demo2="test";

 3.---->
 module.exports.demo1=demo;
 module.exports.demo2="test";

 */