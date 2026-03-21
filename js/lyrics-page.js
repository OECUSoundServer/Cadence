document.addEventListener("DOMContentLoaded", () => {
  const langButtons = document.querySelectorAll(".lang-btn");
  const lyricBlocks = document.querySelectorAll(".lyrics-text[data-lang]");

  function applyPreviewToVisibleLyrics() {
    if (!window.LyricsPreview) return;

    lyricBlocks.forEach((block) => {
      if (!block.hidden) {
        LyricsPreview.apply(block);
      }
    });
  }

  langButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedLang = button.dataset.lang;

      langButtons.forEach((btn) => {
        btn.classList.remove("is-active");
      });
      button.classList.add("is-active");

      lyricBlocks.forEach((block) => {
        if (block.dataset.lang === selectedLang) {
          block.hidden = false;
          block.classList.add("is-active");
        } else {
          block.hidden = true;
          block.classList.remove("is-active");
        }
      });

      applyPreviewToVisibleLyrics();
    });
  });

  applyPreviewToVisibleLyrics();
});