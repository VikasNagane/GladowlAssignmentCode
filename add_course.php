<?php
include 'db_config.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!empty($data['courseName']) && !empty($data['courseCode']) && !empty($data['courseDescription']) && !empty($data['enrolmentDetails'])) {
  $courseName = mysqli_real_escape_string($conn, $data['courseName']);
  $courseCode = mysqli_real_escape_string($conn, $data['courseCode']);
  $courseDescription = mysqli_real_escape_string($conn, $data['courseDescription']);
  $enrolmentDetails = mysqli_real_escape_string($conn, $data['enrolmentDetails']);

  $sql = "INSERT INTO courses (course_name, course_code, course_description, enrolment_details) 
            VALUES ('$courseName', '$courseCode', '$courseDescription', '$enrolmentDetails')";

  if ($conn->query($sql) === TRUE) {
    $response = array('status' => 'success', 'message' => 'Course added successfully');
    echo json_encode($response);
  } else {
    $response = array('status' => 'error', 'message' => 'Error adding course: ' . $conn->error);
    echo json_encode($response);
  }
} else {
  $response = array('status' => 'error', 'message' => 'Invalid data received');
  echo json_encode($response);
}

$conn->close();
