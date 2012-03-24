var pizzas = [];
var _ingredientesDoBanco = null;

$().ready(function () {
    getAllPizza();
});

var getAllPizza = function () {
    var request = $.ajax({
        type: "GET",
        url: "api/pizza",
        contentType: "application/json"
    });

    request.done(function (data) {
        pizzas = data;
        preencharGrid(data);
    });

    request.fail(function (jqXHR, textStatus) {
        exibirNoty("Request failed: " + textStatus, "error");
    });
};

//Monta e carrega o grid
var preencharGrid = function (dados) {
    if (_.isUndefined(dados))
        return;

    var linhas = "";
    for (var i = 0; i < dados.length; i++) {
        var pizza = dados[i];
        linhas += "<tr>";
        linhas += "<td>";
        linhas += pizza.Id;
        linhas += "</td>";
        linhas += "<td>";
        linhas += pizza.Nome;
        linhas += "</td>";
        linhas += "</tr>";
    }

    $("#tablePizzas").append(linhas);

    prepararTabela();

};

var prepararTabela = function () {
    var tr = $("#tablePizzas tr:gt(0)");
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


var preencherSelectsIngredientes = function (ingredientes) {
    // se ainda a lista não está preenchida busca lista de ingredientes
    if (_ingredientesDoBanco === null) {
        pesquisarIngredientes();
    }

    $("#divIngredientes").html("");

    criarSelectIngrediente();
    //    if (_.isUndefined(ingredientes)) {
//        criarSelectIngrediente();
//    }
//    else {
//        for (var i = 0; i < ingredientes.length; i++) {
//            criarSelectIngrediente(ingredientes[i]);
//        }
//    }
};

var criarSelectIngrediente = function (ingrediente) {
    $("#divIngredientes").append("<select></select>");
    for (var i = 0; i < _ingredientesDoBanco.length; i++) {
        var ing = _ingredientesDoBanco[i];
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

var recuperarSelectsIngredientesDto = function () {
    var ingredientes = [];
    $("#divIngredientes option:selected").each(function () {
        var ing = { Id: $(this).val() };
        ingredientes.push(ing);
    });
    return ingredientes;
};

var pesquisarIngredientes = function () {
    var request = $.ajax({
        type: "GET",
        url: "api/ingrediente",
        contentType: "application/json",
        async: false
    });

    request.done(function (data) {
        _ingredientesDoBanco = data;
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

// Preparar para nova pizza
$("#btPizzaAdd").click(function() {
    limparDadosPizza();
});




//Inclui uma  nova pizza
$("#btIncluir").click(function () {
    // http://encosia.com/using-complex-types-to-make-calling-services-less-complex/
    // Initialize the object, before adding data to it.
    //  { } is declarative shorthand for new Object().
    var pizzaDto = {};
    pizzaDto.Id = $("#txtId").val();
    pizzaDto.Nome = $("#txtNome").val();
    pizzaDto.Ingredientes = recuperarSelectsIngredientesDto();

    // Create a data transfer object (DTO) with the proper structure.
    //var DTO = { 'pizzaDto': pizzaDto };

    var request = $.ajax({
        type: "POST",
        url: "api/pizza",
        contentType: "application/json",
        data: JSON.stringify(pizzaDto)
    });

    request.done(function (data) {
        exibirNoty(data.d, "success");
        getAllPizza();
    });

    request.fail(function (jqXHR, textStatus) {
        exibirNoty("Request failed: " + textStatus, "error");
    });
});

//Excluir pizza
$("#btExcluir").click(function () {
    var request = $.ajax({
        type: "DELETE",
        url: "api/pizza/" + $("#txtId").val(),
        contentType: "application/json"
    });

    request.done(function (data) {
        exibirNoty(data.d, "success");
        getAllPizza();
    });

    request.fail(function (jqXHR, textStatus) {
        exibirNoty("Request failed: " + textStatus, "error");
    });
});


var exibirNoty = function (mensagem, tipoAlert) {
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
