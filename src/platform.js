import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

window.Webflow ||= [];
window.Webflow.push(() => {
  gsap.set('.sticky-col_image-wrap:not(:first-child)', {
    opacity: 0,
  });

  document.querySelectorAll('.sticky-col_wrap').forEach((stickyWrap) => {
    const rows = stickyWrap.querySelectorAll('.sticky-col_row');
    const images = stickyWrap.querySelectorAll('.sticky-col_image-wrap');

    rows.forEach((row, index) => {
      if (index === rows.length) return; // Skip the last row

      ScrollTrigger.create({
        trigger: row.querySelector('.sticky-col_row-wrap'),
        // markers: true,
        start: 'bottom 80px',
        onEnter: () => gsap.to(images[index + 1], { opacity: 1, duration: 0.2 }),
        onLeaveBack: () => gsap.to(images[index + 1], { opacity: 0, duration: 0.2 }),
      });
    });
  });
});