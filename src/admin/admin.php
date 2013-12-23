<?php
//this is old project of Pendjulina Katja. I did not refactor this
require "../config/connect.php";
$connect =  mssql_connect( $Server, $Login, $Password ) or	die( 'Could not open connection to server' );

mssql_select_db( $DataBase, $connect ) or 	die( 'Could not select database '. $DataBase );
if ((isset($_GET['delete'])) and ($_GET['delete'] == 1)) {
	$query = mssql_query('exec[dbo].[owebs_mini_DeleteAgent] '.mssql_real_escape_string($_GET['id']).'');
	echo 'Запись удалена';
	exit;
}	  
if ((isset($_POST['phone'])) and (isset($_POST['password'])) and (isset($_POST['email']))) {
	if ($_POST['add']==1)
		{
		if ((int)$_POST['status'] != 0)
			$status = mssql_real_escape_string($_POST['status']);
		else $status = 0;
		$query = mssql_query('exec [dbo].[owebs_mini_AddAgent] '.mssql_real_escape_string($_POST['agentoid']).','.mssql_real_escape_string($_POST['phone']).', "'.mssql_real_escape_string($_POST['password']).'",  "'.mssql_real_escape_string($_POST['email']).'", '.$status.'');
		}
	else
		if($_POST['change']==1)
					{
					$query = mssql_query('exec [dbo].[owebs_mini_ChangeAgent] '.mssql_real_escape_string($_POST['phone']).', '.mssql_real_escape_string($_POST['password']).', "'.mssql_real_escape_string($_POST['email']).'", '.mssql_real_escape_string($_POST['status']).', '.mssql_real_escape_string($_POST['id']).'');
					
					}
} 
echo '<!DOCTYPE html>
           <html>
              <head>
               <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
			   <link rel="stylesheet" href="../web/css/demo_page.css" type="text/css" />
               <link rel="stylesheet" href="../web/css/demo_table.css" type="text/css" />
               <link rel="stylesheet" href="../web/css/style.css" type="text/css" />

               <script type="text/javascript" src="../web/js/jquery-1.9.1.js"></script>
               <script type="text/javascript" src="../web/js/jquery.dataTables.min.js"></script>
               <script type="text/javascript" src="../web/js/provider.js"></script>
			   <script src="../web/js/jquery.maskedinput.min.js" type="text/javascript"></script>
			   	
               <title>regplat</title>
               </head>
               
               <body id="dt_example">
					<div id="container">
						<div id="header">
						  <img src="../web/images/regplat_small.png" alt="logo"/>
						  <h1>Мониторинг терминалов</h1>
						</div>
						<div class="exit"><a href="../web/index.php" title="Выход"><img src="../web/images/exit.png" alt="exit"/></a></div>
						<div class="exit" id="exit_text"><a href="../web/index.php" title="Выход">Выход</a></div>
						<div id="agent" >Данные агентов <br/><br/>
						<img alt="new" src="../web/images/new.png" id="new"/>
						<div class="notvisible" id="right">
							<form action="#" method="post">
							<table>
							<tr><td colspan="2"><select id="agent_name" onChange="find_id()">
							';
							$agent = mssql_query("exec [regplat-ru].pendjurina.[owebs_mini_GetAgents]");
														
							if (mssql_num_rows($agent) > 0)
								  {
								  while ($agent_info = MyIconv(mssql_fetch_array($agent))){
									echo '<option value="'.$agent_info['provider_oid'].'">'.$agent_info['ProviderName'].'</option>';
									
								  }
								  }

							echo '</select></td></tr>
							<tr><td>ID Агента</td><td><a id="agent_id"></a></td></tr>
							<tr><td>Телефон</td><td><input type="text"  id="agent_phone" name="phone"/></td></tr>
							<tr><td>Пароль</td><td><input type="text" id="agent_pas" name="password"/></td></tr>
							<tr><td>E-mail</td><td><input type="text" id="agent_email" name="email"/></td></tr>
							<tr><td>Статус</td><td><input type="text" id="agent_status" name="status"/></td></tr>
							<input type="hidden" name="agentoid" id="agentoid" value=""/>
							<input type="hidden" name="add" value="1"/>
							</table><input type="submit" value="Сохранить"/></form>
						</div>
						
				   ';

	  $count = 0;
	  echo '<div id="demo_gecko">
            <table class="display" id="agent_info">
			<thead><th>ID Агента</th><th>Телефон</th><th>Пароль</th><th>Email</th><th>Статус</th><th></th><th></th><th>#</th></thead>
			<tbody>';
				$agent = mssql_query("select * from [dbo].[owebs_mini_logins]");

				if (mssql_num_rows($agent) > 0)
					  {
					  while ($agent_info = mssql_fetch_array($agent)) {
						echo '<tr><td>'.$agent_info['agent_oid'].'</td><td>'. $agent_info['phone'].'</td><td>Зашифрованно</td><td>'.$agent_info['email'].'</td><td>'.$agent_info['status'].'</td><td><a href="#" class="edit"><img src="../web/images/edit.png"/></a></td><td><a href="#" class="delete"><img src="../web/images/delete.png"/></a></td><td>'.$agent_info['id_login'].'</td></tr>';
						$count ++;
					  }
					  }
			echo '</tbody>
			</table>
				
	  </div></div></div></body></html>';
	
function mssql_real_escape_string($s) {
	if(get_magic_quotes_gpc()) {
		$s = stripslashes($s);
	}
	$s = str_replace("'","''",$s);
	return $s;
}
function MyIconv($array = array()) {
	$new_array = array();
	foreach ($array as $key => $value)
		{
		$new_array[$key] = iconv('Windows-1251', 'UTF-8', $value);
		}
	return $new_array;
}
?>