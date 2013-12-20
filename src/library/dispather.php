<?php
require_once (realpath(dirname(__FILE__) . '/../library/autoload.php')); //class of autoloader of this project
autoload::init();

class library_dispatcher //very simple dispatcher
{
    public static function getContent($env)
    {
        require_once (realpath(dirname(__FILE__) . '/../config/routes.php'));
        $request = library_request::init();
        try{
            $session = library_session::init($env);
            $get = $_GET;
            $rights = $session->hasRights();
            $module = @$_GET['module'];
            $action = @$get['action']?$get['action']:'index';
            if(!$module && $rights && in_array($rights, array_keys($defaultControllers))){
                $module = $defaultControllers[$rights];
            } elseif ($module && in_array($module, $freeActions) && in_array($action, $freeActions[$module])) {
                   // echo 'test<br>';
            } elseif ($rights === false && $request->isXmlHttpRequest()) {
                header('HTTP/1.1 403 Forbidden');
            } elseif($rights === false){
                $module = 'user';
                $action = 'login';
            } elseif(array_key_exists($module, $protect_modules) && !in_array($rights, $protect_modules[$module])){
                $module = 'errors';
                $action='err404';
            }
            //var_dump($freeActions[$module]);
            //echo 'm=' . $module . ' a=' . $action . ' d=' . @$defaultControllers[$rights];
            self::run($module, $action, $env, $request, $session);
        } catch(Exception $e){
            $errorsController = new app_errorsController($env);
            $errorsController->error($e, $env); //get exception
        }
    }

    private static function run($module, $action, $env, $request, $session) {
        $errorsController = new app_errorsController($env);
        try {
            $actionClass = 'app_' . $module . 'Controller';
            if (class_exists($actionClass) && method_exists($actionClass, $action)) {
                $actionClass = new $actionClass();
                $actionClass->$action($request, $session);
            } else {
                $errorsController->err404(); //requested action notfound
            }
        } catch (Exception $e) {
            $errorsController->error($e, $env); //get exception
        }
    }
}
