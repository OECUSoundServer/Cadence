const langButtons = document.querySelectorAll(".lang-btn");
const lyricBlocks = document.querySelectorAll(".lyrics-text[data-lang]");

langButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedLang = button.dataset.lang;

    // ボタン見た目切り替え
    langButtons.forEach((btn) => {
      btn.classList.remove("is-active");
    });
    button.classList.add("is-active");

    // 歌詞表示切り替え
    lyricBlocks.forEach((block) => {
      if (block.dataset.lang === selectedLang) {
        block.hidden = false;
        block.classList.add("is-active");
      } else {
        block.hidden = true;
        block.classList.remove("is-active");
      }
    });
  });
});
