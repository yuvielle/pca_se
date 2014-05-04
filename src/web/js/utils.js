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

    $("body").on("click", ".datePicker", function () {

        // multiple times, you can check for the "hasDatepicker" class...
        if (!$(this).hasClass("hasDatepicker")) {
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
    $("#new_table").draggable();
});

$(document).ajaxError(function() {
    alert('Ваша сессия истекла, повторите вход в систему!');
    });

function dateFormat(date){
        if(date == '') return date
        date = date.split('.');
        return date[2] + '-' + date[1] + '-' + date[0];
    }

function dateFormatV2(date){
        if(date == '') return date
        fulldate = date.split(' ');
        date = fulldate[0].split('.');
        return date[2] + '-' + date[1] + '-' + date[0] + ' ' + fulldate[1];
    }

function directDateFormat(date){
        date = date.split('-');
        return date[2] + '.' + date[1] + '.' + date[0];
    }

function setTimePicker(e) {
    $(e).mask("99:99");
    $(e).timepicker({
        timeSeparator: ':',
        periodSeparator: ' ',
        showLeadingZero: true,
        hourText: 'Часы',
        minuteText: 'Минуты',
        amPmText: ['', ''],
        hours: {
            starts: 0,                // First displayed hour
            ends: 23                  // Last displayed hour
        },
        minutes: {
            starts: 0,                // First displayed minute
            ends: 55,                 // Last displayed minute
            interval: 5,              // Interval of displayed minutes
            manual: []                // Optional extra entries for minutes
        },
        rows: 4,                      // Number of rows for the input tables, minimum 2, makes more sense if you use multiple of 2
        showHours: true,              // Define if the hours section is displayed or not. Set to false to get a minute only dialog
        showMinutes: true
    });
}