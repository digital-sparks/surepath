import { Swiper, Parallax, Keyboard, Mousewheel, Autoplay } from 'swiper';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger);

window.Webflow ||= [];
Webflow.push(() => {
  let swiperInteracted = false;
  let swiperFirstInteracted = false;

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
    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },
    autoplay: {
      enabled: false,
      delay: 4000,
      pauseOnMouseEnter: false,
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
      sliderMove: () => {
        swiperInteracted = true;
      },
      sliderFirstMove: () => {
        swiperFirstInteracted = true;
      },
      afterInit: (swiper) => {
        const handleMouseEnter = () => swiper.autoplay.stop();
        const handleMouseLeave = () => {
          if (!swiperInteracted) swiper.autoplay.start();
        };

        swiper.wrapperEl.addEventListener('mouseenter', handleMouseEnter);
        swiper.wrapperEl.addEventListener('mouseleave', handleMouseLeave);

        ScrollTrigger.create({
          trigger: swiper.el,
          start: '75% bottom',
          end: '125% top',
          // markers: true,
          onLeaveBack: () => {
            swiperInteracted = false;
            swiper.autoplay.start();
          },
          onLeave: () => {
            swiperInteracted = false;
          },
          onEnter: () => {
            if (!swiperFirstInteracted) {
              swiper.slideNext();
              swiper.autoplay.start();
            }
          },
          onEnterBack: () => {
            swiperInteracted = false;
            swiper.autoplay.start();
          },
        });
      },
      slideChange: (swiper) => {
        const links = document.querySelectorAll('.solution-swiper_component .links_link');
        links.forEach((link) => link.classList.remove('is-active'));
        links[swiper.realIndex].classList.add('is-active');
      },
    },
  });

  const links = document.querySelectorAll('.solution-swiper_component .links_link');
  links.forEach((link, index) => {
    link.addEventListener('click', () => {
      swiperFirstInteracted = true;
      swiperInteracted = true;
      solutionsSwiper.slideToLoop(index);
    });
  });
});
