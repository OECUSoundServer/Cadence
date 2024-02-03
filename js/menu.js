$('#hamburger').on('click', function () {
    console.log('ハンバーガーがクリックされました。');
    $('.icon').toggleClass('close');
    $('.sm').slideToggle();
});