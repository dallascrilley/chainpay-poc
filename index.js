var express = require('express');
var Web3 = require("web3");
var abi = require("./erc20abi.js")
var config = require("./config.js") 
const EthereumTx = require('ethereumjs-tx')
const web3 = new Web3();

var BigNumber = require('bignumber.js');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); 


web3.setProvider(new web3.providers.HttpProvider(config.rpcurl));
var contractAddress = config.coinaddress;

var address = config.walletaddress; // wallet from whih token will be taken
//var to_address = "0x85148b2debD2a2ea4eA744500BeAD37453b5004b"
var tokenContract = new web3.eth.Contract(abi, contractAddress, {
    from: address
});


// post to this handle with payload
//  {
// 	"address":"0x4824D35bD1f325Ab45E89a43F3f4C348379B9470",
// 	"amount":90
// }

 app.post('/transfer', function (req, res) {
     var payload = req.body;
    console.log(payload)
    transact(payload.address, payload.amount, res);
});

app.post('/transfertest', function (req, res) {
    var payload = req.body;
    transacttest(payload.address, payload.amount, res);
});

// app.get('/transfer/:address/:amount', function (req, res) {
//     console.log("Address:", req.params.address)
//     console.log("Amount:", req.params.amount)
//     transact(req.params.address, req.params.amount, res);
// });

app.get('/balance/:address', function (req, res) {
    console.log("Address:", req.params.address)
    balance(req.params.address, res);
});
app.listen(config.port);
console.log('Listening on port ',config.port);


function balance(address,res){
      var balance =    tokenContract.methods.balanceOf(address).call().then(function(bal){
        res.send({"Balance":bal});
    })
}



 


async function transact(to_address, amount, res) {
    var txnCount =   await  web3.eth.getTransactionCount(address,"pending")
    console.log("txnCount",txnCount)
    // if (txnCount ==0){
    //     txnCount++
    // }
   
    var gasPrice = web3.eth.gasPrice;
    console.log(gasPrice);
    var gasLimit = 90713;
    amount = BigNumber(amount) * Math.pow(10, 18) // 18 decimal

    var data = tokenContract.methods.transfer(to_address, BigNumber(amount)).encodeABI();


    var rawTransaction = {
        "from": address,
        "nonce": web3.utils.toHex(txnCount),    
        "gasPrice": web3.utils.toHex(2000000000),  // 2gwei
        "gasLimit": web3.utils.toHex(gasLimit),
        "to": contractAddress,
        "value": 0,
        "data": data,
        "chainId": web3.utils.toHex(1)
    };

  
    var privKey = new Buffer(config.privatekey, 'hex');
    var tx = new EthereumTx(rawTransaction);
    tx.sign(privKey);
    var serializedTx = tx.serialize();
    web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), function (err, hash) {
        if (!err) {
            console.log(hash);
            rawTransaction.transactionhash = hash
            res.send(rawTransaction);
        }
        else {
            console.log(err);
            rawTransaction.error = err
            res.send({"Error":err,"rawTransaction":rawTransaction});
        }
    });



}