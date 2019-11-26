var mongoose = require("mongoose");

//SCHEMA SETUP
var neusualnetworkSchema = new mongoose.Schema({
    name:String,
    price:String,
    image:String,
    description:String,
    author: {
        id :{
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        },
        username: String
    },
    comments:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Comment"
        }
    ]
}); 

var Neusualnetwork = mongoose.model("Neusualnetwork", neusualnetworkSchema);

module.exports = Neusualnetwork;