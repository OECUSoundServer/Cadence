// 没

let currentSortColumn = null;
let currentSortOrder = 1; // 1: 昇順, -1: 降順

// 外部のJSONデータを読み込む関数
function loadExternalData() {
    fetch('https://oecusoundserver.github.io/Cadence/data.json') // 外部ファイルのパスを指定
        .then(response => response.json())
        .then(data => {
            // 読み込んだデータをテーブルに表示
            displayTableData(data);
        })
        .catch(error => {
            console.error('データの読み込みエラー:', error);
        });
}

// テーブル内のデータを表示する関数
function displayTableData(data) {
    const table = document.getElementById("albumTable");
    table.innerHTML = ""; // テーブルの中身をクリア

    // ヘッダー行を作成
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    for (const key in data[0]) {
        const th = document.createElement("th");
        th.textContent = key;
        th.addEventListener("click", () => sortTable(key));
        const sortIcon = document.createElement("i");
        sortIcon.classList.add("fa", "fa-sort");
        th.appendChild(sortIcon);
        headerRow.appendChild(th);
    }
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // データ行を作成
    const tbody = document.createElement("tbody");
    data.forEach(item => {
        const row = document.createElement("tr");
        for (const key in item) {
            const td = document.createElement("td");
            td.textContent = item[key];
            row.appendChild(td);
        }
        tbody.appendChild(row);
    });
    table.appendChild(tbody);
}

function sortTable(column) {
    if (currentSortColumn === column) {
        currentSortOrder *= -1; // クリックした列が既にソート対象の場合、昇順と降順を切り替える
    }
    else {
        currentSortColumn = column;
        currentSortOrder = 1; // 新しい列を昇順でソート
    }

    const table = document.getElementById("albumTable");
    const tbody = table.querySelector("tbody");
    const rows = Array.from(tbody.querySelectorAll("tr"));

    rows.sort((a, b) => {
        const aValue = a.querySelector(`td:nth-child(${columnIndex(column)})`).textContent;
        const bValue = b.querySelector(`td:nth-child(${columnIndex(column)})`).textContent;

        // 日付を解析してDateオブジェクトに変換
        const aDate = parseDate(aValue);
        const bDate = parseDate(bValue);

        // 数値の比較を行うために数値に変換
        const aValueNumeric = parseFloat(aValue);
        const bValueNumeric = parseFloat(bValue);

        if (aDate && bDate) {
            return (aDate - bDate) * currentSortOrder;
        } else if (!isNaN(aValueNumeric) && !isNaN(bValueNumeric)) {
            return (aValueNumeric - bValueNumeric) * currentSortOrder;
        } else {
            return aValue.localeCompare(bValue) * currentSortOrder;
        }
    });

    tbody.innerHTML = "";
    rows.forEach(row => tbody.appendChild(row));

    // ソートアイコンの更新
    resetSortIcons();
    const header = table.querySelector(`th:nth-child(${columnIndex(column)})`);
    const sortIcon = header.querySelector("i.fa-sort");
    sortIcon.classList.remove("fa-sort");
    sortIcon.classList.add(currentSortOrder === 1 ? "fa-sort-up" : "fa-sort-down");
}

// 日付を解析してDateオブジェクトに変換する関数
function parseDate(dateString) {
    const dateParts = dateString.split('-');
    if (dateParts.length === 3) {
        const year = parseInt(dateParts[0], 10);
        const month = parseInt(dateParts[1], 10) - 1; // 月は0から11で表現されるため
        const day = parseInt(dateParts[2], 10);
        return new Date(year, month, day);
    }
    return null; // 不正な日付の場合はnullを返す
}

// ソートアイコンをリセット
function resetSortIcons() {
    const icons = document.querySelectorAll(".fa-sort-up, .fa-sort-down");
    icons.forEach(icon => {
        icon.classList.remove("fa-sort-up");
        icon.classList.remove("fa-sort-down");
        icon.classList.add("fa-sort");
    });
}

// 列名から列番号を取得
function columnIndex(column) {
    const headers = document.querySelectorAll("thead th");
    for (let i = 0; i < headers.length; i++) {
        if (headers[i].textContent === column) {
            return i + 1;
        }
    }
    return 0;
}

// リアルタイムでテーブルデータを検索して表示する関数
function searchData() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    const table = document.getElementById("albumTable");
    const rows = table.getElementsByTagName("tr");

    for (let i = 1; i < rows.length; i++) { // i = 1 から開始してヘッダー行をスキップ
        const cells = rows[i].getElementsByTagName("td");
        let found = false;

        for (let j = 1; j < cells.length - 1; j++) { // すべての列を対象
            const cellText = cells[j].textContent.toLowerCase();
            const index = cellText.indexOf(searchInput); // 検索文字列のインデックスを取得
            if (index !== -1) {
                found = true; // 一致するデータが見つかったらtrueを返す
                const textNode = cells[j].firstChild; // テキストノードを取得
                const before = document.createTextNode(cellText.substring(0, index)); // 検索文字列の前の部分
                const middle = document.createElement("span"); // 検索文字列を含む部分を<span>で囲む
                middle.textContent = cellText.substring(index, index + searchInput.length);
                middle.classList.add("highlight");
                const after = document.createTextNode(cellText.substring(index + searchInput.length)); // 検索文字列の後の部分
                cells[j].innerHTML = ''; // テキストノードをクリア
                cells[j].appendChild(before);
                cells[j].appendChild(middle);
                cells[j].appendChild(after);
            }
        }

        if (found) {
            rows[i].style.display = "";
        } else {
            rows[i].style.display = "none";
        }
    }
}

// ページ読み込み時に外部データを読み込む
loadExternalData();

// リアルタイムでテーブルデータを検索して表示する関数
// function searchData() {
//     const searchInput = document.getElementById("searchInput").value.toLowerCase();
//     const table = document.getElementById("albumTable");
//     const rows = table.getElementsByTagName("tr");

//     for (let i = 1; i < rows.length; i++) { // i = 1 から開始してヘッダー行をスキップ
//         const cells = rows[i].getElementsByTagName("td");
//         let found = false;

//         for (let j = 1; j < cells.length -1; j++) { // アルバム名からアーティスト名まで検索
//             const cellText = cells[j].textContent.toLowerCase();
//             if (cellText.includes(searchInput)) {
//                 found = true; // 一致するデータが見つかったらtrueを返す
//                 break;
//             }
//         }

//         if (found) {
//             rows[i].style.display = "";
//         }
//         else {
//             rows[i].style.display = "none";
//         }
//     }
// }