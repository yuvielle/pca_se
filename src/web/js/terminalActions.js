/**
 * Created with IntelliJ IDEA.
 * User: Yuvielle
 * Date: 23.11.13
 * Time: 22:54
 * To change this template use File | Settings | File Templates.
 */


var oTable;
var dataT;
var search_url;
var term_name;
var search_type;
var search_template;
var pays_amount = '';
var summa= '';
var commission = '';
var all = '';
/*
     buttons actions
     Нажать на кнопку
     */
$(document).ready(function () {

    //templates for modal windows
    var kupuriTemplate = new EJS({url: 'js/templates/banknotes.ejs'});
    var errorPageTemplate = new EJS({url: 'js/templates/terminal_errors.ejs'});
    var incashmentTemplate = new EJS({url: 'js/templates/incashment.ejs'});
    var searchTemplate = new EJS({url: 'js/templates/pay_search.ejs'});
    var incomeTemplate = new EJS({url:' js/templates/income.ejs'});
    var terminalInfo = new EJS({url:' js/templates/terminal_info.ejs'});
    var terminalScheduleAdd = new EJS({url: 'js/templates/terminal_schedule_add.ejs'});
    var addTableRow = new EJS({url: 'js/templates/add_table_row.ejs'});
    var groupForm = new EJS({url:'js/templates/group_form.ejs'});

    var sorts = [ [ 6, "desc" ], [ 7, "desc" ], [ 8, "desc" ], [ 15, "desc" ], [ 11, "asc" ] ];
    var colDefs = [ { "bSearchable": false, "bVisible": false, "aTargets": [15] }, { "bSearchable": false, "bVisible": false, "aTargets": [13] } ];

    if ($.browser.msie) {
        if (($.browser.msie) && ($.browser.version == '6.0')) {
            //код только для ИЕ шестой версии!
            $('body').html('Пожалуйста, установите Internet Explorer не ниже 8 версии');
        }
        else {
            //Инициализация плагина dataTable
            oTable = $('#example').dataTable({
                "iDefaultSortIndex": 6,
                "sDefaultSortDirection": "asc",
                "bPaginate": false,
                "bScrollCollapse": true,
                "aaSorting": sorts,
                "aoColumnDefs": colDefs

            });
        }
    }
    else {
        oTable = $('#example').dataTable({"oLanguage": {
            "sUrl": "datatables/language/ru_RU.txt" },
            "iDefaultSortIndex": 6,
            "sDefaultSortDirection": "asc",
            "bPaginate": false,
            "bScrollCollapse": true,
            "aaSorting": sorts,
            "aoColumnDefs": colDefs
        });
    }

    /* Add a click handler to the rows - this could be used as a callback */
	$("#example tbody").click(function(event) {
		$(oTable.fnSettings().aoData).each(function (){
			$(this.nTr).removeClass('row_selected');
		});
		$(event.target.parentNode).addClass('row_selected');
	});

    /* Get the rows which are currently selected */
    function fnGetSelected( oTableLocal )
    {
    	var aReturn = [];
    	var aTrs = oTableLocal.fnGetNodes();

    	for ( var i=0 ; i<aTrs.length ; i++ )
    	{
    		if ( $(aTrs[i]).hasClass('row_selected') )
    		{
    			aReturn.push( aTrs[i] );
    		}
    	}
    	return aReturn;
    }
    function fnDeleteSelected( oTableLocal )
    {
    	var aReturn = new Array();
    	var aTrs = oTableLocal.fnGetNodes();

    	for ( var i=0 ; i<aTrs.length ; i++ )
    	{
    		if ( $(aTrs[i]).hasClass('row_selected') )
    		{
    			$(aTrs[i]).removeClass('row_selected')
    		}
    	}
    }

    function initTable ()
    {
      return $('#example_modal').dataTable( {
        "sScrollY": "200px",
        "bPaginate": false,
        "bRetrieve": true
      } );
    }

    //Функции для отрисовки таблиц в модальных окнах
    function drawDataTable(x) {
        $('#modal_bills').dataTable({
            "oLanguage": {"sUrl": "datatables/language/ru_RU.txt" },
            "bPaginate": false,
            "iDefaultSortIndex": x,
            "aaSorting": [
                [ x, "desc" ]
            ],
            "aoColumnDefs": [
                { "bSearchable": false, "bVisible": false, "aTargets": [x] }
            ],
            "bScrollCollapse": true
        });
    }

    /*
     Выбрать строку
     */
    oTable.$('tr').click(function () {
        dataT = oTable.fnGetData(this);
        $("#overlay").slideUp();
    });

    oTable.$('tr').dblclick(function () {
        fnDeleteSelected(oTable);
    });

    $("#kupuri").click(function (e) {			//Данные купюроприемника
        e.preventDefault();
        var anSelected = fnGetSelected(oTable);
        term_name = '';
        $("#overlay").fadeIn();
        $("#new_table").fadeIn();
        var render_html = kupuriTemplate.render({term_name:term_name});
        $("#new_table").html(render_html);
        var url;
        if(anSelected.length == 0){url = 'index.php?&action=bills'}
        else{ url = 'index.php?&action=acceptorData&id_terminal=' + dataT[0];
            term_name = dataT[1].substr(25);
        }
        $.ajax({
            url: url,     // указываем URL
            type: "GET",                     // метод
            beforeSend: function () {
                $('#ajax_loader').html('<img id="ajax_loader" src="images/loading.gif" alt="Идет поиск"/>');
            },
            success: function (data) {
                $('#ajax_loader').hide();
                alert(data);
                data = JSON.parse(data);
                data['term_name'] = term_name;
                kupuriTemplate.update('new_table',data);
                //alert(render_html);
                drawDataTable(3);
            },
            error: function(e){
              $('#ajax_loader').hide();
              alert('error: ' + e.message);
            }
        });

        search_url =  'index?action=bills';
        search_template = kupuriTemplate;
        search_type = 3;
    });

    //Нажатие на название терминала - Информация о терминале
    $(document).on("click", '#example tbody td .name', function () {
        $("#overlay").fadeIn();
        $("#new_table").fadeIn();

        dataT = oTable.fnGetData($(this).parents('tr')[0]);
        var render_html = terminalInfo.render({'id_terminal': dataT[0]});
        $("#new_table").html(render_html);
        $.ajax({
            url: 'index.php?id_terminal=' + dataT[0] + '&action=terminalInformation',
            type: "GET",
            beforeSend: function () {
                $('#new_table').html('<img id="ajax_loader" src="images/loading.gif" alt="Идет поиск"/>');
            },
            success: function (data) {
                $('#ajax_loader').hide();
                alert(data);
                data = JSON.parse(data);
                data['term_name'] = dataT[1].substr(25);
                terminalInfo.update('new_table',data);
            }
        });
    });

    //Нажатие на значек Добавить Рассписание
    $(document).on("click", '#timetable_icon', function () {
        $('#clock').attr('src', 'images/clock_close.png');
        $('#timetable_icon').attr('id', 'timetable_close');
        var render_html = terminalScheduleAdd.render({'id_terminal': dataT[0]});
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
                    alert(data);
                    document.location.reload();
                }
            });
    });


    $(document).on("click", '#change_maxkup', function (e){
        e.preventDefault();
        var max_kup = $('#max_kup').val();
        $.ajax({
            url: 'index.php?id_terminal=' + dataT[0] + '&max_kup=' + max_kup + '&action=banknotesMaxCountChange',     // указываем URL
            type: "GET",                     // метод
            success: function (data) {
                alert(data);
                document.location.reload();
            }
        });
    });

    function addTableRow() {
        /* default-id — скрытый элемент формы, из которого берется id для первого создаваемого элемента */
        var id = document.getElementById("default-id").value;
        id++;
        /* в форму с именем testform добавляем новый элемент */
        var render_html = addTableRow.render({'id': id});
        $("#timetable").append(render_html);
        $('#timetable_input' + id).mask("99:99");
        $('#timetable_input2' + id).mask("99:99");

        /* увеличиваем счетчик элементов */
        document.getElementById("default-id").value = id;
    }

    function deleteTableRow(id) {
        $('.rasp' + id + '').remove();
    }

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
        if(id_group) id_group = '&group=' + id_group;
        else id_group = '';
        $.ajax({
            url: search_url+ '&start=' + dateFormat(start) + '&end=' + dateFormat(end) + id_group,     // указываем URL
            type: "GET",                     // метод
            beforeSend: function () {
                $('#modal_bills').html('<img src="images/loading.gif" alt="Идет поиск"/>');
            },
            success: function (data) {
                alert(data);
                data = JSON.parse(data);
                data['term_name'] = term_name;
                search_template.update('new_table', data);
                drawDataTable(search_type);
            }
        });
    });

    $("#oshibki").click(function (e) {			//Данные ошибок
        e.preventDefault();
        var anSelected = fnGetSelected(oTable);
        $("#overlay").fadeIn();
        $("#new_table").fadeIn();
        var render_html = errorPageTemplate.render([]);
        $("#new_table").html(render_html);
        var url;
        var type;
        var term_name = '';
        var error = '';
        if (anSelected.length != 0) {
            term_name = dataT[1].substr(25);
            url = 'index.php?action=terminalErrors&id_terminal=' + dataT[0]; type = 3
            if ((dataT[6] == '<a class="connect_status" href="#"><div class="notvisible">5</div><img src="images/red.png" alt="c"></a>') || (dataT[7] == '<a class="bill_acceptor" href="#"><div class="notvisible">1</div><img src="images/red.png" alt="b"></a>') || (dataT[8] == '<a class="printer" href="#"><div class="notvisible">2</div><img src="images/red.png" alt="p"></a>')){
                error = true;
            }
        }
        else {
            var datao = oTable.fnGetData();
            var terminals = [];
            var count = 0;
            for (var key in datao) {
            var val = datao[key];
                if ((val[7] != '<a class="bill_acceptor" href="#"><div class="notvisible">0</div><img src="images/green.png" alt="b"></a>') || (val[8] != '<a class="printer" href="#"><div class="notvisible">0</div><img src="images/green.png" alt="p"></a>')) {
                    terminals.push(val[0]);
                    count ++;
                }
            }
            url = 'index.php?action=terminalErrors&terminals=' + JSON.stringify(terminals);
            type = 4 }
        $.ajax({
            url: url,
            type: "GET",
            beforeSend: function () {
                $('#modal_errors').html('<img src="images/loading.gif" alt="Идет поиск"/>');
            },
            success: function (data) {
                $('#ajax_loader').hide();
                alert(data);
                data = JSON.parse(data);
                data['term_name'] = term_name;
                data['error'] = error;
                errorPageTemplate.update('new_table', data);
                drawDataTable(type);
            }
        });
        search_url =  'index.php?action=terminalErrors';
        search_template = errorPageTemplate;
        search_type = 4;
    });

    $("#incassacii").click(function (e) {		//Данные инкассаций
        e.preventDefault();
        var anSelected = fnGetSelected(oTable);
        $("#overlay").fadeIn();
        $("#new_table").fadeIn();
        var render_html = incashmentTemplate.render([]);
        $("#new_table").html(render_html);
        var url;
        var type;
        var term_name = '';
        if (anSelected.length != 0) {
            url = 'index.php?id_terminal=' + dataT[0] + '&action=encashment';
            type = 5
            term_name = dataT[1].substr(25);
        }
        else {
            url = 'index.php?action=incash';
            type = 4
        }
        $.ajax({
            url: url,     // указываем URL
            type: "GET",                     // метод
            beforeSend: function () {
                $('#modal_incass').html('<img src="images/loading.gif" alt="Идет поиск"/>');
            },
            success: function (data) {
                $('#ajax_loader').hide();
                alert(data);
                data = JSON.parse(data);
                data['term_name'] = term_name;
                incashmentTemplate.update('new_table', data);
                drawDataTable(type);
            }
        });
        search_url = 'index.php?action=incash';
        search_template = incashmentTemplate;
        search_type = 4;
    });

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
                alert(data);
                searchTemplate.update('new_table', JSON.parse(data));
            },
            error: function(e){
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
        //alert(pay_state);
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
                    alert(data);
                    searchTemplate.update('new_table', JSON.parse(data));
                    drawDataTable(3);
                }
            });
        }
        else alert('Заполните больше информации о поиске');
    });

     //Доход
    $('#dohod').click(function (e) {
        e.preventDefault();
        var anSelected = fnGetSelected(oTable);
        $("#overlay").fadeIn();
        $("#new_table").fadeIn();
        var render_html = incomeTemplate.render({period: 1, start_day:'', end_day:''});
        $("#new_table").html(render_html);
        var data;
        var term_name = '';
        if (anSelected.length != 0) {
            data = 'action=income&all=1&terminal_id=' + dataT[0];
            term_name = dataT[1].substr(25);
        }
        else {
            data = 'action=income&all=1';
        }
        $.ajax({
            url: 'index.php',     // указываем URL
            data: data,
            type: "GET",                     // метод
            beforeSend: function () {
                $('#search_result').html('<img src="images/loading.gif" alt="Идет поиск"/>');
            },
            success: function (data) {
                $('#ajax_loader').hide();
                alert(data);
                data = JSON.parse(data);
                data['term_name'] = term_name;
                incomeTemplate.update('new_table', data);
                drawDataTable(3);
                plot(data['x_axis'], data['y_axis']);
            }
        });
    });

    $(document).on("click", "#draw_graph", function(e){
    	e.preventDefault();
        var anSelected = fnGetSelected(oTable);
    	var period = $('input[name=period]:checked').val();
        var start_date = '';
        var end_date = '';
        if (period == 5) {
        	start_date = $('#search_from').val();
        	end_date = $('#search_till').val();
        }
        var data;
        var term_name = '';
        if (anSelected.length != 0) {
            data = 'period='+period+'&start_date='+dateFormat(start_date)+'&end_date='+dateFormat(end_date)+'&pays_amount='+pays_amount+'&summa='+summa+'&commission='+commission+'&all='+all+'&terminal_id=' + dataT[0];
            term_name = dataT[1].substr(25);
        } else {
            data = 'period='+period+'&start_date='+dateFormat(start_date)+'&end_date='+dateFormat(end_date)+'&pays_amount='+pays_amount+'&summa='+summa+'&commission='+commission+'&all='+all;
        }
        $.ajax({
        	url: 'index.php?action=income',     // указываем URL
        	data: data,
        	type : "GET",
        	beforeSend: function(){
        		$('#search_result').html('<img src="images/loading.gif" alt="Идет поиск"/>');
        	},
        	success: function (data) {
                $('#ajax_loader').hide();
                alert(data);
                data = JSON.parse(data);
                data['start_day'] = start_date;
                data['end_day'] = end_date;
                data['term_name'] = term_name;
                alert(data['start_day']);
                incomeTemplate.update('new_table', data);
                drawDataTable(3);
                plot(data['x_axis'], data['y_axis']);
        	}
        });
    });

    function plot(x_axis, y_axis){
        alert(y_axis);
        var datasets = [{fillColor: "rgba(169,231,113,0.5)",
                        strokeColor: "rgba(169,231,113,1)",
                        pointColor: "rgba(169,231,113,1)",
                        pointStrokeColor: "#fff",
                        scaleOverlay : true,
                        scaleOverride : true,
                        scaleStartValue : -2},
                    {fillColor: "rgba(151,187,205,0.5)",
                       strokeColor: "rgba(151,187,205,1)",
                       pointColor: "rgba(151,187,205,1)",
                       pointStrokeColor: "#fff",
                        scaleOverlay : true,
                        scaleOverride : true,
                        scaleStartValue : -2},
                    {fillColor: "rgba(187,151,205,0.5)",
                        strokeColor: "rgba(187,151,205,1)",
                        pointColor: "rgba(187,151,205,1)",
                        pointStrokeColor: "#fff",
                        scaleOverlay : true,
                        scaleOverride : true,
                        scaleStartValue : -2}];
        for(var i=0; i<y_axis.length; i++){
            datasets[i]['data'] = y_axis[i];
        }
        var lineChartData = {
            labels: x_axis,
            datasets: datasets
        };
        new Chart(document.getElementById("plot").getContext("2d")).Line(lineChartData);
    }

    $(document).on('click', '.graph_params', function(){
        if($(this).is(':checked')){
            if($(this).val() == 1) pays_amount = 1;
            if($(this).val() == 2) summa=1;
            if($(this).val() == 3) commission =1;
            if($(this).val() == 4) all =1;
        }
        else{
            if($(this).val() == 1) pays_amount = '';
            if($(this).val() == 2) summa='';
            if($(this).val() == 3) commission ='';
            if($(this).val() == 4) all ='';
        }
    });

    $('#groups').change(function () {
        var id_group = $('#groups option:selected').val();
        if (id_group != 0) {
            $.ajax({
                url: 'index.php?id_group=' + id_group + '&action=getSelectedGroup',
                type: "GET",
                success: function (data) {
                    oTable.fnFilter("^(" + data + ")", 0, true);
                    totalSum();
                }
            });
        }
        else {
            oTable.fnFilter("()", 0, true);
            totalSum();
        }
    });

    function totalSum() {
        var total_pays = 0;
        var total_sum = 0;
        var total_com = 0;
        var total_total = 0;
        var total_kupurs = 0;

        $('#example tbody tr').each(function () {
            total_pays += parseInt($(this).find('.bills').html());
            total_sum += parseFloat($(this).find('.sum').html());
            total_com += parseFloat($(this).find('.com').html());
            //parseInt(number.toFixed(fc), 10);
            total_total += parseFloat($(this).find('.total').html());
            total_kupurs += parseInt($(this).find('td > .current_sum').html());

        });
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
                alert(data);
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
                    alert(data);
                    data = JSON.parse(data);
                    data['group_name'] = group_name;
                    groupForm.update('new_table', data);
                }
            });
        }
        else alert("выберите группу");
    });

    $(document).on('click', '#add_in_group',function (e) {
        e.preventDefault();  alert($("#terminals").val());
        if ($("#terminals").val()) {    alert('test');
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

    $(document).on('click', "#save_group", function (e) {		//Данные инкассаций
        e.preventDefault();
        var terminals =[];
        var group_name = $('#group_name').val();
        if (group_name == '')
            alert('Введите название');
        else {
            $('#terminals_in_group option').each(function () {
                terminals.add($(this).val());
            });
            terminals =  JSON.stringify(terminals);
            $.ajax({
                url: 'index.php?action=saveGroup',
                data: 'terminals=' + terminals + '&group_name=' + group_name,
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
});
