const bitcore = require('bitcore-lib');
const Mnemonic = require('bitcore-mnemonic')

const words = "kit youth enroll gravity inform coil life response over collect shrimp fashion desk million differ style october hill first fiscal reform among fiscal word"

const code = new Mnemonic(words);

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

const net = bitcore.Networks.get(1, "privatekey")
console.log(net.name)

var hdPrivateKey = code.toHDPrivateKey("", "efin/mainnet"); // empty passphrase
console.log(hdPrivateKey.xprivkey)

var transaction = new bitcore.Transaction()
    .to("EUuMV5Y59D5THkkRPYE9edR8oYEGAzhZGs", 5)
    .change("EgRYJ8U5GTmwc7gdGDFgyBaDdZozha6Aft")
    .sign(hdPrivateKey.xprivkey);

console.log(transaction.serialize())
