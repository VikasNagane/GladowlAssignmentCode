function showAlert(message, type) {
  const alertContainer = document.getElementById('alertContainer');
  const alertElement = document.createElement('div');
  alertElement.classList.add('alert', `alert-${type}`, 'mt-3', 'fade', 'show', 'alert-dismissible');

  // Bootstrap close button
  const closeButton = document.createElement('button');
  closeButton.classList.add('close');
  closeButton.setAttribute('type', 'button');
  closeButton.setAttribute('data-dismiss', 'alert');
  closeButton.innerHTML = '&times;'; // HTML for the close icon

  alertElement.innerHTML = `<strong>${type.charAt(0).toUpperCase() + type.slice(1)}!</strong> ${message}`;
  alertElement.appendChild(closeButton);

  alertContainer.appendChild(alertElement);

  // Automatically remove the alert after 3 seconds (3000 milliseconds)
  setTimeout(() => {
    alertElement.remove();
  }, 3000);
}

function addCourse() {
  const courseName = document.getElementById("courseName").value;
  const courseCode = document.getElementById("courseCode").value;
  const courseDescription = document.getElementById('courseDescription').value;
  const enrolmentDetails = document.getElementById('enrolmentDetails').value;
  if (!courseName || !courseCode) {
    showAlert("Please fill in all fields", "danger");
    return;
  }

  const data = {
    courseName: courseName,
    courseCode: courseCode,
    courseDescription: courseDescription,
    enrolmentDetails: enrolmentDetails
  };

  sendDataToBackend(data, 'backend/add_course.php');
}

function sendDataToBackend(data, endpoint) {
  console.log('Data:', data);

  fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    console.log(response)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();  // Parse JSON here
  })
  .then(result => {
    // Handle the success case
    showAlert(result.message, "success");
  })
  .catch(error => {
    console.error('Error:', error.message);
    showAlert('An error occurred. Please try again.', "danger");
  });
}

function addCollege() {
  const collegeName = document.getElementById("collegeName").value;
  const location = document.getElementById("location").value;

  if (!collegeName || !location) {
    showAlert("Please fill in all fields", "danger");
    return;
  }

  const data = {
    collegeName: collegeName,
    location: location
  };

  sendDataToBackend(data, 'backend/add_college.php');
}

function sendDataToBackend(data, endpoint) {
  console.log('Data:', data);

  fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(result => {
    showAlert(result.message, "success");
  })
  .catch(error => {
    console.error('Error:', error.message);
    showAlert('An error occurred. Please try again.', "danger");
  });
}

function showRelatedCourses() {
  const collegeSelect = document.getElementById("collegeSelect");
  const selectedCollegeId = collegeSelect.value;

  if (!selectedCollegeId) {
    showAlert("Please select a college", "danger");
    return;
  }

  // Make an AJAX request to fetch related courses based on the selected college
  fetch('backend/get_related_courses.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ collegeId: selectedCollegeId })
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(result => {
      if (result.status === 'success') {
        renderRelatedCourses(result.courses);
      } else {
        showAlert(result.message, "danger");
      }
    })
    .catch(error => {
      console.error('Error:', error.message);
      showAlert('An error occurred. Please try again.', "danger");
    });
}

function renderRelatedCourses(courses) {
  const relatedCoursesContainer = document.getElementById('relatedCourses');

  if (courses.length === 0) {
    relatedCoursesContainer.innerHTML = '<p>No related courses found.</p>';
    return;
  }

  const relatedCoursesHTML = courses.map(course => {
    return `<div class="course-item" data-course-id="${course.course_id}">
              <h3>${course.course_name}</h3>
              <p>Course Code: ${course.course_code}</p>
            </div>`;
  }).join('');

  relatedCoursesContainer.innerHTML = relatedCoursesHTML;

  // Attach onclick event listener to each course item
  const courseItems = document.querySelectorAll('.course-item');
  courseItems.forEach(courseItem => {
    courseItem.addEventListener('click', () => {
      const courseId = courseItem.getAttribute('data-course-id');
      // Call a function to handle the click event with the course ID
      handleCourseClick(courseId);
    });
  });
}

// Function to handle the click event for a course
function handleCourseClick(courseId) {
  // Perform actions when a course is clicked, e.g., redirect to the course detail page
  window.location.href = `course.php?course_id=${courseId}`;
}

function populateCollegeDropdown() {
  const collegeSelect = document.getElementById("collegeSelect");

  // Make an AJAX request to fetch colleges from the database
  fetch('backend/get_colleges.php')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(result => {
      if (result.status === 'success') {
        // Populate the college dropdown with options
        result.colleges.forEach(college => {
          const option = document.createElement("option");
          option.value = college.college_id;
          option.text = college.college_name;
          collegeSelect.add(option);
        });
      } else {
        showAlert(result.message, "danger");
      }
    })
    .catch(error => {
      console.error('Error:', error.message);
      showAlert('An error occurred while fetching colleges. Please try again.', "danger");
    });
}
