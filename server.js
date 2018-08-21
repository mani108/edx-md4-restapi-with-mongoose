const express = require('express');
const mongoose = require('mongoose');
const errorhandler = require('errorhandler');
const logger = require('morgan');
const bodyParser = require('body-parser');

const url = "mongodb://localhost:27017/edx-course-db";
let app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(errorhandler());

mongoose.connect(url,{useNewUrlParser: true});

const Account = mongoose.model('Account', {
    name: String,
    balance: Number
});

app.get('/accounts', (req, res, next) =>{
    Account.find((error, accountsDoc) =>{
        if(error) return next(error);

        res.send(accountsDoc);
    });
});

app.post('/accounts',(req, res, next) =>{
    let account = new Account(req.body);
    account.save((err, results) =>{
        if(err){
            console.error(err);
            process.exit(1);
        }else{
            res.send(results);
        }
    });
});

app.put('/accounts/:id', (req, res, next) =>{
    let account = Account.findById(req.params.id);
    account = new Account(req.body);
    account.save((error, result) => {
        if(error) return next(error);

        res.send(result);
    });
});

app.delete('/accounts/:id', (req, res, next) =>{
    let account = Account.findById(req.params.id);
    account.remove((error, result) =>{
        if(error) return next(error);

        res.send(result);
    });
})

app.listen(3000);
