const fs = require('fs');

const sha256 = require('js-sha256');
const ripemd160 = require('ripemd160');

const bitcore = require('bitcore-lib');
const Mnemonic = require('bitcore-mnemonic')
const coin_data = require('./coin-data.js').coin_data

desired_coin_data = coin_data["efin"]

bitcore.Networks.add(desired_coin_data["mainnet"].network_data);

if (process.argv.length < 6) {
    console.log("Syntax: genesis-block-gen.js <n_accounts> <n_coins_per_account> <mne_file> <addr_file>")
    process.exit(1);
}

const n_accounts = parseInt(process.argv[2]);
const n_coins_per_account = parseInt(process.argv[3])
const mne_file = process.argv[4];
const addr_file = process.argv[5];

for (var j = 0; j < n_accounts; j++) {
    var code = new Mnemonic(256);
    fs.writeFileSync(mne_file, code.toString() + "\n", {flag: 'a'});
    var hdPrivateKey = code.toHDPrivateKey("", "efin/mainnet"); // empty passphrase

    var derivationPath = hdPrivateKey
        .derive(44, true)
        .derive(coin_data["efin"]["mainnet"].bip44_id, true)
        .derive(0, true)
        .derive(0);
    for (var i = 0; i < n_coins_per_account; i++) {
        var myPath = derivationPath.derive(i)
        var privKey = myPath.privateKey;
	var address = privKey.toAddress().toString();

	fs.writeFileSync(addr_file, address + '\n', {flag: 'a'});
    }
    fs.writeFileSync(addr_file, '\n', {flag: 'a'});
}

