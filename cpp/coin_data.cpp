#include <map>
#include "coin_data.h"    

typedef std::pair<std::string, std::string> coinnet_t;

static std::map<coinnet_t, coin_data> coin_data_map {
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
        .script_address = 0x7a,
        .pubkey_address_256 = 0x77,
        .script_address_256 = 0x7b,
        .secret_key = 0xfe, // e
        .ext_public_key = {0x04, 0x32, 0x4d, 0xe3}, // tfub
        .ext_secret_key = {0x04, 0x32, 0x46, 0x7f}, // tfpv
        .stealth_address = 0x15, // T
        .ext_key_hash = 0x89, // x
        .ext_acc_hash = 0x53, // a
        .bip44_id = (1 << 31) + 3715 // 3715'
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

uint32_t coin_data::get_public_key_prefix() const {
    return to_prefix(ext_public_key);
}
uint32_t coin_data::get_secret_key_prefix() const {
    return to_prefix(ext_secret_key);
}
const coin_data& coin_data::get_coin_data(const std::string& coin, const std::string& net) {
    return coin_data_map.at(coinnet_t(coin, net));
}

uint32_t coin_data::to_prefix(const uint8_t bytes[]) {
    return bytes[0] << 24 | bytes[1] << 16 | bytes[2] << 8 | bytes[3];
}
