const http = require('http');
const fs = require('fs');
const express = require('express');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');


var BillModel = require('./models/bills');
var AccountModel = require('./models/accounts');
var BillCounterModel = require('./models/billCounter');
const Bill = require('./models/bills');
// const Bill = require('./models/bills');


// const { db } = require('./models/bills');
// const { json } = require('body-parser');
// const Account = require('./models/accounts');
// const { findaAccount } = require('./models/accounts');

var app = express();

app.set('view engine' , 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const urldb = 'mongodb+srv://mongodb_aliasger_user:afdikomu5253@cluster0.bs7ekta.mongodb.net/?retryWrites=true&w=majority';

//'mongodb://localhost:27017/BM_test'

mongoose.connect(urldb, {useNewUrlParser: true , useUnifiedTopology: true})
.then(() =>{
    console.log('Connection successful');
}).catch((err) => console.log(err));


const hostname = '127.0.0.1';
const port = process.env.PORT || 3000;


var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.get("/", (req, res)=>{
     res.sendFile(__dirname + '/account.html');
 });

app.get("/bill", (req, res)=>{
     res.sendFile(__dirname + '/bill.html');
 });

app.post('/account_submit' , urlencodedParser ,async function (req, res) {

    var accountChecker;

    await AccountModel.exists({AccountName : req.body.AccountName}, async function (err , docs) {
        accountChecker = docs;
        console.log(accountChecker);
        if(accountChecker === null)
        {
            var AccountCollection = await new AccountModel({
            AccountName : req.body.AccountName ,
            AcountNumber : req.body.AccountNumber ,
            AccountBank  : req.body.AccountBank ,
            Balance : req.body.Balance
            }).save();
    
            console.log(AccountCollection);
    
        }
        else {
            await AccountModel.updateOne({ AccountName : req.body.AccountName} , {Balance : req.body.Balance});
            console.log("else of app is executed");

        }
    });
    res.sendFile(__dirname + '/account.html');
});
    



app.post('/bill_template', urlencodedParser, async function (req, res) {
    var billdisplay;
    console.log(req.body.AcntName);
    var total = 0;
    var multiple_names = '';
    var billidString = '';
    var numberbill = 0;

    var month_num = parseInt(req.body.BillDate[6]);

            if(month_num > 4)
            {
                var yearString = '';
                yearString = yearString.concat(req.body.BillDate[2] , req.body.BillDate[3]);
                var yearNum = parseInt(yearString);
                var yearNumOne = yearNum + 1;
                var yearNumStr = yearNum.toString();
                var yearNumOneStr = yearNumOne.toString();
                var billidyear = '';
                billidyear = billidyear.concat(yearNumStr , yearNumOneStr);

                billidString = billidString.concat(req.body.DeptName[0] , req.body.DeptName[1] , 'D-' , billidyear);
                console.log(billidString); 
            }
            
            if(month_num < 4)
            {
                var yearString = '';
                yearString = yearString.concat(req.body.BillDate[2] , req.body.BillDate[3]);
                var yearNum = parseInt(yearString);
                var yearNumOne = yearNum - 1;
                var yearNumStr = yearNum.toString();
                var yearNumOneStr = yearNumOne.toString();
                var billidyear = '';
                billidyear = billidyear.concat(yearNumOneStr , yearNumStr);

                billidString = billidString.concat(req.body.DeptName[0] , req.body.DeptName[1] , 'D-' , billidyear);
                console.log(billidString); 
            }

    if(typeof req.body.AcntName === 'string' || req.body.AcntName instanceof String) {
    
            await AccountModel.find({AccountName : req.body.AcntName}).then((Names) => {
            total = total + Names[0].Balance;
            });  

            await AccountModel.findOneAndUpdate({AccountName : req.body.AcntName} , {Balance : 0})
             
                billdisplay = await new BillModel({
                BillId : billidString,
                BillDate : req.body.BillDate,
                BillDepartment : req.body.DeptName ,
                BillNames : req.body.AcntName ,
                MID : req.body.M_ID,
                Contact : req.body.ContactNumber,
                BillBank : req.body.BillBank ,
                BillCurrency : req.body.currency,
                BillAmount : total
            }).save();

            
            res.render('bill_template', {data : req.body});
            console.log(billdisplay);
            console.log("if executed");
     }
     else {
            var NameArray = Array.from(req.body.AcntName);
            var NameArrayLength = NameArray.length;
            NameArray.forEach(async function(element) {
            
            await AccountModel.find({AccountName : element}).then((Names) => {
            numberbill++;
            console.log(Names);
            console.log(numberbill);
            total = total + Names[0].Balance;
            console.log(total);
            multiple_names = multiple_names.concat(element , ' ');
            multiple_names.toString();
            console.log(multiple_names);
            console.log(typeof multiple_names); 
        })
        .then(async () => {
            if(numberbill == NameArrayLength) {
                billdisplay = await new BillModel({
                BillId : billidString,
                BillDate : req.body.BillDate,
                BillDepartment : req.body.DeptName ,
                BillNames :  multiple_names ,
                MID : req.body.M_ID,
                Contact : req.body.ContactNumber,
                BillBank : req.body.BillBank ,
                BillCurrency : req.body.currency,
                BillAmount : total
                }).save();
            
                console.log(billdisplay);

                res.render('bill_template', {data : billdisplay});
            }

            await AccountModel.findOneAndUpdate({AccountName : element} , {Balance : 0});
            
        });
            
            
            /* write code to increment bill counter and delete previous one if some variable is > 1
            if(numberbill > 1) {
                //code to delete previous bill etry
            } */  
            
        
            
            //loop ends
            
        });
        //else ends
        }
});
        
app.get('/AccountLogs' , async (req, res)=>{

    const numAccountModel = await AccountModel.estimatedDocumentCount();

    const AccountLogs = await AccountModel.find({});

    const ArrayAccountLogs = Array.from(AccountLogs);

    var AccountNameArray = [];
    var AccountNumberArray = [];
    var AccountBankArray = [];
    var BalanceArray = [];

    ArrayAccountLogs.forEach(element => {
        AccountNameArray.push(element.AccountName);
        AccountNumberArray.push(element.AcountNumber);
        AccountBankArray.push(element.AccountBank);
        BalanceArray.push(element.Balance);
    });

    res.render('Account_logs' , { 
        Names : AccountNameArray ,
        AccountNumbers : AccountNumberArray,
        AccountBank : AccountBankArray ,
        Balance : BalanceArray,
        Count : numAccountModel});

    console.log("The page has been rendered");
});

app.get('/BillLogs' , async (req, res)=>{

    const numBillModel = await BillModel.estimatedDocumentCount();

    const BillLogs = await BillModel.find({});

    const ArrayBillLogs = Array.from(BillLogs);

    var BillIdArray = [];
    var BillDateArray = [];
    var BillDepartmentArray = [];
    var BillNamesArray = [];
    var BillMIDArray = [];
    var BillContactArray = [];
    var BillBankArray = [];
    var BillCurrencyArray = [];
    var BillAmountArray = [];
    
    ArrayBillLogs.forEach(element => {
        BillIdArray.push(element.BillId);
        BillDateArray.push(element.BillDate);
        BillDepartmentArray.push(element.BillDepartment);
        BillNamesArray.push(element.BillNames);
        BillMIDArray.push(element.MID);
        BillContactArray.push(element.Contact);
        BillBankArray.push(element.BillBank);
        BillCurrencyArray.push(element.BillCurrency);
        BillAmountArray.push(element.BillAmount);
    });

    res.render('Bill_logs' , { 
        BillId : BillIdArray ,
        BillDate : BillDateArray ,
        BillDepartment : BillDepartmentArray ,
        BillNames : BillNamesArray ,
        MID : BillMIDArray ,
        Contact: BillContactArray ,
        BillBank : BillBankArray ,
        BillCurrency : BillCurrencyArray,
        BillAmount : BillAmountArray ,
        Count : numBillModel 
        }
        );

    console.log("The page has been rendered");
});

app.listen(port, ()=>{
     console.log(`Server running at http://${hostname}:${port}/`);
 });