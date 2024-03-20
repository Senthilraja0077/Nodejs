const express=require('express');
const app=express();
const users_data_controller=require('./users.controller');
//app.use('/users',controller.getUsers());
app.use(controller);
app.listen(3000);


