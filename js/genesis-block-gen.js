const fs = require('fs');

const sha256 = require('js-sha256');
const ripemd160 = require('ripemd160');

const bitcore = require('bitcore-lib');
const Mnemonic = require('bitcore-mnemonic')


const coin_data = {
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
            bip44_id: 3714 // 3714'
        }
        
    }
}

desired_coin_data = coin_data["efin"]

bitcore.Networks.add(desired_coin_data["mainnet"].network_data);

if (process.argv.length < 6) {
    console.log("Syntax: genesis-block-gen.js <total_coin_supply> <n_accounts> <n_coins_per_account> <out_file>")
    process.exit(1);
}

var total_coin_supply = parseInt(process.argv[2]);
var n_accounts = parseInt(process.argv[3]);
var n_coins_per_account = parseInt(process.argv[4]);
const out_file = process.argv[5] + ".txt";

const amount = total_coin_supply / n_accounts / n_coins_per_account;

for (var j = 0; j < n_accounts; j++) {
    var code = new Mnemonic(256);
    fs.writeFileSync(out_file, code.toString() + "\n", {flag: 'a'});
    var hdPrivateKey = code.toHDPrivateKey("", "efin/mainnet"); // empty passphrase

    //console.log("BIP32 Root Key: " + hdPrivateKey.toString())
    console.log(`// ${j+1}`);
    var derivationPath = hdPrivateKey
        .derive(44, true)
        .derive(coin_data["efin"]["mainnet"].bip44_id, true)
        .derive(0, true)
        .derive(0);
    for (var i = 0; i < n_coins_per_account; i++) {
        var myPath = derivationPath.derive(i)
        var privKey = myPath.privateKey;
        var pubKey = privKey.toPublicKey();
        var hash = sha256(pubKey.toBuffer());
        var pbKeyHashBuffer = new ripemd160().update(Buffer.from(hash, 'hex')).digest();
        var pbKeyHashHex = pbKeyHashBuffer.toString("hex");

        console.log(`std::make_pair("${pbKeyHashHex}", ${amount} * COIN),`);
    }
    console.log('')
}
