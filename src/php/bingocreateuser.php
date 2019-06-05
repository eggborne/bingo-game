<?php include("config.php");
	$postData = json_decode(file_get_contents("php://input"), TRUE);
	$username = $postData['username'];
  $pass = $postData['pass'];
  $options = $postData['options'];
  $stats = $postData['stats'];
  $getToken = $postData['getToken'];

  if (strlen($username) > 2 && strlen($username) < 17 && strlen($pass) > 5) {
    $nameSql = "SELECT username FROM `players` WHERE username='$username'";
    $nameTaken = mysqli_fetch_array(mysqli_query($link,$nameSql), MYSQLI_ASSOC);
    $nameAvailable = strlen(json_encode($nameTaken['username']));
    if ($nameAvailable) {
      if ($getToken) {
        // $p = new OAuthProvider();
        // $token = $p->generateToken(16);
        $token = password_hash($username, PASSWORD_DEFAULT);
      } else {
        $token = NULL;
      }
      $hashedPass = password_hash($pass, PASSWORD_DEFAULT);
      $userSql="INSERT INTO `players` (`username`, `options`, `stats`, `pass`, `token`) VALUES ('$username', '$options', '$stats', '$hashedPass', '$token');";
      $userResult=mysqli_query($link,$userSql);
      $newUserID=mysqli_insert_id($link);
    } else {
      echo 'nameTaken';
    }
  } else {
    echo 'badLengths';
  }

	if($nameAvailable && $userResult && $newUserID){
    echo json_encode([$newUserID, $token]);
  } else {
    echo "CREATING NEW USER FAILED :(";
  }
	mysqli_close($link);
?>