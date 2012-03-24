// busca do banco de dados
var pizzasDto;
var ingredientesDto;

$().ready(function () {
    getAllPizza();
    getAllIngredientes();

    // inicializa o viewModel
    var pizzasViewModel = new MainViewModel(pizzasDto);

    // This makes Knockout get to work
    ko.applyBindings(pizzasViewModel);

    var a = 1;
});


var MainViewModel = function (pizzas) {
    var self = this;
    self.pizzaIdSelecionada = ko.observable();
    self.pizzaSelecionada = ko.observable();
    self.todosIngredientes = ko.observableArray();

    // Behaviours
    self.selecionarPizza = function (pizza) {
        self.pizzaIdSelecionada(pizza.Id);
        self.pizzaSelecionada(pizza);
    };

    // Carregar todosIngredientes
    self.todosIngredientes = ko.observableArray(ingredientesDto);

    // Carregar as Pizzas
    var pizzasVm = [];
    for (var i = 0; i < pizzasDto.length; i++) {
        pizzasVm.push(new PizzaVM(pizzasDto[i]));
    }
    self.Pizzas = ko.observableArray(pizzasVm);

};

var PizzaVM = function (pizza) {
    var self = this;
    self.Id = ko.observable(pizza.Id);
    self.Nome = ko.observable(pizza.Nome);
    self.Ingredientes = ko.observableArray();
    _.each(pizza.Ingredientes, function (ing) {
        self.Ingredientes().push(new IngredienteVM(ing));
    });

    self.exibirDetalhe = function () {
        exibirNoty(self.Nome());
        
    };
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
        pizzasDto = data;
    });

    request.fail(function (jqXHR, textStatus) {
        exibirNoty("Request failed: " + textStatus, "error");
    });
};

var getAllIngredientes = function () {
    var request = $.ajax({
        type: "GET",
        url: "api/ingrediente",
        contentType: "application/json",
        async: false
    });

    request.done(function (data) {
        ingredientesDto = data;
    });

    request.fail(function (jqXHR, textStatus) {
        exibirNoty("Request failed: " + textStatus, "error");
    });
};


