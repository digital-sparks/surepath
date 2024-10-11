import { Swiper, Keyboard, Mousewheel, Navigation, Pagination } from 'swiper';

window.Webflow ||= [];
Webflow.push(function () {
  const swiperCarousel = new Swiper('.team-swiper_wrapper', {
    modules: [Keyboard, Mousewheel, Navigation, Pagination],
    wrapperClass: 'team-swiper_list',
    slideClass: 'team-swiper_item',
    slidesPerView: 'auto',
    direction: 'horizontal',
    spaceBetween: 24,
    grabCursor: true,
    loop: false,
    speed: 400,
    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },
    breakpoints: {
      mousewheel: {
        enabled: true,
        forceToAxis: true,
        releaseOnEdges: true,
      },
      768: {
        spaceBetween: 32,
      },
    },
    navigation: {
      nextEl: '.swiper_button.is-next',
      prevEl: '.swiper_button.is-prev',
    },
    pagination: {
      el: '.swiper_pagination',
      type: 'bullets',
      bulletClass: 'swiper_pagination-bullet',
      bulletActiveClass: 'is-active',
      clickable: true,
    },
    on: {
      beforeInit: (swiper) => {
        swiper.wrapperEl.style.gridColumnGap = 'unset';
      },
    },
  });
});
