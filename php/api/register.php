<?php
    header("Access-Control-Allow-Origin:*");

    $email = $_POST["email"];
    $password = md5($_POST["password"]);

    //包含连接文件
    include "conn.php";

    $sql = "INSERT INTO wangyi(email, password) VALUES('$email', '$password')";
    $result = mysql_query($sql);
    $array = array("res_code"=>"1", "res_error"=>"");

    if($result) {
        $res_body = array("status"=>1, "email"=>$email, "message"=>"");
    } else {
        $res_body = array("status"=>0, "message"=>"有误:" . mysql_error());
    }

    $array["res_body"] = $res_body;

    echo json_encode($array);

    mysql_close();
?>