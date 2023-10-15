const express = require("express");
var app=express();
var multer = require("multer");
var upload = multer();
const {MongoClient}= require("mongodb");
async function dbconnect()
{
var url = "mongodb://127.0.0.1:27017";
var client = new MongoClient(url);
var connect = client.db("Ecommerce");
var collection = connect.collection("Users");
return collection;
}

app.post("/register" , upload.single(), async function(req, res){
  var {name, email, password, confirm_password} = req.body;
  if (name && email && password && confirm_password){
    if(password == confirm_password){
        var users = await dbconnect();
        var finduser = await users.findOne({email: email});
        if(finduser){
            res.send({message:"user already registered", status:0});
        }
        else{
            var insertdata = await users.insertOne({name:name, email:email, password:password, confirm_password: confirm_password });
            if(insertdata){
                res.send({message:"registration successful", status:1});
            }
            else {
                res.send({message:"registration failed", status:0});
            }

        }
        
    }
    else{
        res.send({message:"password and confirm password not matched", status:0})
    }
  }
  else{
    res.send({message:"Enter all fields compulsery", status:0});
  }
});
app.listen(8000, function () {
    console.log("server listening on http://localhost:8000/");
});









