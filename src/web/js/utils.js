/**
 * Created with IntelliJ IDEA.
 * User: Yuvielle
 * Date: 23.11.13
 * Time: 18:05
 * To change this template use File | Settings | File Templates.
 */
$(document).ready(function () {

    // refresh captcha
    $("img#captcha-refresh").click(function () {

        change_captcha();
    });

    function change_captcha() {
        document.getElementById("captcha").src = "index.php?module=user&action=getCaptchaImage";
    }

    $('#user').mask("+7 (999) 999 99 99"); //Маска на ввод телефона

    /*
     Закрытие окна    */
    $('#overlay').click(function () {
        $('#text').empty();
        $('#overlay').fadeOut();
        $('#new_table').fadeOut();
        $('.orderhistory').remove();
        $('#example_modal').empty();
        $('#time_form').fadeOut();
    });

    $(document).on("click", ".btn_close", function () {
        $('.orderhistory').remove();
        $('#example_modal').empty();
        $('#text').empty();
        $('#overlay').fadeOut();
        $('#new_table').fadeOut();
        $('#time_form').fadeOut();
    });

    $(document).on("keydown", function(e) {
        if (e.keyCode == 27) {
            $('.btn_close').click();
        }   // esc
    });

    $('img.btn_close_pay').click(function () {
        $('#pay_text').empty();
        $('#pay_info').fadeOut();
    });

    //Нажатие на значек обновить
    $('#refresh').click(function (e) {
        e.preventDefault();
        window.location.reload();
    });

    $("body").on("click", ".datePicker", function(){

            // multiple times, you can check for the "hasDatepicker" class...
            if (!$(this).hasClass("hasDatepicker"))
            {
                $(this).datepicker({ dateFormat: "dd.mm.yy" });
                $(this).datepicker("show");
            }
    });


    $("body").on("click", ".datesAble", function() {
    		var start = document.getElementById('search_from');
    		var end = document.getElementById('search_till');
    		if (this.value =="5")
    		{
    			start.disabled=false;
    			end.disabled=false;
    		}
    		else {
    			start.disabled=true;
    			end.disabled=true;
    		}
    });
});

$(document).ajaxError(function() {
    alert('error handle');
    });

function dateFormat(date){
        if(date == '') return date
        date = date.split('.');
        return date[2] + '-' + date[1] + '-' + date[0];
    }

function directDateFormat(date){
        date = date.split('-');
        return date[2] + '.' + date[1] + '.' + date[0];
    }

function getCmodel(name, type){
    var field = cModel[type];
    field['name'] = name;
    field['index'] = name;
    return field;
}

var cModel = {
    '#':{width:20, sorttype:"int"},
    'title':{width:100, align:"left",sorttype:"string"},
    'count':{ width:25, align:"right",sorttype:"int", formatter:'integer', formatoptions: { defaultValue:0 }},
    'money':{width:30, align:"right",sorttype:"float", formatter:"number"},
    'symbol':{width:10, sorttype:"string", search:false},
    'datetime':{width:50, sorttype:"date", datefmt:'d.m.Y H:i:s'},
    'account_number':{width:70, sorttype:"string"},
    'pay_status':{width:61, align:"right",sorttype:"string", formatter:"string"},
    'text':{width:221, align:"left",sorttype:"string"},
    'detail':{width:53,align:"right", sortable:false, search:false},
    'print':{width:30, sortable:false, search:false}
}