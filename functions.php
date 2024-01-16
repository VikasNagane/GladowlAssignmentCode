<?php

include 'db_config.php';

function getCourseDetails($courseId)
{
  global $conn;
  $courseId = mysqli_real_escape_string($conn, $courseId);

  $sql = "SELECT * FROM courses WHERE course_id = $courseId";
  $result = $conn->query($sql);

  if ($result->num_rows > 0) {
    return $result->fetch_assoc();
  } else {
    return null;
  }
}
