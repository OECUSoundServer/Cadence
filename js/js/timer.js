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
let countdown = setInterval(function(){
    document.querySelectorAll('.countdown').forEach(function (elem) {
        const now = new Date()  //今の日時
        const targetTime = new Date(elem.getAttribute("data-target-time"))  //ターゲット日時を取得
        const remainTime = targetTime - now  //差分を取る（ミリ秒で返ってくる

        // 指定の日時を過ぎていたらスキップ
        if(remainTime < 0) return true

        // //差分の日・時・分・秒を取得
        const difDay = Math.floor(remainTime / 1000 / 60 / 60 / 24) % 365
        const difHour = Math.floor(remainTime / 1000 / 60 / 60 ) % 24
        const difMin = Math.floor(remainTime / 1000 / 60) % 60
        const difSec = Math.floor(remainTime / 1000) % 60

        // //残りの日時を上書き
        elem.querySelectorAll('.countdown-day')[0].textContent = difDay
        elem.querySelectorAll('.countdown-hour')[0].textContent = difHour
        elem.querySelectorAll('.countdown-min')[0].textContent = difMin
        elem.querySelectorAll('.countdown-sec')[0].textContent = difSec
    });
}, 1000)    //1秒間に1度処理