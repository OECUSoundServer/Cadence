function addTagInput() {
	var tagInputs = document.getElementById("tag-inputs");
	var newTagInput = document.createElement("div");
	newTagInput.classList.add("tag-input");
	newTagInput.innerHTML = `
		日本語タグ：<input type="text" class="tag-name" placeholder="タグ名"><br>
		英語タグ：<input type="text" class="tag-en" placeholder="tag">
		<button onclick="deleteTagInput(this)">削除</button><br>
	`;
	tagInputs.appendChild(newTagInput);
}

function deleteTagInput(button) {
	var tagInputDiv = button.parentElement;
	tagInputDiv.remove();
}

// コンテンツを追加する関数
function addInput() {
	var contentInputs = document.getElementById("content-inputs");
	var newInput = document.createElement("div");
	newInput.classList.add("content-input");
	newInput.innerHTML = `
		コンテンツタイトル：<input type="text" class="content-title" placeholder="コンテンツタイトル"><br>
		コンテンツ本文：<textarea class="content-body" rows="4" cols="50" placeholder="コンテンツ本文を入力してください"></textarea>
		<button onclick="deleteInput(this)">削除</button><br>
	`;
	contentInputs.appendChild(newInput);
}

// 削除ボタンが押された時の処理
function deleteInput(button) {
	var inputDiv = button.parentElement;
	inputDiv.remove();
}

function generateHTML() {
	// 入力された値を取得
	var fileName = document.getElementById("file-text").value;
	var authorName = document.getElementById("author-text").value;
	var titleText = document.getElementById("title-text").value;
	var overviewText = document.getElementById("overview-text").value;
	var metaTagText = document.getElementById("metatag-text").value;
	var linkText = document.getElementById("x-text").value;
	var introductionText = document.getElementById("introduction-text").value.replace(/\n/g, "<br>");
	// タグ情報を取得
	var tagInputs = document.getElementsByClassName("tag-input");
	var tagsHTML = "";
	
	for (var i = 0; i < tagInputs.length; i++) {
		var tagName = tagInputs[i].querySelector(".tag-name").value;
		var tagEN = tagInputs[i].querySelector(".tag-en").value;
		
		tagsHTML += `
			<a href="https://oecusoundserver.github.io/Cadence/portfolio/index.html?category=${tagEN}" class="js-btn-link" data-radio-value="${tagEN}"><i class="fas fa-hashtag"></i>${tagName}</a>
		`;
	}
	
	// コンテンツ情報を取得
	var contentInputs = document.getElementsByClassName("content-input");
	var contentsHTML = "";
	
	for (var j = 0; j < contentInputs.length; j++) {
		var contentTitle = contentInputs[j].querySelector(".content-title").value;
		var contentBody = contentInputs[j].querySelector(".content-body").value;
		
		// 改行を<p>タグで区切る
		var paragraphs = contentBody.split('\n').map(p => `<p>${p}</p>`).join('');
		
		contentsHTML += `
			<div class="content">
				<h2><img class="emoji" src="https://oecusoundserver.github.io/Cadence/img/nikukyu.svg"> ${contentTitle} <img class="emoji" src="https://oecusoundserver.github.io/Cadence/img/nikukyu.svg"></h2>
				${paragraphs}
			</div>
		`;
	}
	
	// 今回は固定のサンプルHTMLを生成する例として、メタタグの内容を利用する。
	var generatedHTML = `
<!doctype html>
<html lang="ja">
<head prefix="og: https://ogp.me/ns#">
	<meta charset="utf-8" />
	<meta name="author" content="${authorName}" />
	<!-- Meta -->
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta name="theme-color" content="#1abc9c" id="meta-theme-color" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://oecusoundserver.github.io/Cadence/article/${fileName}.html" />
	<meta property="og:title" content="Cadence｜${titleText}" />
	<meta property="og:description" content="${overviewText}" />
	<meta property="og:image" content="https://oecusoundserver.github.io/Cadence/img/yellow.png" />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:site" content="@${linkText}" />
	<meta name="twitter:title" content="Cadence｜${titleText}" />
 	<meta name="twitter:description" content="${overviewText}" />
	<meta name="twitter:image" content="https://oecusoundserver.github.io/Cadence/img/yellow.png" />
    <meta name="keywords" content="${metaTagText}">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <!-- Icon -->
    <link rel="icon" href="https://oecusoundserver.github.io/Cadence/img/yellow.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="https://oecusoundserver.github.io/Cadence/img/yellow.png">
    <!-- Stylesheets -->
    <link rel="stylesheet" href="https://oecusoundserver.github.io/Cadence/css/style2.css" type="text/css">
    <link rel="stylesheet" href="https://oecusoundserver.github.io/Cadence/css/responsive.css" type="text/css">
    <!-- Web CSS -->
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css">
    <!-- Font -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=DotGothic16&display=swap" rel="stylesheet">
    <!-- Icon -->
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.4/css/all.css">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css">
    <!-- Document Title -->
    <title>Cadence｜${titleText}</title>
</head>

<body>
	<!-- ロード画面 -->
	<script data-cfasync="false" data-no-defer="1">var ewww_webp_supported = false;<\/script>
	<div id="loftloader-wrapper" class="pl-imgloading" data-show-close-time="5000" data-max-load-time="60000">
		<div class="loader-section section-up"></div>
		<div class="loader-section section-down"></div>
		<div class="loader-inner">
			<div id="loader">
				<div class="imgloading-container"><span class="lazyload" data-back="https://oecusoundserver.github.io/Cadence/img/nikukyu.png"></span>
					</div><img width="76" height="59" data-no-lazy="1" class="skip-lazy" alt="loader image" src="https://oecusoundserver.github.io/Cadence/img/nikukyu.png">
				</div>
			</div>
		<div class="loader-close-button" style="display: none;"><span class="screen-reader-text">Close</span></div>
	</div>
	
	<!-- ヘッダー -->
	<header class="header">
		<!-- Header Logo -->
		<div class="logo">
			<a href="#">
				<p><a href="https://oecusoundserver.github.io/Cadence/index.html"><img src="https://oecusoundserver.github.io/Cadence/img/yellow.png" alt="Cadence_Icon" class="logo"></a></p>
			</a>
		</div>
		
		<!-- Menu -->
		<div id="hamburger">
			<div class="icon">
				<span></span>
				<span></span>
				<span></span>
			</div>
		</div>
		<!-- Nav Phon -->
		<nav class="nav sm">
			<ul>
				<li><a href="https://oecusoundserver.github.io/Cadence/index.html">トップページ</a></li>
				<li><a href="https://oecusoundserver.github.io/Cadence/about/index.html">サークルについて</a></li>
				<li><a href="https://oecusoundserver.github.io/Cadence/portfolio/index.html">作品</a></li>
				<li><a href="https://oecusoundserver.github.io/Cadence/event/index.html">イベント</a></li>
				<li><a href="https://oecusoundserver.github.io/Cadence/special/bosyu.html">募集</a></li>
				<li><a href="https://oecusoundserver.github.io/Cadence/link.html">リンク</a></li>
				<li><a href="https://oecusoundserver.github.io/Cadence/Other/index.html">その他</a></li>
			</ul>
		</nav>
		<!-- Nav PC -->
		<nav class="nav pc">
			<ul>
				<li><a href="https://oecusoundserver.github.io/Cadence/index.html">トップページ</a></li>
				<li><a href="https://oecusoundserver.github.io/Cadence/about/index.html">サークルについて</a></li>
				<li><a href="https://oecusoundserver.github.io/Cadence/portfolio/index.html">作品</a></li>
				<li><a href="https://oecusoundserver.github.io/Cadence/event/index.html">イベント</a></li>
				<li><a href="https://oecusoundserver.github.io/Cadence/special/bosyu.html">募集</a></li>
				<li><a href="https://oecusoundserver.github.io/Cadence/link.html">リンク</a></li>
				<li><a href="https://oecusoundserver.github.io/Cadence/Other/index.html">その他</a></li>
			</ul>
		</nav>
	</header>
	<hr>

	<!-- 本文 -->
	<main class="top blog">
		<article>
			<div>
				<h2 class="DotGothic16 blogTitle">${titleText}</h2>
				<h3 class="author"><i class="far fa-user-circle"></i> ${authorName}</h3>
				<h4 class="blogTag">Tags：<a href="https://oecusoundserver.github.io/Cadence/portfolio/index.html?category=blog" class="js-btn-link" data-radio-value="blog"><i class="fas fa-hashtag"></i>ブログ</a>
					${tagsHTML} 
				</h4>
				<div class="title"></div>
			</div>

			<div class="Two-column">
				<div  class="blogMain">
					<div>
						${contentsHTML}
					</div>
						
					<div class="authorinfo">
						<div class="title"></div>
						<div class="ma"></div>
						<div class="Two-column">
							<div class="left-min">
								<div>
									<img src="https://oecusoundserver.github.io/Cadence/img/${authorName}.png" class="author-photo" alt="作者アイコン">
								</div>
							</div>
							<div class="right-max">
								<div class="authorcontainer">
									<div class="authorname">
										<i class="far fa-user-circle"></i> <b>${authorName}</b>
									</div>
									<div class="handle">
										<small><i class="fa-brands fa-x-twitter"></i> <a href="https://x.com/${linkText}">@${linkText}</a></small>
									</div>
								</div>
								<hr style="margin-top: 0;">
								<div>
									${introductionText}
								</div>
							</div>
						</div>
						<div class="ma"></div>
					</div>
				</div>
				<div class="blogSub">
					<h3 style="text-align:center">
						<img class="emoji" src="https://oecusoundserver.github.io/Cadence/img/nikukyu.svg"> おすすめ記事 <img class="emoji" src="https://oecusoundserver.github.io/Cadence/img/nikukyu.svg">
					</h3>
        			<div class="articles"></div>
				</div>
			</div>
		</article>
	</main>
	
	<!-- フッター -->
	<footer id="footer" class="dark">
		<div id="copyrights">
			<div class="container clearfix">
				<div class="col_half">
					<!-- Copyrights -->
					Copyrights &copy; Cadence<br>
					<a href="https://oecusoundserver.github.io/Cadence/about/index.html">About This Circle</a>
				</div>
			</div>
		</div>
	</footer>
	<!-- jQuery JavaScript -->
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"><\/script>
	<script src="https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js"><\/script>
	<script src="https://oecusoundserver.github.io/Cadence/js/menu.js"><\/script>
	<script src="https://oecusoundserver.github.io/Cadence/js/slider.js"><\/script>
	<script src="https://oecusoundserver.github.io/Cadence/js/pagetop.js"><\/script>
	<script src="https://oecusoundserver.github.io/Cadence/js/stkr.js"><\/script>
	<script src="https://oecusoundserver.github.io/Cadence/js/emoji.js"><\/script>
	<script src="https://oecusoundserver.github.io/Cadence/js/loader.js"><\/script>
	<script src="https://oecusoundserver.github.io/Cadence/js/random.js"><\/script>
</body>
</html>`;
	// 生成したHTMLコードをテキストボックスに表示する
	document.getElementById("generatedCode").value = generatedHTML;
}

function copyToClipboard() {
	var copyText = document.getElementById("generatedCode");
	copyText.select();
	copyText.setSelectionRange(0, 99999); /* For mobile devices */
	document.execCommand("copy");
	alert("コピーしました！");
}

function downloadHTML() {
	var fileName = document.getElementById("file-text").value;
	var htmlContent = document.getElementById("generatedCode").value;
	
	// ファイル名が空の場合、デフォルトのファイル名を設定
	if (fileName.trim() === '') {
		fileName = 'default';
	}
	
	// Blobオブジェクトを作成
	var blob = new Blob([htmlContent], { type: 'text/html' });
	
	// a要素を作成し、BlobのURLを設定
	var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    
    // ダウンロード時のファイル名を指定
    a.download = fileName + '.html';
    
    // a要素をクリックしてダウンロードをトリガー
    document.body.appendChild(a);
    a.click();
    
    // 使用後にa要素を削除
    document.body.removeChild(a);
}
