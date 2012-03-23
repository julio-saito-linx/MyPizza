//HELPERS
var primeiroMaiusculo = function (texto) {
    texto = texto.toLowerCase();
    var primeiraLetra = texto.substring(0, 1).toUpperCase();
    return primeiraLetra + texto.substring(1);
};
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

// Here's my data model
var PizzasViewModel = function (pizzas) {
    var self = this;
    self.Pizzas = ko.observableArray(pizzas.Pizzas);
};

var PizzaVM = function (pizza) {
    var self = this;
    self.Id = ko.observable(pizza.Id);
    self.Nome = ko.observable(pizza.Nome);

    self.Ingredientes = ko.observableArray();
    _.each(pizza.Ingredientes, function (ing) {
        self.Ingredientes().push(IngredienteVM(ing));
    });

};

var IngredienteVM = function (ingrediente) {
    var self = this;
    self.Id = ko.observable(ingrediente.Id);
    self.Nome = ko.observable(ingrediente.Nome);
};

var getAllPizza = function () {
    var request = $.ajax({
        type: "GET",
        url: "api/pizza",
        contentType: "application/json",
        async: false
    });

    request.done(function (data) {
        pizzas = { Pizzas: data };
    });

    request.fail(function (jqXHR, textStatus) {
        exibirNoty("Request failed: " + textStatus, "error");
    });
};

// busca do banco de dados
var pizzas;
getAllPizza();

// inicializa o viewModel
var pizzasViewModel = new PizzasViewModel(pizzas);

// This makes Knockout get to work
ko.applyBindings(pizzasViewModel);