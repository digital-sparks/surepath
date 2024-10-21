import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

window.Webflow ||= [];
window.Webflow.push(() => {
  ScrollTrigger.create({
    trigger: '.sub-nav_component',
    start: 'top +=96px',
    onEnter: () => {
      gsap.to('.sub-nav_shadow', { opacity: 1, duration: 0.2 });
    },
    onLeaveBack: () => {
      gsap.to('.sub-nav_shadow', { opacity: 0, duration: 0.2 });
    },
  });

  gsap.set('.sticky-col_image-wrap:not(:first-child)', {
    opacity: 0,
  });

  document.querySelectorAll('.sticky-col_wrap').forEach((stickyWrap) => {
    const rows = stickyWrap.querySelectorAll('.sticky-col_row');
    const images = stickyWrap.querySelectorAll('.sticky-col_image-wrap');

    const yOffsetFactor = 2;
    const durationFactor = 0.45;
    const easeFactor = 'power1.inOut';

    rows.forEach((row, index) => {
      if (index === 0) return; // Skip the first row

      ScrollTrigger.create({
        trigger: row.querySelector('.sticky-col_row-wrap'),
        // markers: true,
        start: 'top 55%',
        onEnter: () => {
          gsap.to(images[index - 1], {
            yPercent: yOffsetFactor,
            ease: easeFactor,
            duration: durationFactor * 1.5,
            opacity: 0,
          });
          gsap.fromTo(
            images[index],
            { yPercent: yOffsetFactor },
            { yPercent: 0, opacity: 1, ease: easeFactor, duration: durationFactor }
          );
        },
        onLeaveBack: () => {
          gsap.to(images[index], {
            yPercent: yOffsetFactor,
            ease: easeFactor,
            duration: durationFactor,
            opacity: 0,
          });
          gsap.fromTo(
            images[index - 1],
            { yPercent: yOffsetFactor },
            { yPercent: 0, opacity: 1, ease: easeFactor, duration: durationFactor * 1.5 }
          );
        },
      });
    });
  });
});
