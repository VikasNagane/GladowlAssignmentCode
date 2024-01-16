<?php
include 'db_config.php';

$data = json_decode(file_get_contents('php://input'), true);

if ($conn->connect_error) {
  $response = array('status' => 'error', 'message' => 'Database connection error');
} else {

  if (!empty($data['collegeId'])) {
    // Perform necessary validations on $data['collegeId']

    // Fetch related courses from the 'college_courses' table
    $sql = "SELECT c.* FROM courses c
                JOIN college_courses cc ON c.course_id = cc.course_id
                WHERE cc.college_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $data['collegeId']);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
      $courses = array();
      while ($row = $result->fetch_assoc()) {
        $courses[] = $row;
      }

      $response = array('status' => 'success', 'courses' => $courses);
    } else {
      $response = array('status' => 'error', 'message' => 'No related courses found');
    }

    // Close the prepared statement
    $stmt->close();
  } else {
    $response = array('status' => 'error', 'message' => 'Invalid data received');
  }
}

// Close the database connection
$conn->close();

// Output the response as JSON
header('Content-Type: application/json');
echo json_encode($response);
