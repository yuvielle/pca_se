<?php
/**
 * Created by IntelliJ IDEA.
 * User: Yuvielle
 * Date: 06.11.13
 * Time: 21:49
 * To change this template use File | Settings | File Templates.
 */
class app_terminalController extends app_baseController
{
    public function index()
    {
        $agent = $this->Query("exec [regplat-ru].dbo.owebs_mini_GetAgentInfo '" . $_SESSION['session_hash'] . "'");
        $group = $this->Query('exec [regplat-ru].pendjurina.owebs_mini_GetGroups "' . $_SESSION['session_hash'] . '"');
        $this->view->agent = $agent;
        $this->view->group = $group;
        $this->view->environtment = 'terminal';
        $terminalErrors = $this->Query('exec [regplat-ru].dbo.owebs_mini_GetPointList "' . $_SESSION['session_hash'] . '"');
        $this->view->terminalErrors = $terminalErrors;
        $result = $this->Query("exec [regplat-ru].dbo.owebs_mini_GetPointList '" . $_SESSION['session_hash'] . "'");
        $res = array();
        while ($row = library_utils::MyIconv(mssql_fetch_array($result))) {
            array_push($res, $row);
        }
        $this->view->Result = $res;
        $this->view->table_name = 'example';
        echo $this->view->render();
        mssql_free_result($terminalErrors);
    }

    public function logout()
    {
        $session = library_session::init();
        $session->logout();
        $this->redirect('login');
    }

//ajax actions

    public function acceptorData()
    {
        $id_terminal = !empty($_GET["id_terminal"]) ? $_GET["id_terminal"] : 1;
        $sQuery = "exec [regplat-ru].dbo.owebs_mini_GetPointKupurs '" . $id_terminal . "' , '" . $_SESSION['session_hash'] . "'";
        $rResult = $this->Query($sQuery);
        echo library_FastJSON::encode(library_utils::getMoneyStateTable($rResult));
    }

    public function bills() //answer on button 'kupuri'
    {
        $days = library_utils::timeFormat(@$_GET['start'], @$_GET['end']);

        $sQuery = "exec [regplat-ru].dbo.owebs_mini_GetDayBills '" . $days['day_end'] . "', '" . $days['day_start'] . "', '" . $_SESSION['session_hash'] . "'";
        $rResult = $this->Query($sQuery);
        //ну нету тут json.so блин.
        echo library_FastJSON::encode(library_utils::getMoneyStateTable($rResult, $days['day_start_for_show'], $days['day_end_for_show']));
    }


    public function encashment()
    {
        $id_terminal = !empty($_GET["id_terminal"]) ? $_GET["id_terminal"] : 1;
        $sQuery = "exec [regplat-ru].dbo.owebs_mini_GetPointInkass '" . $id_terminal . "' , '" . $_SESSION['session_hash'] . "'";
        $rResult = $this->Query($sQuery);
        echo library_FastJSON::encode(library_utils::getMoneyStateTable($rResult));
    }

    public function incash()
        {
            $days = library_utils::timeFormat(@$_GET['start'], @$_GET['end']);

            $group = 0;
            if (@$_GET['group']) $group = $_GET['group'];

            $sQuery = "exec [regplat-ru].dbo.owebs_mini_GetDayIncass '" . $days['day_end'] . "', '" . $days['day_start'] . "', '" . $_SESSION['session_hash'] . "', " . $group;
            $rResult = $this->Query($sQuery);
            $groupQuery = $this->Query('exec [regplat-ru].pendjurina.owebs_mini_GetGroups "' . $_SESSION['session_hash'] . '"');
            $groups = array();
            while($row = library_utils::MyIconv(mssql_fetch_array($groupQuery))){
                array_push($groups, $row);
            }
            echo library_FastJSON::encode(array_merge(library_utils::getMoneyStateTable($rResult, $days['day_start_for_show'], $days['day_end_for_show']), array('groups'=>$groups, 'current_group'=>$group)));
        }


    public function terminalErrors($request, library_session $session)
    {
        $oid = $session->getAgentOid();
        $day_end = date('Y-m-d 23:59:59');
        $day_start = date('Y-m-d 00:00:00', (time() - 160800));
        $day_start_for_show = date('Y-m-d', (time() - 160800));
        $day_end_for_show = date('Y-m-d');
        if (@$_GET['start'] && @$_GET['end']) {
            $days = library_utils::timeFormat(@$_GET['start'], @$_GET['end']);
            $day_start_for_show = $_GET['start']; $day_end_for_show = $_GET['end'];
            //$sQuery = "exec [regplat-ru].dbo.owebs_mini_Get3DayErrors '" . $days['day_end'] . "', '" . $days['day_start'] . "', '" . $_SESSION['session_hash'] . "'";
            $sQuery = "SELECT 0 as err_code, name, [TERMINAL_CODE], [RECEIVE_TIME] ,[DEVICE_NAME] ,[ERROR_TEXT]
                          FROM [ipt].[dbo].[EVENTS_DEVICE_ERROR] AS e LEFT OUTER JOIN gorod.dbo.point as p on p.point_oid=e.terminal_code
                          where receive_time <= '" .  $days['day_end'] . "' and receive_time >= '" .  $days['day_start'] . "' and p.agent_oid='" . $oid . "' and p.point_type_id = 3
                          order by receive_time desc";
            $rResult = $this->Query($sQuery);
        } elseif (@$_GET['terminals']) {
            //$sQuery = "exec [regplat-ru].dbo.owebs_mini_Get3DayErrors '" . $cur_day_start . "', '" . $cur_day_end . "', '" . $_SESSION['session_hash'] . "'";
            //$sQuery_deiail = "SELECT DISTINCT 0 as err_code, name, [TERMINAL_CODE], [RECEIVE_TIME] ,[DEVICE_NAME] ,[ERROR_TEXT]
            //  FROM [ipt].[dbo].[EVENTS_DEVICE_ERROR] AS e LEFT OUTER JOIN gorod.dbo.point as p on p.point_oid=e.terminal_code
            //  where receive_time <= '" . $day_end . "' and receive_time >= '" . $day_start . "' and p.agent_oid='" . $oid . "' and p.point_type_id = 3
            //  and e.terminal_code in (" . implode($term_with_er, ', ') . ") order by receive_time desc";
            //$rResult_detail = $this->Query($sQuery_deiail);
            $sQuery = "SELECT 0 as err_code, name, [TERMINAL_CODE], [RECEIVE_TIME] ,[DEVICE_NAME] ,[ERROR_TEXT]
               FROM [ipt].[dbo].[EVENTS_DEVICE_ERROR] AS e LEFT OUTER JOIN gorod.dbo.point as p on p.point_oid=e.terminal_code
               where receive_time <= '" . $day_end . "' and receive_time >= '" . $day_start . "' and p.agent_oid='" . $oid . "' and p.point_type_id = 3
               order by receive_time desc";
            $rResult = $this->Query($sQuery);
        } else {
            $id_terminal = !empty($_GET["id_terminal"]) ? $_GET["id_terminal"] : 1;
            $sQuery = "exec [regplat-ru].dbo.owebs_mini_GetPointErrors '" . $id_terminal . "', '" . $_SESSION['session_hash'] . "'";
            $rResult = $this->Query($sQuery);
        }
        $data = array();
        while ($row = library_utils::MyIconv(mssql_fetch_array($rResult))) {
            $row['RECEIVE_TIME'] = date('d.m.Y H:i:s', strtotime($row['RECEIVE_TIME']));
            array_push($data, $row);
        }

        echo library_FastJSON::encode(array('data' => $data, 'term_with_er' => @$_GET['terminals'], 'start_date' => $day_start_for_show, 'end_date'=>$day_end_for_show));
    }

    public function search(library_request $request, library_session $session) {

        $pay_info = $this->Query('exec [pendjurina].[owebs_mini_GetPayStates]');
        $pay_states = array();
        $pay_types = array();
        $points = array();

        if (mssql_num_rows($pay_info) > 0) {
            while ($pay_state = library_utils::MyIconv(mssql_fetch_array($pay_info))) {
                array_push($pay_states,$pay_state);
            }
        }
        $pay_info = $this->Query('exec [pendjurina].[owebs_mini_GetPayProvider]'); //todo autocomplete field
        if (mssql_num_rows($pay_info) > 0) {
            while ($pay_type = library_utils::MyIconv(mssql_fetch_array($pay_info))) {
                array_push($pay_types, $pay_type);
            }
        }
        $oid = $session->getAgentOid();
        $terminals = $this->Query("SELECT DISTINCT name, point_oid from [Gorod].[dbo].[point] where agent_oid='" . $oid . "' and status=0 and extern_id is not null order by name asc");
        if (mssql_num_rows($terminals) > 0) {
            while ($point = library_utils::MyIconv(mssql_fetch_array($terminals))) {
                array_push($points, $point);
            }
        }
        $data = array();
        if ($request->isPost()) {
            $start_date = library_utils::mssql_real_escape_string($request->start_date . ' 00:00:00');
            $end_date = library_utils::mssql_real_escape_string($request->end_date . ' 23:59:59');

            $id_terminal = ($request->id_terminal != '') ? library_utils::mssql_real_escape_string($request->id_terminal) : "'%'";
            $pay_type = ($request->pay_type != '') ? "'%" . iconv('UTF-8', 'Windows-1251', library_utils::mssql_real_escape_string($request->pay_type)) . "%'" : "'%'";
            $string = '';
            if((int)$request->pay_state == 6){
                $string = ' and pdesc.state = 6 ';
            }
            elseif((int)$request->pay_state != 0){
                $string = ' and pdesc.state <> 6 ';
            }
            $tid = ((int)$request->tid != 0) ? library_utils::mssql_real_escape_string($request->tid) : "'%'";
            $transaction = ((int)$request->transaction != 0) ? '"' . library_utils::mssql_real_escape_string($request->transaction) . '"' : "'%'";
            $client_account = ($request->client_account != '') ? library_utils::mssql_real_escape_string($request->client_account) : "%";
            $client_amount = ((int)$request->client_amount != 0) ? library_utils::mssql_real_escape_string($request->client_amount) : "'%'";
            //$pays = $this->Query('exec [pendjurina].[owebs_mini_FindPays] "' . $_SESSION['session_hash'] . '", "' . $start_date . '", "' . $end_date . '", ' . $id_terminal . ', ' . $pay_type . ', ' . $pay_state . ', ' . $tid . ', ' . $transaction . ', ' . $client_account . ', ' . $client_amount . '');
            //todo свалить всё это в процедуру
            $pays = $this->Query("
                SELECT    0 as err_code, p.tid, p.sub_inner_tid, p.point_oid, p.DatePay, pr.ProviderName, gorod.dbo.PD4.ClientAccount,
                            CAST(--CAST(p.state AS varchar(2)) + '-' +
                            pdesc.name AS varchar(30)) AS state, p.summary_amount, p.Commission, p.amount
                FROM	  gorod.dbo.point point LEFT OUTER JOIN
                		  gorod.dbo.payment p  on p.point_oid = point.point_oid LEFT OUTER JOIN
                          gorod.dbo.PD4 ON gorod.dbo.PD4.tid = p.tid LEFT OUTER JOIN
                          gorod.dbo.provider pr ON pr.provider_oid = p.provider_oid LEFT OUTER JOIN
                          gorod.dbo.payment_state_desc pdesc ON pdesc.state = p.state
                WHERE     point.agent_oid = '" . $oid . "'
                            and p.datepay >= '" . $start_date . "'
                            and p.datepay <= '" . $end_date . "'
                            and p.sub_inner_tid like Convert(VarChar, " . $transaction . ")
                            and p.point_oid Like Convert(VarChar, " . $id_terminal . ")"
                            . $string .
                            "and pr.ProviderName Like Convert(VarChar, " . $pay_type . ")
                            and p.tid Like Convert(VarChar, " . $tid . ")
                            and gorod.dbo.PD4.ClientAccount like Convert(VarChar, '" . $client_account . "') + '%'
                            and p.summary_amount like Convert(VarChar, " . $client_amount . ") + '%'
                order by p.datepay desc
            ");

            $data = array();
            if (mssql_num_rows($pays) > 0) {
                while ($pay = library_utils::MyIconv(mssql_fetch_array($pays))) {
                    $sub_tid = explode('-', $pay['sub_inner_tid']);
                    $pay['DatePay'] = (date('d.m.Y H:i:s', strtotime($pay['DatePay'])));
                    $pay['sub_tid'] = @$sub_tid[2];
                    array_push($data, $pay);
                }
            }
        }
        echo library_FastJSON::encode(array('pay_states'=>$pay_states,
                                'pay_types'=>$pay_types,
                                'data'=>$data,
                                'points'=>$points,
                                'start_date'=>$request->start_date?$request->start_date:'',
                                'end_date'=>$request->end_date?$request->end_date:'',
                                'pay_state'=>$request->pay_state?$request->pay_state:'',
                                'id_terminal'=>$request->id_terminal?$request->id_terminal:'',
                                'tid'=>$request->tid?$request->tid:'',
                                'transaction'=>$request->transaction?$request->transaction:'',
                                'client_account'=>$request->client_account?$request->client_account:'',
                                'client_amount'=>$request->client_amount?$request->client_amount:''  //todo pager
        ));
    }

    public function income(library_request $request, library_session $session)
    {
        $condition = "' ";
        $period = @$_GET['period'];
        $year = false;
        $week = false;
        switch ($period) {
            case 2:
                $day_start = date('Y-m-01 00:00:00');
                $day_end = date('Y-m-d 23:59:59');
                break;
            case 3:
                $month = date('m');
                $date = 'Y-' . ($month - 1) . '-01 00:00:00';
                if($month == '01') {
                    $y= date('Y');
                    $date = $y-1  . '-12-01 00:00:00';
                }
                $day_start = date($date);
                $day_end = date('Y-m-01 00:00:00');
                break;
            case 4:
                $day_start = date('Y-01-01 00:00:00');
                $day_end = date('Y-m-d 23:59:59');
                $year = true;
                break;
            case 5:
                $day_start = $_GET['start_date'] . ' 00:00:00';
                $day_end = $_GET['end_date'] . ' 23:59:59';
                $start = explode('-', $_GET['start_date']);
                $end = explode('-', $_GET['end_date']);
                if(mktime(00, 00, 00, $end[1], $end[2], $end[0]) - mktime(00, 00, 00, $start[1], $start[2], $start[0]) > 86400*180){
                    $year = true;
                }
                elseif(mktime(00, 00, 00, $end[1], $end[2], $end[0]) - mktime(00, 00, 00, $start[1], $start[2], $start[0]) > 86400*40){
                      $week = true;
                }
                break;
            default:
                $day_start = date('Y-m-d 00:00:00', (time() - 518400));
                $day_end = date('Y-m-d 23:59:59');
        }
        $terminal_id = @$_GET['terminal_id']?$_GET['terminal_id']:false;
        if($terminal_id)  $condition =  "' and point_oid = " .  (int)$terminal_id;
        if($year){
            $sQuery = "SELECT MONTH(gorod.dbo.payment.DatePay) as point_date, count(tid) as pays_amount,sum(summary_amount) as summa, sum(Commission) as commission,  sum(amount) as total
            FROM  gorod.dbo.payment  where agent_oid = '" . $session->getAgentOid() . "' and DatePay > '" . $day_start . "' and DatePay < '" . $day_end . $condition .
            " group by year(gorod.dbo.payment.DatePay), MONTH(gorod.dbo.payment.DatePay) ORDER BY year(gorod.dbo.payment.DatePay), MONTH(gorod.dbo.payment.DatePay) asc";

        }
        elseif($week){
            $sQuery = "SELECT DATEPART(wk,gorod.dbo.payment.DatePay) as point_date, year(gorod.dbo.payment.DatePay) as year, count(tid) as pays_amount,sum(summary_amount) as summa, sum(Commission) as commission,  sum(amount) as total
                FROM  gorod.dbo.payment where agent_oid = '" . $session->getAgentOid() . "' and DatePay >= '" . $day_start . "' and DatePay <= '" . $day_end . $condition .
                " group by year(gorod.dbo.payment.DatePay),  DATEPART(wk,gorod.dbo.payment.DatePay)  ORDER BY year(gorod.dbo.payment.DatePay), DATEPART(wk,gorod.dbo.payment.DatePay) asc";

        } else {
            $sQuery = "SELECT CONVERT(varchar, DatePay, 104) as point_date, count(tid) as pays_amount,sum(summary_amount) as summa, sum(Commission) as commission,  sum(amount) as total
               FROM  gorod.dbo.payment where agent_oid = '" . $session->getAgentOid() . "' and DatePay >= '" . $day_start . "' and DatePay <= '" . $day_end . $condition .
               " group by CONVERT(varchar, DatePay, 104),  MONTH(gorod.dbo.payment.DatePay), year(gorod.dbo.payment.DatePay) ORDER BY year(gorod.dbo.payment.DatePay), MONTH(gorod.dbo.payment.DatePay),  CONVERT(varchar, DatePay, 104) asc";
        }
        //else $sQuery = "exec " . $query . " '" . $_SESSION['session_hash'] . "', '" . $day_start . "', '" . $day_end . "'";
        //echo $sQuery;
        $rResult = $this->Query($sQuery);
        $points = array(array(),array(),array());
        $data = array();
        $x_axis = array();
        $all = false;
        if((!@$_GET['pays_amount'] && !@$_GET['summa'] && !@$_GET['commission']) || @$_GET['all']) $all = true;
        if (mssql_num_rows($rResult) > 0) {
            while ($row = library_utils::MyIconv(mssql_fetch_array($rResult))) {
                if ($year) {
                    $row['date'] = $row['x_axis'] = (int)$row['point_date']>9?$row['point_date']:'0' . $row['point_date'];
                }elseif($week){
                    $row['date'] = date('d.m.Y', $row['point_date'] * 7 * 86400 + strtotime($row['year'] . '/1/1') - date('w', strtotime($row['year'] . '/1/1')) * 86400 - 6* 86400);
                    $row['x_axis'] = date('d.m.y', $row['point_date'] * 7 * 86400 + strtotime($row['year'] . '/1/1') - date('w', strtotime($row['year'] . '/1/1')) * 86400 - 6* 86400);
                    //$row['date'] = $row['year'] . "/" . $row['point_date'];
                }
                else {

                    $row['date'] = date('d.m.Y', strtotime($row['point_date']));
                    $row['x_axis'] = date('d.m.y', strtotime($row['point_date']));
                    $row['time'] = strtotime($row['point_date']);
                }
                array_push($x_axis, $row['x_axis']);
                if(@$_GET['pays_amount'] || $all) $points[0][] = round($row['pays_amount']);
                if(@$_GET['summa'] || $all) $points[1][] = round($row['summa'],2);
                if(@$_GET['commission'] || $all) $points[2][] = round($row['commission'],2);
                array_push($data, $row);
            }
        }
        $term_select = array();
        $oid = $session->getAgentOid();
        $terminals = $this->Query("SELECT DISTINCT name, point_oid from [Gorod].[dbo].[point] where agent_oid='" . $oid . "' and status=0 and extern_id is not null order by name asc");
        if (mssql_num_rows($terminals) > 0) {
            while ($point = library_utils::MyIconv(mssql_fetch_array($terminals))) {
                array_push($term_select, $point);
            }
        }

        echo library_FastJSON::encode(array('legends'=>array('points1','points2','points3'),
            'y_axis'=>$points, 'data'=>$data, 'x_axis'=>$x_axis, 'period'=>@$period?$period:1,
            'start_day'=>@$_GET['start_date']?$_GET['start_date']:'', 'end_day'=>@$_GET['end_date']?$_GET['end_date']:'',
            'all'=> $all, 'pays_amount'=>@$_GET['pays_amount']?1:'',
            'summa'=>@$_GET['summa']?1:'', 'commission'=>@$_GET['commission']?1:'', 'term_select'=>$term_select));
    }

    public function terminalInformation()
    {
        $id_terminal = library_utils::mssql_real_escape_string($_GET['id_terminal']);
        $data = array();
        $rasp = array();
        $sQuery = "exec [regplat-ru].pendjurina.owebs_mini_GetTerminalInfo '" . $id_terminal . "', '" . $_SESSION['session_hash'] . "'";
        $rResult = $this->Query($sQuery);
        while ($aRow = library_utils::MyIconv(mssql_fetch_array($rResult))) {
            $aRow['cert_dateend']= date('d.m.Y H:i:s', strtotime($aRow['cert_dateend']));;
            $data = $aRow;
        }
        $timetable = mssql_query("exec [pendjurina].[owebs_mini_GetTermTimetable] " . $id_terminal . "");
        if (mssql_num_rows($timetable) > 0) {
            $rasp = array(array());
            $i = 0;
            while ($table = library_utils::MyIconv(mssql_fetch_array($timetable))) {
                $rasp[$i][0] = $table['start_time'];
                $rasp[$i][1] = $table['end_time'];
                $rasp[$i][2] = $table['period'];
                $rasp[$i][3] = $table['id_timetable'];
                $i++;
            }
        }
        echo library_FastJSON::encode(array('data'=>$data, 'rasp'=>$rasp, 'id_terminal'=>$_GET['id_terminal']));
    }

    public function terminalScheduleDelete(){
        $time = $this->Query('delete from [pendjurina].[owebs_mini_terminal_timetable] where id_timetable = ' . $_GET['id_timetable']);
        if ($time) echo 'Расписание успешно удалено';
        else echo 'Ошибка в удалении';
    }

    public function insertTermTimetable(){
        $id_terminal = $_GET['id_terminal'];
        $timetable = array(array());
        $node = 0;
        $n = count($_GET);
        $n = ($n - 1) / 3;

        for ($i = 0; $i < $n; $i++) {
            if (($_GET["max_time_from_pay" . $i] != '')) {
                if (($_GET["start_time" . $i] != '') && ($_GET["end_time" . $i] != '')) {
                    $timetable[$node][0] = substr(library_utils::mssql_real_escape_string($_GET["start_time" . $i]), 0, 2);
                    $timetable[$node][1] = substr(library_utils::mssql_real_escape_string($_GET["end_time" . $i]), 0, 2);
                    $timetable[$node][2] = library_utils::mssql_real_escape_string($_GET["max_time_from_pay" . $i]);
                    $node++;
                } else {
                    $timetable[$node][0] = 00;
                    $timetable[$node][1] = 24;
                    $timetable[$node][2] = library_utils::mssql_real_escape_string($_GET["max_time_from_pay" . $i]);
                    $node++;
                }
            }
        }
        for ($i = 0; $i < $node; $i++) {
            // Добавляем запись в нашу таблицу customer
            // т.е. делаем sql запрос
            $query = 'exec [pendjurina].[owebs_mini_InsertTermTimetable] ' . $id_terminal . ', "' . $timetable[$i][0] . '", "' . $timetable[$i][1] . '", "' . $timetable[$i][2] . '"';
            $this->Query($query);
        }
        header('Location: index.php');
    }

    public function banknotesMaxCountChange(){
        $id_terminal = library_utils::mssql_real_escape_string($_GET['id_terminal']);
        $max_kup = library_utils::mssql_real_escape_string($_GET['max_kup']);
        $this->Query('exec [regplat-ru].[pendjurina].[owebs_mini_InsertMaxKup] "'.$_SESSION['session_hash'].'", "'.$max_kup.'", "'.$id_terminal.'"');
        echo 'Максимальное количество купюр для данного терминала изменено';
    }

    public function getTime()
    {
        $time_from_table = library_utils::mssql_real_escape_string($_GET['time']);
        $current_time = time();
        $time_from_connect2 = strtotime($time_from_table);
        $timedifference = $current_time - $time_from_connect2;
        $days = floor($timedifference / 86400);
        $hours = floor($timedifference / 3600);
        $minuts = floor(abs(($timedifference - round($hours * 3600))) / 60);
        $hours_f = floor(abs(($timedifference - round($days * 86400))) / 3600);
        $difference = $days . 'д  ' . $hours_f . 'ч  ' . $minuts . 'м  назад';
        echo $difference;
    }

    public function getSelectedGroup()
    {
        $i = 1;
        $terminal = array();
        $keys = array();
        $id_group = library_utils::mssql_real_escape_string($_GET['id_group']);
        $selected_group = $this->Query('exec [regplat-ru].pendjurina.owebs_mini_GetTermInGroups ' . $id_group . ', 0');
        if (mssql_num_rows($selected_group) > 0) {
            while ($group = library_utils::MyIconv(mssql_fetch_array($selected_group))) {
                $keys[$i] = 'tid';
                $terminal[$i] = $group['point_oid'];
                $i++;
            }
        }
        echo library_FastJSON::encode(array('keys'=>$keys, 'values'=>$terminal));
        mssql_free_result($selected_group);
    }

    public function deleteGroup(){
        $id_group = library_utils::mssql_real_escape_string($_GET['id_group']);
        $this->Query('exec [regplat-ru].pendjurina.owebs_mini_DeleteGroup "'.$_SESSION['session_hash'].'", '.$id_group.'');
    }

    public function saveGroup(library_request $request) { // die(var_dump($_POST));
        if($request->isPost()){
            $result = '';
            $group_name = library_utils::mssql_real_escape_string($_POST['group_name']);
            $terminal = $_POST['terminals'];//library_FastJSON::decode($_POST['terminals']);
            $id_group = $_POST['group_id']?$_POST['group_id']:null;

            $new = false;
            if(!$id_group){
                $new = true;
                $new_group = $this->Query('exec [regplat-ru].pendjurina.owebs_mini_InsertGroup "' . $_SESSION['session_hash'] . '", "' . iconv('UTF-8', 'Windows-1251', $group_name) . '", 0');
                if (mssql_num_rows($new_group) > 0) {
                    while ($group = library_utils::MyIconv(mssql_fetch_array($new_group))) {
                        $id_group = $group['id_group'];
                    }
                }
            }
            if ($id_group != -1) {
                if(!$new) $this->Query('delete from [dbo].[owebs_mini_agent_groups_ids] where [id_group] = ' . $id_group);
                foreach ($terminal as $t) {
                    $t = library_utils::mssql_real_escape_string($t);
                    if ($t != '')
                        $this->Query('exec [regplat-ru].pendjurina.owebs_mini_InsertTermInGroup ' . $t . ', ' . $id_group . ', 0');
                }
                $result = $new?'Группа успешно созданна':'Группа отредактирована';
            } else $result = 'Группа с таким название уже существует';
        }
        else $result = "данные не отправлены";
        echo $result;
    }

    public function groupFormShow(library_request $request, library_session $session){
        $oid = $session->getAgentOid();
                $terminals = $this->Query("SELECT DISTINCT name, point_oid from [Gorod].[dbo].[point] where agent_oid='" . $oid . "' and status=0 and extern_id is not null order by name asc");
        $points = array();
        $selected_terminals = array();
        if($id_group = $request->id_group) {
            $selected_terminals_query = $this->Query('exec [regplat-ru].pendjurina.owebs_mini_GetTermInGroups ' . $id_group . ', 1');
            if (mssql_num_rows($selected_terminals_query) > 0) {
                while ($point = library_utils::MyIconv(mssql_fetch_array($selected_terminals_query))) {
                    array_push($selected_terminals, $point);
                }
            }
        }
        if (mssql_num_rows($terminals) > 0) {
            while ($point = library_utils::MyIconv(mssql_fetch_array($terminals))) {
                array_push($points, $point);
            }
        }
        echo library_FastJSON::encode(array('terminals' => $points, 'selected_terminals' => $selected_terminals));
    }

    public function payDetail(library_request $request) {
        $id_terminal = $request->id;
        $sQuery = "exec [regplat-ru].dbo.owebs_mini_GetPointPays '" . $id_terminal . "', '" . $_SESSION['session_hash'] . "'";
        $rResult = $this->Query($sQuery);
        $data = array();
        $total_sum = 0;
        $total_commission = 0;
        $total_total = 0;
        $i = 0;
        if (mssql_num_rows($rResult) > 0) {
            while ($aRow = library_utils::MyIconv(mssql_fetch_array($rResult))) {
                $aRow['DatePay'] = date('d.m.Y H:i:s', strtotime($aRow['DatePay']));
                $total_sum += $aRow['summary_amount'];
                $total_commission += $aRow['Commission'];
                $total_total += $aRow['amount'];
                $data[$i]['cell'] = $aRow;
                $data[$i]['id']=$aRow['tid'];
                $i++;
            }
        }
        echo library_FastJSON::encode(array('data'=>$data, 'total_sum'=>$total_sum, 'total_commission'=>$total_commission, 'total_total'=>$total_total));
    }

    public function getDetail(library_request $request, library_session $session) {
        $id = $request->id;
        $query = "SELECT 0 as err_code, p.tid, p.Card_number, p.DatePay, p.DateLastChange, p.amount_commission_provider, p.amount_provider, pd.ClientAccount AS ClientAccount,
                               pd.ClientFIO AS ClientFIO, pd.ProviderName AS ProviderName, p.state AS state, pdesc.name as status_name,
                               pe.value as purpose, pe.extent_tid as etid, pdesc.descr as descript, p.summary_amount,
                               (select t.name  from gorod.dbo.point as t where t.point_oid=p.point_oid) as terminal_name,
                               e.Description, e.extentName
                        FROM gorod.dbo.payment p LEFT OUTER JOIN
                              gorod.dbo.PD4 pd ON pd.tid = p.tid LEFT OUTER JOIN
                              gorod.dbo.provider pr ON pr.provider_oid = p.provider_oid LEFT OUTER JOIN
                              gorod.dbo.payment_state_desc pdesc ON pdesc.state = p.state LEFT OUTER JOIN
                              gorod.dbo.payment_extent pe ON p.tid = pe.tid LEFT OUTER JOIN
                              gorod.dbo.extent e ON pe.extent_tid = e.extent_tid
                        WHERE p.tid = " . $id . " order by p.datepay desc";
        $states_query = "SELECT 0 as err_code, p.tid, ph.old_state, ph.new_state, ph.try_state,
                              ph.result_code, ph.result_text, ph.date_change
                         FROM gorod.dbo.payment p LEFT OUTER JOIN
                              gorod.dbo.payment_history ph ON p.tid = ph.tid
                         WHERE p.tid = " . $id . " order by p.datepay desc";
        $pay = $this->Query($query);
        $states = $this->Query($states_query);
        $data = array();
        $state = array();
        if (mssql_num_rows($pay) > 0) {
            while ($row = library_utils::MyIconv(mssql_fetch_array($pay))){;
                $row['DatePay'] = date('d.m.Y H:i:s', strtotime($row['DatePay']));
                $row['DateLastChange'] = date('d.m.Y H:i:s', strtotime($row['DateLastChange']));
                array_push($data, $row);
            }

        }
        if (mssql_num_rows($states) > 0) {
            while ($row = library_utils::MyIconv(mssql_fetch_array($states))){;
                $row['date_change'] = date('d.m.Y H:i:s', strtotime($row['date_change']));
                array_push($state, $row);
            }
        }
        echo library_FastJSON::encode(array('data' =>$data, 'state'=>$state));
    }

    public function statusChange(library_request $request, library_session $session){
        $status = $request->status_id;
        $id = $request->pid;
        $state_check = null;
        $query = "EXEC [gorod].[dbo].[Set_State_Payment_Ex] '" . $id . "', NULL, NULL, '" . $status . "', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL";
        $err_code = $this->Query($query);
        //because of this pl_sql script returns error code 1 independent from result of record update, check db update with additional query
        $query = "SELECT 0 as err_code, p.state FROM gorod.dbo.payment p where p.tid = '" . $id . "'";
        $check = $this->Query($query);
        if (mssql_num_rows($check) > 0) {
            while ($status_record = library_utils::MyIconv(mssql_fetch_array($check))) {
                $state_check = $status_record['state'];
            }
        }
        if((int)$state_check == (int)$status) $err_code = 0;
        else $err_code = $state_check. ' != ' . $status;
        echo $err_code;
    }
}
