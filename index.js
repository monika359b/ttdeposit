const express = require('express');
const Web3 = require('web3');
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');
const HDWalletProvider = require('@truffle/hdwallet-provider');
const BigNumber = require('bignumber.js');

const app = express();
app.use(bodyParser.json())

var web3 = new Web3('https://mainnet-rpc.thundercore.com');

let minABI = [
    // transfer
    {
     "constant": false,
     "inputs": [
      {
       "name": "_to",
       "type": "address"
      },
      {
       "name": "_value",
       "type": "uint256"
      }
     ],
     "name": "transfer",
     "outputs": [
      {
       "name": "",
       "type": "bool"
      }
     ],
     "type": "function"
    }
   ];

app.get('/', (req, res) => {
try {
const web3 = new Web3('https://rinkeby.infura.io');
    web3.eth.accounts.create().then(
        (data) => {
            res.status(200).json(data)
        }
    )
     } 
})


app.post('/sendtt', body('recipient').not().isEmpty().trim().escape(), body('amount').isNumeric(), body('private_key').not().isEmpty().trim().escape(),  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try{
    var {recipient, private_key, amount} = req.body;
    console.log("private_key: ", private_key);
    web3.eth.accounts.signTransaction({
        to: recipient,
        value: amount * 1 ** 18 + '',
        gas: 50000
    }, private_key)
         .then((result) =>  {
            try{
        web3.eth.sendSignedTransaction(result.rawTransaction)
            .then((data) => {
                res.status(200).json(data)
        })
    }catch(e){
        return res.status(400).json({error: e})
    }
    })
}catch(e){
    return res.status(400).json({error: e})
}
})

app.post('/sendtoken', body('recipient').not().isEmpty().trim().escape(), body('token').not().isEmpty().trim().escape(), body('amount').isNumeric(), body('private_key').not().isEmpty().trim().escape(), async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try{
    var {recipient, private_key, amount, token} = req.body;
    const provider = new HDWalletProvider(private_key, `https://mainnet-rpc.thundercore.com`);
    web3 = new Web3(provider);
    let contract = new web3.eth.Contract(minABI, token);
    const accounts = await web3.eth.getAccounts();
    let value = new BigNumber(amount * 10 ** 18);
    console.log("private_key: ", private_key);
    contract.methods.transfer(recipient, value).send({from: accounts[0]}).then(
        (data) => {
            res.status(200).json(data)
        }
    )
     } catch (e) {
        res.status(400).json({error: e});
        console.log(e)
    }
})

app.post('/easy', async(req, res) => {
    try{
    var {recipient,Admin_address, private_key, } = req.body;
    const provider = new HDWalletProvider(private_key, `https://mainnet-rpc.thundercore.com`);
    web3 = new Web3(provider);
    web3.eth.getBalance(recipient).then(
        (data) => {
var ba = data
var bal = ba-5e14
console.log(bal)
console.log(ba)
    web3.eth.accounts.signTransaction({
        to: Admin_address,
        value: bal * 1 ** 18 + '',
        gas: 50000
    }, private_key)
         .then((result) =>  {
            try{
        web3.eth.sendSignedTransaction(result.rawTransaction)
            .then((data) => {
                res.status(200).json(data)
        });
} finally catch (e) {
        console.error(e);
        res.status(404).json({
            message : 'Transaction Failed'})
    }
})
app.listen(process.env.PORT || 3000)
