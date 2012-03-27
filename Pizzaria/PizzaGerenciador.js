/// <reference path="~/Scripts/knockout.debug.js" />
/// <reference path="~/Scripts/jquery-1.6.4.min.js" />
/// <reference path="~/Scripts/underscore/underscore-min.js" />
/// <reference path="~/Scripts/helpers.js" />
/// <reference path="Scripts/ajaxRestHelper/ajaxRestHelper.js" />

// /////////////////////
// Banco de dados local
// /////////////////////
var pizzasDto;
var ingredientesDto;
var configuradorAjax = new ConfiguradorAjax();

// ///////
// READY!
// ///////
$().ready(function () {
    // busca do banco de dados
    getAllPizza();
    getAllIngredientes();

    // inicializa o viewModel
    var pizzasViewModel = new MainViewModel();

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
    self.pizzaSelecionadaEstadoInicialJSON = undefined;

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



    // ////////////////////////////////////////
    // Verifica se o JSON da Pizza foi alterado
    // ////////////////////////////////////////
    var pizzaSelecionadaEstadoInicialJSON = undefined;

    self.foiAlterada = function () {
        if (!_.isUndefined(pizzaSelecionadaEstadoInicialJSON)) {
            var jsonPizzaAtual = ko.toJSON(self.pizzaSelecionada);
            return (pizzaSelecionadaEstadoInicialJSON !== jsonPizzaAtual);
        }
        return false;
    };

    // selecionar pizza
    self.selecionarPizza = function (pizza) {
        // salva pizza anterior
        self.salvar();

        // define a nova pizza selecionada
        self.pizzaIdSelecionada(pizza.Id);
        self.pizzaSelecionada(pizza);

        // guarda o estado inicial da pizza nova
        pizzaSelecionadaEstadoInicialJSON = ko.toJSON(self.pizzaSelecionada);

        // limpa as seleções dos ingredientes
        self.removerCancelar();
        self.adicionarCancelar();
    };

    // inicializar as Pizzas
    self.Pizzas = ko.observableArray(_.map(pizzasDto, function (pizzaDto) {
        return new PizzaVM(pizzaDto);
    }));

    self.IsUpdating = ko.observable(false);

    self.salvar = function () {
        if (_.isUndefined(self.pizzaSelecionada())) {
            // não existe pizza selecionada
            return;
        }

        // somente salva se o JSON foi alterado
        if (!self.foiAlterada()) {
            return;
        }

        self.IsUpdating(true);

        var pizzaSerializada = ko.toJSON(self.pizzaSelecionada());

        chamarAjaxAsync(
            "pizza",
            configuradorAjax.METHOD_PUT,
            self.pizzaSelecionada().Id(),
            pizzaSerializada,
            function (data) {
                self.IsUpdating(false);
                self.removerCancelar();
                self.adicionarCancelar();
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
    chamarAjaxSync(
        "pizza",
        configuradorAjax.METHOD_LIST,
        undefined,
        undefined,
        function (data) {
            pizzasDto = data;
        });
};

// /////////////////////////////
//  AJAX :: todos ingredientes
// /////////////////////////////
var getAllIngredientes = function () {
    chamarAjaxSync(
        "ingrediente",
        configuradorAjax.METHOD_LIST,
        undefined,
        undefined,
        function (data) {
            ingredientesDto = data;
        });
};



