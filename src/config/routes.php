<?php
/**
 * Created by IntelliJ IDEA.
 * User: Yuvielle
 * Date: 02.12.13
 * Time: 10:02
 * To change this template use File | Settings | File Templates.
 */

$protect_modules = array(
    'terminal'=>array('terminal_rights'),
    'provider'=>array('provider_rights')
);

$freeActions = array('user'=>array('login', 'getCaptchaImage'), 'errors'=>array('err404', 'error'));

$defaultControllers = array('terminal_rights'=> 'terminal', 'provider_rights' =>'provider');