/**
 * Created with IntelliJ IDEA.
 * User: Yuvielle
 * Date: 07.12.13
 * Time: 20:28
 * To change this template use File | Settings | File Templates.
 */

var search_url;
var term_name = '';
var term_id = '';
var search_type;
var search_template;
var select_row;
var pays_amount = '';
var summa = '';
var commission = '';
var all = '';
var columnNames = [];
var modalNames = [];
var colnames;
var colmodel;

$(document).ready(function () {

    //templates for modal windows
    var kupuriTemplate = new EJS({url: 'js/templates/banknotes.ejs'});
    var errorPageTemplate = new EJS({url: 'js/templates/terminal_errors.ejs'});
    var incashmentTemplate = new EJS({url: 'js/templates/incashment.ejs'});
    var searchTemplate = new EJS({url: 'js/templates/pay_search.ejs'});
    var incomeTemplate = new EJS({url: ' js/templates/income.ejs'});
    var terminalInfo = new EJS({url: ' js/templates/terminal_info.ejs'});
    var terminalScheduleAdd = new EJS({url: 'js/templates/terminal_schedule_add.ejs'});
    var groupForm = new EJS({url: 'js/templates/group_form.ejs'});
    var detailTemplate = new EJS({url: 'js/templates/pay_detail.ejs'});
    var payDetailShort = new EJS({url: 'js/templates/pay_detail_short.ejs'});

    var datePick = function (elem) {
        $("elem").datepicker();
    }
    $('#loader').html('');

    tableToGrid(".table-to-grid", {
        rowNum: 40,
        rowList: [20, 40, 70, 100],
        caption: "Терминалы",
        pager: '#table-pager',
        height: 'auto',
        altRows: true,
        altclass: 'altRowClass',
        ignoreCase:true,
        multiSort:true,
        //rownumbers: true,
        viewrecords: true,
        colNames: ['#', 'Название терминала', 'Платежи', 'Сумма', 'Ком.', 'Зачис.', 'С', 'К',
            'П', 'Б', 'О', 'Последний платеж', 'Последнее соединение', 'Наличные'],
        colModel: [
            {name: 'tid', index: 'tid', width: 20, sorttype: "int", align:"right"},
            {name: 'term_name', index: 'term_name', width: 100, align: "right", sorttype: "string",
                formatter: function (cellvalue, options, rowObject) {
                    return '<a id="'+ rowObject.tid + '" class="name" href="#">' + $.jgrid.htmlEncode(cellvalue) + "</a>";
                }},
            {name: 'pay', index: 'pay', width: 25, align: "right", sorttype: "int", formatter: 'integer', formatoptions: { defaultValue: 0 }},
            {name: 'amount', index: 'amount', width: 30, align: "right", sorttype: "float", formatter: "number"},
            {name: 'comm', index: 'comm', width: 30, align: "right", sorttype: "float", formatter: "number"},
            {name: 'zach', index: 'zach', width: 30, align: "right", sorttype: "float", formatter: "number"},
            {name: 'C', index: 'C', width: 10, sorttype: "string", search: false},
            {name: 'K', index: 'K', width: 10, sorttype: "string", search: false},
            {name: 'P', index: 'P', width: 10, sorttype: "string", search: false},
            {name: 'B', index: 'B', width: 10, sorttype: "string", search: false},
            {name: 'O', index: 'O', width: 10, sorttype: "string", search: false},
            {name: 'last_pay', index: 'last_pay', width: 50, sorttype: "date", datefmt: 'd.m.Y H:i:s', align: "right"},
            {name: 'last_connect', index: 'last_connect', width: 50, sorttype: "date", datefmt: 'd.m.Y H:i:s', align: "right"},
            {name: 'cash', index: 'cash', width: 30, align: "right", sorttype: "int", formatter: 'integer'}
        ],
        afterInsertRow: function(rowId, data){
            var val = $(".table-to-grid").jqGrid('getRowData', rowId);
            //alert(val.B);
            if (val.C == '<a class="connect_status" href="#"><div class="notvisible a">5</div><img src="images/red.png" alt="c"></a>') {
                //alert('k=' + val.K);
                $('#' + rowId).children("td").css('background-color', "#ff7777");
            }
            else if((val.K != '<a class="bill_acceptor" href="#"><div class="notvisible b">0</div><img src="images/green.png" alt="b"></a>') || (val.P != '<a class="printer" href="#"><div class="notvisible b">0</div><img src="images/green.png" alt="p"></a>')){
                $('#' + rowId).children("td").css('background-color', "#FFDDAA");
            }
            else if(val.B == '<a class="balance pay_no" href="#"><div class="notvisible b">0</div><img src="images/green.png" alt="bal"></a>'){
                $('#' + rowId).children("td").css('background-color', "#DDDDEE");
            }
        },
        onSelectRow: function (rowId, status, e) {
            rowSelect(rowId, status, e);
        },
        subGrid: true,
        subGridOptions: {
            "plusicon": "ui-icon-triangle-1-e",
            "minusicon": "ui-icon-triangle-1-s",
            "openicon": "ui-icon-arrowreturn-1-e"
        },
        subGridRowExpanded: function (subgrid_id, rowId) {
            var t_id = ($(".table-to-grid").jqGrid('getRowData', rowId).tid);
            var t_name = ($(".table-to-grid").jqGrid('getRowData', rowId).term_name);
            var subgrid_table_id;
            subgrid_table_id = subgrid_id + "_t";
            $("#" + subgrid_id).html("<table id='" + subgrid_table_id + "' class='scroll'><div id='pager_detail'></div></table>");
            $("#" + subgrid_table_id).jqGrid({
                url: "index.php?action=payDetail&id=" + t_id,
                datatype: "json",
                rowNum:5,
                rowList:[5,10,20],
                height: 'auto',
                pager: '#pager_detail',
                loadonce: true,
                caption: "Платежи терминала: " + t_name.substr(34),
                colNames: ['Транзакция', 'Время', 'Поставщик услуги', 'Номер счета', 'Состояние', 'Сумма', 'Комиссия', 'Зачислено'],
                colModel: [
                    {name: 'tid', index: 'tid', width: 100, sorttype: "int"},
                    {name: 'DatePay', index: 'DatePay', width: 100, sorttype: "date", datefmt: 'd.m.Y H:i:s'},
                    {name: 'ProviderName', index: 'ProviderName', width: 250, align: "left", sorttype: "string"},
                    {name: 'ClientAccount', index: 'ClientAccount', width: 120, align: "left", sorttype: "string"},
                    {name: 'Expr1', index: 'Expr1', width: 100, align: "left", sorttype: "string"},
                    {name: 'summary_amount', index: 'summary_amount', width: 80, align: "right", sorttype: "float", formatter: "number"},
                    {name: 'Commission', index: 'Commission', width: 80, align: "right", sorttype: "float", formatter: "number"},
                    {name: 'amount', index: 'amount', width: 80, align: "right", sorttype: "float", formatter: "number"}
                ],
                onSelectRow: function (rowId, status, e) {
                    subRowSelect(rowId, status, e, subgrid_table_id);
                },
                jsonReader: {
                    root: "data",
                    cell: "cell",
                    id: "id"
                },
                //height: '100px',
                width: '800px'
            });
        },
        loadComplete: function(){
            columnNames = [];
            var columns = $(".table-to-grid").jqGrid('getGridParam','colModel');
            for(key in columns){
                if(columns[key]['name'] != 'subgrid') columnNames.push(columns[key]['name']);
            }
        }
    });
    $("#count").html("показано " + jQuery(".table-to-grid").jqGrid('getGridParam', 'records') + " записей");
    $('.table-to-grid').jqGrid('filterToolbar', { searchOnEnter: true, enableClear: false, ignoreCase:true });
    $(".table-to-grid").jqGrid('navGrid', '#table-pager', {edit: false, add: false, del: false, view :true}, {}, {}, {}, {multipleSearch: true, multipleGroup: true});
    $(".table-to-grid").sortGrid("C", true, "desc").sortGrid("K", true, "desc").sortGrid("P", true, "desc").sortGrid("B", true, "desc").trigger("reloadGrid");

    $("#detail").jqGrid({
        row: {},
        datatype: "json",
        height: 'auto',
        ignoreCase:true,
        viewrecords: true,
        caption: "Invoice Detail",
        colNames: ['Транзакция', 'Время', 'Поставщик услуги', 'Номер счета', 'Состояние', 'Сумма', 'Комиссия', 'Зачислено'],
        colModel: [
            {name: 'tid', index: 'tid', width: 20, sorttype: "int"},
            {name: 'DatePay', index: 'DatePay', width: 70, sorttype: "date", datefmt: 'd.m.Y H:i:s'},
            {name: 'ProviderName', index: 'ProviderName', width: 100, align: "left", sorttype: "string"},
            {name: 'ClientAccount', index: 'ClientAccount', width: 100, align: "left", sorttype: "string"},
            {name: 'Expr1', index: 'Expr1', width: 100, align: "left", sorttype: "string"},
            {name: 'summary_amount', index: 'summary_amount', width: 50, align: "right", sorttype: "float", formatter: "number"},
            {name: 'Commission', index: 'Commission', width: 50, align: "right", sorttype: "float", formatter: "number"},
            {name: 'amount', index: 'amount', width: 50, align: "right", sorttype: "float", formatter: "number"}
        ],
        jsonReader: {
            root: "data",
            cell: "cell",
            id: "id"
        }
    }).navGrid('#pager_detail', {add: false, edit: false, del: false});
    $("#detail").trigger("reloadGrid");

    function rowSelect(rowId, status, e) {
        if (!e || e.which === 1) {
            term_id = ($(".table-to-grid").jqGrid('getRowData', rowId).tid);
            term_name = ($(".table-to-grid").jqGrid('getRowData', rowId).term_name);
            select_row = $(".table-to-grid").jqGrid('getRowData', rowId);
            //alert('t0=' + term_name);
            $("#" + rowId).addClass('ui-state-highlight');
            $("#detail").jqGrid('setGridParam', {url: "index.php?action=payDetail&id=" + term_id, page: 1});
            $("#detail").jqGrid('setCaption', "Платежи терминала: " + term_id).trigger('reloadGrid');
        } else if (e.which === 3) {
            $(".table-to-grid").jqGrid('setSelection', rowId, false);
            $("#" + rowId).removeClass('ui-state-highlight');
            term_id = '';
            term_name = '';
            select_row = null;
        }
        //e.dblclick();
    }

    function subRowSelect(rowId, status, e, subgrid_table_id){
        if (!e || e.which === 1) {
            var sub_select_row = $("#" + subgrid_table_id).jqGrid('getRowData', rowId);
            $("#" + rowId).addClass('ui-state-highlight');

            e.preventDefault();
            $("#overlay").fadeIn();
            $("#new_table").fadeIn();
            var url = 'index.php?action=getDetail&id=' + sub_select_row.tid;
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
                    //alert(data['state'].length);
                    var render_html = detailTemplate.render(data);
                    $("#new_table").html(render_html);
                },
                error: function (e) {
                    $('#ajax_loader').hide();
                    //alert('error: ' + e.message);
                }
            });
        } else if (e.which === 3) {
            $("#" + subgrid_table_id).jqGrid('setSelection', rowId, false);
            $("#" + rowId).removeClass('ui-state-highlight');
        }
    }

    $(document).on('keyup', '#general_filter', function(e){
        var vals = Array.apply(null, new Array(columnNames.length)).map(String.prototype.valueOf,$(this).val());
        OnChangeGridSelect('.table-to-grid', columnNames, vals, 'OR', 'cn');
    });

    //Нажатие на название терминала - Информация о терминале
    $(document).on("click", '#example tbody td .name', function (e) {
        $("#overlay").fadeIn();
        $("#new_table").fadeIn();

        var id = $(this).attr('id');
        var name = $(e.target).text();
        //alert(name);
        var render_html = terminalInfo.render({'id_terminal': id});
        $("#new_table").html(render_html);
        $.ajax({
            url: 'index.php?id_terminal=' + id + '&action=terminalInformation',
            type: "GET",
            beforeSend: function () {
                $('#new_table').html('<img id="ajax_loader" src="images/loading.gif" alt="Идет поиск"/>');
            },
            success: function (data) {
                $('#ajax_loader').hide();
                //alert(data);
                data = JSON.parse(data);
                data['term_name'] = name;
                data['id_terminal'] = id;
                terminalInfo.update('new_table', data);
            }
        });
    });

    //Нажатие на значек Добавить Рассписание
    $(document).on("click", '#timetable_icon', function () {
        $('#clock').attr('src', 'images/clock_close.png');
        $('#timetable_icon').attr('id', 'timetable_close');
        var id = $('#id_terminal').val();
        var render_html = terminalScheduleAdd.render({'id_terminal': id});
        $("#new_rasp").append(render_html);
        $('#timetable_input').mask("99:99");
        $('#timetable_input2').mask("99:99");
    });

    $(document).on("click", '#timetable_close', function () {
        $("#new_rasp").html('');
        $('#clock').attr('src', 'images/clock_big.png');
        $('#timetable_close').attr('id', 'timetable_icon');
        $('#timetable_close').attr('title', 'Скрыть рассписание');
    });

    //Удаление рассписания
    $(document).on("click", '.del_time', function (e) {
        e.preventDefault();
        var id_timetable = $(this).attr("id");
        if (confirm('Вы действительно хотите удалить расписание?'))
            $.ajax({
                url: 'index.php?id_timetable=' + id_timetable + '&action=terminalScheduleDelete',     // указываем URL
                type: "GET",                     // метод
                success: function (data) {
                    //alert(data);
                    document.location.reload();
                }
            });
    });


    $(document).on("click", '#change_maxkup', function (e) {
        e.preventDefault();
        var max_kup = $('#max_kup').val();
        var id = $('#id_terminal').val();
        $.ajax({
            url: 'index.php?id_terminal=' + id + '&max_kup=' + max_kup + '&action=banknotesMaxCountChange',     // указываем URL
            type: "GET",                     // метод
            success: function (data) {
                //alert(data);
                document.location.reload();
            }
        });
    });

    //Нажатие на ссылку Наличность - вызовет Данные купюроприемника
    $(document).on("click", '#example tbody td .current_sum', function () {
        $(this).parents('tr').addClass('row_selected');
        $('#kupuri').trigger('click');
    });

    $(document).on("click", '#example tbody td .toomuch', function () {
        $(this).parents('tr').addClass('row_selected');
        $('#kupuri').trigger('click');
    });

    $(document).on("click", '#search_start', function (e) {
        e.preventDefault();
        var start = $('#search_from').val();
        var end = $('#search_till').val();
        var id_group = $('#groups_incas option:selected').val();
        if (id_group) id_group = '&group=' + id_group;
        else id_group = '';
        $.ajax({
            url: search_url + '&start=' + dateFormat(start) + '&end=' + dateFormat(end) + id_group,     // указываем URL
            type: "GET",                     // метод
            beforeSend: function () {
                $('#modal_bills').html('<img src="images/loading.gif" alt="Идет поиск"/>');
            },
            success: function (data) {
                //alert(data);
                data = JSON.parse(data);
                data['term_name'] = term_name;
                search_template.update('new_table', data);
                tableToGrid("#modal_bills", {
                    height: 'auto',
                    rowNum: 10,
                    rowList: [10, 20, 50],
                    pager: '#modal-pager',
                    ignoreCase:true,
                    altRows: true,
                    colNames: colnames,
                    colModel: colmodel,
                    altclass: 'altRowClass'
                });
            }
        });
    });

    $("#kupuri").click(function (e) {			//Данные купюроприемника
        e.preventDefault();
        $("#overlay").fadeIn();
        $("#new_table").fadeIn();
        var render_html = kupuriTemplate.render({term_name: term_name});
        $("#new_table").html(render_html);
        var url;
        colnames = ['Время вложения', 'Номинал'];
        colmodel = [{name: 'RECEIVE_TIME', index: 'RECEIVE_TIME', width: 70, sorttype: "date", datefmt: 'd.m.Y H:i:s'},
                        {name: 'CASH_NOMINAL', index: 'CASH_NOMINAL', width: 50, align: "right", sorttype: "int"}
                         ];
        if (term_id == '') {
            url = 'index.php?&action=bills';
            colnames.push('Название терминала');
            colmodel.push({name: 'name', index: 'name', width: 100, align: "left", sorttype: "string"});
        } else {
            url = 'index.php?&action=acceptorData&id_terminal=' + term_id;
        }
        $.ajax({
            url: url,     // указываем URL
            type: "GET",                     // метод
            beforeSend: function () {
                $('#ajax_loader').html('<img id="ajax_loader" src="images/loading.gif" alt="Идет поиск"/>');
            },
            success: function (data) {
                $('#ajax_loader').hide();
                //alert(data);
                data = JSON.parse(data);
                data['term_name'] = term_name;
                //alert('t=' + term_name);
                kupuriTemplate.update('new_table', data);
                tableToGrid("#modal_bills", {
                    height: 'auto',
                    rowNum: 10,
                    rowList: [10, 20, 50],
                    pager: '#modal-pager',
                    altRows: true,
                    ignoreCase:true,
                    altclass: 'altRowClass',
                    colNames: colnames,
                    colModel: colmodel,
                    loadComplete: function(){
                        modalNames = [];
                        var columns = $("#modal_bills").jqGrid('getGridParam','colModel');
                        for(key in columns){
                            if(columns[key]['name'] != 'subgrid') modalNames.push(columns[key]['name']);
                        }
                    }
                });
            },
            error: function (e) {
                $('#ajax_loader').hide();
                alert('error: ' + e.message);
            }
        });
        $("#modal_bills").trigger("reloadGrid");
        search_url = 'index?action=bills';
        search_template = kupuriTemplate;
        search_type = 3;
    });

    $("#oshibki").click(function (e) {			//Данные ошибок
        e.preventDefault();
        $("#overlay").fadeIn();
        $("#new_table").fadeIn();
        var render_html = errorPageTemplate.render([]);
        $("#new_table").html(render_html);
        var url;
        var error = '';
        colnames = ['Дата'];
        colmodel = [{name: 'RECEIVE_TIME', index: 'RECEIVE_TIME', width: 70, sorttype: "date", datefmt: 'd.m.Y H:i:s'}];
        if (term_name != '') {
            url = 'index.php?action=terminalErrors&id_terminal=' + term_id;
            //alert(select_row.C);
            if ((select_row.C == '<a class="connect_status" href="#"><div class="notvisible">5</div><img src="images/red.png" alt="c"></a>') || (select_row.B == '<a class="bill_acceptor" href="#"><div class="notvisible">1</div><img src="images/red.png" alt="b"></a>') || (select_row.P == '<a class="printer" href="#"><div class="notvisible">2</div><img src="images/red.png" alt="p"></a>')) {
                error = true;
            }
        }
        else {
            colnames.push('Название терминала');
            colmodel.push({name: 'name', index: 'name', width: 100, align: "left", sorttype: "string"});
            var datao = $(".table-to-grid").jqGrid('getRowData');
            var terminals = [];
            var count = 0;
            for (var key in datao) {
                var val = datao[key];
                if ((val.K != '<a class="bill_acceptor" href="#"><div class="notvisible">0</div><img src="images/green.png" alt="b"></a>') || (val.P != '<a class="printer" href="#"><div class="notvisible">0</div><img src="images/green.png" alt="p"></a>')) {
                    //alert('k=' + val.K);
                    terminals.push(val.tid);
                    count++;
                }
            }
            url = 'index.php?action=terminalErrors&terminals=' + JSON.stringify(terminals);
        }
        colnames.push('Устройство', 'Сообщение об ошибке');
        colmodel.push({name: 'DEVICE_NAME', index: 'DEVICE_NAME', width: 100, align: "left", sorttype: "string"},
                    {name: 'ERROR_TEXT', index: 'ERROR_TEXT', width: 100, align: "left", sorttype: "string"}
        );
        $.ajax({
            url: url,
            type: "GET",
            beforeSend: function () {
                $('#modal_errors').html('<img src="images/loading.gif" alt="Идет поиск"/>');
            },
            success: function (data) {
                $('#ajax_loader').hide();
                //alert(data);
                data = JSON.parse(data);
                data['term_name'] = term_name;
                data['error'] = error;
                errorPageTemplate.update('new_table', data);
                tableToGrid("#modal_bills", {
                    height: 'auto',
                    rowNum: 10,
                    rowList: [10, 20, 50],
                    pager: '#modal-pager',
                    altRows: true,
                    altclass: 'altRowClass',
                    colNames: colnames,
                    colModel: colmodel,
                    ignoreCase:true,
                    loadComplete: function(){
                        modalNames = [];
                            var columns = $("#modal_bills").jqGrid('getGridParam','colModel');
                            for(key in columns){
                                if(columns[key]['name'] != 'subgrid') modalNames.push(columns[key]['name']);
                        }
                    }
                });
            }
        });
        search_url = 'index.php?action=terminalErrors';
        search_template = errorPageTemplate;
        search_type = 4;
    });

    $("#incassacii").click(function (e) {		//Данные инкассаций
        e.preventDefault();
        $("#overlay").fadeIn();
        $("#new_table").fadeIn();
        var render_html = incashmentTemplate.render([]);
        $("#new_table").html(render_html);
        var url;
        colnames = ['Время на терминале'];
        colmodel = [{name: 'TERMINAL_DATE', index: 'TERMINAL_DATE', width: 60, sorttype: "date", datefmt: 'd.m.Y H:i:s'}];
        if (term_name != '') {
            url = 'index.php?id_terminal=' + term_id + '&action=encashment';
            colnames.push('Время на сервере', 'Количество купюр');
            colmodel.push(
                {name: 'RECEIVE_DATE', index: 'RECEIVE_DATE', width: 60, sorttype: "date", datefmt: 'd.m.Y H:i:s'},
                {name: 'CASH_COUNT', index: 'CASH_COUNT', width: 40, align: "left", sorttype: "int"});
        }
        else {
            url = 'index.php?action=incash';
            colnames.push('Название терминала');
            colmodel.push({name: 'name', index: 'name', width: 80, align: "left", sorttype: "string"});
        }
        colnames.push('Сумма инкассации','Номиналы и количество');
        colmodel.push(
            {name: 'CASH_AMOUNT', index: 'CASH_AMOUNT', width: 40, align: "left", sorttype: "float", formatter: "number"},
            {name: 'count', index: 'count', width: 90, align: "left", sorttype: "int"});
        $.ajax({
            url: url,     // указываем URL
            type: "GET",                     // метод
            beforeSend: function () {
                $('#modal_incass').html('<img src="images/loading.gif" alt="Идет поиск"/>');
            },
            success: function (data) {
                $('#ajax_loader').hide();
                //alert(data);
                data = JSON.parse(data);
                data['term_name'] = term_name;
                incashmentTemplate.update('new_table', data);
                tableToGrid("#modal_bills", {
                    height: 'auto',
                    rowNum: 10,
                    rowList: [10, 20, 50],
                    pager: '#modal-pager',
                    altRows: true,
                    altclass: 'altRowClass',
                    colNames: colnames,
                    colModel: colmodel,
                    ignoreCase: true,
                    loadComplete: function () {
                        modalNames = [];
                        var columns = $("#modal_bills").jqGrid('getGridParam', 'colModel');
                        for (key in columns) {
                            if (columns[key]['name'] != 'subgrid') modalNames.push(columns[key]['name']);
                        }
                    }
                });
            }
        });
        search_url = 'index.php?action=incash';
        search_template = incashmentTemplate;
        search_type = 4;
    }).trigger("reloadGrid");


    //Поиск платежей
    $("#poisk_plateja").click(function (e) {		//Поиск платежа
        e.preventDefault();
        $("#overlay").fadeIn();
        $("#new_table").fadeIn();
        var render_html = searchTemplate.render([]);
        $("#new_table").html(render_html);
        $.ajax({
            url: 'index.php',     // указываем URL
            data: 'action=search',
            type: "GET",                     // метод
            success: function (data) {
                //alert(data);
                searchTemplate.update('new_table', JSON.parse(data));
            },
            error: function (e) {
                alert(e.message);
            }
        });

    });

    $(document).on('click', '#search_platej', function (e) {
        e.preventDefault();
        var start_date = $('#start_date').val();
        var end_date = $('#end_date').val();
        var id_terminal = $('#id_terminal option:selected').val();
        var pay_type = $('#pay_type').val();
        var pay_state = $('#pay_state option:selected').val();
        var tid = $('#tid').val();
        var transaction = $('#transaction').val();
        var client_account = $('#client_account').val();
        var client_amount = $('#client_amount').val();
        colnames = ['Дата', 'TID', 'Транзакция', 'Терминал', 'Поставщик', 'Состояние', 'Счет', 'Сумма', 'Комиссия', 'Зачисленно'];
        colmodel = [
            {name: 'DatePay', index: 'DatePay', width: 60, sorttype: "date", datefmt: 'd.m.Y H:i:s'},
            {name: 'tid', index: 'tid', width: 50, align: "left", sorttype: "string"},
            {name: 'sub_tid', index: 'sub_tid', width: 60, align: "left", sorttype: "string"},
            {name: 'point_oid', index: 'point_oid', width: 40, align: "left", sorttype: "string"},
            {name: 'ProviderName', index: 'ProviderName', width: 130, align: "left", sorttype: "string"},
            {name: 'state', index: 'state', width: 50, align: "left", sorttype: "string"},
            {name: 'ClientAccount', index: 'ClientAccount', width: 80, align: "left", sorttype: "string"},
            {name: 'summary_amount', index: 'summary_amount', width: 40, align: "left", sorttype: "float", formatter: "number"},
            {name: 'Commission', index: 'Commission', width: 40, align: "left", sorttype: "float", formatter: "number"},
            {name: 'amount', index: 'amount', width: 50, align: "left", sorttype: "float", formatter: "number"}
        ];
        if (((start_date != '') && (end_date != '')) && ((id_terminal != '') || (pay_type != '') || (pay_state != '') || (tid != '') || (transaction != '') || (client_account != '') || (client_amount != ''))) {
            $.ajax({
                url: 'index.php?action=search',     // указываем URL
                data: 'start_date=' + dateFormat(start_date) + '&end_date=' + dateFormat(end_date) + '&id_terminal=' + id_terminal + '&pay_type=' + pay_type + '&pay_state=' + pay_state + '&tid=' + tid + '&transaction=' + transaction + '&client_account=' + client_account + '&client_amount=' + client_amount,
                type: "POST",
                contentType: "application/x-www-form-urlencoded",
                beforeSend: function () {
                    $('#search_result').html('<img src="images/loading.gif" alt="Идет поиск"/>');
                },
                success: function (data) {
                    $('#ajax_loader').hide();
                    //alert(data);
                    searchTemplate.update('new_table', JSON.parse(data));
                    tableToGrid("#modal_bills", {
                        height: 'auto',
                        rowNum: 10,
                        rowList: [10, 20, 50],
                        pager: '#modal-pager',
                        altRows: true,
                        altclass: 'altRowClass',
                        colNames: colnames,
                        colModel: colmodel,
                        ignoreCase: true,
                        subGrid: true,
                        loadComplete: function () {
                            modalNames = [];
                            var columns = $("#modal_bills").jqGrid('getGridParam', 'colModel');
                            for (key in columns) {
                                if (columns[key]['name'] != 'subgrid') modalNames.push(columns[key]['name']);
                            }
                        },
                        subGridRowExpanded: function (subgrid_id, rowId) {
                            var subgrid_table_id = subgrid_id + "_t";
                            var sub_select_row = $('#modal_bills').jqGrid('getRowData', rowId);
                            alert('i=' + rowId + ' s=' + JSON.stringify(sub_select_row));
                            var url = 'index.php?action=getDetail&id=' + sub_select_row.tid;
                            var html = '';
                            $.ajax({
                                url: url,
                                type: "GET",
                                async: false,
                                success: function (data) {
                                    data = JSON.parse(data);
                                    html = payDetailShort.render(data);
                                    //alert(html);
                                },
                                error: function (e) {
                                    html = e.message;
                                }
                            });
                            $("#" + subgrid_id).html("<table id='" + subgrid_table_id + "' class='scroll'>" +
                                "<tr><td>" +
                                 html
                                + "</td></tr></table>");
                        }
                    });
                }
            });
        }
        else alert('Заполните больше информации о поиске');
    });

    //Доход
    $('#dohod').click(function (e) {
        e.preventDefault();
        $("#overlay").fadeIn();
        $("#new_table").fadeIn();
        var render_html = incomeTemplate.render({period: 1, start_day: '', end_day: ''});
        $("#new_table").html(render_html);
        var data;
        if (term_name != '') {
            data = 'action=income&all=1&terminal_id=' + term_id;
        }
        else {
            data = 'action=income&all=1';
        }
        setIncome(data);
    });

    function setIncome(data) {
        $.ajax({
            url: 'index.php',     // указываем URL
            data: data,
            type: "GET",                     // метод
            beforeSend: function () {
                $('#search_result').html('<img src="images/loading.gif" alt="Идет поиск"/>');
            },
            success: function (data) {
                $('#ajax_loader').hide();
                //alert(data);
                data = JSON.parse(data);
                data['term_name'] = term_name;
                data['id_terminal'] = term_id;
                incomeTemplate.update('new_table', data);
                colnames = ['Дата', 'Количество платежей', 'Сумма платежей', 'Комиссия'];
                colmodel = [
                    {name: 'date', index: 'date', width: 60, sorttype: "date", datefmt: 'd.m.Y H:i:s'},
                    {name: 'pays_amount', index: 'pays_amount', width: 40, align: "left", sorttype: "int"},
                    {name: 'summa', index: 'summa', width: 40, align: "left", sorttype: "float", formatter: "number"},
                    {name: 'commission', index: 'commission', width: 40, align: "left", sorttype: "float", formatter: "number"}
                ];
                tableToGrid("#modal_bills", {
                    height: 'auto',
                    rowNum: 10,
                    rowList: [10, 20, 50],
                    pager: '#modal-pager',
                    altRows: true,
                    altclass: 'altRowClass',
                    colNames: colnames,
                    colModel: colmodel,
                    ignoreCase: true,
                    loadComplete: function () {
                        modalNames = [];
                        var columns = $("#modal_bills").jqGrid('getGridParam', 'colModel');
                        for (key in columns) {
                            if (columns[key]['name'] != 'subgrid') modalNames.push(columns[key]['name']);
                        }
                    }
                });
                plot(data['x_axis'], data['y_axis']);
            }
        });
    }

    $(document).on("click", "#draw_graph", function (e) {
        e.preventDefault();
        var period = $('input[name=period]:checked').val();
        var start_date = '';
        var end_date = '';
        if (period == 5) {
            start_date = $('#search_from').val();
            end_date = $('#search_till').val();
        }
        var id_terminal = '';
        var terminal_name = '';
        if($('#id_terminal option:selected').val() != ''){
            //alert($('#id_terminal option:selected').val());
            id_terminal = $('#id_terminal option:selected').val();
            terminal_name = $('#id_terminal option:selected').text();
        }
        else { id_terminal = term_id; terminal_name = term_name; }
        var data;
        if (id_terminal != '') {
            data = 'period=' + period + '&start_date=' + dateFormat(start_date) + '&end_date=' + dateFormat(end_date) + '&pays_amount=' + pays_amount + '&summa=' + summa + '&commission=' + commission + '&all=' + all + '&terminal_id=' + id_terminal;
        } else {
            data = 'period=' + period + '&start_date=' + dateFormat(start_date) + '&end_date=' + dateFormat(end_date) + '&pays_amount=' + pays_amount + '&summa=' + summa + '&commission=' + commission + '&all=' + all;
        }
        $.ajax({
            url: 'index.php?action=income',     // указываем URL
            data: data,
            type: "GET",
            beforeSend: function () {
                $('#search_result').html('<img src="images/loading.gif" alt="Идет поиск"/>');
            },
            success: function (data) {
                $('#ajax_loader').hide();
                //alert(data);
                data = JSON.parse(data);
                data['start_day'] = start_date;
                data['end_day'] = end_date;
                data['term_name'] = terminal_name;
                data['id_terminal'] = id_terminal;
                //alert(data['start_day']);
                incomeTemplate.update('new_table', data);
                tableToGrid("#modal_bills", {
                    height: 'auto',
                    rowNum: 10,
                    rowList: [10, 20, 50],
                    pager: '#modal-pager',
                    altRows: true,
                    altclass: 'altRowClass',
                    ignoreCase: true,
                    colNames: colnames,
                    colModel: colmodel,
                    loadComplete: function () {
                        modalNames = [];
                        var columns = $("#modal_bills").jqGrid('getGridParam', 'colModel');
                        for (key in columns) {
                            if (columns[key]['name'] != 'subgrid') modalNames.push(columns[key]['name']);
                        }
                    }
                });
                plot(data['x_axis'], data['y_axis']);
            }
        });
    });

    function plot(x_axis, y_axis) {
        //alert(y_axis);
        var datasets = [
            {fillColor: "rgba(169,231,113,0.5)",
                strokeColor: "rgba(169,231,113,1)",
                pointColor: "rgba(169,231,113,1)",
                pointStrokeColor: "#fff",
                scaleOverlay: true,
                scaleOverride: true,
                scaleStartValue: -2},
            {fillColor: "rgba(151,187,205,0.5)",
                strokeColor: "rgba(151,187,205,1)",
                pointColor: "rgba(151,187,205,1)",
                pointStrokeColor: "#fff",
                scaleOverlay: true,
                scaleOverride: true,
                scaleStartValue: -2},
            {fillColor: "rgba(187,151,205,0.5)",
                strokeColor: "rgba(187,151,205,1)",
                pointColor: "rgba(187,151,205,1)",
                pointStrokeColor: "#fff",
                scaleOverlay: true,
                scaleOverride: true,
                scaleStartValue: -2}
        ];
        for (var i = 0; i < y_axis.length; i++) {
            datasets[i]['data'] = y_axis[i];
        }
        var lineChartData = {
            labels: x_axis,
            datasets: datasets
        };
        new Chart(document.getElementById("plot").getContext("2d")).Line(lineChartData);
    }

    $(document).on('click', '.graph_params', function () {
        if ($(this).is(':checked')) {
            if ($(this).val() == 1) pays_amount = 1;
            if ($(this).val() == 2) summa = 1;
            if ($(this).val() == 3) commission = 1;
            if ($(this).val() == 4) all = 1;
        }
        else {
            if ($(this).val() == 1) pays_amount = '';
            if ($(this).val() == 2) summa = '';
            if ($(this).val() == 3) commission = '';
            if ($(this).val() == 4) all = '';
        }
    });


    //groups actions
    $('#groups').change(function () {
        var id_group = $('#groups option:selected').val();
        if (id_group != 0) {
            $.ajax({
                url: 'index.php?id_group=' + id_group + '&action=getSelectedGroup',
                type: "GET",
                success: function (data) {
                    data = JSON.parse(data);
                    OnChangeGridSelect('.table-to-grid', data['keys'], data['values']);
                    totalSum();
                    $("#count").html("показано " + jQuery(".table-to-grid").jqGrid('getGridParam', 'records') + " записей");
                }
            });
        }
        else {
            $(".table-to-grid").jqGrid('setGridParam', { search: false, postData: { "filters": ""} }).trigger("reloadGrid");
            totalSum();
            $("#count").html("показано " + jQuery(".table-to-grid").jqGrid('getGridParam', 'records') + " записей");
        }
    });

    function totalSum() {
        var total_pays = 0;
        var total_sum = 0;
        var total_com = 0;
        var total_total = 0;
        var total_kupurs = 0;
        var datao = $(".table-to-grid").jqGrid('getRowData');
        //alert(datao.length);
        for (var key in datao) {
            var val = datao[key];
            total_pays += parseInt(val.pay);
            total_sum += parseFloat(val.amount);
            total_com += parseFloat(val.comm);
            total_total += parseFloat(val.zach);
            total_kupurs += parseInt(val.cash);
        }
        $('#total_pays').html(total_pays);
        $('#total_sum').html(total_sum.toFixed(2));
        $('#total_com').html(total_com.toFixed(2));
        $('#total_total').html(total_total.toFixed(2));
        $('#total_kupurs').html(total_kupurs);
        return;
    }

    $('#delete_group').click(function () {
        var id_group = $('#groups option:selected').val();
        if (id_group != 0) {
            var group_name = $('#groups option:selected').html();
            if (confirm('Вы действительно хотите удалить группу "' + group_name + '"?'))
                $.ajax({
                    url: 'index.php?id_group=' + id_group + '&action=deleteGroup',
                    type: "GET",
                    success: function (data) {
                        $("#overlay").fadeOut();
                        $("#new_table").fadeOut();
                        document.location.reload();
                    }
                });
        }
        else alert('Выберите группу терминалов для удаления');
    });

    $('#new_group').click(function () {
        $("#overlay").fadeIn();
        $("#new_table").fadeIn();
        var render_html = groupForm.render([]);
        $("#new_table").html(render_html);
        $.ajax({
            url: 'index.php?action=groupFormShow',     // указываем URL
            type: "GET",                     // метод
            beforeSend: function () {
                $('#search_result').html('<img src="images/loading.gif" alt="Идет поиск"/>');
            },
            success: function (data) {
                $('#ajax_loader').hide();
                //alert(data);
                groupForm.update('new_table', JSON.parse(data));
            }
        });
    });

    $('#edit_group').click(function () {
        var id_group = $('#groups option:selected').val();
        if (id_group != 0) {
            var group_name = $('#groups option:selected').html();
            $("#overlay").fadeIn();
            $("#new_table").fadeIn();
            var render_html = groupForm.render({id_group: id_group, group_name: group_name});
            $("#new_table").html(render_html);
            $.ajax({
                url: 'index.php?id_group=' + id_group + '&action=groupFormShow',
                type: "GET",
                beforeSend: function () {
                    $('#search_result').html('<img src="images/loading.gif" alt="Идет поиск"/>');
                },
                success: function (data) {
                    $('#ajax_loader').hide();
                    //alert(data);
                    data = JSON.parse(data);
                    data['group_name'] = group_name;
                    data['group_id'] = id_group;
                    groupForm.update('new_table', data);
                }
            });
        }
        else alert("выберите группу");
    });

    $(document).on('click', '#add_in_group', function (e) {
        e.preventDefault();
        alert($("#terminals").val());
        if ($("#terminals").val()) {
            //alert('test');
            var selected = $('#terminals option:selected').val();
            var selected_name = $('#terminals option:selected').html();
            $('#terminals_in_group').append($('<option value="' + selected + '">' + selected_name + '</option>'));
            $('#terminals option:selected').remove();
        }
    });

    $(document).on('click', '#delete_from_group', function (e) {
        e.preventDefault();
        if ($("#terminals_in_group").val()) {
            var selected = $('#terminals_in_group option:selected').val();
            var selected_name = $('#terminals_in_group option:selected').html();
            $('#terminals').append($('<option value="' + selected + '">' + selected_name + '</option>'));
            $('#terminals_in_group option:selected').remove();
        }
    });

    $(document).on('click', "#save_group", function (e) {
        e.preventDefault();
        var terminals = [];
        var group_name = $('#group_name').val();
        var group_id = $('#group_id').val();
        var id_string = '';
        if(typeof group_id !== 'undefined') id_string = '&group_id=' + group_id;
        if (group_name == '') alert('Введите название');
        else {
            $('#terminals_in_group option').each(function () {
                terminals.push($(this).val());
            });
            terminals = JSON.stringify(terminals);
            //alert(terminals + ' ' + group_name);
            $.ajax({
                url: 'index.php?action=saveGroup',
                data: 'terminals=' + terminals + '&group_name=' + group_name + id_string,
                type: "POST",
                success: function (data) {
                    alert(data);
                    $("#overlay").fadeOut();
                    $("#new_table").fadeOut();
                    document.location.reload();
                }
            });
        }
        return false;
    });

    function OnChangeGridSelect(table_id, fieldNames, searchArray, groupOp, op) {
        groupOp = typeof groupOp !== 'undefined' ? groupOp : 'OR';
        op = typeof op !== 'undefined' ? op : 'eq';
        var rules = [];
        for (var search in searchArray) {
            rules.push({"field": fieldNames[search], "op": op, "data": searchArray[search]})
        }

        var filters = JSON.stringify({
            "groupOp": groupOp,
            "rules": rules
        });

        var grid = jQuery(table_id);
        var postdata = grid.jqGrid('getGridParam', 'postData');

        if (postdata != undefined
            && postdata.filters != undefined
            && postdata.filters.rules != undefined) {
            //Remove if current field exists   fbox_example
            postdata.filters.rules = $.grep(postdata.filters.rules, function (value) {
                if ($.inArray(value.field, fieldNames))
                    return value;
            });

            //Add new filter
            postdata.filters.push(filters);
        }
        else {
            $.extend(postdata, {
                filters: filters
            });
        }
        //alert(JSON.stringify(postdata));
        grid.jqGrid('setGridParam', { search: true, postData: postdata });
        grid.trigger("reloadGrid", [
            { page: 1}
        ]);
    }

    $(document).on('keyup', '#modal_filter', function(e){
        var vals = Array.apply(null, new Array(modalNames.length)).map(String.prototype.valueOf,$(this).val());
        OnChangeGridSelect('#modal_bills', modalNames, vals, 'OR', 'cn');
    });
});

