<?php
include 'db_config.php';

$data = json_decode(file_get_contents('php://input'), true);
if ($conn->connect_error) {
  $response = array('status' => 'error', 'message' => 'Database connection error');
} else {
  if (!empty($data['collegeName']) && !empty($data['location'])) {
    $sql = "INSERT INTO colleges (college_name, location) VALUES (?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $data['collegeName'], $data['location']);
    if ($stmt->execute()) {
      $response = array('status' => 'success', 'message' => 'College added successfully');
    } else {
      $response = array('status' => 'error', 'message' => 'Error adding college');
    }
    $stmt->close();
  } else {
    $response = array('status' => 'error', 'message' => 'Invalid data received');
  }
}
$conn->close();
header('Content-Type: application/json');
echo json_encode($response);
