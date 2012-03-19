var pizzas = [];

//Inclui uma  nova pizza
$("#btIncluir").click(function() {
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

    request.done(function(data) {
        noty({ text: data, type: "success" });
        $("#btConsulta").click();
    });

    request.fail(function(jqXHR, textStatus) {
        noty({ text: "Request failed: " + textStatus, type: "error" });
    });
});

//Excluir pizza
$("#btExcluir").click(function() {
    var dados = "{ id:" + $("#txtId").val() + "}";

    var request = $.ajax({
        type: "POST",
        url: "Default.aspx/ExcluirPizza",
        contentType: "application/json",
        data: dados
    });

    request.done(function(data) {
        noty({ text: data.d, type: "success" });
        $("#btConsulta").click();
    });

    request.fail(function(jqXHR, textStatus) {
        noty({ text: "Request failed: " + textStatus, type: "error" });
    });
});

//Consulta pizzas
$("#btConsulta").click(function() {
    var nome = $("#txtConsulta").val();

    var request = $.ajax({
        type: "POST",
        url: "/AJAX/Pizzas.aspx/PizzasLista",
        contentType: "application/json",
        data: "{nome:'" + nome + "'}"
    });

    request.done(function(data) {
        pizzaGrid(data);
    });

    request.fail(function(jqXHR, textStatus) {
        noty({ text: "Request failed: " + textStatus, type: "error" });
    });
});

//Salva o garcom
$("#btGarcom").click(function() {
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

    request.done(function(data) {
        noty({ text: data.d, type: "success" });
    });

    request.fail(function(jqXHR, textStatus) {
        noty({ text: "Request failed: " + textStatus, type: "error" });
    });
});


//Monta e carrega o grid
var pizzaGrid = function (d) {
    $("#pizzaview").html("");

    YUI().use('datatable', function (Y) {
        var cols = [{ key: "Id", sortable: false },
                    { key: "Nome", sortable: false}];

        var data = d.d;
        pizzas = data;

        // Creates a DataTable with 3 columns and 3 rows
        new Y.DataTable.Base({
            columnset: cols,
            recordset: data,
            caption: "Pizzas",
            plugins: Y.Plugin.DataTableSort
        }).render("#pizzaview");

        YUIGridFormat();
    });
};

var ingredienteGrid = function(id) {
    var dados = "{id :" + id + "}";

    var request = $.ajax({
        type: "POST",
        dataType: "json",
        url: "Default.aspx/Ingredientes",
        contentType: "application/json",
        data: dados
    });

    request.done(function(data) {
        $("#txtIngrediente1").val(data.d[0].Nome);
        $("#txtIngrediente2").val(data.d[1].Nome);
        $("#txtIngrediente3").val(data.d[2].Nome);
    });

    request.fail(function(jqXHR, textStatus) {
        noty({ text: "Request failed: " + textStatus, type: "error" });
    });
};

var YUIGridFormat = function () {
    var tr = $(".yui3-datatable-data tr");
    tr.css("cursor", "pointer");

    tr.mouseover(function () {
        $(this).css("color", "red");
    });
    tr.mouseout(function () {
        $(this).css("color", "gray");
    });

    tr.click(function () {
        var id = parseInt($(this).find("td:eq(0)").text());
        var pizza = _.find(pizzas, function (p) {
            return p.Id === id;
        });

        $("#txtId").val(pizza.Id);
        $("#txtNome").val(pizza.Nome);

        $("#txtIngrediente1").val(pizza.Ingredientes[0].Nome);
        $("#txtIngrediente2").val(pizza.Ingredientes[1].Nome);
        $("#txtIngrediente3").val(pizza.Ingredientes[2].Nome);
    });
};