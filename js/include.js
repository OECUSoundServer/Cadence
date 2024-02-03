const includeHeader = new XMLHttpRequest();
includeHeader.open("GET", "Header2.html", true);
includeHeader.onreadystatechange = function () {
  if (includeHeader.readyState === 4 && includeHeader.status === 200) {
    const headerHTML = includeHeader.responseText;
    const header = document.querySelector("#header");
    header.insertAdjacentHTML("afterbegin", headerHTML);

    // ハンバーガーメニューのスクリプトを追加
    const hamburgerScript = document.createElement("script");
    hamburgerScript.src = "./js/menu.js";
    document.body.appendChild(hamburgerScript);
  }
};
includeHeader.send();
