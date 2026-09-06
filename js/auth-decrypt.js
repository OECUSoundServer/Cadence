const AUTH_SECRETS = {
    "2310e473ce07": "mAy8zRZmu64GjtGSqo9rknDgHGgc2tjy",
    "4bac26989b7c": "QuwADzDgLZtED7gcJDVzxwAjodxm3yrR",
    "564f5421ab8b": "MKwZQvGBDuWDtSSsD6dbqEqzrjHmo3C9",
    "462fd0aba531": "Xs7bE9w9SLUCkd6PyfbcFg4MPFu4VjB5",
    "73ffa65f98ea": "2LUxj8xPBSUp9zvWhuBaDEubEs6bPJDr",
    "4781a70c3387": "uUtMMQ4vskPNVNfcwGtxtajMRcWAoY7G",
    "fadc658b41f4": "xFEpk4pGiWfpY3de4c2d37aPo38QDi2c",
    "e38d78da1dd4": "fgideTYupkEiotpXaDs36N7jjKu64b69",
    "114b39c5d6e4": "PEdKP9XLUW8wMB5zKYKNtShynM9ApSf3",
    "8dbe8296cd26": "T6iRAyS8xzWro7KUorHpmHGfZd6yRxgh",
    "1dcd7453c0db": "LPo9pWyvVjsBDfwKZGPq2LaxYaGyJDPd",
    "2206548e1574": "v8cr4iDMuesb8AGuvZDUJSLeUmxq2oyt",
    "faad7fb3c4c4": "tLTAiusVWwkZFvaQMdehDRF6Rk4Y7czm",
    "291e47fe9e24": "vnQsp2kJ93DZeVgUtMru4BTqbu5GMNeq",
    "b16455826be9": "yVvs8qUGt4XEopzZ5USDSdgG3MLkKbek",
    "a8e61b0159c8": "xPZDxvQo3kVH8NHGZUv6dtWj93yxk9DR",
    "5c7bcb5b9c4c": "3dWPvLdaXFT9ttw5GdynfZ3z5ayKFoom",
    "3dedafdf8da3": "zwdYQjGa2PXQmQirwagxL9BmpWM8Hgis"
};

// ==========================================
// 商品情報を復号
// ==========================================
async function decryptProduct(
    encrypted
) {

    // 対応する復号キーを取得
    const secret =
        AUTH_SECRETS[
        encrypted.id
        ];


    if (!secret) {
        throw new Error(
            "復号キーがありません。"
        );
    }


    // AESキー生成
    const key =
        await createAesKey(
            secret
        );


    // HEX → Uint8Array
    const iv =
        hexToBytes(
            encrypted.iv
        );

    const data =
        hexToBytes(
            encrypted.data
        );


    // AES-GCM復号
    const decrypted =
        await crypto.subtle.decrypt(
            {
                name: "AES-GCM",
                iv: iv
            },
            key,
            data
        );


    // JSON文字列へ
    const json =
        new TextDecoder()
            .decode(decrypted);


    // オブジェクトへ
    return JSON.parse(json);
}


// ==========================================
// AES-256-GCMキー生成
//
// 復号キー文字列
// ↓
// SHA-256
// ↓
// AES-256キー
// ==========================================
async function createAesKey(
    secret
) {

    const source =
        new TextEncoder()
            .encode(secret);


    const hash =
        await crypto.subtle.digest(
            "SHA-256",
            source
        );


    return await crypto.subtle.importKey(
        "raw",
        hash,
        {
            name: "AES-GCM"
        },
        false,
        [
            "decrypt"
        ]
    );
}


// ==========================================
// HEX → Uint8Array
// ==========================================
function hexToBytes(hex) {

    if (
        typeof hex !== "string" ||
        hex.length % 2 !== 0
    ) {
        throw new Error(
            "不正なHEXデータです。"
        );
    }


    const bytes =
        new Uint8Array(
            hex.length / 2
        );


    for (
        let i = 0;
        i < bytes.length;
        i++
    ) {

        bytes[i] =
            parseInt(
                hex.slice(
                    i * 2,
                    i * 2 + 2
                ),
                16
            );
    }


    return bytes;
}