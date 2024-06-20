const articles = [
	{
        image: "file:///C:/Users/User/Downloads/Cadence-main/Cadence-main/img/touhou.png",
        title: "<a href='https://oecusoundserver.github.io/Cadence/event/CAD-0007.html'>東方アレンジコンピアルバム(仮)</a>",
        description: "東方Project関係なら、どの曲をアレンジしてもOK。テーマやジャンルなどの指定もなく、好きなように作って頂くという、超ゆる～い(？)CDです。"
    },
	{
        image: "file:///C:/Users/User/Downloads/Cadence-main/Cadence-main/img/shintyoku.jpg",
        title: "<a href='https://oecusoundserver.github.io/Cadence/event/CAD-0006.html'>進捗どうですか？</a>",
        description: "入稿の締め切りギリギリ、そんな限界状態の時にふと思い立って作った限界CD。締め切りを目前に控え追い詰められてる人へ、届け～このCD！！"
    },
    {
        image: "https://oecusoundserver.github.io/Cadence/img/yellow.png",
        title: "<a href='https://oecusoundserver.github.io/Cadence/sample.html'>サンプル記事</a>",
        description: "サンプル記事の内容を簡単に書くところです。ある程度まで来たら勝手に続きを読むというように表示したい。"
    },
    {
        image: "https://oecusoundserver.github.io/Cadence/img/YouthfulBlue.png",
        title: "<a href='https://oecusoundserver.github.io/Cadence/event/CAD-0005.html'>Youthful Blue</a>",
        description: "みんなブルアカは好きかい？夏コミでのブルアカの規模の大きさを見て、「乗るしかない このビッグウェーブに」ということで企画しました。動機はアレだけど至って真面目です。"
    },
    {
        image: "https://oecusoundserver.github.io/Cadence/img/PrettyFurry.png",
        title: "<a href='https://oecusoundserver.github.io/Cadence/event/CAD-0004.html'>Pretty Furry VGM Remix Collection</a>",
        description: "全曲ケモノ(人外含む)成分たっぷりでお届け。色々なケモノが出てくるゲームから、曲をチョイスし様々なジャンルにアレンジしました。"
    },
    {
        image: "https://oecusoundserver.github.io/Cadence/img/ToyBox.png",
        title: "<a href='https://oecusoundserver.github.io/Cadence/event/CAD-0002.html'>ToyBox</a>",
        description: "Cadenceとボカロ部の運営スタッフが作詞・作曲した楽曲を参加者の皆さんがアレンジし、一つのCDにします。"
    },
    {
        image: "https://oecusoundserver.github.io/Cadence/img/kemo.png",
        title: "<a href='https://oecusoundserver.github.io/Cadence/portfolio/fatty.html'>ふぁってい・きゃっと</a>",
        description: "このゲームは、3Dアクションゲームです。主人公の猫はコロコロと転がりながら移動し、ヒップドロップで衝撃波を出します。衝撃波を敵にぶつけ、一定数の敵を倒すことでゲームクリアになります。"
    }
];

const randomArticles = [];

// Randomly select 2 articles for PC and 1 article for mobile
if (window.innerWidth > 1024) {
    while (randomArticles.length < 3) {
        const randomIndex = Math.floor(Math.random() * articles.length);
        if (!randomArticles.includes(randomIndex)) {
            randomArticles.push(randomIndex);
        }
    }
}
else {
    while (randomArticles.length < 2) {
        const randomIndex = Math.floor(Math.random() * articles.length);
        if (!randomArticles.includes(randomIndex)) {
            randomArticles.push(randomIndex);
        }
    }
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
