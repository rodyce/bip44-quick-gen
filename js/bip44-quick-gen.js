var bitcore = require('bitcore-lib');
var assert = require('assert')
var Mnemonic = require('bitcore-mnemonic')

words = "loyal excite family skirt wise impulse ripple host disorder stamp want casino method bracket step relax indicate night cool mixed harvest wire crazy survey"

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
    var address = derivationPath.derive(i).privateKey.toAddress();
    console.log(address.toString());    
}
