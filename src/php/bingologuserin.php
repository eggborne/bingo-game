<?php include("config.php");
  $postData = json_decode(file_get_contents("php://input"), TRUE);
  $username = $postData['username'];
  $pass = $postData['pass'];
  $token = $postData['token'];
  $hashSql = "SELECT pass FROM `players` WHERE username='$username'";
  $hashedPass =  strval(mysqli_fetch_array(mysqli_query($link, $hashSql), MYSQLI_ASSOC)['pass']);

  $passwordMatches = password_verify($pass, $hashedPass);
  $cookieMatches = mysqli_query($link,"SELECT id, username, currency, chickens, options, menuMode, cards, prizes, cardSlots, itemSlots, chickenSlots, bonusChance, stats, token FROM `players` WHERE username='$username' AND token='$token'");

  if ($passwordMatches) {
    $userResult = mysqli_query($link,"SELECT id, username, currency, chickens, options, menuMode, cards, prizes, cardSlots, itemSlots, chickenSlots, bonusChance, stats, token FROM `players` WHERE username='$username' AND pass='$hashedPass'");
  } else if ($cookieMatches && strlen($token) > 0) {
    $userResult = $cookieMatches;
  }
  if ($userResult) {
    // echo json_encode(mysqli_fetch_array($userResult, MYSQLI_ASSOC));

    $resultArray = mysqli_fetch_array($userResult, MYSQLI_ASSOC);
    
    $newToken = password_hash($username, PASSWORD_DEFAULT);
    mysqli_query($link,"UPDATE `players` set token='$newToken' WHERE username='$username'");
    $resultArray['token'] = $newToken;

    echo json_encode([$resultArray, $newToken]);


  } else {
    if (!$hashedPass) {
      echo 'NO SUCH USER.';
    } else if (!$passwordMatches) {
      echo 'WRONG PASSWORD.';
    }
  }
  mysqli_close($link);
?>