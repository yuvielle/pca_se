<?php
/**
 * Created by IntelliJ IDEA.
 * User: Yuvielle
 * Date: 23.11.13
 * Time: 14:18
 * To change this template use File | Settings | File Templates.
 */ 
class library_session {

    private static $object;
    private $environment;
    private $request;
    private $conn;

    public static function init($environment = 'prod')
    {
        if (!self::$object) {
            self::$object = new library_session($environment);
        }
        return self::$object;
    }

    private function __construct($environment)
    {
        try{
            $this->request = library_request::init();
            $this->conn = library_dbConnect::init($environment);
        } catch(Exception $e){
            throw $e;
        }
    }

    public function getSession()
    {
        return $_SESSION;
    }

    public function __get($name)
    {
        if (!array_key_exists($name, $_SESSION)) {
            return false;
        }
        return $_SESSION[$name];
    }

    public function __set($name, $value){
        $_SESSION['name'] = $value;
    }

    public function hasRights() {

        if(!@$_SESSION['session_hash']) return false;
        $pas_check = "SELECT count(*) FROM [regplat-ru].dbo.owebs_mini_Sessions WHERE hash='" . $_SESSION['session_hash'] . "'";
        if (($this->username == '') && ($this->password == '')) return false;
        $result = $this->conn->Query($pas_check);
        list ($numrows) = MSSQL_FETCH_ROW($result);
        if($numrows ==0) return false;
        if(@$_SESSION['status'] === 1){
            return 'terminal_rights';
        }
        elseif(@$_SESSION['status'] === 2){
            return 'provider_rights';
        }
        else{
            session_unset();
            return false;
        }
    }

    public function getAgentOid(){
        if(!@$_SESSION['session_hash']) return false;
        $query="select dbo.owebs_mini_FindAgentIDFromSession ('" . $_SESSION['session_hash'] . "')";
        $result = $this->conn->Query($query);
        $result = MSSQL_FETCH_ROW($result);
        return $result[0];
    }

    public function getLoginId(){
        if(!@$_SESSION['session_hash']) return false;
        $query = "select s.id_login AS id from dbo.owebs_mini_sessions s where hash = '" . $_SESSION['session_hash'] . "'";
        $result = $this->conn->Query($query);
        $result = MSSQL_FETCH_ARRAY($result);
        return $result['id'];
    }

    public function logout(){
        session_destroy();
    }

    public function setCaptcha(){
        $word_1 = '';
        $word_2 = '';
        for ($i = 0; $i < 4; $i++)
        {
        	$word_1 .= chr(rand(97, 122));
            $word_2 .= chr(rand(97, 122));
        }
        $_SESSION['random_number'] = $word_1.' '.$word_2;
        $dir = 'fonts/';
        $image = imagecreatetruecolor(165, 50);
        $font = "recaptchaFont.ttf"; // font style
        $color = imagecolorallocate($image, 0, 0, 0);// color
        $white = imagecolorallocate($image, 255, 255, 255); // background color white
        imagefilledrectangle($image, 0,0, 709, 99, $white);
        imagettftext($image, 22, 0, 5, 30, $color, $dir.$font, $_SESSION['random_number']);
        return imagepng($image);
    }
}
