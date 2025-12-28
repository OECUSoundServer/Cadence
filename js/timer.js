(() => {
  console.log("countdown js loaded:", location.pathname);

  const init = () => {
    const tick = () => {
      const now = new Date();

      document.querySelectorAll(".countdown").forEach((elem) => {
        const raw =
          elem.getAttribute("data-deadline") ||
          elem.getAttribute("data-target-time");
        if (!raw) return;

        const target = new Date(raw);
        if (Number.isNaN(target.getTime())) return;

        const remainMs = target - now;
        if (remainMs <= 0) {
          elem.textContent = "締切";
          return;
        }

        const totalSec = Math.floor(remainMs / 1000);
        const days = Math.floor(totalSec / 86400);
        const hours = Math.floor((totalSec % 86400) / 3600);
        const mins = Math.floor((totalSec % 3600) / 60);
        const secs = totalSec % 60;

        elem.textContent =
          `残り：${days}日 ` +
          `${hours}時間 ` +
          `${mins}分 ` +
          `${secs}秒`;
      });
    };

    tick();
    setInterval(tick, 1000);
  };

  // DOMContentLoaded 前後どちらでも確実に初期化
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();



// JavaScript Document
// タイマーの日付を設定
// const day = document.getElementById("day");
// const hour = document.getElementById("hour");
// const min = document.getElementById("min");
// const sec = document.getElementById("sec");

// function countdown() {
//   document.querySelectorAll('.countdown').forEach(function (elem) {
//     const now = new Date(); // 現在時刻を取得
//     const deadline = new Date(elem.getAttribute("data-target-time"));
//     const diff = deadline - now.getTime(); // 時間の差を取得（ミリ秒）

//     // 指定の日時を過ぎていたらスキップ
//     if(diff < 0) return true

//     // ミリ秒から単位を修正
//     const calcDay = Math.floor(diff / 1000 / 60 / 60 / 24);
//     const calcHour = Math.floor(diff / 1000 / 60 / 60) % 24;
//     const calcMin = Math.floor(diff / 1000 / 60) % 60;
//     const calcSec = Math.floor(diff / 1000) % 60;

//     // 取得した時間を表示（2桁表示）
//     day.innerHTML = calcDay < 10 ? '0' + calcDay : calcDay;
//     hour.innerHTML = calcHour < 10 ? '0' + calcHour : calcHour;
//     min.innerHTML = calcMin < 10 ? '0' + calcMin : calcMin;
//     sec.innerHTML = calcSec < 10 ? '0' + calcSec : calcSec;
//   });
// }
// countdown();
// setInterval(countdown,1000);
ddocument.addEventListener("DOMContentLoaded", () => {
  // 二重起動ガード
  if (window.__countdownStarted) return;
  window.__countdownStarted = true;

  const tick = () => {
    const now = new Date();

    document.querySelectorAll(".countdown").forEach((elem) => {
      const raw =
        elem.getAttribute("data-deadline") ||
        elem.getAttribute("data-target-time");
      if (!raw) return;

      const target = new Date(raw);
      if (Number.isNaN(target.getTime())) return;

      const remainMs = target - now;
      if (remainMs <= 0) {
        elem.textContent = "締切";
        return;
      }

      // 分単位に丸め（秒で毎秒表示が変わらない）
      const totalMin = Math.ceil(remainMs / 60000);

      const days = Math.floor(totalMin / 1440);      // 1440 = 24*60
      const hours = Math.floor((totalMin % 1440) / 60);
      const mins = totalMin % 60;

      // 表示を統一
      elem.textContent = `${days}日 ${hours}時間 ${mins}分`;
    });
  };

  tick();
  // 秒で更新する必要がないので、1秒より長くして目にも優しい
  setInterval(tick, 10_000); // 10秒ごと（必要なら 60_000 にして1分更新でもOK）
});
