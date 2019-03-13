const bitcore = require('bitcore-lib');
const Mnemonic = require('bitcore-mnemonic')
const readline = require("readline")

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true
})

rl.on('line', function(words) {
    if (words.trim().length == 0) {
        // Create random words
    }
    //var code = new Mnemonic(256);
    var code = new Mnemonic(words);
    console.log(code.toString())

    coin_data = {
        "efin": {
            "mainnet": {
                network_data: {
                    name: "efin/mainnet",
                    alias: "efin livenet",
        
                    pubkeyhash: 0x21,
                    privatekey: 0x5c,
                    scripthash: 0x3c,
                    xpubkey: 0x011c3bed,
                    xprivkey: 0x011c3488
                },
                bip44_id: 144
            }
            
        }
    }

    desired_coin_data = coin_data["efin"]

    bitcore.Networks.add(desired_coin_data["mainnet"].network_data);

    var hdPrivateKey = code.toHDPrivateKey("", "efin/mainnet"); // empty passphrase

    console.log("BIP32 Root Key: " + hdPrivateKey.toString())
    var derivationPath = hdPrivateKey
        .derive(44, true)
        .derive(coin_data["efin"]["mainnet"].bip44_id, true)
        .derive(0, true)
        .derive(0);

    for (var i = 0; i < 10; i++) {
        var privKey = derivationPath.derive(i).privateKey;
        var pubKey = privKey.toPublicKey();
        var address = privKey.toAddress();
        console.log(address.toString());
        console.log("    " + pubKey.toString() + ", " + privKey.toString());
        console.log(privKey.toWIF());
    }
})

