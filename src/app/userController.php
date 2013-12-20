<?php
/**
 * Created by IntelliJ IDEA.
 * User: Yuvielle
 * Date: 06.11.13
 * Time: 21:44
 * To change this template use File | Settings | File Templates.
 */ 
class app_userController extends app_baseController {

    private $password;
    private $username;

    public function login(library_request $request, library_session $session) {
        if ($request->isPost()) {
            $try = @$_POST['try'];
            if ($try >= 3) {
                if (@strcmp($_POST['captcha-code'], $session->random_number) == 0) {
                    $session->contact = 0;
                    $try = 0;
                } else {
                    $this->view->error = 'Ошибка капчи';
                    echo $this->view->render();
                    return;
                }
            } else {
                $try++;
                $this->view->try = $try;
            }
            if (!isset($_POST["username"]) || !isset($_POST["password"])) $this->view->error = 'не введён логин или пароль';

            elseif ($this->check_user($try) && $try <= 3) {
                $this->redirect('index');
            }
            else{$this->view->error = "не правильный логин или пароль!";}
        }
        echo $this->view->render();
    }

    public function getCaptchaImage(library_request $request, library_session $session)
    {
        header("Content-type: image/png");
        echo $session->setCaptcha();
    }


    public function editProfile(library_request $request, library_session $session){
        $result_message ='';
        $error = '';
        if($request->isPost() && ($_POST['phone'] || $_POST['password'] || $_POST['email'])){
            try{
                if(!$user_id = $session->getLoginId()) $this->redirect('login');
                $query = "SELECT * FROM dbo.owebs_mini_logins WHERE id_login = '" . $user_id . "'";
                $data = $this->Query($query);
                if (mssql_num_rows($data) > 0) {
                     $array = mssql_fetch_array($data);
                    if ($array['err_code'] == 0) {
                        $id = $array['id'];
                        $status = $array['status'];
                        $phone = $_POST['phone']?$_POST['phone']:$array['phone'];
                        $password =$_POST['password']?$_POST['password']:$array['password'];
                        $email = $_POST['email']?$_POST['email']:$array['email'];
                    $this->Query('exec [dbo].[owebs_mini_ChangeAgent] '.
                        library_utils::mssql_real_escape_string($phone).', '.
                        library_utils::mssql_real_escape_string($password).', "'.
                        library_utils::mssql_real_escape_string($email).'", '.
                        library_utils::mssql_real_escape_string($status).', '.
                        library_utils::mssql_real_escape_string($id).'');
                    }
                }
                $result_message = "Данные успешно изменены!";
            }
            catch(Exception $e){
                throw $e;
            }
        }
        elseif($request->isPost()) {
            $result_message = "Данные не отправлены!";
            $error = 'форма не заполнена!';
        }
        if($request->isXmlHttpRequest()){
            echo library_FastJSON::encode(array('error'=>$error, 'result'=>$result_message));
            return;
        }
        $this->view->result = $result_message;
        $this->view->error = $error;
        echo $this->view->render();
    }

    private function check_user()
    {
        $this->username = substr(library_utils::mssql_real_escape_string(@$_POST["username"]), 4);
        $vowels = array("(", ")", " ");
        $this->username = str_replace($vowels, "", $this->username);
        $this->password = library_utils::mssql_real_escape_string(@$_POST["password"]);
        if (($this->username == '') && ($this->password == '')) return false;
        $pas_check = "exec [regplat-ru].[dbo].[owebs_mini_SessionStart] '" . library_utils::GetRealIp() . "', '" . $this->username . "' , '" . $this->password . "'";
        $result = $this->Query($pas_check);
        if (mssql_num_rows($result) > 0) {
            $array = mssql_fetch_array($result);
            if ($array['err_code'] == 0) {
                $_SESSION['session_hash'] = $array['session_hash'];
                $_SESSION['status'] = $array['status'];
                $_SESSION['username'] = $this->username; //die('st=' . $_SESSION['status']);
                return true;
            }
        }
        return false;
    }
}
