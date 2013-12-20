<?php
/**
 * Created by IntelliJ IDEA.
 * User: Yuvielle
 * Date: 09.09.13
 * Time: 12:21
 * To change this template use File | Settings | File Templates.
 */

class library_dbConnect {

    private static $object;
    private $conn = null;
    private $environment;

    public static function init($environment='prod'){
        if(!self::$object){
            self::$object = new library_dbConnect($environment);
        }
        return self::$object;
    }

    private function __construct($environment){
        include "../config/connect.php";
        $this->environment = $environment;
        try{
            $this->conn = mssql_connect($Server, $Login, $Password);
            if($this->conn == false)throw new Exception('Нет соединения с сервером');
            mssql_select_db($DataBase, $this->conn);
        }
        catch(Exception $e){
            throw new Exception('При соединении с базой данных выброшено исключение: ' . $e->getMessage());
        }
    }

    public function getConnection(){
        return $this->conn;
    }

    public function __destruct(){
        mssql_close($this->conn);
    }

    public function Query($query) {
        try{
            $result = mssql_query($query);
        }
        catch(Exception $e){
            throw new Exception('При обработке запроса выброшено исключение: ' . $e->getMessage());
        }
        return $result;
    }
}
