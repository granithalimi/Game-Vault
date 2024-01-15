<?php

include './includes/db.php';
include './includes/helpers.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Access-Control-Allow-Methods: *');

$payload = json_decode(file_get_contents('php://input'), true);
$method = $_SERVER['REQUEST_METHOD'];
$action = (isset($_GET['action']) && !empty($_GET["action"])) ? $_GET['action'] : "";

// REGISTER
// METHOD: POST
// URL: http://localhost/game-vault/api/v1.php
if(is_set($payload) && ($payload['action'] == 'register') && $method == 'POST'){
    $register_stm = $pdo->prepare("INSERT INTO `users` (`name`, `surname`,`username`, `email`, `password`, `token`) VALUES (:name, :surname, :username,:email, :password, :token)");

    $hash = (isset($payload['password']) && !empty($payload['password'])) ? password_hash($payload['password'], PASSWORD_BCRYPT) : '';
    $token = str_shuffle(substr($hash, 12, strlen($hash)));

    $register_stm->bindParam(':name', $payload['name']);
    $register_stm->bindParam(':surname', $payload['surname']);
    $register_stm->bindParam(':username', $payload['username']);
    $register_stm->bindParam(':email', $payload['email']);
    $register_stm->bindParam(':password', $hash);
    $register_stm->bindParam(':token', $token);

    if($register_stm->execute()){
        echo json_encode(['status' => 1, 'msg' => 'User was registered successfully']);
    } else {
        echo json_encode(['status' => 0, 'msg' => 'Something went wrong']);
    }
}

// LOGIN
// METHOD: POST
// URL: http://localhost/game-vault/api/v1.php
if(is_set($payload) && $payload['action'] == 'login' && $method == 'POST'){
    $user = [];

    $login_stm = $pdo->prepare("SELECT * FROM `users` WHERE `email` = :email");
    $login_stm->bindParam(':email', $payload['email']);
    $login_stm->execute();  
    $user = $login_stm->fetch(PDO::FETCH_ASSOC);
    
    if(!$user){
        echo json_encode(["status" => 0, "msg" => "something went wrong"]);
        die();
    }
    
    if(password_verify($payload['password'], $user['password'])){
        echo json_encode(['status' => 1, 'id' => $user['id'], 'fullname' => $user['name'].' '.$user['surname'], 'email' => $user['email'], 'token' => $user['token']]);
    } else {
        echo json_encode(["status" => 0, "msg" => "email or password is incorrect"]);
    }
}

// GET USER
// METHOD: GET
// URL: http://localhost/game-vault/api/v1.php?action=get_user&id=3
if($action && $action == "get_user" && $method == 'GET'){
    $user = [];

    $register_stm = $pdo->prepare("SELECT * FROM `users` WHERE id = :id");
    $register_stm->bindParam(':id', $_GET['id']);
    $register_stm->execute();
    $user = $register_stm->fetch(PDO::FETCH_ASSOC);

    echo json_encode(['status' => 1, 'users' => $user]);
}

// GET USERS
// METHOD: GET
// URL: http://localhost/game-vault/api/v1.php?action=get_users
if($action && $action == "get_users" && $method == 'GET'){
    $users = [];

    $register_stm = $pdo->prepare("SELECT * FROM `users`");
    $register_stm->execute();

    while($row = $register_stm->fetch(PDO::FETCH_ASSOC)){
        $users[] = $row;
    }

    echo json_encode(['status' => 1, 'users' => $users]);
}

// ADD FRIEND(toggle)
// METHOD: GET
// URL:http://localhost/game-vault/api/v1.php?action=add_friends&sender_id=?&receiver_id=?
if($action == "add_friends" && is_set($_GET['sender_id']) && is_set($_GET['receiver_id']) && $method == 'GET'){
    $sender_id_stm = $pdo->prepare("SELECT * FROM `friends` WHERE `sender_id` = :sender_id AND `receiver_id` = :receiver_id");
    $sender_id_stm->bindParam(':sender_id', $_GET['sender_id']);
    $sender_id_stm->bindParam(':receiver_id', $_GET['receiver_id']);
    $sender_id_stm->execute();

    $haf = $sender_id_stm->fetch(PDO::FETCH_ASSOC);
    if($haf != false && count($haf) > 0){
        $remove_friend = $pdo->prepare("DELETE FROM `friends` WHERE `sender_id` = :sender_id AND `receiver_id` = :receiver_id");
        $remove_friend->bindParam(':sender_id', $_GET['sender_id']);
        $remove_friend->bindParam(':receiver_id', $_GET['receiver_id']);

        if($remove_friend->execute()){
            echo json_encode(['status' => 1, 'msg' => 'Removed from my friends list']);
        }else{
            echo json_encode(['status' => 0, 'msg' => 'Something went wrong']);
        }
    }else{
        $sender_id = $pdo->prepare("INSERT INTO `friends` (`sender_id`, `receiver_id`) VALUES (:sender_id, :receiver_id)");
        $sender_id->bindParam(':sender_id', $_GET['sender_id']);
        $sender_id->bindParam(':receiver_id', $_GET['receiver_id']);

        if($sender_id->execute()){
            echo json_encode(['status' => 1, 'msg' => 'Added to my friends list']);
        }else{
            echo json_encode(['status' => 0, 'msg' => 'Something went wrong']);
        }
    }
}

// GET MY FRIENDS 
// METHOD GET
// URL: http://localhost/game-vault/api/v1.php?action=get_my_friends&user_id=?
if($action == 'get_my_friends' && is_set($_GET['user_id']) && $method == 'GET'){
    $friends = [];

    $friends_stm = $pdo->prepare("SELECT * FROM `users` INNER JOIN `friends` ON `users`.`id` = `friends`.`receiver_id` WHERE `friends`.`sender_id` = :user_id;");
    $friends_stm->bindParam(':user_id', $_GET['user_id']);
    $friends_stm->execute();

    while($row = $friends_stm->fetch(PDO::FETCH_ASSOC)){
        $friends[] = $row;
    }

    echo json_encode(['status' => 1, 'my_friends' => $friends]);
}

//  BUY A GAME
// METHOD: POST
// URL:http://game-vault/steamdemo/api/v1.php
if($payload && $payload['action'] == 'buy_games' && $method == "POST"){
    $buy_stm = $pdo->prepare("SELECT * FROM `games` INNER JOIN `my_games` ON `games`.`id` = `my_games`.`game_id` WHERE `games`.`id` = :game_id AND `my_games`.`user_id` = :user_id;");
    $buy_stm->bindParam(':game_id', $payload['game_id']);
    $buy_stm->bindParam(':user_id', $payload['user_id']);
    $buy_stm->execute();

    $eg = $buy_stm->fetch(PDO::FETCH_ASSOC);

    if($eg != false && count($eg) > 0){
        echo json_encode(['status' => 1, 'msg' => "Game is already in 'My Games' list"]);
    } else{
        $buy_stm = $pdo->prepare("INSERT INTO `my_games` (`user_id`, `game_id`) VALUES (:user_id, :game_id)");
        $buy_stm->bindParam(':user_id', $payload['user_id']);
        $buy_stm->bindParam(':game_id', $payload['game_id']);
    
        if($buy_stm->execute()){
            echo json_encode(['status' => 1, 'msg' => "Added to my games successfully"]);
        }else{
            echo json_encode(['status' => 0, 'msg' => "Something went wrong"]);
        }
    }
}

// GET MY GAMES
// METHOD: GET
// URL:http://localhost/game-vault/api/v1.php?action=get_my_games&user_id=?
if($action && $action == 'get_my_games' && $method == "GET"){
    $game = [];

    $buy_stm = $pdo->prepare("SELECT `title`,`genre`,`id` FROM `games` INNER JOIN `my_games` ON `games`.`id` = `my_games`.`game_id` WHERE `my_games`.`user_id` = :user_id");
    $buy_stm->bindParam(':user_id', $_GET['user_id']);
    $buy_stm->execute();

    while($row = $buy_stm->fetch(PDO::FETCH_ASSOC)){
        $game[] = $row;
    }

    echo json_encode(['status' => 1, 'game' => $game]);
}

// OFFER TRADE
// METHOD: POST
// URL: http://localhost/game-vault/api/v1.php
if($payload && $payload['action'] == 'offer_trade' && $method == "POST"){
    $offer_trade_stm = $pdo->prepare("INSERT INTO `offer_trade` (`trader_id`,`receiver_id`,`trader_game_id`,`receiver_game_id`) VALUES (:trader_id, :receiver_id, :trader_game_id, :receiver_game_id)");

    $offer_trade_stm->bindParam(':trader_id', $payload['trader_id']);
    $offer_trade_stm->bindParam(':receiver_id', $payload['receiver_id']);
    $offer_trade_stm->bindParam(':trader_game_id', $payload['trader_game_id']);
    $offer_trade_stm->bindParam(':receiver_game_id', $payload['receiver_game_id']);
    
    if($offer_trade_stm->execute()){
        echo json_encode(['status' => 1, 'msg' => 'Trade Offered successfully']);
    } else {
        echo json_encode(['status' => 0, 'msg' => 'Something went wrong']);
    }
}

// CHECK TRADE
// METHOD: GET
// URL: http://localhost/game-vault/api/v1.php?action=check_trades&receiver_id=?
if($action == 'check_trades' && is_set($_GET['receiver_id']) && $method == "GET"){
    $trades = [];

    $querry = "SELECT `t1`.`id` as `trade_id`, `t4`.`name` as `trader_name`, `t4`.`id` as `trader_id`, 
    `t2`.`title` as `trader_game_name`, `t2`.`id` as `trader_game_id`, 
    `t3`.`title` as `receiver_game_name`, `t3`.`id` as `receiver_game_id` 
    FROM `offer_trade` as `t1` JOIN `games` as `t2` on `trader_game_id` = `t2`.`id` 
    JOIN `games` as `t3` on `receiver_game_id` = `t3`.`id` 
    JOIN `users` as `t4` on `trader_id` = `t4`.`id` 
    WHERE `receiver_id` = :receiver_id;";

    $check_trades_stm = $pdo->prepare($querry);
    $check_trades_stm->bindParam(':receiver_id', $_GET['receiver_id']);
    $check_trades_stm->execute();
    
    // $trades[] = $check_trades_stm->fetch(PDO::FETCH_ASSOC);
    while($row = $check_trades_stm->fetch(PDO::FETCH_ASSOC)){
        $trades[] = $row;
    }

    echo json_encode(['status' => 1, 'trades' => $trades]);
}

// DECLINE TRADE
// METHOD: DELETE
// URL: http://localhost/game-vault/api/v1.php
if($action == "decline_trade" && is_set($_GET['id']) && $method == "DELETE"){
    $check_trades_stm = $pdo->prepare("DELETE FROM `offer_trade` WHERE `offer_trade`.`id` = :id");
    $check_trades_stm->bindParam(':id', $_GET['id']);

    if($check_trades_stm->execute()){
        echo json_encode(['status' => 1, 'msg' => 'Offer declined successfully']);
    }else {
        echo json_encode(['status' => 0, 'msg' => 'Something went wrong']);
    }
}

// ACCEPT TRADE
// METHOD: PUT
// URL: http://localhost/game-vault/api/v1.php
if($payload && $payload['action'] == 'accept_trade' && $method == "PUT"){

    $check_trades_stm = $pdo->prepare("UPDATE `my_games` SET `my_games`.`game_id` = :receiver_game_id WHERE `my_games`.`user_id` = :trader_id AND `my_games`.`game_id` = :trader_game_id;
    UPDATE `my_games` SET `my_games`.`game_id` = :trader_game_id WHERE `my_games`.`user_id` = :receiver_id AND `my_games`.`game_id` = :receiver_game_id");

    $check_trades_stm->bindParam(':receiver_game_id', $payload['receiver_game_id']);
    $check_trades_stm->bindParam(':trader_id', $payload['trader_id']);
    $check_trades_stm->bindParam(':trader_game_id', $payload['trader_game_id']);
    $check_trades_stm->bindParam(':receiver_id', $payload['receiver_id']);

    if($check_trades_stm->execute()){
        echo json_encode(['status' => 1, 'msg' => 'Offer accepted successfully']);
    }else {
        echo json_encode(['status' => 0, 'msg' => 'Something went wrong']);
    }
}

// get_game_category
// method: get
// url: http://localhost/game-vault/api/v1.php?action=get_game_category
if($action && $_GET['action'] == "get_game_category" && $method == "GET"){
    $game = [];
    $games_stm = $pdo->prepare("SELECT DISTINCT `games`.`genre` FROM `games`;");
    $games_stm->execute();

    while($row = $games_stm->fetch(PDO::FETCH_ASSOC)){
        $game[] = $row;
    }

    echo json_encode(['status' => 1, 'genre' => $game]);
}

// get_game_genre
// method: get
// url: http://localhost/game-vault/api/v1.php?action=get_game_genre&genre=?
if($action && $_GET['action'] == "get_game_genre" && $_GET['genre'] && $method == "GET"){
    $games = [];
    $games_stm = $pdo->prepare("SELECT * FROM `games` WHERE `games`.`genre` = :genre");
    $games_stm->bindParam(':genre', $_GET['genre']);
    $games_stm->execute();

    while($row = $games_stm->fetch(PDO::FETCH_ASSOC)){
        $games[] = $row;
    }

    echo json_encode(['status' => 1, 'games' => $games]);
}



// END
// set games
// method: get
// url: http://localhost/game-vault/api/v1.php
if($payload && $payload['action'] == "set_games" && $method == "POST"){
    $games_stm = $pdo->prepare("INSERT INTO `games` (`title`, `thumbnail`,`short_description`,`genre`,`platform`,`publisher`,`developer`, `release_date`) 
    VALUES (:title, :thumbnail, :short_description,:genre,:platform,:publisher,:developer,:release_date)");
    $games_stm->bindParam(":title", $payload['title']);
    $games_stm->bindParam(":thumbnail", $payload['thumbnail']);
    $games_stm->bindParam(":short_description", $payload['short_description']);
    $games_stm->bindParam(":genre", $payload['genre']);
    $games_stm->bindParam(":platform", $payload['platform']);
    $games_stm->bindParam(":publisher", $payload['publisher']);
    $games_stm->bindParam(":developer", $payload['developer']);
    $games_stm->bindParam(":release_date", $payload['release_date']);

    if($games_stm->execute()){
        echo json_encode(['status' => 1, 'msg' => 'games added successfully']);
    }else{
        echo json_encode(['status' => 0, 'msg' => '404']);
    }
}

// get_games
// method: get
// url: http://localhost/game-vault/api/v1.php?action=get_games
if($action && $_GET['action'] == "get_games" && $method == "GET"){
    $games = [];
    $games_stm = $pdo->prepare("SELECT * FROM `games`");
    $games_stm->execute();

    while($row = $games_stm->fetch(PDO::FETCH_ASSOC)){
        $games[] = $row;
    }

    echo json_encode(['status' => 1, 'games' => $games]);
}

// get_latest_games
// method: get
// url: http://localhost/game-vault/api/v1.php?action=get_latest_games&game=?
if($action && $_GET['action'] == "get_latest_games" && is_set($_GET['game']) && $method == "GET"){
    $games = [];
    $games_stm = $pdo->prepare("SELECT * FROM `games` WHERE id <= :game");
    $games_stm->bindParam(':game', $_GET['game']);
    $games_stm->execute();

    while($row = $games_stm->fetch(PDO::FETCH_ASSOC)){
        $games[] = $row;
    }

    echo json_encode(['status' => 1, 'games' => $games]);
}

// get_single_game
// method: get
// url: http://localhost/game-vault/api/v1.php?action=get_single_game&id=?
if($action && $_GET['action'] == "get_single_game" && is_set($_GET['id']) && $method == "GET"){
    $game = [];
    $games_stm = $pdo->prepare("SELECT * FROM `games` WHERE id = :id");
    $games_stm->bindParam(':id', $_GET['id']);
    $games_stm->execute();

    $game = $games_stm->fetch(PDO::FETCH_ASSOC);

    echo json_encode(['status' => 1, 'game' => $game]);
}