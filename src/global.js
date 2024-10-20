import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
gsap.registerPlugin(SplitText, ScrollTrigger);

window.Webflow ||= [];
window.Webflow.push(() => {
  const testimonialComponents = document.querySelectorAll('.testimonial_component blockquote');

  document.fonts.ready.then(() => {
    testimonialComponents.forEach((quote) => {
      let headingSpans;
      let masterTimeline;

      const applyHighlighter = () => {
        headingSpans = quote.querySelectorAll('.heading-span');
        const lines = gsap.utils.toArray(headingSpans);

        gsap.defaults({ ease: 'power2.out', duration: 1.2 });

        // Prepare highlight elements without setting initial styles
        const lineProperties = lines.map((line) => ({
          element: line,
          highlight: document.createElement('span'),
        }));

        // Append highlight elements without setting initial styles
        requestAnimationFrame(() => {
          lineProperties.forEach(({ element, highlight }) => {
            highlight.className = 'marker-effect';
            element.appendChild(highlight);
          });
        });

        // Create master timeline
        masterTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: quote,
            start: 'bottom bottom',
            end: 'bottom 40%',
            // markers: true,
          },
        });

        // Create a sequence of animations
        lines.forEach((line, i) => {
          masterTimeline.add(
            gsap
              .timeline()
              .set(
                line,
                {
                  '-webkit-background-clip': 'text',
                  background:
                    'linear-gradient(to right, var(--semantic--text--text-primary) 0%, var(--semantic--text--text-alternate) 0%)',
                },
                '>'
              ) // Set initial state at the start of this timeline
              .to(line, {
                backgroundImage:
                  'linear-gradient(to right, var(--semantic--text--text-primary) 100%, var(--semantic--text--text-alternate) 100%)',
              })
              .to(
                lineProperties[i].highlight,
                {
                  width: '100%',
                },
                '<'
              )
          );
        });
      };

      let text = nestedLinesSplit(quote, {
        type: 'lines',
        reduceWhiteSpace: true,
        lineThreshold: 1,
      });

      applyHighlighter();

      let previousWidth = window.innerWidth;
      const debounceDelay = 250;

      const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
      };

      const handleResize = () => {
        const currentWidth = window.innerWidth;
        if (currentWidth !== previousWidth) {
          text.revert();
          text = nestedLinesSplit(quote, {
            type: 'lines',
            reduceWhiteSpace: true,
            lineThreshold: 1,
          });
          gsap.set(quote.querySelectorAll('.heading-span'), {
            backgroundColor: 'white',
          });
          quote.querySelectorAll('.marker-effect').forEach((marker) => marker.remove());

          previousWidth = currentWidth;
          return true; // Indicate that the width has changed
        }
        return false; // Indicate that the width hasn't changed
      };

      const applyHighlighterDebounced = debounce(applyHighlighter, debounceDelay);

      const handleResizeAndApply = () => {
        const widthChanged = handleResize();
        if (widthChanged) {
          applyHighlighterDebounced();
        }
      };

      window.addEventListener('resize', handleResizeAndApply);
    });
  });

  function nestedLinesSplit(target, vars) {
    target = gsap.utils.toArray(target);
    if (target.length > 1) {
      let splits = target.map((t) => nestedLinesSplit(t, vars)),
        result = splits[0],
        resultRevert = result.revert;
      result.lines = splits.reduce((acc, cur) => acc.concat(cur.lines), []);
      result.revert = () => splits.forEach((s) => (s === result ? resultRevert() : s.revert()));
      return result;
    }
    target = target[0];
    let contents = target.innerHTML;
    gsap.utils.toArray(target.children).forEach((child) => {
      if (child.classList.contains('heading-span')) {
        // Split the heading-span content into words
        let words = child.textContent.split(/\s+/);
        let newContent = words.map((word) => `<span class="heading-word">${word}</span>`).join(' ');
        child.innerHTML = newContent;
      }
      let split = new SplitText(child, { type: 'lines' });
      split.lines.forEach((line) => {
        let clone = child.cloneNode(false);
        clone.innerHTML = line.innerHTML;
        target.insertBefore(clone, child);
      });
      target.removeChild(child);
    });
    let split = new SplitText(target, vars),
      originalRevert = split.revert;
    split.revert = () => {
      originalRevert.call(split);
      target.innerHTML = contents;
    };
    return split;
  }

  /////

  /////

  /////

  /////

  document.querySelectorAll('.logo-marquee_image').forEach((logo) => {
    logo.setAttribute('width', logo.dataset.width);
    logo.setAttribute('height', logo.dataset.height);
  });

  /////
  /////

  const nav = document.querySelector('.nav_component');
  const isDarkModeNav = nav.getAttribute('nav-state') === 'inverse';
  const animationDuration = 0.2;

  gsap.set(nav, { backgroundColor: 'rgba(255,255,255,0)' });

  if (isDarkModeNav) {
    nav.classList.add('inverse');
    nav.removeAttribute('nav-state');
  }

  ScrollTrigger.create({
    start: '25 top',
    end: '+=1',
    toggleActions: 'play none none reverse',
    onEnter: () => updateNavStyle(true),
    onLeaveBack: () => updateNavStyle(false),
  });

  function updateNavStyle(isEntering) {
    const backgroundColor = isEntering ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0)';
    gsap.to(nav, { backgroundColor, duration: animationDuration });

    if (isDarkModeNav) {
      nav.classList.toggle('inverse', !isEntering);
    }
  }

  if (isDarkModeNav) {
    const menuOpen = document.querySelector('.nav_menu-open');
    const menuClose = document.querySelector('.nav_menu-close');

    if (menuOpen && menuClose) {
      menuOpen.addEventListener('click', () => nav.classList.remove('inverse'));
      menuClose.addEventListener('click', () => {
        setTimeout(() => nav.classList.add('inverse'), 500);
      });
    }
  }
});
