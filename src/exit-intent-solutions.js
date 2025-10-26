window.Webflow ||= [];
window.Webflow.push(() => {
  // Variables
  const exitIntent = document.getElementById('fs-exit-popup');
  const pageUrl = window.location.pathname;
  const storageKey = `exitPopupShown_${pageUrl}`;
  const closeButtons = document.querySelectorAll('[aria-controls=fs-exit-popup]');
  let hasShownPopup = false;
  let hasReachedBottom = false;
  let bottomPosition = 0;

  // Initial setup
  exitIntent.style.display = 'none';
  exitIntent.style.opacity = '0';

  // Functions
  function getFormId() {
    const formIdElement = exitIntent.querySelector('[modal-form-id]');
    return formIdElement ? formIdElement.getAttribute('modal-form-id') : null;
  }

  function getModalName() {
    const modalName = exitIntent.querySelector('[fs-modal-name]');
    return modalName ? modalName.getAttribute('fs-modal-name') : null;
  }

  function showPopup() {
    if (hasShownPopup || sessionStorage.getItem(storageKey)) return;

    exitIntent.style.display = 'flex';
    setTimeout(() => {
      exitIntent.style.opacity = '1';
    }, 10);

    const formId = getFormId();
    const modalName = getModalName();
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'exit_intent_shown',
      label: modalName,
      form_id: formId,
    });

    hasShownPopup = true;
    sessionStorage.setItem(storageKey, 'true');
  }

  function closePopup() {
    exitIntent.style.opacity = '0';
    setTimeout(() => {
      exitIntent.style.display = 'none';
    }, 300);

    const formId = getFormId();
    const modalName = getModalName();
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'exit_intent_closed',
      label: modalName,
      form_id: formId,
    });
  }

  function isScrolledToBottom() {
    return window.innerHeight + window.scrollY >= document.body.offsetHeight - 50;
  }

  // Event listeners
  window.addEventListener(
    'scroll',
    () => {
      const currentPosition = window.pageYOffset || document.documentElement.scrollTop;

      if (isScrolledToBottom() && !hasReachedBottom) {
        hasReachedBottom = true;
        bottomPosition = currentPosition;
      }

      if (hasReachedBottom && !hasShownPopup && bottomPosition - currentPosition > 200) {
        showPopup();
      }
    },
    false
  );

  closeButtons.forEach((elem) => {
    elem.addEventListener('click', closePopup);
  });
});
