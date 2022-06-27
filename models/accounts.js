// to describe schema of new accounts

const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
    AccountName : String ,
    // AccountName : {type : String , require : true},
    AcountNumber : String ,
    AccountBank  : String ,
    Balance : Number,
},
 {collection : 'accounts'});

const Account = mongoose.model("Account" , accountSchema);

module.exports = Account;