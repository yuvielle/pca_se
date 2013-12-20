<?php
/**
 * Created by IntelliJ IDEA.
 * User: Yuvielle
 * Date: 10.09.13
 * Time: 20:56
 * To change this template use File | Settings | File Templates.
 */ 
class view_viewer {

    private $_template;//comes from config.php
    public $properties;

    public function __construct(){
        $this->properties = array();
        $this->_template = dirname(__FILE__) . '/../templates/index.phtml';
    }

    public function setTemplate($template){
        $this->_template = dirname(__FILE__) . '/../templates/' . $template . '.phtml';
    }


    public function render(){

       ob_start();
       if(file_exists(realpath($this->_template))){
         include(realpath($this->_template));
        } else throw new Exception("the template file not found in " . $this->_template);
        return ob_get_clean();
    }

    public function __set($k, $v){
          $this->properties[$k] = $v;
    }

    public function __get($k){
        if(!$k || !@$this->properties[$k]) return false;
          return $this->properties[$k];
    }
}
