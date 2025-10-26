window.Webflow ||= [];
window.Webflow.push(() => {
  // Variables
  const exitIntent = document.getElementById('fs-exit-popup');
  const pageUrl = window.location.pathname;
  const storageKey = `exitPopupShown_${pageUrl}`;
  const closeButtons = document.querySelectorAll('[aria-controls=fs-exit-popup]');
  const popupShowDelay = 10000; // 10 seconds
  const exitIntentDelay = 3000; // 3 seconds
  let entryTime = Date.now();
  let hasShownPopup = false;

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

  // Event listeners
  setTimeout(showPopup, popupShowDelay);

  document.addEventListener('mouseout', (e) => {
    if (e.clientY < 0 && Date.now() - entryTime > exitIntentDelay) {
      showPopup();
    }
  });

  closeButtons.forEach((elem) => {
    elem.addEventListener('click', closePopup);
  });
});
