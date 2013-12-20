/**
 * Created with IntelliJ IDEA.
 * User: Yuvielle
 * Date: 07.12.13
 * Time: 12:14
 * To change this template use File | Settings | File Templates.
 */
$(document).ready(function () {
    var datePick = function(elem)
        {
            $("elem").datepicker();
        }
    $('#loader').html('');

        tableToGrid(".table-to-grid", {
            rowNum:40,
            rowList:[20,40,70,100],
            pager: '#table-pager',
            height: 'auto',
            altRows:true,
            altclass:'altRowClass',
            colNames:['# Транзакции','Дата платежа', 'Номер счета', 'Сумма платежа','Статус платежа','Адрес точки','Подробнее', 'Печать чека'],
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
                          if (!e || e.which === 1) {
                              alert($(".table-to-grid").jqGrid('getRowData',rowId).trid);
                              $("#" + rowId).addClass('ui-state-highlight');
                          } else if(e.which === 3){
                              $(".table-to-grid").jqGrid('setSelection', rowId, false);
                              $("#" + rowId).removeClass('ui-state-highlight');
                          }
                e.dblclick();
                      }
        });
    $('.table-to-grid').jqGrid('filterToolbar', { searchOnEnter: true, enableClear: false });
    $(".table-to-grid").jqGrid('searchGrid', {} );

    $(".table-to-grid").trigger("reloadGrid");
    //$("tr.jqgrow:odd").css("background", "#F5FBFF");
});
