/// <reference path="~/Scripts/knockout.debug.js" />
/// <reference path="~/Scripts/jquery-1.6.4.min.js" />
/// <reference path="~/Scripts/underscore/underscore-min.js" />

/// /////////////////////
/// Banco de dados local
/// /////////////////////
var pizzasDto;
var ingredientesDto;



/// ///////
/// READY!
/// ///////
$().ready(function () {
    getAllPizza();
    getAllIngredientes();

    // inicializa o viewModel
    var pizzasViewModel = new MainViewModel(pizzasDto);

    // This makes Knockout get to work
    ko.applyBindings(pizzasViewModel);

    $("#buttonDebug").click(function () {
        preencherDebugOutside(this);
    });

    var preencherDebugOutside = function (self) {
        var selData = ko.dataFor(self);
        var selContext = ko.contextFor(self);
        $("#preDebug").html(JSON.stringify(ko.toJS(selData), null, 2));
        prettyPrint();
    };
});



/// //////////////////////////////////////////////////////////////////////////////
///  MAIN :: VIEWMODEL
///  Define os itens que serão observáveis, ou seja, sicronizados via MVVM
///  
///  esta classe depende das seguintes variáveis 'globais':
///   - pizzasDto;
///   - ingredientesDto;
/// //////////////////////////////////////////////////////////////////////////////
var MainViewModel = function () {
    var self = this;

    // somente o id da pizza que estiver selecionada
    self.pizzaIdSelecionada = ko.observable();

    // a pizza selecionada
    self.pizzaSelecionada = ko.observable();

    // todos ingredientes disponíveis
    self.todosIngredientes = ko.observableArray(ingredientesDto);

//    // debug
//    self.preencherDebug = ko.computed(preencherDebugOutside, this);

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
    };

    // inicializar as Pizzas
    var pizzasVm = [];
    for (var i = 0; i < pizzasDto.length; i++) {
        pizzasVm.push(new PizzaVM(pizzasDto[i]));
    }
    self.Pizzas = ko.observableArray(pizzasVm);

    // inserir novo ingrediente
    self.ingredienteToAdd = ko.observable();
    self.addIngrediente = function () {
        if (self.ingredienteToAdd() != "") // Prevent blanks
        {
            //self.pizzaSelecionada().Ingredientes.push(self.ingredienteToAdd());   
            self.pizzaSelecionada().Ingredientes.push(new IngredienteVM(self.ingredienteToAdd()));
            //self.pizzaSelecionada().Ingredientes.push(new IngredienteVM({Id:1, Nome:"ingQualquer"}));

        }
    };

    // remover ingredientes
    self.ingredientesSelecionados = ko.observableArray([]);
    self.removeSelected = function () {
        self.pizzaSelecionada().Ingredientes.removeAll(self.ingredientesSelecionados());
        self.ingredientesSelecionados([]); // Clear selection
    };

};

/// ////////////////////////
///  PizzaVM :: VIEWMODEL
/// ////////////////////////
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

/// ////////////////////////
///  IngredienteVM :: VIEWMODEL
/// ////////////////////////
var IngredienteVM = function (ingrediente) {
    var self = this;
    self.Id = ko.observable(ingrediente.Id);
    self.Nome = ko.observable(ingrediente.Nome);
};



/// ////////////////////////
///  AJAX :: todas pizzas
/// ////////////////////////
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

/// /////////////////////////////
///  AJAX :: todos ingredientes
/// /////////////////////////////
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


