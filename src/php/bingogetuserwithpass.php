<?php include("config.php");
  $postData = json_decode(file_get_contents("php://input"), TRUE);
  $username = $postData['username'];
  $pass = $postData['pass'];
  $token = $postData['token'];
  $hashSql = "SELECT pass FROM `players` WHERE username='$username'";
  $hashedPass =  strval(mysqli_fetch_array(mysqli_query($link, $hashSql), MYSQLI_ASSOC)['pass']);

  $passwordMatches = password_verify($pass, $hashedPass);

  $cookieMatch = mysqli_query($link,"SELECT id, username, rulesets, token FROM `players` WHERE username='$username' AND token='$token'");

  if ($passwordMatches) {
    $userResult = mysqli_query($link,"SELECT id, username, rulesets, token FROM `players` WHERE username='$username' AND pass='$hashedPass'");
  } else if (strlen($token) > 0 && $cookieMatch) {
    $userResult = $cookieMatch;
  }
  if ($userResult) {
    echo json_encode(mysqli_fetch_array($userResult, MYSQLI_ASSOC));
  } else {
    if (!$hashedPass) {
      echo 'badUsername';
    } else if (!$passwordMatches) {
      echo 'badPassword';
    }
  }
  mysqli_close($link);
?>