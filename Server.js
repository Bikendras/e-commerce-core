var express = require("express");
var app = express();
const indexRoute = require("./routes/index-route")
const cors=require('cors');
app.use(cors());
app.use("/", indexRoute);



// app.post("/redirect", function (req, res) {
//     res.redirect("/users");
// });


// app.post("/login", upload.single(),async function (request, response) {
//     // var email = request.body.email;
//     // var password = request.body.password;
//     var { email, password } = request.body;
//     if (email == "" && password == "") {

//         response.send({ message: "please enter data", status: 1 });
//     }
//      else if (email && password) {
//         const users =await dbConnect();
//         const usersdata= await users.findOne();
//         if(usersdata.email==email && usersdata.password==password){
//             response.send({ message: "login Successfully", status: 1 });
//         }
//         else{
//             response.send({ message: "plz enter valid email and password", status: 0 });
//         }
//     }
//     else {
//         response.send({ message: "Email and password must be required ", status: 0 });
//     }
// });



// Update Data..





// temparary inactive user..










// hard delete data..



app.listen(8000, function () {
    console.log("server listening on http://localhost:8000/");
});






