<?php
//this is old project of Pendjulina Katja. I did not refactor this
require "../config/connect.php";
require_once (realpath(dirname(__FILE__) . '/../library/autoload.php')); //class of autoloader of this project
autoload::init();
$connect = mssql_connect($Server, $Login, $Password) or die('Could not open connection to server');
$view = new view_viewer();
$view->setTemplate("admin/index");
$request = library_request::init();
$message = '';
mssql_select_db($DataBase, $connect) or die('Could not select database ' . $DataBase);
if ((isset($_GET['delete'])) and ($_GET['delete'] == 1)) {
    $query = mssql_query('exec[dbo].[owebs_mini_DeleteAgent] ' . library_utils::mssql_real_escape_string($_GET['id']) . '');
    $message = 'Запись удалена';
    $color = '#00FF00';
}
if($request->isPost()){
    if(!$request->phone || !$request->password || !$request->email) {$message = "не все параметры заданы"; $color = '#ff0000';}
    if(!$request->agentoid) {$message = "не получен идентификатор агента"; $color = '#ff0000'; }
    else {
        if ($_POST['add'] == 1) {
            if ((int)$_POST['status'] != 0)
                $status = library_utils::mssql_real_escape_string($_POST['status']);
            else $status = 0;
            $agent = mssql_query("select * from [dbo].[owebs_mini_logins] where phone = " . library_utils::mssql_real_escape_string($_POST['phone']));

            if (mssql_num_rows($agent) > 0){ $message = "Пользователь с таким номером телефона уже зарегистрирован в системе"; $color = '#ff0000'; }
            else {
                $query = mssql_query('exec [dbo].[owebs_mini_AddAgent] ' . library_utils::mssql_real_escape_string($_POST['agentoid']) . ', ' . library_utils::mssql_real_escape_string($_POST['phone']) . ', "' . library_utils::mssql_real_escape_string($_POST['password']) . '",  "' . library_utils::mssql_real_escape_string($_POST['email']) . '", ' . $status . '');
                $message = "пользователь добавлен";  $color = '#00ff00';
            }
        } else
            if ($_POST['change'] == 1) {
                $query = mssql_query('exec [dbo].[owebs_mini_ChangeAgent] ' . library_utils::mssql_real_escape_string($_POST['phone']) . ', ' . library_utils::mssql_real_escape_string($_POST['password']) . ', "' . library_utils::mssql_real_escape_string($_POST['email']) . '", ' . library_utils::mssql_real_escape_string($_POST['status']) . ', ' . library_utils::mssql_real_escape_string($_POST['id']) . '');
                $message = "пользователь изменён";
                $color = '#00ff00';
            }
    }
}
$agent = mssql_query("exec [regplat-ru].pendjurina.[owebs_mini_GetAgents]");
$view->agent = $agent;
$agent = mssql_query("select * from [dbo].[owebs_mini_logins]");
$view->agent2 = $agent;
$view->message=$message;
$view->color = $color;
echo $view->render();