import gsap from 'gsap';

window.Webflow ||= [];
window.Webflow.push(() => {
  function animateCareersBgCircles() {
    const circles = gsap.utils.shuffle(
      gsap.utils.toArray('.careers-bg_circle:not([style*="display: none"])')
    );

    circles.forEach((circle) => {
      gsap.from(circle.querySelectorAll('.careers-bg_line, img'), {
        opacity: 0.1,
        duration: 'random(2, 3)',
        scale: (_, target) => gsap.getProperty(target, 'scale') * 0.9,
        stagger: { amount: 0.15, from: 'end' },
        ease: 'power3.out',
        delay: 'random(0, 0.25)',
      });
    });
  }
  animateCareersBgCircles();

  // Configurable elements and selectors
  const CONFIG = {
    // Selector for the element that displays the job count string
    jobCountSelector: '[fs-element="summary"]',

    // Selector for the department wrap template
    departmentWrapTemplateSelector: '[fs-element="department-wrap"]',

    // Selector for the department name within the department wrap
    departmentNameSelector: '[fs-cmsfilter-field="department"]',

    // Selector for the job title within the department wrap
    jobTitleSelector: '[fs-cmsfilter-field="title"]',

    // Selector for the location within the department wrap
    locationSelector: '[fs-cmsfilter-field="location"]',

    // Selector for the "empty" message link
    emptyMessageLinkSelector: '[fs-cmsfilter-element="empty"] a',

    // Selector for the clear filters button
    clearFiltersSelector: '[fs-cmsfilter-element="clear"]',

    // Class name for identifying job items
    jobItemClassName: 'w-dyn-item',
  };

  const departments = new Set();
  const locations = new Set();

  const createOption = (target, value) => {
    const select = document.querySelector(`select[fs-cmsfilter-field="${target}"]`);
    const opt = document.createElement('option');
    opt.value = opt.innerHTML = value;
    select.appendChild(opt);
  };

  // const updateJobCountDisplay = (count, departmentCount, locationCount) => {
  //   const pluralize = (count, singular, total) =>
  //     `${count === total ? 'all' : count} ${singular}${count !== 1 ? 's' : ''}`;

  //   const textString = `${count} role${count !== 1 ? 's' : ''} across <strong>${pluralize(
  //     departmentCount,
  //     'department',
  //     departments.size
  //   )}</strong> and <strong>${pluralize(locationCount, 'location', locations.size)}</strong>`;

  //   document.querySelector(CONFIG.jobCountSelector).innerHTML = textString;
  // };

  const updateJobCountDisplay = (count, departmentCount, locationCount) => {
    const pluralize = (count, singular, total) =>
      `${count === total ? 'all' : count} ${singular}${count !== 1 || count === total ? 's' : ''}`;

    const textString = `${count} role${count !== 1 ? 's' : ''} across <strong>${pluralize(
      departmentCount,
      'department',
      departments.size
    )}</strong> and <strong>${pluralize(locationCount, 'location', locations.size)}</strong>`;

    document.querySelector(CONFIG.jobCountSelector).innerHTML = textString;
  };

  const processItem = async (item, departmentWrapTemplate, listInstance) => {
    const department = [...item.props.department.values][0];
    const location = [...item.props.location.values][0];

    if (!locations.has(location)) {
      locations.add(location);
      createOption('location', location);
    }

    if (!departments.has(department)) {
      departments.add(department);
      createOption('department', department);

      if (departmentWrapTemplate) {
        const departmentEl = departmentWrapTemplate.cloneNode(true);
        const departmentNameElement = departmentEl.querySelector(CONFIG.departmentNameSelector);
        if (departmentNameElement) {
          departmentNameElement.textContent = department;
        }

        const jobNameElement = departmentEl.querySelector(CONFIG.jobTitleSelector);
        const locationNameElement = departmentEl.querySelector(CONFIG.locationSelector);

        listInstance.items.forEach((innerItem) => {
          const innerDepartment = [...innerItem.props.department.values][0];
          const innerLocation = [...innerItem.props.location.values][0];
          const innerTitle = [...innerItem.props.title.values][0];

          if (innerDepartment === department) {
            const newEl = locationNameElement.cloneNode(true);
            newEl.textContent = innerLocation;
            locationNameElement.appendChild(newEl);

            jobNameElement.innerHTML += ` ${innerTitle}`;
          }
        });

        await listInstance.addStaticItems([
          {
            itemElement: departmentEl,
            targetIndex: item.currentIndex,
            interactive: true,
          },
        ]);
      }
    }
  };

  window.fsAttributes = window.fsAttributes || [];
  window.fsAttributes.push([
    'cmsfilter',
    async (filtersInstances) => {
      const [filtersInstance] = filtersInstances;
      const { listInstance } = filtersInstance;

      const departmentWrapTemplate = document.querySelector(CONFIG.departmentWrapTemplateSelector);

      for (const item of listInstance.items) {
        await processItem(item, departmentWrapTemplate, listInstance);
      }

      const jobItems = listInstance.items.filter((item) =>
        item.element.classList.contains(CONFIG.jobItemClassName)
      );
      updateJobCountDisplay(jobItems.length, departments.size, locations.size);

      listInstance.on('renderitems', (renderedItems) => {
        const filterItems = renderedItems.filter((item) =>
          item.element.classList.contains(CONFIG.jobItemClassName)
        );

        const counts = filterItems.reduce(
          (acc, { props }) => {
            props?.location?.values?.forEach((loc) => acc.locations.add(loc));
            props?.department?.values?.forEach((dept) => acc.departments.add(dept));
            return acc;
          },
          { count: 0, locations: new Set(), departments: new Set() }
        );

        updateJobCountDisplay(filterItems.length, counts.departments.size, counts.locations.size);
      });
    },
  ]);

  document.querySelector(CONFIG.emptyMessageLinkSelector).addEventListener('click', () => {
    document.querySelector(CONFIG.clearFiltersSelector).click();
  });
});
