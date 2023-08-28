document.addEventListener("DOMContentLoaded", function() {
  const formatSelect = document.getElementById('file-format');
  const downloadButtons = document.getElementById('download-buttons');
  const downloadPrompt = document.getElementById('download-prompt');

  // ページ読み込み時に「形式を選択してください」と表示
  downloadPrompt.style.display = 'inline-block';

  formatSelect.addEventListener('change', () => {
    const selectedFormat = formatSelect.value;
    if (selectedFormat) {
      // フォーマットが選択されたら、プロンプトを非表示にし、対応するボタンを表示する
      downloadPrompt.style.display = 'none';
      hideDownloadButtons();

      // 選択された拡張子に対応するボタンを表示
      const downloadButton = document.getElementById(`${selectedFormat}-btn`);
      downloadButton.style.display = 'inline-block';
    } else {
      // フォーマットが未選択の場合、プロンプトを表示し、すべてのボタンを非表示にする
      downloadPrompt.style.display = 'inline-block';
      hideDownloadButtons();
    }
  });

  function hideDownloadButtons() {
    const buttons = downloadButtons.querySelectorAll('.download-btn');
    buttons.forEach((button) => {
      button.style.display = 'none';
    });
  }
});