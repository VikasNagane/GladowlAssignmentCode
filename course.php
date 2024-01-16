<?php
include 'backend\db_config.php';
include 'backend\functions.php'; // Include the file containing the getCourseDetails function

if (isset($_GET['course_id'])) {
  $courseId = $_GET['course_id'];
  $courseDetails = getCourseDetails($courseId);

  if ($courseDetails) {
    // Display course details
    echo '<h1>' . $courseDetails['course_name'] . '</h1>';
    echo '<p>' . $courseDetails['course_description'] . '</p>';
    echo '<p>Enrolment Details: ' . $courseDetails['enrolment_details'] . '</p>';
  } else {
    echo 'Course not found.';
  }
} else {
  echo 'Invalid course ID.';
}
