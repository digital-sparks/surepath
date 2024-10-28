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
});
