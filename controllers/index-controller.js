const dbConnect = require("../dbConfig/config");
var bcrypt = require("bcrypt");
const express = require("express");
var jwt = require("jsonwebtoken");
const nodemailer=require("nodemailer");
const {  ObjectId } = require("mongodb");


const rootApi = async (req, res) => {
    var email = 'bikendra7848@gmail.com';
    var name = "bikendra_singh";
    res.send("hello all");
}

const registerApi = async function (req, res) {
    const { name, email, password, confirm_password, address, role } = req.body;
    if (name!=="" && email!=="" && password!=="" && confirm_password!=="" && address!=="" && role!=="") {
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
                    status: 1,  //by default active=1;
                    address: address,
                    role: role,
                });
                if (insertData) {
                    res.send({ message: "Registration is successfull", status: 1 });
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
}

const loginApi = async function (req, res) {
    var { email, password} = req.body;
    if (email == "" && password == "") {
        res.send({ message: "please enter data", status: 1 });
    }
    else if (email && password ) {
        const users = await dbConnect();
        const usersdata = await users.findOne({ email: email });
        if (usersdata) {
            if (usersdata.email == email) {
                bcrypt.compare(password, usersdata.password, async function (err, result) {
                    if (result) {
                        const token = jwt.sign({ email: usersdata.email }, "private_key", { expiresIn: "1day", algorithm: "HS256" });
                        console.log("token", token);
                        const userupdate = await users.updateOne({ email }, { $set: { token: token } });
                        res.send({ message: "login Successfully", status: 1, token: token, email: email, data: userupdate });
                    }
                    else {
                        res.send({ message: "plz enter valid email && password", status: 0 });
                    }
                });
            } else {
                res.send({ message: "email is not correct", status: 0 });
            }
        }
        else {
            res.send({ message: "Login failed due to user not found please Register frist", status: 0 });
        }
    }
}

const alluserApi = async function (req, res) {
    const user = await dbConnect();
    const allUserdata = await user.find().toArray();
    if (allUserdata) {
        res.send({ message: "All user data fetched", status: 1, Data: allUserdata });
    }
    else {
        res.send({ message: "All user data is not fetched", status: 0 });
    }
}
// Profile Update Api...
const updateApi = async function (req, res) {
    const email = req.params.email;
    const name = req.body.name;
    const address = req.body.address;

    if (email) {
        if (name != "" && name != "undefined" && name != "null") {
            const user = await dbConnect();
            const findUser = await user.findOne({ email: email });
            if (findUser) {
                const updateuser = await user.updateOne(
                    { email: email }, { $set: { name: name, address: address } });
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
            res.send({ message: "should not be empty and undefined null", status: 0 });
        }
    }
    else {
        res.send({ message: "please enter email" });
    }
}

const disableUserApi = async function (req, res) {
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
}

const enableUserApi = async function (req, res) {
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
}
// User Delete Api...
const deleteApi = async function (request, response) {
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
}

const specificUserApi = async (req, res) => {
    const email = req.params.email;
    const user = await dbConnect();
    const specificUserData = await user.findOne({ email });
    if (specificUserData) {
        res.send({ message: "User data fetched", status: 1, user_data: specificUserData });
    }
    else {
        res.send({ message: "User data is not fetched", status: 0 });
    }
}

const imageUpload = async (req, res) => {
    const email = req.params.email;
    const image = req.file.originalname;
    if (email && req.file) {
        const user = await dbConnect();
        const userFind = await user.findOne({ email: email });
        if (userFind) {
            const userUpdate = await user.updateOne(
                { email},
                { $set: { image: image} }); // according to frontend request it upload the original of image to the server/backend ...
            if (userUpdate) {
                res.send({ message: "User image uploade Successfully", status: 1, data: userUpdate });
            }
            else {
                res.send({ message: "User image not uploade Successfully", status: 0 });
            }
        }
        else {
            res.send({ message: "User is not found", status: 0 });
        }
    }
    else {
        res.send({ message: "plz Enter your valid email", status: 0 });
    }
}

// Orders API's Booked-Confirm Api...(cardAddBooked Api)....
const OrderBookedApi = async function (req, res) {
    const email = req.params.email;
    const { address,name, Payment_mode, price, Delivery_date, Order_Id, status } = req.body;
    if (email) {
        if (email != "" && email != "undefined" && email != "null") {
            const orders = await dbConnect("orders");
            const insertData = await orders.insertOne({
                email: email,
                name: name,
                address: address,
                Payment_mode: Payment_mode,
                price: price,
                Delivery_date: Delivery_date,
                Order_ID: Order_Id,
                Product_id: 1,
                status: status,
            });
            if (insertData) {
                const transport = nodemailer.createTransport({
                    host: "smtp.gmail.com", // provider or host name
                    port: 465,
                    auth: {
                      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
                      user: email, // sender address
                      pass: "voxy cdyv aatl hkjb" // original gmail ke 2 way verification password hai..
                    }
                  });
                  const info = await transport.sendMail({
                    from: email, // sender address
                    to: "bikendra7848@gmail.com", // list of receivers Reac
                    subject: "Order booked confirmation ✔", // Subject line
                    text: `Congratulation dear user, ${email} your order booked successfully`, // plain text body
                    html: `<b>Congratulation dear user, ${email} your order booked successfully</b>`, // html body send to customer message.
                  });
                res.send({ message: "order placed successfully", status: 1 });
            }
            else {
                res.send({ message: "Somethink went wrong", status: 0 });
            }
        } else {
            res.send({ message: "please enter valid email" });
        }
    }
    else {
        res.send({ message: "please enter valid email" });
    }
}

// Order list API...(myAddCartApi)... Order booked list API...
const orderDetailApi = async (req, res) => {
    const email = req.params.email;
    if (email) {
        if (email != "" && email != "undefined" && email != "null") {
            const Orders = await dbConnect("orders");
            const Orderfind = await Orders.find({ email: email }).toArray();
            if (Orderfind) {
                res.send({ message: "My Add To Cart Details Fetched successfully", status: 1, orderDetail: Orderfind })
            }
            else {
                res.send({ message: "My Add To Cart Details is not fetched", status: 0 })
            }
        }
    }
    else{
        res.send({ message: "please Enter valid Email", status: 0 });
    }
};
// Added cart Successfully
const myAddCartApi = async (req, res) => {
    const {email} = req.params;
    const {price,name,image,discount}=req.body;
    if(email){
        if(email!=null && email!="undefined" && email!=""){
            const Cart = await dbConnect("cart")
            const userCardData = await Cart.insertOne({
                email: email,
                name: name,
                price: price,
                discount: discount,
                image: image,
            });
            console.log("userCardData", userCardData);
            if(userCardData){
                res.send({message: " My Add to cart Fatched successfully", status: 1, userCardData: userCardData })
            }
            else{
                res.send({message: " My Add to cart Detail is not Fatched", status: 0 });
            }
        }
    }
    else{
         res.send({message: "plz enter valid email", status: 0}); 
    }
    
};
// Get cart Successfully
const mygetCartApi = async (req, res) => {
    const {email} = req.params;
    if(email){
        if(email!="null" && email!="undefined" && email!=""){
            const Cart = await dbConnect("cart")
            const mygetCardData = await Cart.find({email: email}).toArray();
            if(mygetCardData){
                res.send({message: " My Add to cart Fatched successfully", status: 1, mygetCardData: mygetCardData })
            }
            else{
                res.send({message: " My Add to cart Detail is not Fatched", status: 0 });
            }
        }
    }
    else{
         res.send({message: "plz enter valid email", status: 0}); 
    }
    
};
// Remove cart Successfully
const cartRemoveApi = async (req,res)=>{
    const {id} = req.params;
    const email = req.body.email;
    const card = await dbConnect("cart");
    const findUser = await card.findOne({email:email});
    if(findUser){
        const deleteUser = await card.deleteOne({ _id: new ObjectId(id) });
        if(deleteUser){
            res.send({message: "Delete user data", status: 1 });
        }
        else{
            res.send({message: "Not Delete user data", status: 0 });
        }
    }else{
        res.send({message: "User email not found", status: 0 });
    }
};
// Added Merchant data Successfully
const marchentOrderApi = async (req, res) => {
    const {email} = req.params;
    const {productname,productPrice,discount} = req.body;
    if(email){
        if(email != "" && email != "undefined" && email != "null"){
            const order = await dbConnect("merchant");
            const insertdata = await order.insertOne({
                email: email,
                productname: productname,
                productPrice: productPrice,
                discount: discount,
            });
            if(insertdata){
                res.send({message: "Data inserted successfully", status: 1, data: insertdata});
            }else{
                res.send({message: "Data does not Inserted",status: 0});
            }
        }
    }
    else{
        res.send({mesage: "Please Enter valied Email",status: 0});
    }
};
// Get Merchant data Successfully
const merchantgetApi = async(req,res)=>{
    const {email} = req.params;
    if(email != "null" && email != "undefined" && email != ""){
        const merchantOrders = await dbConnect("merchant");
        const myorderProductGet = await merchantOrders.find({email:email}).toArray();
        console.log("myorderProductGet",myorderProductGet);
        if(myorderProductGet){
            res.send({message: "self Product Fetched " , status: 1 , merchantProd: myorderProductGet});
        }else{
            res.send({message: "MyOrder Product Detail is not Fetched", status: 0});
        }
    }else{
        res.send ({message: "plz enter Valid Email", status: 0});
    }
};

const merchantDataDeleteAPI = async (req,res)=>{
    const {id} = req.params;
    console.log("id",id);
    const email = req.body.email;
    const card = await dbConnect('merchant')
    const findUser = await card.findOne({email: email});
    if(findUser){
        const deleteUser = await card.deleteOne({_id: new ObjectId(id)});
        if(deleteUser){
            res.send({message: 'Delete Merchant data', status: 1});
        }else{
            res.send({message: 'User data not Deleted', status: 0});
        }
    }else{
        res.send({message: 'Merchant email not found', status: 0});
    }
};

const merchantDataUpdateAPI = async (req, res)=>{
    const {id} = req.params;
    const {email,productname,productPrice,discount} = req.body;
    if(id){
        if(id !== undefined && id !== null){
            const user = await dbConnect();
            const findUser = await user.findOne({_id: new ObjectId(id)});
            if(findUser){
                const UpdateData = await user.updateOne({_id:id},{$set:{
                    // email: email,
                    productname: productname,
                    productPrice: productPrice,
                    discount: discount
                }});
                if(UpdateData){
                    res.send({message: "Product Details updated successfully", status: 1});
                }else{
                    res.send({message: "Product Details is not updated", status: 0});
                }
            }else{
                res.send({message: "User email is not Found", status: 0});
            }
        }else{
            res.send({message: "please enter your email address", status: 0});
        }
    }
}

module.exports = { 
                    rootApi, 
                    registerApi, 
                    loginApi, 
                    alluserApi, 
                    updateApi, 
                    disableUserApi, 
                    enableUserApi, 
                    deleteApi, 
                    specificUserApi, 
                    imageUpload, 
                    OrderBookedApi, 
                    orderDetailApi,
                    myAddCartApi,
                    mygetCartApi,
                    cartRemoveApi,
                    marchentOrderApi,
                    merchantgetApi,
                    merchantDataDeleteAPI,
                    merchantDataUpdateAPI,
                };




