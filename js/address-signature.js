const bitcore = require('bitcore-lib');
const Message = require("bitcore-message");
const Mnemonic = require('bitcore-mnemonic')
const readline = require("readline")

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true
})

const TPAY_MESSAGE_MAGIC = 'TokenPay Signed Message:\n';
Message.MAGIC_BYTES = new Buffer(TPAY_MESSAGE_MAGIC);

//rl.on('line', function(words) {
    words = 'slim person axis since east category clump sword pen mechanic worry lens reject episode dash strong spice proud settle ride trap own transfer sibling';
    if (words.trim().length == 0) {
        // Create random words
    }
    //var code = new Mnemonic(256);
    var code = new Mnemonic(words);
    console.log(code.toString())

    coin_data = {
        "tpay": {
            "mainnet": {
                network_data: {
                    name: 'tpay/mainnet',
                    alias: 'tpay livenet',
                    pubkeyhash: 0x41,
                    privatekey: 0xb3,
                    scripthash: 0x7e,
                    xpubkey: 0x0488B21E,
                    xprivkey: 0x0488ADE4
                },
                bip44_id: 265
            }
        }
    }

    desired_coin_data = coin_data["tpay"]

    bitcore.Networks.add(desired_coin_data["mainnet"].network_data);

    var hdPrivateKey = code.toHDPrivateKey("", "tpay/mainnet"); // empty passphrase

    console.log("BIP32 Root Key: " + hdPrivateKey.toString())
    var derivationPath = hdPrivateKey
        .derive(44, true)
        .derive(coin_data["tpay"]["mainnet"].bip44_id, true)
        .derive(0, true)
        .derive(0);

    const addressSignatures = []
    for (var i = 0; i < 1; i++) {
        //var privKey = new bitcore.PrivateKey("tokenpay/mainnet");
        //var pubKey = privKey.toPublicKey();
        var myPath = derivationPath.derive(i)
        var privKey = myPath.privateKey;
        var address = privKey.toAddress().toString();
        var fullMessage = /*String.fromCharCode(0x19) + TPAY_MESSAGE_MAGIC + '"' +*/ address;
        var hexFullMessage = '';
        for (var i = 0; i < fullMessage.length; i++) {
            hexFullMessage += "0x" + fullMessage.charCodeAt(i).toString(16) + ", ";
        }
        console.log(hexFullMessage);
        //console.log(address);
        //console.log(privKey)
        //var signature = Message(fullMessage).sign(privKey);
        
        //signature from TPAY daemon
        //var signature = 'HzRHw0ExiHPZr4WNeDIjqXKwqJjnldNHGLfKhlKHeByWBKKteg9a1VjNl+UjNmSHb8cNTip7v+rNhnphVK1UOZI='
        var signature = 'IGtn/5TvfUdsY89uIWlC+x8+HrDPqDNM7fRXGglKx3UaA9LbFrpo80gPBcZt2kuFKBWGv4VYXX3Gsmy4bAQYWr8='
        
        //var signature = 'IKRhRHP/CRYBdemr0fHjOaNB9Q1Taf3ym37qkfbq3Xq8CXfslq7ivxbBD8tF3NJ7yeI8QqoNVY8jAnQS3m8dgqc=';
        
        //signature con fromCharCode
        //var signature = 'H9Ona2PVfT7jodC6jH2V1KqagpzUMi6HU3d5+A4qoR8vPCwwczDKjUpNElzNxF9gyxTzN8Dsm9+4FB1JuT7cOfY=';

        addressSignatures.push({
            address: address.toString(),
            signature: signature,
            verify: Message(fullMessage).verify(address, signature)
        })
    }
    console.log(JSON.stringify({
        addressSignatures: addressSignatures
    }, null, 2));


//})

