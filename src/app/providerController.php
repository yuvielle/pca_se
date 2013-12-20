<?php
/**
 * Created by IntelliJ IDEA.
 * User: Yuvielle
 * Date: 23.11.13
 * Time: 15:07
 * To change this template use File | Settings | File Templates.
 */ 
class app_providerController  extends app_baseController{

    public function index(library_request $request, library_session $session) {
        $this->view->environtment = 'provider';
        $agent = $this->Query("exec pendjurina.owebs_mini_GetProviderInfo '" . $_SESSION['session_hash'] . "'");
        if($request->isPost()){
            $query = $this->getTableData($request, $session, true);
            $this->view->search_from = $request->search_from;
            $this->view->search_till = $request->search_till;
            $this->view->pay_state = $request->pay_state;
            $this->view->client_acount = $request->client_acount;
            $this->view->tid = $request->tid;
            $this->view->client_amount = $request->client_amount;
        } else {
            $query = $this->getTableData($request, $session, false);
        }
        $pays = $this->Query($query);
        $this->view->agent = $agent;
        $this->view->pays = $pays;
        echo $this->view->render();
    }

    public function excellWrite(library_request $request, library_session $session) {
        $query = $this->getTableData($request, $session, $request->isPost());
        $agent = $this->Query("exec pendjurina.owebs_mini_GetProviderInfo '" . $_SESSION['session_hash'] . "'");
        $pays = $this->Query($query);
        $terminal_amount = 0;
        $total_sum = 0;
        $total_com = 0;
        $total_total = 0;
        $count = mssql_num_rows($pays);
        $pays_data = array();
        $agent_data = array();
        $agent_header = array('name'=>'Провайдер', 'info'=>'описание', 'inn'=>'ИНН', 'agent_info'=>'данные агента');
        $pays_header = array('pay_status'=>'', 'tid'=>'идентификатор', 'DatePay'=>'дата платежа', 'ClientAccount'=>'номер счёта', 'summary_amount'=>'сумма', 'status_name'=>'статус', 'terminal_name'=>'терминал');
        if (mssql_num_rows($agent) > 0) {
            while ($agent_info = library_utils::MyIconv(mssql_fetch_array($agent))) {
                if ($agent_info['err_code'] == 401) {
                    $agent_data[]['name'] = $agent_info['ProviderName'];
                    $agent_data[]['info'] = $agent_info['pays_amount'];
                    $agent_data[]['inn'] = $agent_info['INN'];
                    $agent_data[]['agent_info'] = $agent_info['pays_sum'];
                }
            }
        }
        if (mssql_num_rows($pays) > 0){
            while ($row = library_utils::MyIconv(mssql_fetch_array($pays))) {
                $pays_data[]['pay_status'] = $row['state'];
                $pays_data[]['tid'] = $row['tid'];
                $pays_data[]['DatePay'] = date('d.m.Y H:i:s', strtotime($row['DatePay']));
                $pays_data[]['ClientAccount'] = $row['ClientAccount'];
                $pays_data[]['summary_amount'] = $row['summary_amount'];
                $pays_data[]['status_name'] = $row['status_name'];
                $pays_data[]['terminal_name'] = $row['terminal_name'];
            }
        }
        $doc = new library_excellWrite();
        $doc->setHeaders(null);
        $doc->addData($pays_header, $pays_data);
        $doc->save();
        echo 'test';
    }

    public function logout()
    {
        $session = library_session::init();
        $session->logout();
        $this->redirect('login');
    }

    public function getDetail(library_request $request, library_session $session){
        $id = $request->id;

        $query = "SELECT 0 as err_code, p.tid, p.Card_number, p.DatePay, gorod.dbo.PD4.ClientAccount, p.state AS state,
                           pdesc.name as status_name, pe.value as purpose, pe.extent_tid as etid, pdesc.descr as descript,
                           p.summary_amount, (select t.name  from gorod.dbo.point as t where t.point_oid=p.point_oid) as terminal_name
                    FROM gorod.dbo.payment p LEFT OUTER JOIN
                          gorod.dbo.PD4 ON gorod.dbo.PD4.tid = p.tid LEFT OUTER JOIN
                          gorod.dbo.provider pr ON pr.provider_oid = p.provider_oid LEFT OUTER JOIN
                          gorod.dbo.payment_state_desc pdesc ON pdesc.state = p.state LEFT OUTER JOIN
                          gorod.dbo.payment_extent pe ON p.tid = pe.tid
                    WHERE p.tid = " . $id . " AND p.provider_oid=" . $session->getAgentOid() . " order by p.datepay desc";
        $pay = $this->Query($query);
        if (mssql_num_rows($pay) > 0){
           	$row = library_utils::MyIconv(mssql_fetch_array($pay));
            echo library_FastJSON::encode($row);
        }
    }

    private function getTableData(library_request $request, library_session $session, $type) {
        if ($type === true) {
            $date1 = explode('.', $request->search_from);
            $date2 = explode('.', $request->search_till);
            $date1 = $date1[2] . '-' . $date1[1] . '-' . $date1[0] . ' 00:00:00';
            $date2 = $date2[2] . '-' . $date2[1] . '-' . $date2[0] . ' 23:59:59';
            $search_from = $request->search_from ? " AND p.datepay >= '" . $date1 . "' " : '';
            $search_till = $request->search_till ? " AND p.datepay <= '" . $date2 . "' " : '';
            $time = $search_from . $search_till;
            if (!$request->search_from && !$request->search_till) $time = " and  p.datepay > DATEADD(DAY, DATEDIFF(DAY,0,getdate()),0)";
            $pay_state = $request->pay_state ? " AND p.state =" . $request->pay_state : '';
            $client_acount = $request->client_acount ? " AND gorod.dbo.PD4.ClientAccount LIKE Convert(VarChar, " . $request->client_acount . ") + '%'" : '';
            $tid = $request->tid ? " AND p.tid LIKE Convert(VarChar, " . $request->tid . ") + '%'" : '';
            $client_amount = $request->client_amount ? " AND p.summary_amount LIKE Convert(VarChar, " . $request->client_amount . ") + '%'" : '';
            $condition = $time . $client_acount . $tid . $client_amount . $pay_state;

            $query = "SELECT 0 as err_code, p.tid, p.Card_number, p.DatePay, gorod.dbo.PD4.ClientAccount, p.state AS state, pdesc.name as status_name,
                                p.summary_amount, (select t.name  from gorod.dbo.point as t where t.point_oid=p.point_oid) as terminal_name
                         FROM gorod.dbo.payment p LEFT OUTER JOIN
                               gorod.dbo.PD4 ON gorod.dbo.PD4.tid = p.tid LEFT OUTER JOIN
                               gorod.dbo.provider pr ON pr.provider_oid = p.provider_oid LEFT OUTER JOIN
                               gorod.dbo.payment_state_desc pdesc ON pdesc.state = p.state
                         WHERE p.provider_oid=" . $session->getAgentOid() . $condition . " order by p.datepay desc";
        } else {
            $query = 'exec [pendjurina].[owebs_mini_GetProviderPays] "' . $_SESSION['session_hash'] . '"';
        }
        return $query;
    }

}
