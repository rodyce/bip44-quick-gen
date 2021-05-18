module.exports = {
  coin_data: {
    efin: {
      mainnet: {
        network_data: {
          name: "efin/mainnet",
          alias: "efin livenet",

          pubkeyhash: 0x21,
          privatekey: 0x5c,
          scripthash: 0x3c,
          xpubkey: 0x011c3bed,
          xprivkey: 0x011c3488,
        },
        bip44_id: 3714, // 3714'
      },
      testnet: {
        network_data: {
          name: "efin/testnet",
          alias: "efin testnet",

          pubkeyhash: 0x5c,
          privatekey: 0xfe,
          scripthash: 0x7a,
          xpubkey: 0x04324de3,
          xprivkey: 0x0432467f,
        },
        bip44_id: 3715, // 3715'
      },
    },
    tpay: {
      mainnet: {
        network_data: {
          name: "tpay/mainnet",
          alias: "tpay livenet",
          pubkeyhash: 0x41,
          privatekey: 0xb3,
          scripthash: 0x7e,
          xpubkey: 0x0488b21e,
          xprivkey: 0x0488ade4,
        },
        bip44_id: 265,
      },
    },
    xvg: {
      mainnet: {
        network_data: {
          name: "verge/mainnet",
          alias: "verge livenet",
          pubkeyhash: 0x1e,
          privatekey: 0xb3,
          scripthash: 0x21,
          xpubkey: 0x0488b21e,
          xprivkey: 0x0488ade4,
          wif: 0x9e,
        },
        bip44_id: 77,
      },
    },
  },
};
