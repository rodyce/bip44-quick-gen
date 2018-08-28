/*
particl-cli createmultisig 2 '["02004067d5b5677bd67a9aa42007dcecb2290bbe2f39e9554c25ec457878613349", "020d4277f
560946061f029d3d11525d8861afc61676e88674d3b9d1365451c4b1b", "024b87985fd0b5cbee675eb303bd6e37e208af724bb6decb34fa43805e5372e61e"]'  
{
  "address": "RPN2AjG4KLU1wvXVEmVYwLrNKq2NNef9AV",
  "redeemScript": "522102004067d5b5677bd67a9aa42007dcecb2290bbe2f39e9554c25ec45787861334921020d4277f560946061f029d3d11525d8861afc61676e88674d3b9d1365451c4b1b21024b87985fd0b5cbee675eb303bd6e37e208af724bb6decb34fa43805e5372e61e53ae"
}
*/

// movie story spare nation lamp lemon supply gospel unable student false seat load strong air about decide truck select tube mobile fancy vessel play
//     024b87985fd0b5cbee675eb303bd6e37e208af724bb6decb34fa43805e5372e61e, 5c5a20d8360ad230548efe6f722a5d1a8120350a1140f4a4010dd79029b2f90a
//     EfSXnHTWC9vALhe2kCxppN8tyRA73rVBbN4yR1oNkm7TESXbocQW

// relief swim enrich leisure thunder away palace skill light gesture valid buffalo stool sell warm enlist laundry harbor food mansion circle mom swarm goat
//     02004067d5b5677bd67a9aa42007dcecb2290bbe2f39e9554c25ec457878613349, 7740f952017f1c74ebfa7e88f39f1bfa957b8b60f4ec5a17349756734c14a0ae
//     EgLpoWgJeZzhyF1BQChdNQpoC8Qba5YscnuNp2rNLwTntsXARViu

// obscure team grid cave police couple spider flee art skull cancel fade abuse energy seed pink there valid cat detail plug police slogan belt
//     020d4277f560946061f029d3d11525d8861afc61676e88674d3b9d1365451c4b1b, 314269c4b60f56acb59f981f47a0afd469b3d6da7ed8afaf0675b3d6bbb41d19
//     EdzmKvk2df523ZsgEFJEAg7Z7XsSWhLTAcYjKZwjFfNhDheuqc57

// topic autumn sustain weather whip opera pair quote slender clarify bulk shed cupboard off anxiety winter bamboo short clever title rough dinner devote library
// pond slush blanket search suffer poet author rate bone menu deny bracket wedding vast horn devote ginger maple purchase hidden raw junk goose crack



const bitcore = require('./node_modules/bitcore-mnemonic/node_modules/particl-bitcore-lib');
const assert = require('assert')

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
                xprivkey: 0x011c3488,
                networkMagic: 1
            },
            bip44_id: 144
        }
        
    }
}

desired_coin_data = coin_data["efin"]

bitcore.Networks.add(desired_coin_data["mainnet"].network_data);

const AMOUNT = 2000

// Obtain this data from the daemon.
const UTXO = new bitcore.Transaction.UnspentOutput({
    "txid": "6a775b7647f22956be2ca0d86da8ab396ecd4c6f21cdd4fce4a8fabbd97f96b8",
    "vout": 0,
    "address": "RPN2AjG4KLU1wvXVEmVYwLrNKq2NNef9AV",
    "scriptPubKey": "a9149a7b9177d9142a5dbeb157ca61f1d0816d41557287",
    "amount": AMOUNT
});

const COIN = 100000000;

// At least 2 signatures required.
const THRESHOLD = 2;

const PUBLIC_KEYS = [
    new bitcore.PublicKey("02004067d5b5677bd67a9aa42007dcecb2290bbe2f39e9554c25ec457878613349"),
    new bitcore.PublicKey("020d4277f560946061f029d3d11525d8861afc61676e88674d3b9d1365451c4b1b"),
    new bitcore.PublicKey("024b87985fd0b5cbee675eb303bd6e37e208af724bb6decb34fa43805e5372e61e"),
]

const PRIVATE_KEYS = [
    new bitcore.PrivateKey.fromWIF("EgLpoWgJeZzhyF1BQChdNQpoC8Qba5YscnuNp2rNLwTntsXARViu"),
    new bitcore.PrivateKey.fromWIF("EdzmKvk2df523ZsgEFJEAg7Z7XsSWhLTAcYjKZwjFfNhDheuqc57"),
    new bitcore.PrivateKey.fromWIF("EfSXnHTWC9vALhe2kCxppN8tyRA73rVBbN4yR1oNkm7TESXbocQW"),
]

var multiSigTx = new bitcore.Transaction()
    .from(UTXO, PUBLIC_KEYS, THRESHOLD)
    .change("RPN2AjG4KLU1wvXVEmVYwLrNKq2NNef9AV")
    .to("EbQ3NpQ3zQ7eQNeC2vHL9519ZkDzY3dEPj", 1999 * COIN)
    .sign([PRIVATE_KEYS[0]]);

//assert(multiSigTx.isFullySigned())
console.log(multiSigTx.toString());

// Send this over the wire....
var serializedTxSign1 = multiSigTx.toObject();
console.log("Part 1: " + serializedTxSign1);

var signature = multiSigTx.getSignatures(PRIVATE_KEYS[0])[0]

console.log(multiSigTx.getSignatures(PRIVATE_KEYS[0]))

// Restore here...
var fullySignedMultiSigTx = new bitcore.Transaction(serializedTxSign1)
    .applySignature(signature)
    .sign([PRIVATE_KEYS[1]]);

assert(fullySignedMultiSigTx.isFullySigned())

console.log(fullySignedMultiSigTx.toString())
