//Panel
YUI().use('datatable-base', 'panel', 'dd-plugin', function (Y) {
    panel = new Y.Panel({
        srcNode: '#PizzaPanel',
        headerContent: '- Pizza -',
        width: 250,
        zIndex: 5,
        centered: true,
        modal: true,
        visible: false,
        render: true,
        plugins: [Y.Plugin.Drag]
    });

    panel.addButton({
        value: 'X',
        section: Y.WidgetStdMod.HEADER,
        action: function (e) {
            panel.hide();
        }
    });

    /*
    panel.addButton({
    value: 'Add Item',
    section: Y.WidgetStdMod.FOOTER,
    action: function (e) {
    e.preventDefault();
    //addItem();
    }
    });
    */

    Y.one("#btPizzaAdd").on("click", function () {
        $("#txtId").val("0");
        $("#PizzaPanel").find(":input[type=text]").each(function () {
            $(this).val("");
        });
        panel.show();
    });
});

//Inclui uma  nova pizza
$("#btIncluir").click(function () {
    var dados = {
        Id: $("#txtId").val(),
        Nome: $("#txtNome").val(),
        I1: $("#txtIngrediente1").val(),
        I2: $("#txtIngrediente2").val(),
        I3: $("#txtIngrediente3").val()
    };

    var request = $.ajax({
        type: "POST",
        url: "Default.aspx?new=1",
        data: dados
    });

    request.done(function (data) {
        noty({ text: data, type: "success" });
        panel.hide();
        $("#btConsulta").click();
    });

    request.fail(function (jqXHR, textStatus) {
        noty({ text: "Request failed: " + textStatus, type: "error" });
    });
});

//Excluir pizza
$("#btExcluir").click(function () {
    var dados = "{ id:" + $("#txtId").val() + "}";

    var request = $.ajax({
        type: "POST",
        url: "Default.aspx/ExcluirPizza",
        contentType: "application/json",
        data: dados
    });

    request.done(function (data) {
        noty({ text: data.d, type: "success" });
        panel.hide();
        $("#btConsulta").click();
    });

    request.fail(function (jqXHR, textStatus) {
        noty({ text: "Request failed: " + textStatus, type: "error" });
    });
});

//Consulta pizzas
$("#btConsulta").click(function () {
    var nome = $("#txtConsulta").val();

    var request = $.ajax({
        type: "POST",
        url: "Default.aspx/Pizzas",
        contentType: "application/json",
        data: "{nome:'" + nome + "'}"
    });

    request.done(function (data) {
        pizzaGrid(data);
    });

    request.fail(function (jqXHR, textStatus) {
        noty({ text: "Request failed: " + textStatus, type: "error" });
    });
});

//Salva o garcom
$("#btGarcom").click(function () {
    var nome = $("#txtGarcom").val();
    var id = $("#ddlPeriodo").val();

    var dados = "{nome:'" + nome + "',id :" + id + "}";

    var request = $.ajax({
        type: "POST",
        dataType: "json",
        url: "Default.aspx/GarcomSave",
        contentType: "application/json",
        data: dados
    });

    request.done(function (data) {
        noty({ text: data.d, type: "success" });
    });

    request.fail(function (jqXHR, textStatus) {
        noty({ text: "Request failed: " + textStatus, type: "error" });
    });
});

//Monta e carrega o grid
function pizzaGrid(d) {
    $("#pizzaview").html("");

    YUI().use('datatable', function (Y) {
    //var cols = ["id","name","price"];
    var cols = [
        { key: "Id", sortable: false },
        { key: "Nome", sortable: false}];

    //var data = [
    //    { id: "ga-3475", name: "gadget", price: "$6.99", cost: "$5.99" },
    //    { id: "sp-9980", name: "sprocket", price: "$3.75", cost: "$3.25" },
    //    { id: "wi-0650", name: "widget", price: "$4.25", cost: "$3.75" }
    //];
    var data = d.d;

    // Creates a DataTable with 3 columns and 3 rows
    var table = new Y.DataTable.Base({
        columnset: cols,
        recordset: data,
        caption: "Pizzas",
        plugins: Y.Plugin.DataTableSort
    }).render("#pizzaview");

    YUIGridFormat();
    });
}

function ingredienteGrid(id) {
    var dados = "{id :" + id + "}";

    var request = $.ajax({
        type: "POST",
        dataType: "json",
        url: "Default.aspx/Ingredientes",
        contentType: "application/json",
        data: dados
    });

    request.done(function (data) {
        $("#txtIngrediente1").val(data.d[0].Nome);
        $("#txtIngrediente2").val(data.d[1].Nome);
        $("#txtIngrediente3").val(data.d[2].Nome);
    });

    request.fail(function (jqXHR, textStatus) {
        noty({ text: "Request failed: " + textStatus, type: "error" });
    });
}

function YUIGridFormat() {
    var tr = $(".yui3-datatable-data tr");

    tr.mouseover(function() {
        $(this).css("color", "red");
    });
    tr.mouseout(function() {
        $(this).css("color", "gray");
    });

    //tr.append("<td><a>ingredientes</a></td>");

    tr.click(function () {
        var id = $(this).find("td:eq(0)").text();

        var dados = "{id :" + id + "}";

        var request = $.ajax({
            type: "POST",
            dataType: "json",
            url: "Default.aspx/PizzaById",
            contentType: "application/json",
            data: dados
        });

        request.done(function (data) {
            $("#txtId").val(data.d.Id);
            $("#txtNome").val(data.d.Nome);

            ingredienteGrid(data.d.Id);

            panel.show();
        });

        request.fail(function (jqXHR, textStatus) {
            noty({text:"Request failed: " + textStatus, type:"error" });
        });
    });
}