/**
 * Created with IntelliJ IDEA.
 * User: Yuvielle
 * Date: 07.12.13
 * Time: 12:14
 * To change this template use File | Settings | File Templates.
 */
var columnNames = [];
$(document).ready(function () {

    var detailTemplate = new EJS({url: 'js/templates/pay_detail.ejs'});
    var lastStatus = false;
    var datePick = function(elem)
        {
            $("elem").datepicker();
        }
    $('#loader').html('');

        tableToGrid(".table-to-grid", {
            rowNum:70,
            rowList:[20,40,70,100],
            pager: '#table-pager',
            caption: "Платежи",
            height: 'auto',
            altRows:true,
            altclass:'altRowClass',
            ignoreCase:true,
            multiSort:true,
            viewrecords: true,
            colNames:['Транзакция','Дата платежа', 'Номер счета', 'Сумма платежа','Статус платежа','Адрес точки','Подробнее', 'Печать чека'],
            colModel:[
                  {name:'trid',index:'trid', width:60, sorttype:"string"},
                  {name:'pay_date',index:'pay_date', width:100, sorttype:"date", datefmt:'d.m.Y H:i:s', searchoptions:{dataInit:datePick, attr:{title:'Select Date'}}},
                  {name:'account_number',index:'account_number', width:70, sorttype:"text"},
                  {name:'amount',index:'amount', width:50, align:"right",sorttype:"float", formatter:"number", editable:false},
                  {name:'pay_status',index:'pay_status', width:61, align:"right",sorttype:"string", formatter:"string", editable:true},
                  {name:'point_adress',index:'point_adress', width:221, align:"left",sorttype:"string", editable:true},
                  {name:'detail',index:'detail', width:53,align:"right", sortable:false, search:false},
                  {name:'print',index:'print', width:30, sortable:false, search:false}
            ],
            onSelectRow: function (rowId, status, e) {
                if(status === false && lastStatus ===false){
                    status = true;
                }
                if ((!e || e.which === 1)&&(status === true)) {
                    $("#" + rowId).addClass('ui-state-highlight');
                } else if (e.which === 3 || status == false){
                    $("#" + rowId).removeClass('ui-state-highlight');
                }
                lastStatus = status;
            },
            afterInsertRow: function (rowId, data) {
                var val = $(".table-to-grid").jqGrid('getRowData', rowId);
                //alert(val.B);
                if (val.pay_status != 'Проведен') {
                    $('#' + rowId).children("td").css('background-color', "#ff7777");
                }
            },
            loadComplete: function () {
                columnNames = [];
                var columns = $(".table-to-grid").jqGrid('getGridParam', 'colModel');
                for (key in columns) {
                    if (columns[key]['name'] != 'subgrid') columnNames.push(columns[key]['name']);
                }
            }
        });
    $('.table-to-grid').jqGrid('filterToolbar', { searchOnEnter: true, enableClear: false, ignoreCase:true });
    $(".table-to-grid").jqGrid('navGrid', '#table-pager', {edit: false, add: false, del: false, view :true}, {}, {}, {}, {multipleSearch: true, multipleGroup: true});

    $(".table-to-grid").trigger("reloadGrid");

    $(document).on('keyup', '#general_filter', function(e){
        var vals = Array.apply(null, new Array(columnNames.length)).map(String.prototype.valueOf,$(this).val());
        OnChangeGridSelect('.table-to-grid', columnNames, vals, 'OR', 'cn');
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
        grid.jqGrid('setGridParam', { search: true, postData: postdata });
        grid.trigger("reloadGrid", [
            { page: 1}
        ]);
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
                data['provider'] = true;
                var render_html = detailTemplate.render(data);
                $("#new_table").html(render_html);
            },
            error: function (e) {
                $('#ajax_loader').hide();
            }
        });
        return false;
    });
    $('#excell').click(function () {
        window.location.href='index.php?action=excellWrite';
    });
});
