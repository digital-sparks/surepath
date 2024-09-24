import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

window.Webflow ||= [];
window.Webflow.push(() => {
  const nav = document.querySelector('.nav_component');
  const navBackground = document.querySelector('.nav_background');
  const animationDuration = 0.2;
  let navIsInversed = true;
  let navState = nav.getAttribute('nav-state') === 'inverse';
  console.log(navState);

  gsap.set(nav, { backgroundColor: 'rgba(255,255,255,0)' });
  gsap.set(navBackground, { opacity: 0 });

  if (navState) nav.classList.add('inverse');

  ScrollTrigger.create({
    start: '25 top',
    end: '+=1',
    toggleActions: 'play none none reverse',
    onEnter: () => {
      gsap.to(nav, { backgroundColor: 'rgba(255, 255, 255, 1)', duration: animationDuration });
      if (navState) {
        navIsInversed = false;
        nav.classList.remove('inverse');
      }
    },
    onLeaveBack: () => {
      gsap.to(nav, { backgroundColor: 'rgba(255, 255, 255, 0)', duration: animationDuration });
      if (navState) {
        navIsInversed = true;
        nav.classList.add('inverse');
      }
    },
  });

  document.querySelectorAll('.nav_dropdown').forEach((dropdown) => {
    dropdown.addEventListener('mouseenter', () => {
      gsap.to(navBackground, { opacity: navState ? 0.3 : 0, duration: animationDuration });
    });
    dropdown.addEventListener('mouseleave', () => {
      gsap.to(navBackground, { opacity: 0, duration: animationDuration });
    });
  });

  if (navState) {
    document.querySelector('.nav_menu-open').addEventListener('click', () => {
      if (navIsInversed) nav.classList.remove('inverse');
    });

    document.querySelector('.nav_menu-close').addEventListener('click', () => {
      setTimeout(() => {
        if (navIsInversed) nav.classList.add('inverse');
      }, 350);
    });
  }
});
