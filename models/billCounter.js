const mongoose = require("mongoose");

const billCounter = new mongoose.Schema({
    Name : String,
    BillNumber : Number,
},
 {collection : 'billCounter'});

const BillCounter = mongoose.model("BillCounter" , billCounter);

module.exports = BillCounter;