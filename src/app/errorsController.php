<?php
/**
 * Created by IntelliJ IDEA.
 * User: Yuvielle
 * Date: 06.11.13
 * Time: 21:50
 * To change this template use File | Settings | File Templates.
 */ 
class app_errorsController extends app_baseController {

    private $env;
    public function  __construct($env){
        $this->env = $env;
        parent::__construct($env, false);
    }

    public function err404(){
        $this->view->message = "404 error";
        $this->view->environtment = 'error';
        echo $this->view->render();
    }

    public function error(Exception $e, $env){
        if($env == 'dev'){
            $this->view->message = $e->getMessage();
        }
        else $this->view->message = "page not found";
        $this->view->environtment = 'error';
        echo $this->view->render();
    }

}
