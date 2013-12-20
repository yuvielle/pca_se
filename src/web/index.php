<?php
set_error_handler("myErrorHandler");
require_once (realpath(dirname(__FILE__) . '/../library/dispather.php'));
$dispath=new library_dispatcher();//new dispatcher object dev-develop, prod - for prodaction
$env = 'dev';
$dispath->getContent($env);//get content of the requested page

// error handler function
function myErrorHandler($errno, $errstr, $errfile, $errline, array $errcontext)
{
    if (!(error_reporting() & $errno)) {
        // This error code is not included in error_reporting
        return;
    }
    $env = 'dev';
    switch ($errno) {
        case E_USER_ERROR:
            throw new Exception("<b>Fatal ERROR</b> [$errno] $errstr<br />Fatal error on line $errline in file $errfile, PHP " .
                PHP_VERSION . " (" . PHP_OS . ")<br />Aborting...<br />");
            break;
        case E_ERROR:
            throw new Exception("<b>Fatal ERROR</b> [$errno] $errstr<br />Fatal error on line $errline in file $errfile, PHP " .
                 PHP_VERSION . " (" . PHP_OS . ")<br />Aborting...<br />");
        case E_USER_WARNING:
            //echo "<b>My WARNING</b> [$errno] $errstr<br />\n";
            break;
        case E_WARNING:
             break;
        case E_NOTICE :
              break;
        case E_USER_NOTICE:
            //echo "<b>My NOTICE</b> [$errno] $errstr<br />\n";
            break;
        case E_DEPRECATED:
            if($env == 'dev'){
                echo "<b>method deprecate</b> [$errno] $errstr<br />\n";
            }
            break;
        default:
            throw new Exception("Unknown error type: [$errno] $errstr  on line $errline in file $errfile");
            break;
        }
    /* Don't execute PHP internal error handler */
    return true;
}

