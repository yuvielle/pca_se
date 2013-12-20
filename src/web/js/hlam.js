/**
 * Created with IntelliJ IDEA.
 * User: Yuvielle
 * Date: 27.11.13
 * Time: 18:08
 * To change this template use File | Settings | File Templates.
 */

<img src="images/x_button.png" class="btn_close" alt="Close">
    <div id="text"><h1>Создание новой группы: </h1>
        <hr><br><div class="center">
            <form class="group_name"><label>Название</label>
                <input name="group_name" id="group_name" type="text"></form>
                <div class="clear"></div></div><br>
                <div id="selects">

                <select name="terminals" id="terminals" size="10">
                    <option value="51">ул.Белинского 51, Музей "Склад Ума"</option>
                    <option value="">
                    </option>

    </select>
                <div id="move_but">
                    <form><input id="add_in_group" value=">" type="submit"><br>
                        <input id="delete_from_group" value="<" type="submit"></form></div>
                        <select name="terminals_in_group" id="terminals_in_group" size="10"></select>
                    </div><div class="clear"></div><div class="clear"><form>
                        <input class="buttons" id="save_group" value="Сохранить" type="submit"></form>
                    </div></div>