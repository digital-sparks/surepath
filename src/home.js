import { Swiper, Parallax, Keyboard, Mousewheel, Autoplay } from 'swiper';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger);

window.Webflow ||= [];
Webflow.push(function () {
  const slidesLength = document.querySelectorAll('.solution-swiper_item').length;

  const solutionsSwiper = new Swiper('.solution-swiper_wrapper', {
    modules: [Parallax, Keyboard, Mousewheel, Autoplay],
    wrapperClass: 'solution-swiper_list',
    slideClass: 'solution-swiper_item',
    slidesPerView: 'auto',
    direction: 'horizontal',
    spaceBetween: 24,
    grabCursor: true,
    loop: true,
    speed: 550,
    parallax: true,
    // initialSlide: slidesLength - 1,
    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },
    autoplay: {
      delay: 3500,
      pauseOnMouseEnter: true,
      disableOnInteraction: true,
    },
    breakpoints: {
      768: {
        speed: 900,
        spaceBetween: 32,
        mousewheel: {
          enabled: true,
          forceToAxis: true,
          thresholdDelta: 5,
        },
      },
    },
    on: {
      beforeInit: (swiper) => {
        swiper.wrapperEl.style.gridColumnGap = 'unset';
      },
      afterInit: (swiper) => {
        swiper.autoplay.stop();

        ScrollTrigger.create({
          trigger: swiper.el,
          start: '75% bottom',
          once: true,
          // markers: true,
          onEnter: () => {
            setTimeout(() => {
              swiper.slideNext();
              swiper.autoplay.start();
            }, 205);
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
