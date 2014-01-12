<?php
/**
 * Created by IntelliJ IDEA.
 * User: Yuvielle
 * Date: 05.11.13
 * Time: 17:50
 * To change this template use File | Settings | File Templates.
 */
class library_utils
{

    static public function mssql_real_escape_string($s)
    {
        if (get_magic_quotes_gpc()) {
            $s = stripslashes($s);
        }
        $s = str_replace("'", "''", $s);
        return $s;
    }

    static public function MyIconv($array = array())
    {
        if (empty($array)) return array();
        $new_array = array();
        if (is_array($array))
            foreach ($array as $key => $value) {
                $new_array[$key] = iconv('Windows-1251', 'UTF-8', $value);
            }
        return $new_array;
    }

    static public function GetRealIp()
    {
        if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
            $ip = $_SERVER['HTTP_CLIENT_IP'];
        } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
        } else {
            $ip = $_SERVER['REMOTE_ADDR'];
        }
        return $ip;
    }

    static public function getMoneyStateTable($query, $start_date=null, $end_date=null) {
        if(!$start_date) $start_date = date('Y-m-d');
        if(!$end_date) $end_date = date('Y-m-d');

        $total_amount = 0;
        $totalm = 0;
        $totalk = 0;
        $ten = 0;
        $fifty = 0;
        $hundred = 0;
        $fiveh = 0;
        $onet = 0;
        $fivet = 0;
        $one = 0;
        $two = 0;
        $five = 0;
        $tenm = 0;
        $result = array();
        $names = array();
        while ($aRow = library_utils::MyIconv(mssql_fetch_array($query))) {
            array_push($names, $aRow['name']);
            if(@$aRow['RECEIVE_TIME']) $aRow['RECEIVE_TIME'] = date('d.m.Y H:i:s', strtotime(@$aRow['RECEIVE_TIME']));
            if(@$aRow['RECEIVE_DATE']) $aRow['RECEIVE_DATE'] = date('d.m.Y H:i:s', strtotime(@$aRow['RECEIVE_DATE']));
            if(@$aRow['TERMINAL_DATE']) $aRow['TERMINAL_DATE'] = date('d.m.Y H:i:s', strtotime(@$aRow['TERMINAL_DATE']));

            if(@$aRow['CASH_NOMINAL']) $total_amount += $aRow['CASH_NOMINAL'];
            elseif(@$aRow['CASH_AMOUNT']) $total_amount += $aRow['CASH_AMOUNT'];
            if(@$aRow['BILLS']){
                $cupur_string = $aRow['BILLS'];
                $k = explode(";", $cupur_string);
                $monets = array('one'=>0, 'two'=>0, 'five'=>0, 'ten'=>0, 'fifty'=>0, 'hundred'=>0, 'fiveh'=>0,'onet'=>0, 'fivet'=>0, 'tenm'=>0);
                for ($i=0; $i<sizeof($k); $i++) {

                    $mas = explode(':', $k[$i]);
                    $cupur_col[$i] = $mas[1];
                    $cupur_nom[$i] = $mas[0];
                    if(strcmp($cupur_nom[$i],'10') == 0) $cupur_nom[$i] = 10;
                    //if(strcmp($cupur_nom[$i],'10.0') ==0) $cupur_nom[$i] =
                    if(strcmp($cupur_nom[$i],'1000') == 0) $cupur_nom[$i] = 1000;
                    if(strcmp($cupur_nom[$i],'5000') == 0) $cupur_nom[$i] = 5000;
                    switch ($cupur_nom[$i]) {
                        case 1:
                            $monets['one'] += $cupur_col[$i];
                            $one += $cupur_col[$i];
                            break;
                        case 2:
                            $monets['two'] += $cupur_col[$i];
                            $two += $cupur_col[$i];
                            break;
                        case 5:
                            $monets['five'] += $cupur_col[$i];
                            $five += $cupur_col[$i];
                            break;
                        case 10:
                            $monets['ten'] += $cupur_col[$i];
                            $ten += $cupur_col[$i];
                            break;
                        case '10.0':
                            $monets['tenm'] += $cupur_col[$i];
                            $tenm += $cupur_col[$i];
                            break;
                        case 50:
                            $monets['fifty'] += $cupur_col[$i];
                            $fifty += $cupur_col[$i];
                            break;
                        case 100:
                            $monets['hundred'] += $cupur_col[$i];
                            $hundred += $cupur_col[$i];
                            break;
                        case 500:
                            $monets['fiveh'] += $cupur_col[$i];
                            $fiveh += $cupur_col[$i];
                            break;
                        case 1000:
                            $monets['onet'] += $cupur_col[$i];
                            $onet += $cupur_col[$i];
                            break;
                        case 5000:
                            $monets['fivet'] += $cupur_col[$i];
                            $fivet += $cupur_col[$i];
                            break;
                    }
                    $aRow['monet']=$monets;
                }
            } else {
            if ($aRow['IS_COIN'] == 1) $totalm++;
            else $totalk++;
            switch ($aRow['CASH_NOMINAL']) {
                case 1:
                    $one++;
                    break;
                case 2:
                    $two++;
                    break;
                case 5:
                    $five++;
                    break;
                case 10:
                    if ($aRow['IS_COIN'] == 1) $tenm++;
                    else $ten++;
                    break;
                case 50:
                    $fifty++;
                    break;
                case 100:
                    $hundred++;
                    break;
                case 500:
                    $fiveh++;
                    break;
                case 1000:
                    $onet++;
                    break;
                case 5000:
                    $fivet++;
                    break;
                }
            }
            array_push($result, $aRow);
        }
        $names = array_unique($names);
        $count = count($names);
        return array('one'=>$one, 'two'=>$two, 'five'=>$five,
                        'ten'=>$ten, 'tenm'=>$tenm, 'fifty'=>$fifty, 'hundred'=>$hundred,
                        'fiveh'=>$fiveh, 'onet'=>$onet, 'fivet'=>$fivet , 'data'=> $result,
                        'total_amount'=>$total_amount, 'totalm'=>$totalm, 'totalk'=>$totalk,
                        'end_date'=>$end_date, 'start_date'=>$start_date, 't_count'=>$count);
    }


    static public function getTimeHelp(){
        if (isset($_GET['time'])) { //Всплывающая подсказка, сколько прошло времени

            $time_from_table = library_utils::mssql_real_escape_string($_GET['time']);
            $current_time = time();
            $time_from_connect2 = strtotime($time_from_table);
            $timedifference = $current_time - $time_from_connect2;
            $days = floor($timedifference / 86400);
            $hours = floor($timedifference / 3600);
            $minuts = floor(abs(($timedifference - round($hours * 3600))) / 60);
            $hours_f = floor(abs(($timedifference - round($days * 86400))) / 3600);

            $difference = $days . 'д  ' . $hours_f . 'ч  ' . $minuts . 'м  назад';
            return $difference;
        }
        return false;
    }

    static public function timeFormat($start, $end)
    {
        if ($start) {
            $day_start = $start . ' 00:00:00';
        } else {
            $day_start = date('Y-m-d 00:00:00');
            $start = date('Y-m-d');
        }
        if ($end) {
            $day_end = $end . ' 23:59:59';
        } else {
            $day_end = date('Y-m-d 23:59:59');
            $end = date('Y-m-d');
        }
        return array('day_start'=>$day_start, 'day_end'=>$day_end, 'day_start_for_show' => $start, 'day_end_for_show' => $end);
    }
}

if (!function_exists("bcdiv")) {
    function bcdiv($first, $second, $scale = 0)
    {
        $res = $first / $second;
        return round($res, $scale);
    }
}
