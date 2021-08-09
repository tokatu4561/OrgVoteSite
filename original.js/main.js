const updateButton = () => {
  if ($(window).scrollTop() >= 20) {
    $('.back-to-top').fadeIn();
  }
  else {
    $('.back-to-top').fadeOut();
  }
};

$(window).on('scroll', updateButton);

// ボタンをクリックしたらページトップにスクロールする
$('.back-to-top').on('click', (e) => {
  e.preventDefault();
  $('main').animate({ scrollTop: 0 }, 600);
});
