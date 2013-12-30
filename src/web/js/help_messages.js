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

function helpMessages() {
    //$('.table-to-grid').mouseover(function(e) {(alert('test00-0'))});
    $('#example tbody td .connect_status').mouseover(function () {
        var rowId = $(this).parents('tr').attr("id");
        var c = $(".table-to-grid").jqGrid('getRowData', rowId).C;
        if (c == '<a class="connect_status" href="#"><div class="notvisible b">0</div><img src="images/green.png" alt="c"></a>') {
            $(this).attr('title', 'Соединение-ОК');
        }
        if(c == '<a class="connect_status" href="#"><div class="notvisible a">5</div><img src="images/red.png" alt="c"></a>') {
            $(this).attr('title', 'Нет соединения более 30 минут');
        }
    });

    $('#example tbody td .bill_acceptor').mouseover(function () {
            var rowId = $(this).parents('tr').attr("id");
            var k = $(".table-to-grid").jqGrid('getRowData', rowId).K;
            if (k == '<a class="bill_acceptor" href="#"><div class="notvisible b">0</div><img src="images/green.png" alt="b"></a>') {
                $(this).attr('title', 'Купюроприемник-OK');
            }
            if (k == '<a class="bill_acceptor" href="#"><div class="notvisible a">1</div><img src="images/red.png" alt="b"></a>')
                $(this).attr('title', 'Купюроприемник-Ошибка');
        }
    );
    $('#example tbody td .printer').mouseover(function () {
            var rowId = $(this).parents('tr').attr("id");
            var p = $(".table-to-grid").jqGrid('getRowData', rowId).P;
            if (p == '<a class="printer" href="#"><div class="notvisible b">0</div><img src="images/green.png" alt="p"></a>') {
                $(this).attr('title', 'Принтер-OK');
            }
            if (p == '<a class="printer" href="#"><div class="notvisible a">2</div><img src="images/red.png" alt="p"></a>')
                $(this).attr('title', 'Принтер-Ошибка');
        }
    );
    $('#example tbody td .balance').mouseover(function () {
            var rowId = $(this).parents('tr').attr("id");
            var b = $(".table-to-grid").jqGrid('getRowData', rowId).B;
            if (b == '<a class="balance" href="#"><div class="notvisible b">0</div><img src="images/green.png" alt="bal"></a>') {
                $(this).attr('title', 'Баланс-OK');
            }
            //else $(this).attr('title', 'Баланс-Ошибка');
        }
    );
    $('#example tbody td .updates').mouseover(function () {
            var rowId = $(this).parents('tr').attr("id");
            var o = $(".table-to-grid").jqGrid('getRowData', rowId).O;
            if (o == '<a class="updates" href="#"><div class="notvisible b">3</div><img src="images/green.png" alt="u"></a>') {
                $(this).attr('title', 'Обновления-Установлены');
            }
            if (o == '<a class="updates" href="#"><div class="notvisible a">0</div><img src="images/red.png" alt="u"></a>')
                $(this).attr('title', 'Обновления-Не установлены');
        }
    );
    // Наведение на поле "Текущая сумма"
    $('td[aria-describedby=example_amount]').mouseover(function () {
        var rowId = $(this).parents('tr').attr("id");
        var cash = $(".table-to-grid").jqGrid('getRowData', rowId).cash;
        $(this).attr('title', 'Сумма: ' + cash);

    });

    $('td[aria-describedby=example_cash]').mouseover(function () {
        var rowId = $(this).parents('tr').attr("id");
        var kupurs_count = $(".table-to-grid").jqGrid('getRowData', rowId).kupurs_count;
        $(this).attr('title', 'Купюр: ' + kupurs_count);

    });

    // Наведение на поле "Последнее соединение"
    $('td[aria-describedby=example_last_connect]').mouseover(function () {
            var rowId = $(this).parents('tr').attr("id");
            var last_connect = $(".table-to-grid").jqGrid('getRowData', rowId).last_connect;
            $(this).attr('title', jQuery.timeago(dateFormatV2(last_connect)));
            /*$.ajax({
                url: 'index.php?action=getTime&time=' + last_connect,     // указываем URL
                type: "GET",                     // метод
                success: function (data) {
                    $(this).attr('title', data);
                }
            }); */
        }
    );

    // Наведение на поле "Последний платеж"
    $('td[aria-describedby=example_last_pay]').mouseover(function () {
            var rowId = $(this).parents('tr').attr("id");
            var last_pay = $(".table-to-grid").jqGrid('getRowData', rowId).last_pay;
            //$(this).removeAttr("title");
            //alert(dateFormatV2(last_pay));
            $(this).attr('title', jQuery.timeago(dateFormatV2(last_pay)));
            /*$.ajax({
                url: 'index.php?action=getTime&time=' + last_pay,     // указываем URL
                type: "GET",                     // метод
                async: false,
                success: function (data) {
                    $(this).setAttribute('title', data);
                }
            });*/
        }
    );
}

