/* ==============================
   商品マスタ
============================== */

const productMaster = [
    {
        id: 'cd_001',
        // data.jsonとの紐付けに使用
        catalogNumber: 'CAD-0002',
        type: 'CD',
        price: 500,
        cover: 'https://oecusoundserver.github.io/Cadence/img/ToyBox.png',
        description: 'オリジナルボーカロイドCD',
        youtube: 'https://youtu.be/DidxJFvEYZg?si=1lCJDK_yd18yvNaT'
    },
    {
        id: 'cd_002',
        catalogNumber: 'CAD-0004',
        type: 'CD',
        price: 500,
        cover: 'https://oecusoundserver.github.io/Cadence/img/PrettyFurry.png',
        description: 'ごちゃ混ぜゲーム曲アレンジCD',
        youtube: 'https://youtu.be/ck2NRAJL3kc?si=dqzebT6rnRzYQB_b'
    },
    {
        id: 'cd_003',
        catalogNumber: 'CAD-0005',
        type: 'CD',
        price: 500,
        cover: 'https://oecusoundserver.github.io/Cadence/img/YouthfulBlue.png',
        description: 'ブルーアーカイブアレンジCD',
        youtube: 'https://youtu.be/fsrpkF9r1LI?si=YIT8BmdC1xeFYZlr'
    },
    {
        id: 'cd_004',
        catalogNumber: 'CAD-0006',
        type: 'CD',
        price: 500,
        cover: 'https://oecusoundserver.github.io/Cadence/img/shintyoku_rogo.png',
        description: '東方ProjectアレンジCD',
        youtube: 'https://youtu.be/hB7p5bqToeE?si=zXzWjlxDZE9zqPKQ'
    },
    {
        id: 'cd_005',
        catalogNumber: 'CAD-0007',
        type: 'CD',
        price: 500,
        cover: 'https://oecusoundserver.github.io/Cadence/img/touhou_logo.png',
        description: '参加者を呼んで緩くアレンジした東方ProjectアレンジCD',
        youtube: 'https://youtu.be/b0_rX9W06_s?si=rKeoqewbNCofJHHD'
    },
    {
        id: 'cd_006',
        catalogNumber: 'CAD-0008',
        type: 'CD',
        price: 500,
        cover: 'https://oecusoundserver.github.io/Cadence/img/Refrain.png',
        description: 'ChangedアレンジCD',
        youtube: 'https://youtu.be/z9lboUb1z7E?si=Zu7-mTdoQXBCmMUH'
    },
    {
        id: 'cd_007',
        catalogNumber: 'CAD-0009',
        type: 'CD',
        price: 500,
        cover: 'https://oecusoundserver.github.io/Cadence/img/RebootingWorld.png',
        description: 'OneShotアレンジCD',
        youtube: 'https://youtu.be/pilBHEwTxRA?si=0y53TxFhC2_RPQuY'
    },
    {
        id: 'cd_008',
        catalogNumber: 'CAD-0010',
        type: 'CD',
        price: 500,
        cover: 'https://oecusoundserver.github.io/Cadence/img/FurryParade.png',
        description: 'ごちゃ混ぜアレンジ第2弾、賑やか目アレンジ',
        youtube: 'https://youtu.be/x9Wx50aGr0E?si=p41zIbYHyL7vX7oD'
    },
    {
        id: 'cd_009',
        catalogNumber: 'CAD-0011',
        type: 'CD',
        price: 500,
        cover: 'https://oecusoundserver.github.io/Cadence/img/airride_Logo.png',
        description: 'カービィのエアライド限定アレンジCD',
        youtube: 'https://youtu.be/yDVMZ9w04u4?si=RNuV9hvL5mue3K_W'
    },
    {
        id: 'cd_010',
        catalogNumber: 'CAD-0012',
        type: 'CD',
        price: 500,
        cover: 'https://oecusoundserver.github.io/Cadence/img/klonoa_Logo.png',
        description: '風のクロノアシリーズ限定アレンジCD',
        youtube: 'https://youtu.be/wlE19r9OS7s?si=7_FqDMOMo-hbSv-g'
    },
    {
        id: 'cd_011',
        catalogNumber: 'CAD-0013',
        type: 'CD',
        price: 500,
        cover: 'https://oecusoundserver.github.io/Cadence/img/REVERIE.png',
        description: 'Changed × 癒しをテーマとしたCD',
        youtube: 'https://youtu.be/vGJRD4v3weA?si=_rgcrvM168qhkKv9'
    },
    {
        id: 'cd_012',
        catalogNumber: 'CAD-0014',
        type: 'CD',
        price: 500,
        cover: 'https://oecusoundserver.github.io/Cadence/img/Touhou_Yuyake_logo.png',
        description: '東方Project限定アレンジCD',
        youtube: 'https://youtu.be/rkPlHE93rdw?si=A-aksGl2ZCcN4yWw'
    },
    {
        id: 'cd_013',
        catalogNumber: 'CAD-0015',
        type: 'CD',
        price: 300,
        cover: 'https://oecusoundserver.github.io/Cadence/img/Baishou_CD.png',
        description: '有兽焉限定アレンジCD',
        youtube: 'https://youtu.be/oEkwSVpVgM8?si=If-lHvVNY2L59dEH'
    },
    {
        id: 'cd_014',
        catalogNumber: 'CAD-0016',
        type: 'CD',
        price: 500,
        cover: 'https://oecusoundserver.github.io/Cadence/img/FutureMap_logo.png',
        description: '秘封倶楽部限定アレンジCD',
        youtube: 'https://youtu.be/M7SkJLGBtVk?si=DH9etyGy95X0SGgk'
    },
    {
        id: 'cd_015',
        catalogNumber: 'CAD-0017',
        type: 'CD',
        price: 500,
        cover: 'https://oecusoundserver.github.io/Cadence/img/attitude_logo.png',
        description: 'おしゃれ？をテーマとした東方Project限定アレンジCD',
        youtube: 'https://youtu.be/D87h-ncuW-M?si=KBFTRt6UHyrQ01ko'
    },
    {
        id: 'book_001',
        catalogNumber: 'CADB-0001',
        name: 'RECORD',
        type: 'BOOK',
        price: 500,
        cover: 'https://oecusoundserver.github.io/Cadence/img/Record.png',
        releaseDate: '2026-10-18',
        description: 'Changedフルカラーイラスト本/20P',
        samples: [
            'https://oecusoundserver.github.io/Cadence/img/Record_Sample_1.png',
            'https://oecusoundserver.github.io/Cadence/img/Record_Sample_2.png',
            'https://oecusoundserver.github.io/Cadence/img/Record_Sample_3.png',
            'https://oecusoundserver.github.io/Cadence/img/Record_Sample_4.png',
        ]
    },
    {
        id: 'book_002',
        catalogNumber: 'CADB-0002',
        name: '百兽日常',
        type: 'BOOK',
        price: 500,
        cover: 'https://oecusoundserver.github.io/Cadence/img/BaiShou_logo.png',
        releaseDate: '2026-10-18',
        description: '有兽焉フルカラーイラスト本/20P',
        samples: [
            'https://oecusoundserver.github.io/Cadence/img/BaiShou_Sample_1.png',
            'https://oecusoundserver.github.io/Cadence/img/BaiShou_Sample_2.png',
            'https://oecusoundserver.github.io/Cadence/img/BaiShou_Sample_3.png',
            'https://oecusoundserver.github.io/Cadence/img/BaiShou_Sample_4.png',
        ]
    },
];

/* ==============================
   セットマスタ
============================== */
const setMaster = [
    {
        id: 'set_001',

        name:
            'Changed 新譜＋旧譜セット',

        requires: {
            cd_006: 1,
            cd_011: 1
        },

        setPrice:
            800
    },

    {
        id: 'set_002',

        name:
            'Changed 新譜＋イラスト本セット',

        requires: {
            cd_011: 1,
            book_001: 1
        },

        setPrice:
            800
    },

    {
        id: 'set_003',

        name:
            'Changed 旧譜＋イラスト本セット',

        requires: {
            cd_006: 1,
            book_001: 1
        },

        setPrice:
            800
    },

    {
        id: 'set_004',

        name:
            'Changed コンプリートセット',

        requires: {
            cd_006: 1,
            cd_011: 1,
            book_001: 1
        },

        setPrice:
            1200
    }
];

/* ==============================
   イベント設定
============================== */
const events = {
    '1': {
        name:
            '東方紅楼夢22',

        productIds: [
            'cd_001',
            'cd_002',
            'cd_003',
            'cd_004',
            'cd_005',
            'cd_006',
            'cd_007',
            'cd_008',
            'cd_009',
            'cd_010',
            'cd_011',
            'cd_012',
            'cd_013',
            'cd_014',
            'cd_015',
            'cd_016',
        ],
        setIds: []
    },


    '2': {
        name:
            '京都合同',

        productIds: [
            'cd_006',
            'cd_011'
        ],
        setIds: [
            'set_001'
        ]
    }
};

const urlParams =
    new URLSearchParams(
        location.search
    );


const eventId =
    urlParams.get('ev')
    || '1';


const registerId =
    urlParams.get('reg')
    || 'demo';


const selectedEvent =
    events[eventId];


if (!selectedEvent) {
    throw new Error(
        `イベントID ${eventId} は存在しません。`
    );
}


const eventData = {
    eventId:
        eventId,

    name:
        selectedEvent.name,

    registerId:
        registerId,

    productIds:
        selectedEvent.productIds,

    sets:
        selectedEvent.setIds
            .map(setId => {
                return setMaster.find(
                    set => {
                        return (
                            set.id
                            === setId
                        );
                    }
                );
            })
            .filter(set => {
                return set;
            })
};

/* ==============================
   Cadence 楽曲データ
============================== */

const MUSIC_DATA_URL =
    'https://oecusoundserver.github.io/Cadence/data.json';


let musicData = [];


/**
 * Cadenceのdata.jsonを読み込む
 */
async function loadMusicData() {
    try {
        const response =
            await fetch(MUSIC_DATA_URL);

        if (!response.ok) {
            throw new Error(
                `HTTP ${response.status}`
            );
        }

        musicData =
            await response.json();


        console.log(
            `楽曲データ ${musicData.length}件を読み込みました。`
        );

        return true;
    }
    catch (error) {
        console.error(
            '楽曲データの取得に失敗しました。',
            error
        );

        musicData = [];

        return false;
    }
}


/**
 * 型番から収録曲を取得
 *
 * @param {string} catalogNumber 型番
 * @return {Array}
 */
function getAlbumTracks(catalogNumber) {
    return musicData
        .filter(track => {
            return track['型番'] === catalogNumber;
        })
        .sort((a, b) => {

            const numberA =
                parseInt(a['番号'], 10);

            const numberB =
                parseInt(b['番号'], 10);


            if (
                Number.isNaN(numberA)
                || Number.isNaN(numberB)
            ) {
                return 0;
            }


            return numberA - numberB;
        });
}


/**
 * 型番からアルバム情報を取得
 *
 * @param {string} catalogNumber 型番
 * @return {Object|null}
 */
function getAlbumInfo(catalogNumber) {
    const tracks =
        getAlbumTracks(catalogNumber);


    if (!tracks.length) {
        return null;
    }


    return {
        catalogNumber:
            catalogNumber,

        albumName:
            tracks[0]['アルバム名'],

        releaseDate:
            tracks[0]['発行日'],

        tracks:
            tracks
    };
}


/**
 * 商品情報と楽曲データを結合
 *
 * @param {Object} product 商品情報
 * @return {Object}
 */
function getProductData(product) {
    /*
     * CD以外はdata.jsonとの結合を行わない
     */
    if (
        product.type !== 'CD'
        || !product.catalogNumber
    ) {
        return {
            ...product,
            tracks: []
        };
    }


    const album =
        getAlbumInfo(
            product.catalogNumber
        );


    /*
     * data.jsonに型番が存在しない場合
     */
    if (!album) {
        return {
            ...product,

            name:
                product.name
                || product.catalogNumber,

            releaseDate:
                null,

            tracks:
                []
        };
    }


    /*
     * 商品データとdata.jsonを結合
     */
    return {
        ...product,

        name:
            album.albumName,

        releaseDate:
            album.releaseDate,

        tracks:
            album.tracks
    };
}

const K = 'cadence-pos-demo-sales';

let cart = {};
let zoom = 100;

const yen = n => '¥' + n.toLocaleString('ja-JP');

let products = [];
let pmap = {};

/**
 * カートの最安価格を計算
 */
/**
 * カートの金額を計算
 *
 * @return {Object}
 */
function calc() {
    /*
     * 通常価格を計算
     */
    let subtotal = 0;

    for (
        const [id, quantity]
        of Object.entries(cart)
    ) {
        subtotal +=
            pmap[id].price * quantity;
    }


    /*
     * 最安になるセットの組み合わせを探索
     */
    const result =
        findBestSetCombination({
            ...cart
        });


    const total =
        result.total;


    const discount =
        subtotal - total;


    return {
        subtotal,
        discount,
        total,

        labels:
            result.appliedSets.map(set => {
                return `${set.name} ×${set.count}`;
            }),

        appliedSets:
            result.appliedSets
    };
}


/**
 * 最安になるセットの組み合わせを探索
 *
 * @param {Object} remaining 残っている商品
 * @return {Object}
 */
function findBestSetCombination(remaining) {
    /*
     * 全商品を単品で購入した場合の金額
     */
    let singleTotal = 0;

    for (
        const [id, quantity]
        of Object.entries(remaining)
    ) {
        /*
         * 数量0の商品は無視
         */
        if (quantity <= 0) {
            continue;
        }


        /*
         * 商品が存在しない場合は無視
         */
        if (!pmap[id]) {
            console.warn(
                `商品ID ${id} がpmapに存在しません。`
            );

            continue;
        }


        singleTotal +=
            pmap[id].price * quantity;
    }


    /*
     * 初期状態では全部単品
     */
    let bestResult = {
        total:
            singleTotal,

        appliedSets:
            []
    };


    /*
     * 登録されているセットをすべて試す
     */
    for (const set of eventData.sets) {

        /*
         * このセットを作れない場合
         */
        if (
            !canApplySet(
                remaining,
                set
            )
        ) {
            continue;
        }


        /*
         * 現在の商品数をコピー
         */
        const nextRemaining = {
            ...remaining
        };


        /*
         * セットに使った商品を減らす
         */
        for (
            const [id, quantity]
            of Object.entries(set.requires)
        ) {
            nextRemaining[id] =
                (nextRemaining[id] || 0)
                - quantity;
        }


        /*
         * 残った商品について
         * さらに最安値を探索
         */
        const nextResult =
            findBestSetCombination(
                nextRemaining
            );


        /*
         * 今回のセット価格
         * ＋
         * 残った商品の最安価格
         */
        const candidateTotal =
            set.setPrice
            + nextResult.total;


        /*
         * 現在より安くなる場合のみ採用
         */
        if (
            candidateTotal
            < bestResult.total
        ) {
            bestResult = {
                total:
                    candidateTotal,

                appliedSets:
                    addAppliedSet(
                        nextResult.appliedSets,
                        set
                    )
            };
        }
    }


    return bestResult;
}


/**
 * セットを適用できるか確認
 *
 * @param {Object} remaining 残っている商品
 * @param {Object} set セット情報
 * @return {boolean}
 */
function canApplySet(
    remaining,
    set
) {
    for (
        const [id, quantity]
        of Object.entries(set.requires)
    ) {
        if (
            (remaining[id] || 0)
            < quantity
        ) {
            return false;
        }
    }


    return true;
}


/**
 * 適用されたセットを追加
 *
 * 同じセットが複数回使われた場合は
 * countを増やす
 *
 * @param {Array} appliedSets 適用済みセット
 * @param {Object} set 追加するセット
 * @return {Array}
 */
function addAppliedSet(
    appliedSets,
    set
) {
    const result =
        appliedSets.map(item => ({
            ...item
        }));


    const existing =
        result.find(item => {
            return item.id === set.id;
        });


    if (existing) {
        existing.count++;
    }
    else {
        result.push({
            id:
                set.id,

            name:
                set.name,

            count:
                1
        });
    }


    return result;
}

/**
 * 商品一覧・カート情報を描画
 */
function render() {
    document.querySelector('#eventName').textContent =
        eventData.name;


    /*
     * 商品一覧
     *
     * eventData.products ではなく、
     * data.jsonと結合済みの products を使用する
     */
    document.querySelector('#products').innerHTML =
        products.map(p => `
            <article class="card">

                <img
                    class="cover addByImage"
                    data-id="${p.id}"
                    src="${p.cover}"
                    alt="${p.name || ''}"
                >

                <div class="cardBody">

                    <div class="name">
                        ${p.name || 'タイトル未取得'}
                    </div>

                    <div class="price">
                        ${yen(p.price)}
                    </div>


                    <div class="actions">

                        <button
                            class="remove"
                            data-id="${p.id}"
                            ${cart[p.id] ? '' : 'disabled'}
                        >
                            −1
                        </button>

                        <span class="quantity">
                            ${cart[p.id] || 0}
                        </span>

                        <button
                            class="add"
                            data-id="${p.id}"
                        >
                            ＋1
                        </button>

                        <button
                            class="info"
                            data-id="${p.id}"
                        >
                            ⓘ
                        </button>

                    </div>

                    ${cart[p.id]
                ? `
                                <div class="qty">
                                    選択中 ×${cart[p.id]}
                                </div>
                            `
                : ''
            }

                </div>

            </article>
        `).join('');


    /*
     * カート内の商品数
     */
    const cartCount =
        Object.values(cart).reduce(
            (total, quantity) => {
                return total + quantity;
            },
            0
        );


    /*
     * 金額計算
     */
    const calculation =
        calc();


    /*
     * カート個数
     */
    document.querySelector(
        '#cartCount'
    ).textContent =
        cartCount;


    /*
     * 合計金額
     */
    document.querySelector(
        '#cartTotal'
    ).textContent =
        yen(calculation.total);


    /*
     * セット割引
     */
    document.querySelector(
        '#discountText'
    ).textContent =
        calculation.discount
            ? `セット割引 -${yen(calculation.discount)}`
            : '';


    /*
     * 商品が0個なら会計ボタンを無効化
     */
    document.querySelector(
        '#checkoutBtn'
    ).disabled =
        cartCount === 0;


    /*
     * 商品カードのイベントを再設定
     */
    bindCards();
}


/**
 * 商品をカートへ追加
 */
function add(id) {
    cart[id] = (cart[id] || 0) + 1;

    render();
}

function remove(id) {
    if (!cart[id]) {
        return;
    }

    cart[id]--;

    if (cart[id] <= 0) {
        delete cart[id];
    }

    render();
}


/**
 * 商品カードのイベントを設定
 */
function bindCards() {
    document
        .querySelectorAll('.add,.addByImage')
        .forEach(b => {
            b.onclick = () => {
                add(b.dataset.id);
            };
        });

    document
        .querySelectorAll('.info')
        .forEach(b => {
            b.onclick = () => {
                showDetail(b.dataset.id);
            };
        });

    document
        .querySelectorAll('.remove')
        .forEach(button => {

            button.onclick = () => {
                remove(button.dataset.id);
            };

        });
}


/**
 * 商品詳細を表示
 */
function showDetail(id) {
    const p =
        pmap[id];

    const d =
        document.querySelector(
            '#detailBody'
        );


    d.innerHTML = `
        <img
            class="detailCover"
            src="${p.cover}"
            alt="${p.name}"
        >

        <h2>
            ${p.name}
        </h2>

        ${p.catalogNumber
            ? `
                    <div class="muted">
                        ${p.catalogNumber}
                    </div>
                `
            : ''
        }

        <h3>
            ${yen(p.price)}
        </h3>

        ${p.releaseDate
            ? `
                    <div class="muted">
                        発行日：${p.releaseDate}
                    </div>
                `
            : ''
        }

        <p>
            ${p.description || ''}
        </p>


        ${p.type === 'CD' && p.tracks?.length
            ? `
                    <h3>
                        収録曲
                    </h3>

                    <ol class="tracks">

                        ${p.tracks.map(track => `
                            <li class="track">

                                <b>
                                    ${String(track['番号']).padStart(2, '0')}
                                    ${track['曲名']}
                                </b>

                                <div class="muted">
                                    ${track['アーティスト名']}
                                </div>

                                <div class="muted">
                                    原曲：${track['原曲名']}
                                </div>

                            </li>
                        `).join('')}

                    </ol>
                `
            : ''
        }


        ${p.type === 'BOOK' && p.samples?.length
            ? `
                    <h3>
                        サンプル
                    </h3>

                    <div class="sampleList">

                        ${p.samples.map(
                (image, index) => `
                                <button
                                    class="sampleImageButton"
                                    data-image="${image}"
                                    type="button"
                                >
                                    <img
                                        class="sampleImage"
                                        src="${image}"
                                        alt="${p.name} サンプル ${index + 1}"
                                    >
                                </button>
                            `
            ).join('')}

                    </div>
                `
            : ''
        }


        ${p.type === 'CD' && p.youtube
            ? `
                    <button
                        class="wide youtube"
                        id="ytBtn"
                    >
                        ▶ YouTubeで試聴（オンライン）
                    </button>
                `
            : ''
        }


        <button
            class="wide primary"
            id="detailAdd"
        >
            この商品を ＋1
        </button>
    `;


    /*
     * 商品追加
     */
    document.querySelector(
        '#detailAdd'
    ).onclick = () => {

        add(id);

        document.querySelector(
            '#detailDialog'
        ).close();
    };


    /*
     * YouTube試聴
     */
    const youtubeButton =
        document.querySelector(
            '#ytBtn'
        );


    if (youtubeButton) {
        youtubeButton.onclick = () => {

            if (navigator.onLine) {
                window.open(
                    p.youtube,
                    '_blank',
                    'noopener'
                );
            }
            else {
                alert(
                    '現在オフラインです。'
                    + 'YouTube試聴には通信が必要です。'
                );
            }

        };
    }


    /*
     * 本のサンプル画像
     */
    document
        .querySelectorAll(
            '.sampleImageButton'
        )
        .forEach(button => {

            button.onclick = () => {
                showSampleImage(
                    button.dataset.image
                );
            };

        });


    /*
     * 商品詳細を開く
     */
    document.querySelector(
        '#detailDialog'
    ).showModal();
}


/**
 * 会計確認画面
 */
function checkout() {
    let x =
        calc();


    console.log(
        '===== 会計デバッグ ====='
    );

    console.log(
        'cart:',
        cart
    );

    console.log(
        'sets:',
        eventData.sets
    );

    console.log(
        'calculation:',
        x
    );


    document.querySelector(
        '#checkoutBody'
    ).innerHTML =

        Object.entries(cart)
            .map(([id, q]) => `
                <div class="line">

                    <span>
                        ${pmap[id].name} ×${q}
                    </span>

                    <b>
                        ${yen(pmap[id].price * q)}
                    </b>

                </div>
            `)
            .join('')

        +

        (
            x.discount
                ? `
                    <div class="line discount">

                        <span>
                            ${x.labels.join(' / ')}
                        </span>

                        <b>
                            -${yen(x.discount)}
                        </b>

                    </div>
                `
                : ''
        )

        +

        `
            <div class="line totalLine">

                <span>
                    合計
                </span>

                <span>
                    ${yen(x.total)}
                </span>

            </div>
        `;


    document.querySelector(
        '#checkoutDialog'
    ).showModal();
}


/**
 * 保存済み販売データを取得
 */
function sales() {
    return JSON.parse(
        localStorage.getItem(K) || '[]'
    );
}


/**
 * 販売データを保存
 */
function saveSales(v) {
    localStorage.setItem(
        K,
        JSON.stringify(v)
    );
}


/**
 * 会計確定
 */
function confirmSale() {
    let x = calc();
    let s = sales();

    s.push({
        transactionId:
            crypto.randomUUID(),

        eventId:
            eventData.eventId,

        registerId:
            eventData.registerId,

        timestamp:
            new Date().toISOString(),

        items:
            Object.entries(cart).map(
                ([productId, quantity]) => ({
                    productId,
                    quantity
                })
            ),

        pricing: {
            subtotal: x.subtotal,
            discount: x.discount,
            total: x.total
        },

        appliedSets:
            x.appliedSets.map(
                set => ({
                    setId:
                        set.id,

                    quantity:
                        set.count
                })
            )
    });


    saveSales(s);

    cart = {};


    document.querySelector(
        '#checkoutDialog'
    ).close();


    render();

    alert(
        '会計を記録しました'
    );
}


/**
 * 売上集計
 */
function stats() {
    let s = sales();

    let total = s.reduce(
        (a, b) => a + b.pricing.total,
        0
    );

    let qty = s.reduce(
        (a, b) =>
            a + b.items.reduce(
                (x, i) => x + i.quantity,
                0
            ),
        0
    );


    return {
        count: s.length,
        total,
        qty
    };
}


/**
 * メニュー表示
 */
function showMenu() {
    let s = stats();

    document.querySelector(
        '#menuStats'
    ).innerHTML = `
        <b>
            ${eventData.name}
        </b>

        <div>
            端末：${eventData.registerId}
        </div>

        <div>
            会計 ${s.count}件 /
            頒布 ${s.qty}点 /
            売上 ${yen(s.total)}
        </div>
    `;


    document.querySelector(
        '#menuDialog'
    ).showModal();
}

/**
 * セットIDからセット情報を取得
 *
 * @param {string} setId セットID
 * @return {Object|null}
 */
function getSetById(setId) {
    return (
        eventData.sets.find(
            set => {
                return set.id === setId;
            }
        )
        || null
    );
}


/**
 * 適用されたセットを表示用文字列へ変換
 *
 * 新形式：
 * {
 *     setId: 'set_001',
 *     quantity: 1
 * }
 *
 * 旧形式：
 * "セット名 ×1"
 *
 * の両方に対応する
 *
 * @param {Object} transaction 取引
 * @return {string}
 */
function getAppliedSetText(transaction) {
    const appliedSets =
        transaction.appliedSets || [];


    return appliedSets
        .map(appliedSet => {

            /*
             * 旧形式
             */
            if (
                typeof appliedSet
                === 'string'
            ) {
                return appliedSet;
            }


            /*
             * 新形式
             */
            const set =
                getSetById(
                    appliedSet.setId
                );


            const name =
                set
                    ? set.name
                    : appliedSet.setId;


            return (
                `${name} ×${appliedSet.quantity}`
            );
        })
        .join(' / ');
}

/**
 * 販売履歴
 */
function history() {
    const s =
        sales()
            .slice()
            .reverse();


    document.querySelector(
        '#historyBody'
    ).innerHTML =

        s.length

            ? s.map(transaction => {

                const setText =
                    getAppliedSetText(
                        transaction
                    );


                return `
                    <div class="historyItem">

                        <strong>
                            ${new Date(
                    transaction.timestamp
                ).toLocaleString(
                    'ja-JP'
                )
                    }
                            　
                            ${yen(transaction.pricing.total)}
                        </strong>

                        <div>
                            ${transaction.items
                        .map(item => {
                            return (
                                `${pmap[item.productId]?.name
                                || item.productId
                                } ×${item.quantity}`
                            );
                        })
                        .join('<br>')
                    }
                        </div>

                        ${setText
                        ? `
                                    <div class="historySet">
                                        セット：${setText}
                                    </div>
                                `
                        : ''
                    }

                    </div>
                `;
            }).join('')

            : '履歴はありません';


    document.querySelector(
        '#historyDialog'
    ).showModal();
}


/**
 * 売上共有用データを作成
 *
 * JSON出力・URL共有の両方で使用する
 *
 * @return {Object}
 */
function createSalesPayload() {
    return {
        schemaVersion:
            1,

        eventId:
            eventData.eventId,

        registerId:
            eventData.registerId,

        exportedAt:
            new Date().toISOString(),

        transactions:
            sales()
    };
}


/**
 * 売上データをマージ
 *
 * transactionIdが同じ取引は
 * 重複登録しない
 *
 * @param {Object} data 売上データ
 * @return {Object}
 */
function mergeSales(data) {
    /*
     * データ形式確認
     */
    if (
        !data
        || !Array.isArray(data.transactions)
    ) {
        throw new Error(
            '売上データの形式が正しくありません。'
        );
    }


    /*
     * schemaVersion確認
     */
    if (
        data.schemaVersion !== 1
    ) {
        throw new Error(
            '対応していないデータ形式です。'
        );
    }


    /*
     * イベントID確認
     */
    if (
        data.eventId
        !== eventData.eventId
    ) {
        throw new Error(
            '別イベントの売上データです。'
        );
    }


    /*
     * 現在保存されている売上
     */
    const oldSales =
        sales();


    /*
     * transactionIdをキーにする
     */
    const map =
        new Map(
            oldSales.map(transaction => [
                transaction.transactionId,
                transaction
            ])
        );


    let addedCount = 0;
    let duplicateCount = 0;


    /*
     * 新しい取引を追加
     */
    for (
        const transaction
        of data.transactions
    ) {
        if (
            map.has(
                transaction.transactionId
            )
        ) {
            duplicateCount++;

            continue;
        }


        map.set(
            transaction.transactionId,
            transaction
        );

        addedCount++;
    }


    /*
     * 保存
     */
    saveSales(
        [...map.values()]
    );


    return {
        addedCount,
        duplicateCount
    };
}


/* ========================================
   JSON
======================================== */

/**
 * JSONを書き出す
 */
function exportJson() {
    const payload =
        createSalesPayload();


    const blob =
        new Blob(
            [
                JSON.stringify(
                    payload,
                    null,
                    2
                )
            ],
            {
                type:
                    'application/json'
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const a =
        document.createElement(
            'a'
        );


    a.href =
        url;


    a.download =
        `${eventData.eventId}_${eventData.registerId}.json`;


    a.click();


    URL.revokeObjectURL(
        url
    );
}


/**
 * JSONを読み込んでマージ
 *
 * @param {File} file JSONファイル
 */
async function importJson(file) {
    try {
        const data =
            JSON.parse(
                await file.text()
            );


        const result =
            mergeSales(
                data
            );


        alert(
            `${result.addedCount}件を取り込みました。\n`
            + `重複：${result.duplicateCount}件`
        );


        showMenu();
    }
    catch (error) {
        console.error(
            error
        );


        alert(
            error.message
            || 'JSONを読み込めませんでした。'
        );
    }
}


/* ========================================
   URL共有
======================================== */
/**
 * 売上データをURL転送用の
 * コンパクト形式へ変換
 *
 * @param {Object} data 通常形式の売上データ
 * @return {Array}
 */
function compactSalesData(data) {
    return [
        data.schemaVersion,

        data.eventId,

        data.registerId,

        data.transactions.map(
            transaction => {

                return [
                    transaction.transactionId,

                    new Date(
                        transaction.timestamp
                    ).getTime(),

                    transaction.items.map(
                        item => [
                            item.productId,
                            item.quantity
                        ]
                    ),

                    (
                        transaction.appliedSets
                        || []
                    ).map(
                        set => [
                            set.setId,
                            set.quantity
                        ]
                    ),

                    transaction.pricing.subtotal,

                    transaction.pricing.discount,

                    transaction.pricing.total
                ];
            }
        )
    ];
}


/**
 * URL転送用データを
 * 通常の売上データへ復元
 *
 * @param {Array} compact コンパクト形式
 * @return {Object}
 */
function expandSalesData(compact) {
    const [
        schemaVersion,
        eventId,
        registerId,
        transactions
    ] = compact;


    return {
        schemaVersion,

        eventId,

        registerId,

        transactions:
            transactions.map(
                transaction => {

                    const [
                        transactionId,
                        timestamp,
                        items,
                        appliedSets,
                        subtotal,
                        discount,
                        total
                    ] = transaction;


                    return {
                        transactionId,

                        eventId,

                        registerId,

                        timestamp:
                            new Date(
                                timestamp
                            ).toISOString(),

                        items:
                            items.map(
                                item => ({
                                    productId:
                                        item[0],

                                    quantity:
                                        item[1]
                                })
                            ),

                        pricing: {
                            subtotal,
                            discount,
                            total
                        },

                        appliedSets:
                            appliedSets.map(
                                set => ({
                                    setId:
                                        set[0],

                                    quantity:
                                        set[1]
                                })
                            )
                    };
                }
            )
    };
}
/**
 * 売上データを圧縮して
 * Base64URL形式へ変換
 *
 * @param {Object} data 売上データ
 * @return {Promise<string>}
 */
async function encodeSalesData(data) {
    const compact =
        compactSalesData(
            data
        );


    const json =
        JSON.stringify(
            compact
        );


    const bytes =
        new TextEncoder().encode(
            json
        );


    const stream =
        new Blob([
            bytes
        ])
            .stream()
            .pipeThrough(
                new CompressionStream(
                    'gzip'
                )
            );


    const compressed =
        new Uint8Array(
            await new Response(
                stream
            ).arrayBuffer()
        );


    let binary = '';


    for (
        const byte
        of compressed
    ) {
        binary +=
            String.fromCharCode(
                byte
            );
    }


    return btoa(binary)
        .replaceAll('+', '-')
        .replaceAll('/', '_')
        .replaceAll('=', '');
}


/**
 * Base64URL形式の売上データを
 * 展開・復元
 *
 * @param {string} encoded URLデータ
 * @return {Promise<Object>}
 */
async function decodeSalesData(encoded) {
    let base64 =
        encoded
            .replaceAll('-', '+')
            .replaceAll('_', '/');

    while (
        base64.length % 4
    ) {
        base64 += '=';
    }


    const binary =
        atob(
            base64
        );


    const compressed =
        Uint8Array.from(
            binary,
            character => {
                return character.charCodeAt(
                    0
                );
            }
        );


    const stream =
        new Blob([
            compressed
        ])
            .stream()
            .pipeThrough(
                new DecompressionStream(
                    'gzip'
                )
            );


    const bytes =
        new Uint8Array(
            await new Response(
                stream
            ).arrayBuffer()
        );


    const json =
        new TextDecoder().decode(
            bytes
        );


    const compact =
        JSON.parse(
            json
        );


    return expandSalesData(
        compact
    );
}

/**
 * 売上共有URLを生成
 *
 * @return {Promise<string>}
 */
async function createSalesUrl() {
    const payload =
        createSalesPayload();


    const encoded =
        await encodeSalesData(
            payload
        );


    const url =
        new URL(
            window.location.href
        );


    url.search = '';

    url.hash =
        `sales=${encoded}`;


    return url.toString();
}


/**
 * 売上共有URLをクリップボードへコピー
 */
async function copySalesUrl() {
    const url =
        await createSalesUrl();


    try {
        await navigator.clipboard.writeText(
            url
        );


        alert(
            '売上共有URLをコピーしました。'
        );
    }
    catch (error) {
        console.error(
            error
        );


        /*
         * Clipboard APIが使えない場合
         */
        prompt(
            'このURLをコピーしてください。',
            url
        );
    }
}

/**
 * 入力されたURLから売上データを取得
 *
 * @param {string} urlText 売上共有URL
 * @return {Object}
 */
async function getSalesDataFromInputUrl(
    urlText
) {
    const url =
        new URL(
            urlText
        );


    if (
        !url.hash.startsWith(
            '#sales='
        )
    ) {
        throw new Error(
            '売上データが含まれていないURLです。'
        );
    }


    const encoded =
        url.hash.substring(
            '#sales='.length
        );


    if (!encoded) {
        throw new Error(
            '売上データが空です。'
        );
    }


    return await decodeSalesData(
        encoded
    );
}

document.querySelector(
    '#importUrlBtn'
).onclick =
    async () => {

        try {
            const input =
                document.querySelector(
                    '#salesUrlInput'
                );


            const urlText =
                input.value.trim();


            if (!urlText) {
                alert(
                    '売上URLを入力してください。'
                );

                return;
            }


            const data =
                await getSalesDataFromInputUrl(
                    urlText
                );


            /*
             * データ管理画面を閉じる
             */
            document.querySelector(
                '#menuDialog'
            ).close();


            /*
             * 取り込み確認画面を表示
             */
            showSalesImportDialog(
                data
            );
        }
        catch (error) {
            console.error(
                error
            );


            alert(
                error.message
                || '売上URLを読み込めませんでした。'
            );
        }

    };

/**
 * URLから受信した売上データ
 */
let receivedSalesData =
    null;


/**
 * 売上データ取り込み確認画面を表示
 *
 * @param {Object} data 売上データ
 */
function showSalesImportDialog(data) {
    receivedSalesData =
        data;


    const transactions =
        data.transactions || [];


    /*
     * 売上合計
     */
    const total =
        transactions.reduce(
            (sum, transaction) => {
                return (
                    sum
                    + (
                        transaction.pricing?.total
                        || 0
                    )
                );
            },
            0
        );


    /*
     * 頒布数
     */
    const itemCount =
        transactions.reduce(
            (sum, transaction) => {

                const count =
                    (
                        transaction.items
                        || []
                    ).reduce(
                        (
                            itemSum,
                            item
                        ) => {
                            return (
                                itemSum
                                + item.quantity
                            );
                        },
                        0
                    );


                return sum + count;
            },
            0
        );


    /*
     * 確認画面を作成
     */
    document.querySelector(
        '#salesImportBody'
    ).innerHTML = `
        <div class="line">
            <span>
                イベント
            </span>

            <b>
                ${data.eventId}
            </b>
        </div>

        <div class="line">
            <span>
                端末
            </span>

            <b>
                ${data.registerId}
            </b>
        </div>

        <div class="line">
            <span>
                会計数
            </span>

            <b>
                ${transactions.length}件
            </b>
        </div>

        <div class="line">
            <span>
                頒布数
            </span>

            <b>
                ${itemCount}点
            </b>
        </div>

        <div class="line totalLine">
            <span>
                売上
            </span>

            <strong>
                ${yen(total)}
            </strong>
        </div>
    `;


    document.querySelector(
        '#salesImportDialog'
    ).showModal();
}

/**
 * URLから受信した売上データを取り込む
 */
function confirmSalesImport() {
    if (!receivedSalesData) {
        return;
    }


    try {
        const result =
            mergeSales(
                receivedSalesData
            );


        document.querySelector(
            '#salesImportDialog'
        ).close();


        receivedSalesData =
            null;


        render();


        alert(
            `${result.addedCount}件を取り込みました。\n`
            + `重複：${result.duplicateCount}件`
        );
    }
    catch (error) {
        console.error(
            error
        );


        alert(
            error.message
            || '売上データを取り込めませんでした。'
        );
    }
}


/**
 * 現在のURLから売上データを取得
 *
 * 売上共有URLではない場合はnullを返す
 *
 * @return {Object|null}
 */
async function getSalesDataFromUrl() {
    const hash =
        window.location.hash;


    if (
        !hash.startsWith(
            '#sales='
        )
    ) {
        return null;
    }


    const encoded =
        hash.substring(
            '#sales='.length
        );


    if (!encoded) {
        return null;
    }


    return await decodeSalesData(
        encoded
    );
}


/**
 * URLから受信した売上をマージ
 */
async function importSalesFromUrl() {
    try {
        const data =
            await getSalesDataFromUrl();


        if (!data) {
            alert(
                'URLに売上データがありません。'
            );

            return;
        }


        /*
         * 取り込み前に確認
         */
        const transactionCount =
            data.transactions?.length || 0;


        const ok =
            confirm(
                '売上データを取り込みますか？\n\n'
                + `イベント：${data.eventId}\n`
                + `端末：${data.registerId}\n`
                + `会計数：${transactionCount}件`
            );


        if (!ok) {
            return;
        }


        const result =
            mergeSales(
                data
            );


        /*
         * URLから売上データを消す
         *
         * 再読み込みによる誤取り込み防止
         */
        history.replaceState(
            null,
            '',
            window.location.pathname
        );


        alert(
            `${result.addedCount}件を取り込みました。\n`
            + `重複：${result.duplicateCount}件`
        );


        showMenu();
    }
    catch (error) {
        console.error(
            error
        );


        alert(
            error.message
            || '売上URLを読み込めませんでした。'
        );
    }
}


/**
 * ローカルデータ削除
 */
function clearLocal() {
    let s = stats();


    if (
        !confirm(
            `この端末の販売履歴 ${s.count}件を削除します。\n`
            + `必要なら先にJSONを書き出してください。\n\n`
            + `削除しますか？`
        )
    ) {
        return;
    }


    localStorage.removeItem(
        K
    );


    caches.keys().then(
        keys =>
            Promise.all(
                keys.map(
                    k => caches.delete(k)
                )
            )
    );


    alert(
        'ローカル販売データとキャッシュを削除しました。'
        + '再読み込みするとアプリデータは再取得されます。'
    );


    render();
}

/**
 * セットIDからセット情報を取得
 *
 * @param {string} setId セットID
 * @return {Object|null}
 */
function getSetById(setId) {
    return (
        eventData.sets.find(
            set => {
                return set.id === setId;
            }
        )
        || null
    );
}


/**
 * 取引のセット適用履歴を表示用文字列に変換
 *
 * @param {Object} transaction 取引データ
 * @return {string}
 */
function getAppliedSetText(transaction) {
    const appliedSets =
        transaction.appliedSets || [];


    return appliedSets
        .map(appliedSet => {

            /*
             * 新形式
             */
            if (
                typeof appliedSet
                === 'object'
            ) {
                const set =
                    getSetById(
                        appliedSet.setId
                    );


                const name =
                    set
                        ? set.name
                        : appliedSet.setId;


                return (
                    `${name} ×${appliedSet.quantity}`
                );
            }


            /*
             * 旧形式
             *
             * "セット名 ×1"
             * のデータも一応表示できるようにする
             */
            return appliedSet;
        })
        .join(' / ');
}


/* ==============================
   Dialog
============================== */

document
    .querySelectorAll('dialog .close')
    .forEach(b => {

        b.onclick = () => {
            b.closest('dialog').close();
        };

    });


/* ==============================
   Buttons
============================== */

document.querySelector(
    '#checkoutBtn'
).onclick = checkout;


document.querySelector(
    '#confirmSale'
).onclick = confirmSale;


document.querySelector(
    '#menuBtn'
).onclick = showMenu;


document.querySelector(
    '#historyBtn'
).onclick = history;


document.querySelector(
    '#exportBtn'
).onclick = exportJson;


document.querySelector(
    '#clearBtn'
).onclick = clearLocal;

document.querySelector(
    '#shareUrlBtn'
).onclick = copySalesUrl;

document.querySelector(
    '#salesImportConfirm'
).onclick =
    confirmSalesImport;


document.querySelector(
    '#salesImportClose'
).onclick =
    () => {

        document.querySelector(
            '#salesImportDialog'
        ).close();


        receivedSalesData =
            null;
    };


/* ==============================
   JSON Import
============================== */

document.querySelector(
    '#importInput'
).onchange = e => {

    if (e.target.files[0]) {
        importJson(
            e.target.files[0]
        );
    }

};


/* ==============================
   Zoom
============================== */

document.querySelector(
    '#zoomBtn'
).onclick = () => {

    zoom =
        zoom === 100
            ? 125
            : zoom === 125
                ? 150
                : 100;


    document.body.classList.toggle(
        'zoom125',
        zoom === 125
    );

    document.body.classList.toggle(
        'zoom150',
        zoom === 150
    );


    document.querySelector(
        '#zoomBtn'
    ).textContent =
        zoom + '%';
};


/* ==============================
   Service Worker
============================== */

if ('serviceWorker' in navigator) {

    navigator.serviceWorker
        .register('./sw.js')

        .then(() => {

            document.querySelector(
                '#status'
            ).textContent =

                navigator.onLine
                    ? '● オンライン / オフライン利用準備済み'
                    : '● オフライン';

        })

        .catch(() => {

            document.querySelector(
                '#status'
            ).textContent =
                '● Service Worker未登録';

        });
}


/* ==============================
   Online / Offline
============================== */

window.addEventListener(
    'online',
    () => {

        document.querySelector(
            '#status'
        ).textContent =
            '● オンライン / オフライン利用準備済み';

    }
);


window.addEventListener(
    'offline',
    () => {

        document.querySelector(
            '#status'
        ).textContent =
            '● オフライン';

    }
);


/* ==============================
   Start
============================== */

async function start() {
    /*
     * Cadenceの楽曲データを読み込む
     */
    const loaded =
        await loadMusicData();


    if (!loaded) {
        console.warn(
            'data.jsonを取得できなかったため、'
            + '楽曲情報なしで起動します。'
        );
    }


    /*
     * eventDataの商品と
     * data.jsonの楽曲情報を結合
     */
    /*
    * イベントで指定された商品IDから
    * 商品マスタの情報を取得する
    */
    products =
        eventData.productIds
            .map(productId => {

                return productMaster.find(
                    product => {
                        return (
                            product.id
                            === productId
                        );
                    }
                );
            })
            .filter(product => {
                return product;
            })
            .map(product => {
                return getProductData(
                    product
                );
            });


    /*
     * 商品IDから商品情報を取得できるようにする
     */
    pmap =
        Object.fromEntries(
            products.map(product => [
                product.id,
                product
            ])
        );


    console.log(
        '商品データ:',
        products
    );


    /*
     * 画面描画
     */
    render();
}


start();