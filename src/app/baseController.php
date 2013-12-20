<?php
/**
 * Created by IntelliJ IDEA.
 * User: Yuvielle
 * Date: 10.09.13
 * Time: 21:41
 * To change this template use File | Settings | File Templates.
 */

class app_baseController {

    private $view;
    protected $connect;
    protected $Result;
    protected $conn;
    protected $withDb;

    public function __construct($env = 'dev', $withDb = true){
        if($withDb == true){
            $this->conn =  library_dbConnect::init($env);
            $this->connect = $this->conn->getConnection();
        }
        $this->view = new view_viewer();
    }

    public function __get($name){
        if($name = "view"){
            $callers=debug_backtrace();
            $controller = str_replace('app_', '', get_called_class());
            $defaultTemplateName = str_replace('Controller', '', $controller) . '/' .  $callers[1]['function'];
            $this->view->setTemplate($defaultTemplateName);
            return $this->view;
        }
        return $this->$name;
    }

    public function Query($query){
        if($this->withDb === false) throw new Exception("Этот контроллер работает без коннекта к базе, определите свойство withDb как true для использования базы");
        return $this->conn->Query($query);
    }

    public function redirect($action, array $get_params = array()){
        $get='';
        if(!empty($get_params)) $get = '&' . implode($get_params, '&');
        header('Location: index.php?action=' . $action . $get);
    }
}
