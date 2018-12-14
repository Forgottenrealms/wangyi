<?php
    header("Access-Control-Allow-Origin:*");

    $email = $_POST["email"];
    $password = md5($_POST["password"]);

    include "conn.php";

    $sql = "SELECT * FROM wangyi WHERE email='$email' AND password='$password'";
    $result = mysql_query($sql);
    $array = array("res_code"=>1, "res_error"=>"");

    if($row = mysql_fetch_assoc($result)) {
        $res_body = array("status"=>1, "info"=>$row);
    } else {
        $res_body = array("status"=>0);
    }

    $array["res_body"] = $res_body;

    echo json_encode($array);

    mysql_close();
?>