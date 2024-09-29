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
});
