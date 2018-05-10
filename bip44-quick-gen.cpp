// Copyright (c) 2018 Rodimiro Cerrato
// Distributed under the Apache License Version 2.0

#include <iostream>
#include <unordered_map>
#include <string>
#include <bitcoin/bitcoin.hpp>
#include <boost/format.hpp>

using namespace bc;


#define COIN 100000000 // 10**8
#define DEFAULT_N_ACCOUNTS 4
#define DEFAULT_TOTAL_WALLET_AMOUNT 2000
#define DEFAULT_N_COINS_PER_ACCOUNT 10

typedef std::pair<std::string, std::string> coinnet_t;

struct base58_prefix {
    const uint8_t pubkey_address;
    const uint8_t script_address;
    const uint8_t pubkey_address_256;
    const uint8_t script_address_256;
    const uint8_t secret_key;
    const uint8_t ext_public_key[4];
    const uint8_t ext_secret_key[4];
    const uint8_t stealth_address;
    const uint8_t ext_key_hash;
    const uint8_t ext_acc_hash;
    const int bip44_id;

    static uint32_t to_prefix(const uint8_t bytes[]) {
        return bytes[0] << 24 | bytes[1] << 16 | bytes[2] << 8 | bytes[3];
    }
    uint32_t get_public_key_prefix() {
        return to_prefix(ext_public_key);
    }
    uint32_t get_secret_key_prefix() {
        return to_prefix(ext_secret_key);
    }
};

std::map<coinnet_t, base58_prefix> base58_prefix_map {
    {{"efin", "mainnet"}, {
        .pubkey_address = 0x21, // E
        .script_address = 0x3c, // TODO: define
        .pubkey_address_256 = 0x39, // TODO: define
        .script_address_256 = 0x3d, // TODO: define
        .secret_key = 0x5c, // E
        .ext_public_key = {0x01, 0x1c, 0x3b, 0xed}, // Efub
        .ext_secret_key = {0x01, 0x1c, 0x34, 0x88}, // Efpv
        .stealth_address = 0x14, // TODO: define
        .ext_key_hash = 0x4b, // X // TODO: define
        .ext_acc_hash = 0x17, // A // TODO: define
        .bip44_id = (1 << 31) + 0x90 // 144'
    }},
    {{"efin", "testnet"}, {
        .pubkey_address = 0x5c, // e
        .script_address = 0x3c, // TODO: define
        .pubkey_address_256 = 0x39, // TODO: define
        .script_address_256 = 0x3d, // TODO: define
        .secret_key = 0xfe, // e
        .ext_public_key = {0x04, 0x32, 0x4d, 0xe3}, // tfub
        .ext_secret_key = {0x04, 0x32, 0x46, 0x7f}, // tfpv
        .stealth_address = 0x14, // TODO: define
        .ext_key_hash = 0x4b, // X // TODO: define
        .ext_acc_hash = 0x17, // A // TODO: define
        .bip44_id = (1 << 31) + 0x01 // 1'
    }},
    {{"particl", "mainnet"}, {
        .pubkey_address = 0x38, // P
        .script_address = 0x3c,
        .pubkey_address_256 = 0x39,
        .script_address_256 = 0x3d,
        .secret_key = 0x6c, // H
        .ext_public_key = {0x69, 0x6e, 0x82, 0xd1}, // PPAR
        .ext_secret_key = {0x8f, 0x1d, 0xae, 0xb8}, // XPAR
        .stealth_address = 0x14, // TODO: define
        .ext_key_hash = 0x4b, // X // TODO: define
        .ext_acc_hash = 0x17, // A // TODO: define
        .bip44_id = (1 << 31) + 0x2c // 144'
    }},
    {{"particl", "testnet"}, {
        .pubkey_address = 0x76, // p
        .script_address = 0x7a,
        .pubkey_address_256 = 0x77,
        .script_address_256 = 0x7b,
        .secret_key = 0x2e,
        .ext_public_key = {0xe1, 0x42, 0x78, 0x00}, // ppar
        .ext_secret_key = {0x04, 0x88, 0x94, 0x78}, // xpar
        .stealth_address = 0x15, // T
        .ext_key_hash = 0x4b, // x
        .ext_acc_hash = 0x17, // a
        .bip44_id = (1 << 31) + 0x01 // 144'
    }}
};


int main(int argc, char* argv[]) {
    if (argc < 3) {
        std:cerr << "Syntax: wallet-get <coin> <net>" << std::endl;
        return -1;
    }
    const char* coin = argv[1];
    const char* net = argv[2];
    const auto n_accounts = argc > 3 ? atoi(argv[3]) : DEFAULT_N_ACCOUNTS;
    const auto total_wallet_amount = argc > 4 ? atoi(argv[4]) : DEFAULT_TOTAL_WALLET_AMOUNT;
    const auto n_coins_per_account = argc > 5 ? atoi(argv[5]) : DEFAULT_N_COINS_PER_ACCOUNT;

    auto& coin_prefixes = base58_prefix_map.at(coinnet_t(coin, net));

    //std::cout << "pubkey prefix: " << std::hex << coin_prefixes.get_public_key_prefix() << std::endl;

    const uint64_t custom_key_prefixes = wallet::hd_private::to_prefixes(
        coin_prefixes.get_secret_key_prefix(),
        coin_prefixes.get_public_key_prefix());

    data_chunk my_entropy(32);

    for (int i = 0; i < n_accounts; i++) {
        pseudo_random_fill(my_entropy);
        auto mnemonic_words = wallet::create_mnemonic(my_entropy);
        std::cout << boost::format("// %s") % bc::join(mnemonic_words) << std::endl;

        auto hd_seed = wallet::decode_mnemonic(mnemonic_words);
        data_chunk seed_chunk(to_chunk(hd_seed));

        //std::cout << "seed: " << encode_base16(hd_seed) << std::endl;

        wallet::hd_private m(seed_chunk, custom_key_prefixes);
        //std::cout << "BIP32 Root Key: " << m << std::endl;
        auto m_purpose = m.derive_private(wallet::hd_first_hardened_key + 44);
        auto m_coin = m_purpose.derive_private(coin_prefixes.bip44_id);
        auto m_account = m_coin.derive_private(wallet::hd_first_hardened_key + 0);
        auto m_ext = m_account.derive_private(0);

        /*
        std::cout << std::endl;
        std::cout << "Account extended PrvKey: " << m_account << std::endl;
        std::cout << "Account extended PubKey: " << m_account.to_public() << std::endl;
        std::cout << std::endl;
        std::cout << "BIP32 Extended Private Key: " << m_ext << std::endl;
        std::cout << "BIP32 Extended Public Key:  " << m_ext.to_public() << std::endl;
        std::cout << std::endl;
        */



        for (int i = 0; i < n_coins_per_account; i++) {
            auto mi = m_ext.derive_private(i);
            auto Mi = mi.to_public();

            //std::cout << boost::format("m/%d'/%d") % 0 % i << std::endl;
            
            //std::cout << "Public key: " << encode_base16(Mi.point()) << std::endl;
            
            auto pv_key = wallet::ec_private(
                mi.secret(),
                wallet::ec_private::to_version(
                    coin_prefixes.pubkey_address, coin_prefixes.secret_key));

            //std::cout << "Private key: " << pv_key << std::endl;
            
            auto payment_addr = pv_key.to_payment_address();
            //std::cout << "Address: " << payment_addr.encoded() << std::endl;

            auto pubkey_hash = bitcoin_short_hash(mi.point());
            //std::cout << "Public Key HASH: " << encode_base16(pubkey_hash) << std::endl;

            auto amount = (unsigned long)total_wallet_amount / n_coins_per_account;
            std::cout << boost::format("std::make_pair(\"%s\", %u * COIN),") % encode_base16(pubkey_hash) % (amount) << std::endl;

            //std::cout << std::endl;
        }

        std::cout << std::endl;
    }

    return 0;
}

