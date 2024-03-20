/*
const fs = require("fs");
const express = require("express");
const app = express();

const body_parser = require("body-parser"); // access to aloow to request body --Mostly used in PUT,PATCH,POST,DELETE
app.use(body_parser.urlencoded()); // bodyParser. urlencoded([options]) Returns middleware that only parses urlencoded bodies and only looks at requests where the Content-Type header matches the type option.

app.use(express.json()); //middleware- modify incoming data -->The express.json() function is a built-in middleware function in Express. It parses incoming requests with JSON payloads and is based on body-parser.
const data = require("./Routes/data.json");
console.log(data);

// ROUTE HANDLER FUNCTION

// GET ALL  DATA
app.get("/data", (req, res) => {
  res.send(JSON.stringify(data));
  res.status(200).json({
    status: "success",
    count: data.length,
    data: {
      data: data,
    },
  });
});
// GET SINGLE DATA
app.get("/data/:id", (req, res) => {
  const id = req.params.id * 1;
  var find_data = data.find((el) => el.ID === id);
  if (!find_data) {
    res.status(404).json({
      status: "fail",
      message: "Data not found",
    });
  }
  res.status(200).json({
    status: "Success",
    data: {
      data: find_data,
    },
  });
});
//POST -CREATE NEW DATA
app.post("/data", (req, res) => {
  const new_id = data[data.length - 1].ID + 1;
  const new_data = Object.assign({ ID: new_id }, req.body);
  data.push(new_data);
  fs.writeFile("./data.json", JSON.stringify(data), (err) => {
    res.status(201).json({
      status: "success",
      data: {
        data: new_data,
      },
    });
  });
  res.send(" data created successfully");
});
// PATCH - UPDATE THE DATA FROM REQUEST
app.patch("/data/:id", (req, res) => {
  var req_id_value = req.params.id * 1;
  var data_to_update = data.find((el) => el.ID === req_id_value);
  if (!data_to_update) {
    res.status(404).json({
      status: "fail",
      message: "Data not found",
    });
  }
  var index = data.indexOf(data_to_update);
  Object.assign(data_to_update, req.body);
  data[index] = data_to_update;
  fs.writeFile("./data.json", JSON.stringify(data), (err) => {
    res.status(200).json({
      status: "success",
      data: {
        user: data_to_update,
      },
    });
    res.send("Updated successfully");
  });
});
// DELETE DATA FROM REQUEST
app.delete("/data/:id", (req, res) => {
  var req_id_value = req.params.id * 1;
  var data_to_delete = data.find((el) => el.ID === req_id_value);
  var index = data.indexOf(data_to_delete);
  data.splice(index, 1);
  fs.writeFile("./data.json", JSON.stringify(data), (err) => {
    res.status(204).json({
      status: "success",
      data: {
        user: null,
      },
    });
  });
});

app.listen(3000);
*/