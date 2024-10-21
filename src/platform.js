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

  document.querySelectorAll('.sticky-col_wrap').forEach((stickyWrap) => {
    const rows = Array.from(stickyWrap.querySelectorAll('.sticky-col_row'));
    const images = Array.from(stickyWrap.querySelectorAll('.sticky-col_image-wrap'));

    const animationConfig = {
      yOffsetFactor: 2,
      duration: 0.45,
      ease: 'power1.inOut',
    };

    let currentAnimation = null;
    let currentImageIndex = 0;

    rows.forEach((row, index) => {
      if (index === 0) return; // Skip the first row

      ScrollTrigger.create({
        trigger: row.querySelector('.sticky-col_row-wrap'),
        start: 'top 55%',
        onEnter: () => animateImages(index),
        onLeaveBack: () => animateImages(index - 1),
      });
    });

    function animateImages(newIndex) {
      if (currentAnimation) {
        currentAnimation.kill();
      }

      const oldIndex = currentImageIndex;
      currentImageIndex = newIndex;

      const tl = gsap.timeline();

      // Fade out the old image and any other visible images
      images.forEach((img, idx) => {
        if (idx !== newIndex) {
          tl.to(
            img,
            {
              yPercent: animationConfig.yOffsetFactor,
              opacity: 0,
              duration: animationConfig.duration,
              ease: animationConfig.ease,
            },
            idx === oldIndex ? 0 : '<'
          );
        }
      });

      // Fade in the new image
      tl.fromTo(
        images[newIndex],
        { yPercent: animationConfig.yOffsetFactor, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: animationConfig.duration, ease: animationConfig.ease },
        '<'
      );

      currentAnimation = tl;
    }

    // Initialize the first image
    gsap.set(images[0], { opacity: 1, yPercent: 0 });
    images
      .slice(1)
      .forEach((img) => gsap.set(img, { opacity: 0, yPercent: animationConfig.yOffsetFactor }));
  });
});
