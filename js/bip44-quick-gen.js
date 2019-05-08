const bitcore = require('bitcore-lib');
const Mnemonic = require('bitcore-mnemonic')
const Message = require("bitcore-message");
const readline = require("readline")

const coin_data = require('./coin-data.js').coin_data

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true
})

rl.on('line', function(words) {
    var code;
    if (words.trim().length == 0) {
        // Create random words
        code = new Mnemonic(256);
    } else {
        code = new Mnemonic(words);
    }
    //var code = new Mnemonic(words);
    console.log(code.toString())

    desired_coin_data = coin_data["efin"]

    bitcore.Networks.add(desired_coin_data["mainnet"].network_data);

    var hdPrivateKey = code.toHDPrivateKey("", "efin/mainnet"); // empty passphrase

    console.log("BIP32 Root Key: " + hdPrivateKey.toString())
    var derivationPath = hdPrivateKey
        .derive(44, true) // 44'
        .derive(coin_data["efin"]["mainnet"].bip44_id, true)
        .derive(0, true)
        .derive(0);

    for (var i = 0; i < 10; i++) {
        var myPath = derivationPath.derive(i)
        var privKey = myPath.privateKey;
        var pubKey = privKey.toPublicKey();
        var address = privKey.toAddress();

        console.log(`${i} - ${address.toString()}`);
        /*
        console.log("    " + pubKey.toString() + ", " + privKey.toString());
        console.log(privKey.toWIF());
        */
        //var script = bitcore.Script.buildPublicKeyHashOut(address);
        
        //console.log("SCRIPT: " + script.toHex());
    }
})

