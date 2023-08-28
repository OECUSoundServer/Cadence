const articles = [
    {
        image: "https://mixtuti.github.io/mixtuti/img/favcon.png",
        title: "<a href='../portfolio/bot.html'>Discord Bot</a>",
        description: "This is the description of article 1."
    },
    {
        image: "https://mixtuti.github.io/mixtuti/img/IMG_0037.jpg",
        title: "<a href='https://mixtuti.github.io/mixtuti/portfolio/providing.html#marisa'>霧雨魔理沙の紅魔館脱出大作戦</a>",
        description: "This is the description of article 2."
    },
    {
        image: "https://mixtuti.github.io/mixtuti/img/IMG_0015.png",
        title: "<a href='../portfolio/ose.html'>逢瀬</a>",
        description: "This is the description of article 3."
    },
    {
        image: "https://mixtuti.github.io/mixtuti/img/IMG_0038.png",
        title: "<a href='../portfolio/providing.html#tower'>鬼形獣タワー</a>",
        description: "This is the description of article 4."
    },
    {
        image: "https://mixtuti.github.io/mixtuti/img/IMG_0014.png",
        title: "<a href='../portfolio/akinasi.html'>あきなし & あきなし2</a>",
        description: "This is the description of article 5."
    },
    {
        image: "https://mixtuti.github.io/mixtuti/img/IMG_0016.png",
        title: "<a href='../portfolio/enemy.html'>レグ・ダーティ</a>",
        description: "This is the description of article 6."
    },
    {
        image: "https://mixtuti.github.io/mixtuti/img/IMG_0012.png",
        title: "<a href='../portfolio/pon.html'>Pon DE Touhou</a>",
        description: "This is the description of article 7."
    },
    {
        image: "https://mixtuti.github.io/mixtuti/img/IMG_0017.png",
        title: "<a href='../portfolio/hunter.html'>ハンターアビリティ</a>",
        description: "This is the description of article 8."
    },
    {
        image: "https://mixtuti.github.io/mixtuti/img/IMG_0013.png",
        title: "<a href='../portfolio/kemofan.html'>ケモノファンタジー</a>",
        description: "This is the description of article 9."
    },
    {
        image: "https://mixtuti.github.io/mixtuti/img/IMG_0018.png",
        title: "<a href='../portfolio/octo.html'>Octogether</a>",
        description: "This is the description of article 10."
    },
    {
        image: "https://mixtuti.github.io/mixtuti/img/IMG_0019.png",
        title: "<a href='../portfolio/pc.html'>Perfect Crime～めざせ完全犯罪～</a>",
        description: "This is the description of article 11."
    },
    {
        image: "https://mixtuti.github.io/mixtuti/img/IMG_0027.jpeg",
        title: "<a href='../portfolio/klonoa.html'>世界が望んだ贈りもの ～風のクロノア２ 20周年記念非公式イラストアンソロジー～</a>",
        description: "This is the description of article 12."
    },
    {
        image: "https://mixtuti.github.io/mixtuti/img/favcon.png",
        title: "<a href='../portfolio/event.html#autumn'>秋の企画ジャム2021</a>",
        description: "This is the description of article 13."
    },
    {
        image: "https://mixtuti.github.io/mixtuti/img/IMG_0164.png",
        title: "<a href='../portfolio/mochicat.html'>モチネコ</a>",
        description: "This is the description of article 14."
    },
    {
        image: "https://mixtuti.github.io/mixtuti/img/IMG_0146.png",
        title: "<a href='../portfolio/as.html'>アクションシューター</a>",
        description: "This is the description of article 15."
    },
    {
        image: "https://mixtuti.github.io/mixtuti/img/IMG_0133.png",
        title: "<a href='../portfolio/japansige.html'>攻城戦VR</a>",
        description: "This is the description of article 16."
    },
    {
        image: "https://mixtuti.github.io/mixtuti/img/favcon.png",
        title: "<a href='../portfolio/event.html#spring'>2022春ジャム</a>",
        description: "This is the description of article 17."
    },
    {
        image: "https://mixtuti.github.io/mixtuti/img/IMG_0025.png",
        title: "<a href='../portfolio/denki.html'>デンキセキ</a>",
        description: "This is the description of article 18."
    },
    {
        image: "https://oecusoundserver.github.io/Cadence/img/SD_1.jpg",
        title: "<a href='https://oecusoundserver.github.io/Cadence/event/SDFirst.html'>【入門編】サウンド＋デザインジャム</a>",
        description: "This is the description of article 19."
    },
    {
        image: "https://mixtuti.github.io/mixtuti/img/favcon.png",
        title: "<a href='../portfolio/event.html#entry'>入門編ゲームジャム2022夏</a>",
        description: "This is the description of article 20."
    },
    {
        image: "https://mixtuti.github.io/mixtuti/img/IMG_0026.jpg",
        title: "<a href='../portfolio/NPFM-0003.html'>忘れじの幻葬曲　～ Recollect Lost Fantasy</a>",
        description: "This is the description of article 21."
    },
    {
        image: "https://oecusoundserver.github.io/Cadence/img/dice_1.jpg",
        title: "<a href='https://oecusoundserver.github.io/Cadence/portfolio/vocakore.html'>ボカコレ2022秋</a>",
        description: "This is the description of article 22."
    },
    {
        image: "https://oecusoundserver.github.io/Cadence/img/Nawafes_1.png",
        title: "<a href='https://oecusoundserver.github.io/Cadence/event/Nawafes.html'>なわフェス2022</a>",
        description: "This is the description of article 23."
    },
    {
        image: "https://mixtuti.github.io/mixtuti/img/IMG_0042.png",
        title: "<a href='../portfolio/nyax.html'>NyaX'22</a>",
        description: "This is the description of article 24."
    },
    {
        image: "https://mixtuti.github.io/mixtuti/img/IMG_0022.jpg",
        title: "<a href='../portfolio/rizulrimo.html'>Rizulrimo - The last tree</a>",
        description: "This is the description of article 25."
    },
    {
        image: "https://mixtuti.github.io/mixtuti/img/IMG_0023.png",
        title: "<a href='../portfolio/obugyo.html'>OBUGYO</a>",
        description: "This is the description of article 26."
    },
    {
        image: "https://mixtuti.github.io/mixtuti/img/IMG_0152.png",
        title: "<a href='../portfolio/covid.html'>COVID-19シューティング</a>",
        description: "This is the description of article 27."
    },
    {
        image: "https://mixtuti.github.io/mixtuti/img/IMG_0043.png",
        title: "<a href='../portfolio/cat.html'>CatKeynote</a>",
        description: "This is the description of article 28."
    },
    {
        image: "https://mixtuti.github.io/mixtuti/img/IMG_0021.png",
        title: "<a href='../portfolio/shark.html'>サメサバイル</a>",
        description: "This is the description of article 29."
    },
    {
        image: "https://mixtuti.github.io/mixtuti/img/IMG_0024.png",
        title: "<a href='../portfolio/rougoku.html'>蝋獄</a>",
        description: "This is the description of article 30."
    },
    {
        image: "https://mixtuti.github.io/mixtuti/img/IMG_0165.png",
        title: "<a href='../portfolio/spacecat.html'>宇宙ネコ</a>",
        description: "This is the description of article 31."
    },
    {
        image: "https://mixtuti.github.io/mixtuti/img/favcon.png",
        title: "<a href='../portfolio/event.html#spring2023'>2023春ジャム</a>",
        description: "This is the description of article 32."
    },
    {
        image: "https://mixtuti.github.io/mixtuti/img/IMG_0192.png",
        title: "<a href='../portfolio/syukatu.html'>転生しても就活生だった件</a>",
        description: "This is the description of article 33."
    },
    {
        image: "https://mixtuti.github.io/mixtuti/img/IMG_0020.png",
        title: "<a href='../portfolio/sgf.html'>サウンドガンファイト</a>",
        description: "This is the description of article 34."
    },
    {
        image: "https://mixtuti.github.io/mixtuti/img/IMG_0201.png",
        title: "<a href='../portfolio/note.html'>AIを使ってケモノを生成する！</a>",
        description: "This is the description of article 35."
    },
    {
        image: "https://oecusoundserver.github.io/Cadence/img/kemo.png",
        title: "<a href='https://mixtuti.github.io/mixtuti/portfolio/fattycat.html'>ふぁってぃ・きゃっと</a>",
        description: "This is the description of article 36."
    }
];

const randomArticles = [];

// Randomly select 2 articles for PC and 1 article for mobile
if (window.innerWidth >= 768) {
    while (randomArticles.length < 4) {
        const randomIndex = Math.floor(Math.random() * articles.length);
        if (!randomArticles.includes(randomIndex)) {
            randomArticles.push(randomIndex);
        }
    }
}
else {
    const randomIndex = Math.floor(Math.random() * articles.length);
    randomArticles.push(randomIndex);
}

const articlesDiv = document.querySelector(".articles");

// Generate HTML for articles
randomArticles.forEach(index => {
    const article = articles[index];
    const articleHTML = `
    <div class="article">
    <img src="${article.image}" alt="${article.title}">
    <h3 class="target-title">${article.title}</h3>
    <p>${article.description}</p>
    </div>
    `;
    articlesDiv.innerHTML += articleHTML;
});