// // JavaScript Document
// function gate(){
//    // ▼ユーザの入力を求める
//    var UserInput = prompt("パスワードを入力して下さい:","");
//    // ▼入力内容をチェック
//    if( /\W+/g.test(UserInput) ) {
//       // ▼半角英数字以外の文字が存在したらエラー
//       alert("半角英数字のみを入力して下さい。");
//    }
//    // ▼キャンセルをチェック
//    else if( UserInput != null ) {
//       // ▼入力内容からファイル名を生成して移動
//       location.href = UserInput + ".html";
//    }
// }

// function gate(){
//    // ▼ユーザの入力を求める
//    var UserInput = prompt("パスワードを入力して下さい:","");
//    // ▼入力内容をチェック
//    if( /[^a-zA-Z0-9\-]+/g.test(UserInput) ) {
//       // ▼半角英数字とハイフン以外の文字が存在したらエラー
//       alert("半角英数字とハイフンのみを入力して下さい。");
//    }
//    // ▼キャンセルをチェック
//    else if( UserInput != null ) {
//       // ▼入力内容からファイル名を生成して移動
//       location.href = UserInput + ".html";
//    }
// }

function gate(){
   // ▼ユーザの入力を求める
   var userInput = prompt("パスワードを入力して下さい:","");
   // ▼入力内容をチェック
   if( /[^a-zA-Z0-9\-]+/g.test(userInput) ) {
      // ▼半角英数字とハイフン以外の文字が存在したらエラー
      alert("半角英数字とハイフンのみを入力して下さい。");
   }
   // ▼キャンセルをチェック
   else if( userInput !== null ) {
      // ▼入力内容からファイル名を生成
      var fileName = userInput + ".html";
      // ▼ページが存在するかチェック
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
         if (this.readyState == 4) {
            if (this.status == 200) {
               // ▼ページが存在する場合は移動
               location.href = fileName;
            } else {
               // ▼ページが存在しない場合は警告を表示
               alert("ページが存在しません。");
            }
         }
      };
      xhttp.open("GET", fileName, true);
      xhttp.send();
   }
}
