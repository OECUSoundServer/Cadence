// ボタン要素を取得
const sortButton = document.getElementById('sortButton');

// クリック回数をカウントするための変数
let clickCount = 0;

// ボタンがクリックされたときの処理を定義
sortButton.addEventListener('click', () => {
  // クリック回数に基づいて並び替えオプションを切り替える
  switch (clickCount % 4) {
    case 0:
      sortItemsByDate(true); // 日付昇順
      break;
    case 1:
      sortItemsByDate(false); // 日付降順
      break;
    case 2:
      sortItemsByPrice(true); // 値段昇順
      break;
    case 3:
      sortItemsByPrice(false); // 値段降順
      break;
  }
  clickCount++;
});

// 初めに日付昇順で並び替える
sortItemsByDate(false);

// 日付に基づいて要素を並び替える関数
function sortItemsByDate(ascending) {
  const targetList = document.querySelector('.targets');
  const targetItems = Array.from(targetList.querySelectorAll('.target'));

  targetItems.sort((a, b) => {
    const dateA = new Date(a.querySelector('time').getAttribute('datetime'));
    const dateB = new Date(b.querySelector('time').getAttribute('datetime'));
    return ascending ? dateA - dateB : dateB - dateA;
  });

  targetItems.forEach(item => targetList.appendChild(item));
}

// 値段に基づいて要素を並び替える関数
function sortItemsByPrice(ascending) {
  const targetList = document.querySelector('.targets');
  const targetItems = Array.from(targetList.querySelectorAll('.target'));

  targetItems.sort((a, b) => {
    const priceA = parseFloat(a.querySelector('figcaption:nth-of-type(1)').textContent);
    const priceB = parseFloat(b.querySelector('figcaption:nth-of-type(1)').textContent);
    return ascending ? priceA - priceB : priceB - priceA;
  });

  targetItems.forEach(item => targetList.appendChild(item));
}
