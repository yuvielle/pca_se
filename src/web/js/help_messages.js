/**
 * Created with IntelliJ IDEA.
 * User: Yuvielle
 * Date: 10.11.13
 * Time: 17:44
 * To change this template use File | Settings | File Templates.
 */

/*
 Всплывающие подсказки
 */

$(document).ready(function () {
    $('#example tbody td .connect_status').hover(function () {
        var dataT = oTable.fnGetData($(this).parents('tr')[0]);
        if (dataT[6] == '<a class="connect_status" href="#"><div class="notvisible">0</div><img src="images/green.png" alt="c"></a>') {
            $('.connect_status').attr('title', 'Соединение-ОК');
        }
        else $('.connect_status').attr('title', 'Нет соединения более 30 минут');
    });

    $('#example tbody td .bill_acceptor').hover(function () {
            var dataT = oTable.fnGetData($(this).parents('tr')[0]);
            if (dataT[7] == '<a class="bill_acceptor" href="#"><div class="notvisible">0</div><img src="images/green.png" alt="b"></a>') {
                $('.bill_acceptor').attr('title', 'Купюроприемник-OK');
            }
            else $('.bill_acceptor').attr('title', 'Купюроприемник-Ошибка');
        }
    );
    $('#example tbody td .printer').hover(function () {
            var dataT = oTable.fnGetData($(this).parents('tr')[0]);
            if (dataT[8] == '<a class="printer" href="#"><div class="notvisible">0</div><img src="images/green.png" alt="p"></a>') {
                $('.printer').attr('title', 'Принтер-OK');
            }
            else $('.printer').attr('title', 'Принтер-Ошибка');
        }
    );
    $('#example tbody td .balance').hover(function () {
            var dataT = oTable.fnGetData($(this).parents('tr')[0]);
            if (dataT[9] == '<a class="balance" href="#"><div class="notvisible">0</div><img src="images/green.png" alt="bal"></a>') {
                $('.balance').attr('title', 'Баланс-OK');
            }
            else $('.balance').attr('title', 'Баланс-Ошибка');
        }
    );
    $('#example tbody td .updates').hover(function () {
            var dataT = oTable.fnGetData($(this).parents('tr')[0]);
            if (dataT[10] == '<a class="updates" href="#"><div class="notvisible">3</div><img src="images/green.png" alt="u"></a>') {
                $('.updates').attr('title', 'Обновления-Установлены');
            }
            else $('.updates').attr('title', 'Обновления-Не установлены');
        }
    );
    // Наведение на поле "Текущая сумма"
    $('#example tbody td .current_sum').hover(function () {
        var terminal_info = oTable.fnGetData($(this).parents('tr')[0]);
        $('.current_sum').attr('title', 'Купюр: ' + terminal_info[13]);

    });

    $('#example tbody td .toomuch').hover(function () {
        var terminal_info = oTable.fnGetData($(this).parents('tr')[0]);
        $('.toomuch').attr('title', 'Купюр: ' + terminal_info[13]);

    });


    // Наведение на поле "Последнее соединение"
    $('#example tbody td .last_connect').hover(function () {
            var Position = oTable.fnGetPosition($(this).parents('tr')[0]);
            var nTr = oTable.fnGetData($(this).parents('td')[0]);
            if ($.browser.msie)
                var time = nTr.substr(31, 19);
            else var time = nTr.substr(33, 19);
            $.ajax({
                url: 'index.php?action=getTime&time=' + time,     // указываем URL
                type: "GET",                     // метод
                success: function (data) {
                    $('.last_connect').attr('title', data);
                }});
        }
    );

    // Наведение на поле "Последний платеж"
    $('#example tbody td .last_payment').hover(function () {
            var Position = oTable.fnGetPosition($(this).parents('tr')[0]);
            var nTr = oTable.fnGetData($(this).parents('td')[0]);
            if ($.browser.msie)
                var time = nTr.substr(31, 19);
            else var time = nTr.substr(33, 19);
            $.ajax({
                url: 'index.php?action=getTime&time=' + time,     // указываем URL
                type: "GET",                     // метод
                success: function (data) {
                    $('.last_payment').attr('title', data);
                }});
        }
    );

});

