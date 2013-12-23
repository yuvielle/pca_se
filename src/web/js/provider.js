$(document).ready(function() {
var oTable;
$("body").append("<div id='overlay'></div>");
		   $("#overlay")
		      .css({
                 'height': '100%',
		         'opacity' : 0.5,
		         'position': 'fixed',
		         'top': 0,
		         'left': 0,
		         'background-color': 'black',
		         'width': '100%',
		         'z-index': 5000,
		         'text-align': 'center',
                 'display': 'none'
		      });
            $("#overlay").after('<div id="new_table"></div>');
             $("#new_table")
                  .css({
                     'opacity' : 1,
                     'top': '50%', /* ??? ?????? ????????*/
                    'left': '50%', /* ??? ?????? ?? ????*/
                    'width': '800px', /* ??? ??*/
                    'min-height': '400px', /* u?? ??*/
                    'position': 'absolute', /* a???? ?????? ??*/
                    'margin-top': '-200px', /* ?????? ????????????????????????? ?? ?????????*/
                    'margin-left': '-400px', /* ?????? ?????? ????????? ???????? ?? ?????????*/
                     'z-index' : 6000,
                     'background-color': 'white',
                     'text-align': 'center',
                     'display': 'none',
                     'overflow': 'hidden',
                     '-moz-box-shadow' : '0 1px 3px rgba(0,0,0,0.5)',
                     '-webkit-box-shadow': '0 1px 3px rgba(0,0,0,0.5)',
                     '-moz-border-radius': '30px',
                     '-webkit-border-radius': '30px',
                     'border': '5px gray solid',
                     'padding': '10px'
                  });

            $("#new_table").append('<img src="../web/images/x_button.png" class="btn_close" alt="Close" />');
                  $("img.btn_close")
                  .css({
                     'float': 'right',
                      'width': '30px',
                      'height': '30px',
			'cursor': 'pointer'

                  });
            $("#new_table").append('<div id="text"></div>');
                  $("#text")
                  .css({
                     'float': 'left',
	                 'width': '770px', /* ??? ??*/
                     'min-height': '30%',
					 'text-align': 'center',
					 'overflow': 'hidden'
                  });
oTable = $('#agent_info').dataTable({"oLanguage": {
        "sUrl": "../web/datatables/language/ru_RU.txt" },
        "iDefaultSortIndex": 0,
        "sDefaultSortDirection": "asc",
        "bPaginate": false,
        "bScrollCollapse": true,
		"aoColumnDefs": [
                        { "bSearchable": false, "bVisible": false, "aTargets": [7] }]
		});
		
$('#new').click(function(e) {
	e.preventDefault();
	$('.notvisible').fadeIn();
	});
	
$('.edit').click(function() {
	var dataT = oTable.fnGetData($(this).parents('tr')[0]);
	$("#overlay").fadeIn();
    $("#new_table").fadeIn();
    $('#text').append('Изменить пользователя '+dataT[2]+'<hr/><br/>');
	$('#text').append('<form action="../admin/admin.php" method="post"><table>'+
						'<tr><td>№ Агента </td><td>'+dataT[0]+'</td></tr>'+
						'<tr><td>Телефон</td><td><input type="text" id="agent_phone" name="phone" value="'+dataT[1]+'"/></td></tr>'+
						'<tr><td>Новый Пароль</td><td><input type="text"  id="agent_pas" name="password"/></td></tr>'+
						'<tr><td>E-mail</td><td><input type="text" id="agent_email" name="email" value="'+dataT[3]+'"/></td></tr>'+
						'<tr><td>Статус</td><td><input type="text" id="agent_status" name="status" value="'+dataT[4]+'"/></td></tr>'+
						'<input type="hidden" name="agentoid" id="agentoid" value="'+dataT[0]+'"/>'+
						'<input type="hidden" name="change" value="1"/>'+
						'<input type="hidden" name="id" value="'+dataT[7]+'"/>'+
						'</table><input type="submit" value="Сохранить"/></form>');
});
$('.delete').click(function() {
	var dataT = oTable.fnGetData($(this).parents('tr')[0]);
	if (confirm('Вы действительно хотите удалить пользователя '+dataT[1]+' ?'))
		$.ajax({
				url: 'admin.php?id='+dataT[7]+'&delete=1', 
				type : "GET",                     
				success: function (data) { 
						alert(data);
						document.location.reload();
				} 
		});
});
	/*
        Закрытие окна    */
    $('#overlay').click(function() {
        $('#text_bottom').empty();
		$('#text').empty();
        $('#overlay').fadeOut();
        $('#new_table').fadeOut();
        $('.orderhistory').remove();
        $('#example_modal').empty();
		$('#time_form').fadeOut();
    });

    $('img.btn_close').click(function() {
        $('.orderhistory').remove();
        $('#example_modal').empty();
        $('#text').empty();
		$('#text_bottom').empty();
        $('#overlay').fadeOut();
        $('#new_table').fadeOut();
		$('#time_form').fadeOut();
    });
	

	
	})(JQuery);
	
function find_id() {
	var state = document.getElementById('agent_name');
	
	$('#agent_id').html(state.value);
	$('#agentoid').attr('value', state.value);
	
}