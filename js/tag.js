window.addEventListener('DOMContentLoaded', function() {
    // 初期表示でAllが表示されるように設定
    const selectedCategoryElement = document.getElementById('selectedCategory');
    const selectedTagCountElement = document.getElementById('selectedTagCount');
    
    // name 属性が categories の input 要素（ラジオボタン）を取得
    const input_categories = document.querySelectorAll("input[name=categories]");
    // 全ての .target の要素（target クラスを指定された div 要素）を取得
    const targets = document.querySelectorAll(".target");
    
    // 初期表示時にチェックされているラジオボタンを取得
    const checkedRadioButton = document.querySelector('input[name=categories]:checked');
    if (checkedRadioButton) {
        const checkedValue = checkedRadioButton.value;
        const checkedLabel = document.querySelector('label[for="' + checkedRadioButton.id + '"]');
        const selectedText = checkedLabel.textContent.trim();
        selectedCategoryElement.textContent = selectedText;
        
        let selectedCount = 0;
        if (checkedValue !== 'All') {
            const checkedCategories = document.querySelectorAll('.target[data-category~=' + '"' + checkedValue + '"]');
            selectedCount = checkedCategories.length;
        } else {
            selectedCount = targets.length;
        }
        selectedTagCountElement.textContent = selectedCount;
    }

    // ラジオボタンの value の値（カテゴリ名）を格納する配列
    const category_array = [];
    for (let input_category of input_categories) {
        input_category.addEventListener('change', function() {
            for (let target of targets) {
                target.style.setProperty('display', 'block');
            }
            let selectedCount = 0; // カウントの初期化
            if (this.checked) {
                if (this.value !== 'All') {
                    const not_checked_categories = document.querySelectorAll('.target:not([data-category~=' + '"' + this.value + '"])');
                    for (let not_checked_category of not_checked_categories) {
                        not_checked_category.style.setProperty('display', 'none');
                    }
                    // 選択されたカテゴリに対応する要素をカウント
                    const checked_categories = document.querySelectorAll('.target[data-category~=' + '"' + this.value + '"]');
                    selectedCount = checked_categories.length;
                } else {
                    selectedCount = targets.length;
                }
            }
            // カウントを表示
            selectedTagCountElement.textContent = selectedCount;
            // 選択されたラジオボタンのラベルのテキストを取得して表示
            const selectedLabel = document.querySelector('label[for="' + this.id + '"]');
            selectedCategoryElement.textContent = selectedLabel.textContent.trim();
        });
        // ラジオボタンの value の値を配列（category_array）に追加
        category_array.push(input_category.getAttribute('value'));
    }

    // カテゴリ名（ラジオボタンの value の値）をキーとする連想配列の初期化
    const category_vars = {};
    // カテゴリ名をキーとする連想配列の要素を生成し値（カウント数）に初期値 0 を設定
    for (let cat of category_array) {
        category_vars[cat] = 0;
    }

    // [data-category] 属性を持つ要素を取得
    const data_categories = document.querySelectorAll("[data-category]");
    // それぞれの要素の data-category の値を取得し、それぞれの値をカウントアップ
    for (let data_category of data_categories) {
        // data-category の値を取得
        let category_values = data_category.getAttribute('data-category');
        // data-category の値を半角スペース（空白文字の正規表現）で分割
        let category_values_array = category_values.split(/\s/);
        // 分割された data-category の値をキーとした連想配列の値をカウントアップ
        for (let category_value of category_values_array) {
            category_vars[category_value]++;
        }
    }
});

function valueChange(event) {
    let selectedId = event.target.id; // 選択されたラジオボタンのIDを取得
    let label = document.querySelector('label[for="' + selectedId + '"]'); // 選択されたラジオボタンに対応するラベルを取得
    let selectedValue = label.textContent.trim(); // ラベルのテキストを取得
    console.log('選択されているのは ' + selectedValue + ' です。');
    // 表示を更新する要素を取得
    let selectedCategoryElement = document.getElementById('selectedCategory');
    selectedCategoryElement.textContent = selectedValue;
}

document.addEventListener('DOMContentLoaded', function() {
    let radioButtons = document.querySelectorAll('input[type="radio"][name="categories"]');
    radioButtons.forEach(function(radioButton) {
        radioButton.addEventListener('change', valueChange);
    });
});
