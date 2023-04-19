// 絵文字要素を取得
const emoji = document.querySelectorAll(".emoji");

emoji.forEach(function(value) {

      // 自身の親要素のstyleを取得
      let style = window.getComputedStyle(value.parentNode);

      // 絵文字要素のheightに適用
      value.style.height = style.fontSize;
});