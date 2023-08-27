// リアルタイムでテーブルデータを検索して表示する関数
function searchData() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    const table = document.getElementById("albumTable");
    const rows = table.getElementsByTagName("tr");

    for (let i = 1; i < rows.length; i++) { // i = 1 から開始してヘッダー行をスキップ
        const cells = rows[i].getElementsByTagName("td");
        let found = false;

        for (let j = 1; j < cells.length -1; j++) { // アルバム名からアーティスト名まで検索
            const cellText = cells[j].textContent.toLowerCase();
            if (cellText.includes(searchInput)) {
                found = true; // 一致するデータが見つかったらtrueを返す
                break;
            }
        }

        if (found) {
            rows[i].style.display = "";
        }
        else {
            rows[i].style.display = "none";
        }
    }
}