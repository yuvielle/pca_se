/**
 * Created with IntelliJ IDEA.
 * User: Yuvielle
 * Date: 22.12.13
 * Time: 22:21
 * To change this template use File | Settings | File Templates.
 */

$(document).ready(function () {

    //templates for modal windows
    var editProfileTemplate = new EJS({url: 'js/templates/edit_profile.ejs'});

    $(document).on('click', ".edit_profile", function (e) {
        $("#overlay").fadeIn();
        $("#new_table").fadeIn();
        e.preventDefault();
        var render_html = editProfileTemplate.render({});
        $("#new_table").html(render_html);
        return false;
    });

    $(document).on('click', "#button", function (e) {
        if($(this).valid()) {
            var post = $(e.target).parents('form').serialize();
            $.ajax({
                url: 'index.php?module=user&action=editProfile',
                data: post,
                type: "POST",
                success: function (data) {
                    //alert(data);
                    editProfileTemplate.update('new_table', JSON.parse(data));
                }
            });
        }
        return false;
    });
});

