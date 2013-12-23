/**
 * Created with IntelliJ IDEA.
 * User: Yuvielle
 * Date: 01.12.13
 * Time: 16:59
 * To change this template use File | Settings | File Templates.
 */

var oTable;


var giRedraw = false;
var dataT;
var colDefs = [ { "bSearchable": false, "bVisible": false, "aTargets": [15] }, { "bSearchable": false, "bVisible": false, "aTargets": [13] } ];
var detailTemplate = new EJS({url: 'js/templates/pay_detail.ejs'});

$(document).ready(function () {
    // refresh captcha
    $("img#captcha-refresh").click(function () {

        change_captcha();
    });

    function change_captcha() {
        document.getElementById("captcha").src = "index.php?module=user&action=getCaptchaImage";
    }

    if ($.browser.msie) {
        if (($.browser.msie) && ($.browser.version == '6.0')) {
            //код только для ИЕ шестой версии!
            $('body').html('Пожалуйста, установите Internet Explorer не ниже 8 версии');
        }
        else {
            //Инициализация плагина dataTable
            oTable = $('#example').dataTable({
                "iDefaultSortIndex": 1,
                "sDefaultSortDirection": "asc",
                "bPaginate": false,
                "bScrollCollapse": true
            });
        }
    }
    else {
        oTable = $('#example').dataTable({"oLanguage": {
            "sUrl": "datatables/language/ru_RU.txt" },
            "iDefaultSortIndex": 1,
            "sDefaultSortDirection": "asc",
            "bPaginate": false,
            "bScrollCollapse": true
        });
    }

    $(".detail").click(function (e) {			//Данные купюроприемника
        e.preventDefault();
        $("#overlay").fadeIn();
        $("#new_table").fadeIn();
        var url = $(this).attr("href");
        $.ajax({
            url: url,     // указываем URL
            type: "GET",                     // метод
            beforeSend: function () {
                $('#new_table').html('<img id="ajax_loader" src="images/loading.gif" alt="Идет поиск"/>');
            },
            success: function (data) {
                $('#ajax_loader').hide();
                //alert(data);
                data = JSON.parse(data);
                var render_html = detailTemplate.render(data);
                $("#new_table").html(render_html);
            },
            error: function (e) {
                $('#ajax_loader').hide();
                //alert('error: ' + e.message);
            }
        });
        return false;
    });
    $('#excell').click(function () {
                $.ajax({
                    url: 'index.php?action=excellWrite',
                    type: "GET",
                    success: function (data) {
                        //alert(data);
                    }
            });

    });
});
