const bitcore = require('bitcore-mnemonic/node_modules/particl-bitcore-lib');
const Mnemonic = require('bitcore-mnemonic')
const assert = require('assert')
const coin_data = require('../coin-data').coin_data
const COIN = 100000000

words = "march hour rabbit response desk exhaust feel intact brother ecology put lamp maze apology then ranch reward loud suffer bitter memory siege glimpse tray"

var code = new Mnemonic(words);
console.log(code.toString())

desired_coin_data = coin_data["efin"]

bitcore.Networks.add(desired_coin_data["testnet"].network_data);

var hdPrivateKey = code.toHDPrivateKey("", "efin/testnet"); // empty passphrase

console.log("BIP32 Root Key: " + hdPrivateKey.toString())
var derivationPath = hdPrivateKey
    .derive(44, true)
    .derive(coin_data["efin"]["testnet"].bip44_id, true)
    .derive(0, true)
    .derive(0);

for (var i = 0; i < 10; i++) {
    var myPath = derivationPath.derive(i)
    var privKey = myPath.privateKey;
    var pubKey = privKey.toPublicKey();
    var address = privKey.toAddress();
    console.log(address.toString());
    //console.log("    " + pubKey.toString() + ", " + privKey.toString());
    //console.log(privKey.toWIF());
}


console.log("=====================")

const utxo = {
    "txId" : "5209723d5612a46836b3ad1f4ccddd254e24b80cbfb72e002b939a6b33798ded",
    "outputIndex" : 3,
    "address" : "EQdjyXKenWcMrNJ3h7dqtnBKprJaAVPe1k",
    "script" : "76a914520c94fac3a526534883c59ab4646010f8da8dc788ac",
    "satoshis" : 20000000000
};

// Obtain the private key that corresponds to the address 'EQdjyXKenWcMrNJ3h7dqtnBKprJaAVPe1k'
// which is the destination of the utxo. For demo simplicity, only look for at most ten
// addresses in the wallet.
var priv_key;
var dest_address
for (var i = 0; i < 10; i++) {
    var candidate_key = derivationPath.derive(i).privateKey;
    var candidate_address = candidate_key.toAddress();
    if (candidate_address == 'EQdjyXKenWcMrNJ3h7dqtnBKprJaAVPe1k') {
        priv_key = candidate_key;
        dest_address = candidate_address;
    }
}

var bitcore_tx = new bitcore.Transaction()
    .from(utxo)
    .to(bitcore.Address.fromString("EKLiqAS8154uEEtRGHZ4PJax64o4nC5Jgw", "efin/testnet"), 15 * COIN)
    .change(bitcore.Address.fromString("EarTiDEmacVgSfFkukqUFBmseeHBCLdrs8", "efin/testnet"))
    .fee(34600)

const tx_before_sign = bitcore_tx.toString();
console.log("BEFORE:")
console.log(tx_before_sign)

console.log("signing with key: " + priv_key.toString())
bitcore_tx.sign(priv_key)

const tx_after_sign = bitcore_tx.toString();
console.log("AFTER:")
console.log(tx_after_sign)

// If tx string hex before and after the transaction are the same, then the tx was not signed.
// This usually happens when the private key is not the correct one.
assert(tx_before_sign != tx_after_sign, "TX string hex must not be the same");
