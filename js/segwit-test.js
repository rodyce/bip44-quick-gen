const btcnodejs = require('btcnodejs')
var bitcore = require('bitcore-lib');
var assert = require('assert')
var Mnemonic = require('bitcore-mnemonic')

words = "kit youth enroll gravity inform coil life response over collect shrimp fashion desk million differ style october hill first fiscal reform among fiscal word"

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
    var address = derivationPath.derive(i).privateKey.toAddress();
    console.log(address.toString());    
}


console.log("=====================")

//var address = Address.fromString('EZT48xbvhthffTtZCR2yganLAbYp2cHQVZ', "efin/mainnet");

var dest_address = derivationPath.derive(0).privateKey.toAddress();
var script = bitcore.Script.buildPublicKeyHashOut(dest_address);
console.log(script.toBuffer().toString("hex"))


var priv_key = derivationPath.derive(0).privateKey

var utxo = {
    "txId" : "5209723d5612a46836b3ad1f4ccddd254e24b80cbfb72e002b939a6b33798ded",
    "outputIndex" : 0,
    "address" : "EHSTekNVcFj5i6XUoFUZ2WKkog6AUabdTo",
    "script" : "76a91403217fe1e5f895420b2b30cb5dc4ef990a5f899488ac",
    "satoshis" : 20000000000
};

var bitcore_tx = new bitcore.Transaction()
    .from(utxo)
    .to(bitcore.Address.fromString("EarTiDEmacVgSfFkukqUFBmseeHBCLdrs8", "efin/mainnet"), 15)
    .sign(priv_key)


console.dir(bitcore_tx)

var scriptSigHex = bitcore_tx.inputs[0].script.toBuffer().toString("hex")
const sig = btcnodejs.ScriptSig.fromHex(scriptSigHex)

const tx_inputs = [
    new btcnodejs.Input(
        txid=bitcore_tx.inputs[0].prevTxId.toString("hex"),
        out=bitcore_tx.inputs[0].outputIndex,
        scriptSig=sig,
        sequence=new btcnodejs.Sequence(bitcore_tx.inputs[0].sequenceNumber),
        witness=sig.toWitness())
]


console.log("=============> ")
console.log(bitcore_tx.outputs[0].script.toBuffer().toString("hex"))

const tx_outputs = [
    new btcnodejs.Output(
        amount=bitcore_tx.outputs[0].satoshis,
        scriptPubKey=btcnodejs.ScriptPubKey.fromHex(bitcore_tx.outputs[0].script.toBuffer().toString("hex")))
]

const tx = new btcnodejs.Transaction(
    version=bitcore_tx.version,
    inputs=tx_inputs,
    outputs=tx_outputs,
    locktime=bitcore_tx.nLockTime,
    segwit=true)

console.log(tx.toHex())
