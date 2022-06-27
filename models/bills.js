// to describe schema of bills

const mongoose = require("mongoose");


const BillSchema = new mongoose.Schema({
    BillId : String,
    BillDate : String,
    BillDepartment : String ,
    BillNames : String ,
    // MID : {type : String , require : true},
    MID : String,
    Contact : Number,
    BillBank : String ,
    BillCurrency : String,
    BillAmount : Number
},
{collection : 'bills'});

const Bill = mongoose.model("Bill", BillSchema );

module.exports = Bill;