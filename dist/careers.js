(() => {
  // bin/live-reload.js
  new EventSource(`${"http://localhost:3000"}/esbuild`).addEventListener("change", () => location.reload());

  // src/careers.js
  window.Webflow ||= [];
  window.Webflow.push(() => {
    let departments = [];
    let locations = [];
    const jobLength = document.querySelectorAll('[fs-cmsfilter-element="list"] .w-dyn-item').length;
    document.querySelector('[fs-element="string"]').innerHTML = `${jobLength} role${jobLength > 1 || jobLength === 0 ? "s" : ""} across <strong> all departments </strong> and <strong> all locations</strong>.`;
    document.querySelectorAll('[fs-cmsfilter-element="list"] .w-dyn-item').forEach((job) => {
      const locationElement = job.querySelector('[fs-cmsfilter-field="location"]');
      if (locationElement) {
        const locationName = locationElement.textContent.trim();
        if (!locations.includes(locationName)) {
          locations.push(locationName);
          const select = document.querySelector('select[fs-cmsfilter-field="location"]');
          let opt = document.createElement("option");
          opt.value = locationName;
          opt.innerHTML = locationName;
          select.appendChild(opt);
        }
      }
      const departmentElement = job.querySelector('[fs-cmsfilter-field="department"]');
      if (departmentElement) {
        const departmentName = departmentElement.textContent.trim();
        if (!departments.includes(departmentName)) {
          departments.push(departmentName);
          const select = document.querySelector('select[fs-cmsfilter-field="department"]');
          let opt = document.createElement("option");
          opt.value = departmentName;
          opt.innerHTML = departmentName;
          select.appendChild(opt);
          const departmentWrapTemplate = document.querySelector('[fs-element="department-wrap"]');
          if (departmentWrapTemplate) {
            const newDepartmentWrap = departmentWrapTemplate.cloneNode(true);
            const departmentNameElement = newDepartmentWrap.querySelector(
              '[fs-cmsfilter-field="department"]'
            );
            if (departmentNameElement) {
              departmentNameElement.textContent = departmentName;
            }
            const jobNameElement = newDepartmentWrap.querySelector('[fs-cmsfilter-field="title"]');
            const locationNameElement = newDepartmentWrap.querySelector(
              '[fs-cmsfilter-field="location"]'
            );
            document.querySelectorAll('[fs-cmsfilter-element="list"] .w-dyn-item').forEach((innerJob) => {
              const innerDepartment = innerJob.querySelector(
                '[fs-cmsfilter-field="department"]'
              ).textContent;
              const innerLocation = innerJob.querySelector(
                '[fs-cmsfilter-field="location"]'
              ).textContent;
              const innertitle = innerJob.querySelector('[fs-cmsfilter-field="title"]').textContent;
              if (innerDepartment === departmentName) {
                const newEl = locationNameElement.cloneNode(true, true);
                newEl.textContent = innerLocation;
                locationNameElement.append(newEl);
                jobNameElement.innerHTML = `${jobNameElement.innerHTML} ${innertitle}`;
              }
            });
            job.parentNode.insertBefore(newDepartmentWrap, job);
          }
        }
      }
    });
    window.fsAttributes = window.fsAttributes || [];
    window.fsAttributes.push([
      "cmsfilter",
      (filterInstances) => {
        const [filterInstance] = filterInstances;
        filterInstance.listInstance.on("renderitems", (renderedItems) => {
          console.log(renderedItems);
          const filterItems = renderedItems.filter(
            (item) => item.element.classList.contains("w-dyn-item")
          );
          const count = filterItems.length;
          const uniqueLocations = /* @__PURE__ */ new Set();
          const uniqueDepartments = /* @__PURE__ */ new Set();
          filterItems.forEach((item) => {
            if (item.props && item.props.location && item.props.location.values) {
              item.props.location.values.forEach((location2) => uniqueLocations.add(location2));
            }
            if (item.props && item.props.department && item.props.department.values) {
              item.props.department.values.forEach((department) => uniqueDepartments.add(department));
            }
          });
          const locationCount = uniqueLocations.size;
          const departmentCount = uniqueDepartments.size;
          console.log(count, locationCount, departmentCount);
          const textString = `${count} role${count > 1 || count === 0 ? "s" : ""} across <strong>${departmentCount === departments.length ? "all" : departmentCount} department${departmentCount > 1 || departmentCount === 0 ? "s" : ""} </strong> and <strong>${locationCount === locations.length ? "all" : locationCount} location${locationCount > 1 || locationCount === 0 ? "s" : ""}</strong>.`;
          document.querySelector('[fs-element="string"]').innerHTML = textString;
          console.log(textString);
        });
      }
    ]);
    document.querySelector('[fs-cmsfilter-element="empty"] a').addEventListener("click", () => {
      document.querySelector('[fs-cmsfilter-element="clear"]').click();
    });
  });
})();
//# sourceMappingURL=careers.js.map
