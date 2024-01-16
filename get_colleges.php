<?php
include 'db_config.php';
if ($conn->connect_error) {
  $response = array('status' => 'error', 'message' => 'Database connection error');
} else {

  $sql = "SELECT * FROM colleges";
  $result = $conn->query($sql);

  if ($result->num_rows > 0) {
    $colleges = array();
    while ($row = $result->fetch_assoc()) {
      $colleges[] = $row;
    }

    $response = array('status' => 'success', 'colleges' => $colleges);
  } else {
    $response = array('status' => 'error', 'message' => 'No colleges found');
  }
}

$conn->close();
header('Content-Type: application/json');
echo json_encode($response);
