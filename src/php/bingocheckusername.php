<?php include("config.php");
	$postData = json_decode(file_get_contents("php://input"), TRUE);
  $username = $postData['username'];
  $nameSql = "SELECT id FROM `players` WHERE username='$username'";
  $nameResult =  mysqli_query($link,$nameSql);
  if ($nameResult && !is_null(mysqli_fetch_array($nameResult, MYSQLI_ASSOC))) {
    echo 'NAME TAKEN';
  } else {
    echo 'NAME OK';
  }
	mysqli_close($link);
?>