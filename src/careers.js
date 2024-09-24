window.Webflow ||= [];
window.Webflow.push(() => {

// Fetch job data from the API
fetch('https://api.rippling.com/platform/api/ats/v1/board/surepath-ai/jobs')
  .then(response => response.json())
  .then(jobs => {
    // Get unique departments
    const departments = [...new Set(jobs.map(job => job.department.label))];

    // Get the job_component element
    const jobComponent = document.querySelector('.job_component');

    // For each department
    departments.forEach(department => {
      // Clone the department-wrap element
      const departmentWrap = document.querySelector('[fs-element="department-wrap"]').cloneNode(true);

     // Set the department name for all matching elements
    departmentWrap.querySelectorAll('[fs-element="department"]').forEach(element => {
    element.textContent = department;
    });

      // Get jobs for this department
      const departmentJobs = jobs.filter(job => job.department.label === department);

      // Remove the original job element (we'll replace it with new ones)
      departmentWrap.querySelector('[fs-element="job"]').remove();

      // For each job in this department
      departmentJobs.forEach(job => {
        // Clone the job element
        const jobElement = document.querySelector('[fs-element="job"]').cloneNode(true);

        // Set job title and link
        const jobLink = jobElement.querySelector('[fs-element="job-link"]');
        jobLink.href = job.url;

        const jobTitle = jobElement.querySelector('[fs-element="job-title"]');
        jobTitle.textContent = job.name;
        jobTitle.href = job.url;

        // Set location
        jobElement.querySelector('[fs-element="location"]').textContent = job.workLocation.label;

        // Append the job element to the department wrap
        departmentWrap.appendChild(jobElement);
      });

      // Append the department wrap to the job component
      jobComponent.appendChild(departmentWrap);
    });

    // Remove the original department-wrap element
    document.querySelector('[fs-element="department-wrap"]').remove();
  })
.catch(error => console.error('Error fetching jobs:', error));

})