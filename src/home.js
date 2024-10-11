import { Swiper, Parallax, Keyboard, Mousewheel } from 'swiper';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger);

window.Webflow ||= [];
Webflow.push(function () {
  const slidesLength = document.querySelectorAll('.solution-swiper_item').length;

  const solutionsSwiper = new Swiper('.solution-swiper_wrapper', {
    modules: [Parallax, Keyboard, Mousewheel],
    wrapperClass: 'solution-swiper_list',
    slideClass: 'solution-swiper_item',
    slidesPerView: 'auto',
    direction: 'horizontal',
    spaceBetween: 24,
    grabCursor: true,
    loop: true,
    speed: 400,
    parallax: true,
    initialSlide: slidesLength - 1,
    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },
    breakpoints: {
      768: {
        speed: 750,
        spaceBetween: 32,
        mousewheel: {
          enabled: true,
          forceToAxis: true,
          releaseOnEdges: true,
        },
      },
    },
    on: {
      beforeInit: (swiper) => {
        swiper.wrapperEl.style.gridColumnGap = 'unset';

        ScrollTrigger.create({
          trigger: swiper.el,
          start: '75% bottom',
          once: true,
          onEnter: () => {
            solutionsSwiper.slideNext();
          },
        });
      },
      slideChange: (swiper) => {
        document.querySelectorAll('.solution-swiper_component .links_link').forEach((link) => {
          link.classList.remove('is-active');
        });

        document
          .querySelectorAll('.solution-swiper_component .links_link')
          [swiper.realIndex].classList.add('is-active');
      },
    },
  });

  document.querySelectorAll('.solution-swiper_component .links_link').forEach((link, index) => {
    link.addEventListener('click', () => {
      solutionsSwiper.slideToLoop(index);
    });
  });
});
