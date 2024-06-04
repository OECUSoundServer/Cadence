document.addEventListener("DOMContentLoaded", function() {
    // URLパラメータを取得する関数
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    // 'category' パラメータをチェック
    const category = getQueryParam('category');
    if (category) {
        // 対応するラジオボタンを選択
        const radioButton = document.querySelector(`input[name="categories"][value="${category}"]`);
        if (radioButton) {
            radioButton.checked = true;
        }
    }
});