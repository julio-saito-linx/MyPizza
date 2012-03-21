var pizzas = [];

var exibirNoty = function(mensagem, tipoAlert) {
    noty({
        "text": mensagem,
        "layout": "top",
        "type": tipoAlert,
        "textAlign": "center",
        "easing": "swing",
        "animateOpen": { "height": "toggle" },
        "animateClose": { "height": "toggle" },
        "speed": "500",
        "timeout": "500",
        "closable": true,
        "closeOnSelfClick": true
    });
};

//Monta e carrega o grid
var pizzaGrid = function(d) {
    $("#pizzaview").html("");

    YUI().use('datatable', function(Y) {
        var cols = [{ key: "Id", sortable: false },
            { key: "Nome", sortable: false }];

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
        tr.css("font-weight", "normal");
        $(this).css("font-weight", "bold");
        var pizza = _.find(pizzas, function (p) {
            return p.Id === id;
        });

        $("#txtId").val(pizza.Id);
        $("#txtNome").val(pizza.Nome);

        preencherSelectsIngredientes(pizza.Ingredientes);
    });
};

var ingredientesDoBanco = null;

var preencherSelectsIngredientes = function (ingredientes) {
    // se ainda a lista não está preenchida busca lista de ingredientes
    if (ingredientesDoBanco === null) {
        pesquisarIngredientes();
    }

    $("#divIngredientes").html("");

    if (ingredientes.length === 0) {
        criarSelectIngrediente();
    }
    else {
        for (var i = 0; i < ingredientes.length; i++) {
            criarSelectIngrediente(ingredientes[i]);
        }
    }
};

var criarSelectIngrediente = function (ingrediente) {
    $("#divIngredientes").append("<select></select>");
    for (var i = 0; i < ingredientesDoBanco.length; i++) {
        var ing = ingredientesDoBanco[i];
        $("#divIngredientes select").append("<option value='" + ing.Id + "'>" + ing.Nome + "</option>");
    }

    if (!_.isUndefined(ingrediente)) {
        var lista = $("#divIngredientes select option");
        var itemEncontrado = _.find(lista, function (l) {
            return (l.value === ingrediente.Id.toString());
        });

        $("#divIngredientes select option[value='" + ingrediente.Id.toString() + "']").select();
    }
};

var recuperarSelectsIngredientesDto = function (ingredientesDto) {
};

var pesquisarIngredientes = function () {
    var request = $.ajax({
        type: "POST",
        url: "AJAX/Pizzas.aspx/Ingredientes",
        contentType: "application/json",
        async: false
    });

    request.done(function (data) {
        ingredientesDoBanco = data.d;
    });

    request.fail(function (jqXHR, textStatus) {
        exibirNoty("Request failed: " + textStatus, "error");
    });
};


var limparDadosPizza = function() {
    $("#txtId").val(0);
    $("#txtNome").val("");
    preencherSelectsIngredientes();
};

//Consulta pizzas
$("#btPizzaAdd").click(function() {
    limparDadosPizza();
});


//Consulta pizzas
$("#btConsulta").click(function() {
    var request = $.ajax({
        type: "POST",
        url: "AJAX/Pizzas.aspx/PizzasLista",
        contentType: "application/json",
        data: JSON.stringify({ nome: $("#txtConsulta").val() })
    });

    request.done(function(data) {
        pizzaGrid(data);
        limparDadosPizza();
    });

    request.fail(function(jqXHR, textStatus) {
        exibirNoty("Request failed: " + textStatus, "error");
    });
});


//Inclui uma  nova pizza
$("#btIncluir").click(function () {
    // http://encosia.com/using-complex-types-to-make-calling-services-less-complex/
    // Initialize the object, before adding data to it.
    //  { } is declarative shorthand for new Object().
    var pizzaDto = {};
    pizzaDto.Id = $("#txtId").val();
    pizzaDto.Nome = $("#txtNome").val();
    pizzaDto.Ingredientes = [];
    recuperarSelectsIngredientesDto(pizzaDto.Ingredientes);

    // Create a data transfer object (DTO) with the proper structure.
    var DTO = { 'pizzaDto': pizzaDto };

    var request = $.ajax({
        type: "POST",
        url: "AJAX/Pizzas.aspx/SavePizza",
        contentType: "application/json",
        data: JSON.stringify(DTO)
    });

    request.done(function (data) {
        exibirNoty(data.d, "success");
        $("#btConsulta").click();
    });

    request.fail(function (jqXHR, textStatus) {
        exibirNoty("Request failed: " + textStatus, "error");
    });
});

//Excluir pizza
$("#btExcluir").click(function() {
    var dados = "{ id:" + $("#txtId").val() + "}";

    var request = $.ajax({
        type: "POST",
        url: "AJAX/Pizzas.aspx/ExcluirPizza",
        contentType: "application/json",
        data: dados
    });

    request.done(function(data) {
        exibirNoty(data.d, "success");
        $("#btConsulta").click();
    });

    request.fail(function(jqXHR, textStatus) {
        exibirNoty("Request failed: " + textStatus, "error");
    });
});