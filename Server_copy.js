
var express = require("express");
var app = express();
var multer = require("multer");
var upload = multer();
var bcrypt = require("bcrypt");

const { MongoClient } = require("mongodb");
async function dbConnect() {
    var url = "mongodb://127.0.0.1:27017";
    var client = new MongoClient(url);
    var connect = client.db("Ecommerce");
    var collection = connect.collection("Users");
    return collection;
}

app.get("/", function (req, res) {
    var email = 'bikendra7848@gmail.com';
    var name = "bikendra_singh";
    res.send("hello all");
});

app.post("/redirect", function (req, res) {
    res.redirect("/users");
});

app.post("/register", upload.single(), async function (req, res) {
    const { name, email, password, confirm_password } = req.body;
    if (name && email && password && confirm_password) {
        if (password == confirm_password) {
            var users = await dbConnect();
            // const saltRounds=10;
            // const salt = bcrypt.genSaltSync(saltRounds);
            const hashpassword = await bcrypt.hash(password, 10);
            var findUser = await users.findOne({ email: email });
            if (findUser) {
                res.send({ message: "User Already Registered", status: 1 });
            }
            else {
                var insertData = await users.insertOne({
                    name: name,
                    email: email,
                    password: hashpassword,
                    confirm_password: confirm_password,
                    status: 1  //by default active=1;
                }); 
                if (insertData) {
                    res.send({ message: "registration is successfull", status: 1 });
                }
                else {
                    res.send({ message: "Sothing went wrong", status: 0 });
                }
            }
        }
        else {
            res.send({ message: "password and confirm password does not matched", status: 0 });
        }
    }
    else {
        res.send({ message: "Registration failled,  please enter data", status: 0 });
    }
});


app.post("/login", upload.single(), async function (request, response) {
    var { email, password } = request.body;
    if (email == "" && password == "") {
        response.send({ message: "please enter data", status: 1 });
    }
    else if (email && password) {
        const users = await dbConnect();
        const usersdata = await users.findOne({ email: email });
        if (usersdata) {
            if (usersdata.email == email) {
                bcrypt.compare(password, usersdata.password, function (err, result) {
                    if (result) {
                        response.send({ message: "login Successfully", status: 1 });
                    }
                    else {
                        response.send({ message: "plz enter valid email and password", status: 0});
                    }
                });
            } else {
                response.send({ message: "email is not correct", status: 0 });
              }
        }
        else {
            response.send({ message: "Login failed due to user not found please Register frist", status: 0 });
        }
    }
    });

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

app.get("/getdata", async function (req, res) {
    const user = await dbConnect();
    const allUserdata = await user.find().toArray();
    if (allUserdata) {
        res.send({ message: "All user data fetched", status: 1, Data: allUserdata });
    }
    else {
        res.send({ message: "All user data is not fetched", status: 0 });
    }
});


app.post("/update/:email", upload.single(), async function (req, res) {
    const { firstname, lastname, mobile, password } = req.body;
    const email = req.params.email;
    const name = req.body.name;
    if (email) {
        if (name != "" && name != "undefined" && name != "null") {
            const user = await dbConnect();
            const findUser = await user.findOne({ email: email });
            if (findUser) {
                const updateuser = await user.updateOne(
                    { email: email }, { $set: { name: name } });
                if (updateuser) {
                    res.send({ message: "Name update seccessfully", status: 1 });
                }
                else {
                    res.send({ message: "user not updated", status: 1 });
                }
            }
            else {
                res.send({ message: "user not found", status: 1 });
            }
        }
        else {
            res.send({ message: "should not be emply and undefined null", status: 0 });
        }
    }
    else {
        res.send({ message: "please enter email" });
    }
});


// temparary inactive user..
app.post("/disableUser/:email", upload.single(), async function (req, res) {
    const { firstname, lastname, mobile, password } = req.body;
    const email = req.params.email;
    const { status } = req.body;
    if (email) {
        if (status != "" && status != "undefined" && status != "null") {
            const user = await dbConnect();
            const findUser = await user.findOne({ email: email });
            if (findUser) {
                if (findUser.status == 1) {
                    const updateuser = await user.updateOne(
                        { email: email },
                        { $set: { status: status } });
                    if (updateuser) {
                        res.send({ message: "User disable seccessfully", status: 1 });
                    }
                    else {
                        res.send({ message: "user not disable", status: 0 });
                    }
                }
                else {
                    res.send({ message: "User Already disable", status: 0 });
                }
            }
            else {
                res.send({ message: "user not found", status: 0 });
            }
        }
        else {
            res.send({ message: "should not be emply and undefined null", status: 0 });
        }
    }
    else {
        res.send({ message: "please enter email" });
    }
});


app.post("/enableUser/:email", upload.single(), async function (req, res) {
    const { firstname, lastname, mobile, password } = req.body;
    const email = req.params.email;
    const { status } = req.body;
    if (email) {
        if (status != "" && status != "undefined" && status != "null") {
            const user = await dbConnect();
            const findUser = await user.findOne({ email: email });
            if (findUser) {
                if (findUser.status == 0) {
                    const updateuser = await user.updateOne(
                        { email: email },
                        { $set: { status: status } });

                    if (updateuser) {
                        res.send({ message: "User disable seccessfully", status: 1 });
                    }
                    else {
                        res.send({ message: "user not disable", status: 0 });
                    }
                }
                else {
                    res.send({ message: "User Already disabled", status: 0 });
                }
            }
            else {
                res.send({ message: "user not found", status: 0 });
            }
        }
        else {
            res.send({ message: "should not be emply and undefined null", status: 0 });
        }
    }
    else {
        res.send({ message: "please enter email", status: 0 });
    }
});


// hard delete data..
app.post("/delete/:email", upload.single(), async function (request, response) {
    const email = request.params.email;
    if (email) {
        const user = await dbConnect();
        const findUser = await user.findOne({ email: email });
        if (findUser) {
            const deleteusers = await user.deleteOne({ email });
            if (deleteusers) {
                response.send({ message: "Enactive users deleted successfully", status: 1, email });
            }
            else {
                response.send({ message: "User not deleted this user is a Active", status: 0 });
            }
        }
        else {
            response.send({ message: "This user is not found", status: 0 });
        }
    }
    else {
        response.send({ message: "plz Enter email", status: 0 });
    }
});


app.listen(8000, function () {
    console.log("server listening on http://localhost:8000/");
});






