/// <reference path="~/Scripts/knockout.debug.js" />
/// <reference path="~/Scripts/jquery-1.6.4.min.js" />
/// <reference path="~/Scripts/underscore/underscore-min.js" />
/// <reference path="~/Scripts/helpers.js" />

// /////////////////////
// Banco de dados local
// /////////////////////
var pizzasDto;
var ingredientesDto;



// ///////
// READY!
// ///////
$().ready(function () {
    getAllPizza();
    getAllIngredientes();

    // inicializa o viewModel
    var pizzasViewModel = new MainViewModel(pizzasDto);

    // seleciona a primeira pizza logo de cara
    if (pizzasViewModel.Pizzas().length > 0) {
        pizzasViewModel.selecionarPizza(pizzasViewModel.Pizzas()[0]);
    }

    // extendendo os bindings
    ko.bindingHandlers.fadeVisible = {
        init: function (element, valueAccessor) {
            // Start visible/invisible according to initial value
            var shouldDisplay = valueAccessor();
            $(element).toggle(shouldDisplay);
        },
        update: function (element, valueAccessor) {
            // On update, fade in/out
            var shouldDisplay = valueAccessor();
            shouldDisplay ? $(element).fadeIn() : $(element).fadeOut();
        }
    };

    // This makes Knockout get to work
    ko.applyBindings(pizzasViewModel);
});

// //////////////////////////////////////////////////////////////////////////////
//  MAIN :: VIEWMODEL
//  Define os itens que serão observáveis, ou seja, sicronizados via MVVM
//  
//  esta classe depende das seguintes variáveis 'globais':
//   - pizzasDto;
//   - ingredientesDto;
// //////////////////////////////////////////////////////////////////////////////
var MainViewModel = function () {
    var self = this;

    // somente o id da pizza que estiver selecionada
    self.pizzaIdSelecionada = ko.observable();

    // a pizza selecionada
    self.pizzaSelecionada = ko.observable();

    // todos ingredientes disponíveis
    self.todosIngredientes = ko.observableArray(ingredientesDto);

    self.ingredientesAindaNaoInseridos = ko.computed(function () {
        var novaLista = null;
        if (!(_.isUndefined(self.pizzaSelecionada()))) {
            novaLista = _.filter(self.todosIngredientes(), function (item) {

                var ids = _.map(self.pizzaSelecionada().Ingredientes(), function (ingPizza) {
                    return ingPizza.Id();
                });

                return ids.indexOf(item.Id) === -1;
            });
        }
        return novaLista;
    }, self);

    // selecionar pizza
    self.selecionarPizza = function (pizza) {
        self.pizzaIdSelecionada(pizza.Id);
        self.pizzaSelecionada(pizza);

        // limpa as seleções dos ingredientes
        self.removerCancelar();
        self.adicionarCancelar();
    };

    // inicializar as Pizzas
    self.Pizzas = ko.observableArray(_.map(pizzasDto, function (pd) {
        return new PizzaVM(pd);
    }));

    self.save = function () {
        var dados = ko.toJSON(self.pizzaSelecionada());

        var request = $.ajax({
            type: "PUT",
            url: "api/pizza/" + self.pizzaSelecionada().Id(),
            contentType: "application/json",
            data: dados
        });

        request.done(function (data) {
            exibirNoty("salvo");
            self.removerCancelar();
            self.adicionarCancelar();
        });

        request.fail(function (jqXHR, textStatus) {
            exibirNoty("Request failed: " + textStatus, "error");
        });
    };

    // remover ingredientes
    self.ingredientesToRemove = ko.observableArray();
    self.removerIngredientes = function () {
        self.pizzaSelecionada().Ingredientes.removeAll(self.ingredientesToRemove());
        self.ingredientesToRemove([]); // Clear selection
    };
    self.removerCancelar = function () {
        self.ingredientesToRemove([]); // Clear selection
    };


    // inserir novo ingrediente
    self.ingredientesToAdd = ko.observableArray();
    self.adicionarIngredientes = function () {
        if (self.ingredientesToAdd() != "") // Prevent blanks
        {
            var ingredientes = self.pizzaSelecionada().Ingredientes;
            _.each(self.ingredientesToAdd(), function (ing) {
                ingredientes.push(new IngredienteVM(ing));
            });
        }
    };
    self.adicionarCancelar = function () {
        self.ingredientesToAdd([]); // Clear selection
    };
};

// ////////////////////////
//  PizzaVM :: VIEWMODEL
// ////////////////////////
var PizzaVM = function (pizza) {
    var self = this;
    self.Id = ko.observable(pizza.Id);
    self.Nome = ko.observable(pizza.Nome);
    self.Ingredientes = ko.observableArray();
    _.each(pizza.Ingredientes, function (ing) {
        self.Ingredientes().push(new IngredienteVM(ing));
    });
};

// ////////////////////////
//  IngredienteVM :: VIEWMODEL
// ////////////////////////
var IngredienteVM = function (ingrediente) {
    var self = this;
    self.Id = ko.observable(ingrediente.Id);
    self.Nome = ko.observable(ingrediente.Nome);
};



// ////////////////////////
//  AJAX :: todas pizzas
// ////////////////////////
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

// /////////////////////////////
//  AJAX :: todos ingredientes
// /////////////////////////////
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


