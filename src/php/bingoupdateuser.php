<?php include("config.php");
	$postData = json_decode(file_get_contents("php://input"), TRUE);
	$username = $postData['username'];
  $token = $postData['token'];
  $attribute = $postData['attribute'];
  $newValue = $postData['newValue'];

  $cookieMatch = mysqli_query($link,"SELECT id, username FROM `players` WHERE username='$username' AND token='$token';");

  if ($cookieMatch) {
    $updateSql = "UPDATE `players` SET $attribute='$newValue' WHERE username='$username' AND token='$token';";
    $result = mysqli_query($link,$updateSql);
  } else {
    echo 'badToken';
  }

	if($result){
    echo 'UPDATED';
  } else {
    echo NULL;
  }
	mysqli_close($link);
?>