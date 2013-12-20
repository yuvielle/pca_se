<?php
/**
 * Created by IntelliJ IDEA.
 * User: Yuvielle
 * Date: 10.09.13
 * Time: 0:41
 * To change this template use File | Settings | File Templates.
 */

/** PHPExcel root directory */
if (!defined('PHPEXCEL_ROOT')) {
    define('PHPEXCEL_ROOT', dirname(__FILE__) . '/excellProcessor/');
}
require_once(PHPEXCEL_ROOT . 'PHPExcel/Autoloader.php');
class autoload {

    public static $loader;

    public static function init()
    {
        if (self::$loader == NULL)
            self::$loader = new autoload();

        return self::$loader;
    }

    private function __construct(){
        spl_autoload_register(array('autoload', 'autoload'));
    }

    public function autoload($className)
    {
        //echo $className . "<br>";
        $classFile = dirname(__FILE__) . '/../' . str_replace('_', '/', $className) . ".php";
        //echo $classFile . "<br>";

        if (is_file($classFile)) {
            require_once realpath($classFile);
        }
        else throw new Exception("the file $classFile is not exist in system");
    }
}

