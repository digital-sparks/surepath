import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

window.Webflow ||= [];
window.Webflow.push(() => {
  let subNavIsActive = false;
  let dropdownIsActive = false;

  const subNavComponent = document.querySelector('.sub-nav_component');
  const subNavShadow = document.querySelector('.sub-nav_shadow');

  const toggleSubNav = (show) => {
    gsap.to(subNavShadow, { opacity: show ? 1 : 0, duration: 0.2 });
    subNavIsActive = show;
    if (dropdownIsActive) {
      gsap.to(subNavComponent, { opacity: show ? 0 : 1, duration: 0.25 });
    }
  };

  ScrollTrigger.create({
    trigger: subNavComponent,
    start: 'top +=96px',
    onEnter: () => toggleSubNav(true),
    onLeaveBack: () => toggleSubNav(false),
  });

  const toggleDropdown = (active) => {
    dropdownIsActive = active;
    if (subNavIsActive) {
      gsap.to(subNavComponent, { opacity: active ? 0 : 1, duration: 0.25 });
    }
  };

  document.querySelectorAll('.nav_dropdown').forEach((dropdown) => {
    dropdown.addEventListener('mouseenter', () => toggleDropdown(true));
    dropdown.addEventListener('mouseleave', () => toggleDropdown(false));
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
