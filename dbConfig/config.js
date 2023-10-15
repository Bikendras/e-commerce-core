
const { MongoClient } = require("mongodb");
async function dbConnect(collection) {
    var url = "mongodb://127.0.0.1:27017";
    var client = new MongoClient(url);
    var connect = client.db("Ecommerce");
    if(collection=="orders"){
        var collection = connect.collection("orders");
        return collection;  
    }
    else if(collection=="merchant"){
        var collection = connect.collection("merchant");
        return collection;
    }
    else if(collection=="cart"){
        var collection = connect.collection("cart");
        return collection;
    }
    else {
        var collection = connect.collection("Users");
        return collection;
    }
    
}
module.exports=dbConnect;


