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
var configuradorAjax;


// ///////
// READY!
// ///////
$().ready(function() {

    configuradorAjax = new ConfiguradorAjax(configuracoesAjax, undefined);

    // busca do banco de dados
    getAllIngredientes();
    getAllPizza();

    // inicializa o viewModel
    var pizzasViewModel = new MainViewModel();
    configuradorAjax = new ConfiguradorAjax(configuracoesAjax, pizzasViewModel);

    // seleciona a primeira pizza logo de cara
    if (pizzasViewModel.Pizzas().length > 0) {
        pizzasViewModel.selecionarPizza(pizzasViewModel.Pizzas()[0]);
    }
    // seleciona a primeira pizza logo de cara
    if (pizzasViewModel.todosIngredientes().length > 0) {
        pizzasViewModel.selecionarIngrediente(pizzasViewModel.todosIngredientes()[0]);
    }

    // extendendo os bindings
    ko.bindingHandlers.fadeVisible = {
        init: function(element, valueAccessor) {
            // Start visible/invisible according to initial value
            var shouldDisplay = valueAccessor();
            $(element).toggle(shouldDisplay);
        },
        update: function(element, valueAccessor) {
            // On update, fade in/out
            var shouldDisplay = valueAccessor();
            shouldDisplay ? $(element).fadeIn() : $(element).fadeOut();
        }
    };

    // This makes Knockout get to work
    ko.applyBindings(pizzasViewModel);

});

var tratarErrorCSharp = function (jqXHR) {
    var erroCSharp = JSON.parse(jqXHR.responseText, undefined);
    console.info(erroCSharp);

    if (erroCSharp.ExceptionType === "NHibernate.Exceptions.GenericADOException") {
        if (!_.isUndefined(erroCSharp.InnerException)) {
            var inner = erroCSharp.InnerException;
            if (inner.ExceptionType === "System.Data.SqlClient.SqlException") {
                //pau do SQL
                exibirNotyErro(":: ERRO DE SQL ::" + "<br /><br />"
                    + "> " + erroCSharp.ExceptionType + "<br />"
                    + "> " + inner.ExceptionType + "<br /><br />"
                    + inner.Message);
            }
        }
    }
    else {
        //pau genérico
        exibirNotyErro(":: ERRO C# GENERICO ::" + "<br /><br />"
                    + "> " + erroCSharp.ExceptionType + "<br />"
                    + erroCSharp.Message);
    }
};

var configuracoesAjax = {
    callBackErrorsTo: tratarErrorCSharp,
    exibirNoty: true
};


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
    self.todosIngredientes = ko.observableArray(_.map(ingredientesDto, function (ingredienteDto) {
        return new IngredienteVM(ingredienteDto);
    }));

    // Ingredientes não inseridos da pizza selecionada
    self.ingredientesAindaNaoInseridos = ko.computed(function () {
        var ingNaoInseridosLista = [];
        if (!(_.isUndefined(self.pizzaSelecionada()))) {
            var ids = _.map(self.pizzaSelecionada().Ingredientes(), function (ingPizza) {
                return ingPizza.Id();
            });

            ingNaoInseridosLista = _.filter(self.todosIngredientes(), function (item) {
                return (ids.indexOf(item.Id()) === -1);
            });
        }
        return ingNaoInseridosLista;
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

        var metodoHttp = configuradorAjax.METHOD_PUT;
        if (self.pizzaIdSelecionada()() === 0) {
            metodoHttp = configuradorAjax.METHOD_POST;
        }

        chamarAjaxAsync(
            "pizza",
            metodoHttp,
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
    self.incluirIngredientesPizza = function () {
        if (self.ingredientesToAdd() != "") // Prevent blanks
        {
            var ingredientes = self.pizzaSelecionada().Ingredientes;
            _.each(self.ingredientesToAdd(), function (ing) {
                ingredientes.push(ing);
            });
        }
    };
    self.adicionarCancelar = function () {
        self.ingredientesToAdd([]); // Clear selection
    };

    self.exibirDebug = function () {
        $("#divDebug").toggle();
    };

    self.novaPizza = function () {
        var novaPizza = new PizzaVM();
        self.Pizzas.push(novaPizza);
        self.selecionarPizza(novaPizza);
        $("#txtPizzaNome").focus();
    };

    self.excluirPizza = function () {
        var novaListaPizzas = _.reject(self.Pizzas(), function (pizza) {
            return pizza.Id() === self.pizzaIdSelecionada()();
        });
        self.Pizzas(novaListaPizzas);

        self.IsUpdating(true);
        chamarAjaxAsync(
            "pizza",
            configuradorAjax.METHOD_DELETE,
            self.pizzaSelecionada().Id(),
            undefined,
            function (data) {
                self.IsUpdating(false);
                self.removerCancelar();
                self.adicionarCancelar();
            });

    };

    self.ingredienteId = ko.observable(0);
    self.ingredienteSelecionado = ko.observable();
    self.selecionarIngrediente = function (ingrediente) {
        self.ingredienteSelecionado(ingrediente);
        self.ingredienteId(ingrediente.Id());
    };

    self.novoIngrediente = function () {
        var novoIngrediente = new IngredienteVM();
        self.todosIngredientes.push(novoIngrediente);
        self.selecionarIngrediente(novoIngrediente);
        $("#txtIngredienteNome").focus();
    };

    self.salvarIngrediente = function () {
        self.IsUpdating(true);

        var metodoAjax;
        if (self.ingredienteId() === 0) {
            metodoAjax = configuradorAjax.METHOD_POST;
        }
        else {
            metodoAjax = configuradorAjax.METHOD_PUT;
        }
        chamarAjaxAsync(
            "ingrediente",
            metodoAjax,
            undefined,
            ko.toJSON(self.ingredienteSelecionado),
            function (data) {
                self.IsUpdating(false);
                if (metodoAjax === configuradorAjax.METHOD_POST) {
                    self.ingredienteSelecionado().Id(data);
                }
                self.selecionarIngrediente(self.ingredienteSelecionado());
            });

    };

    self.deletarIngrediente = function () {
        self.IsUpdating(true);
        chamarAjaxAsync(
            "ingrediente",
            configuradorAjax.METHOD_DELETE,
            self.ingredienteSelecionado().Id(),
            undefined,
            function (data) {
                self.IsUpdating(false);

                var novaListaIngredientes = _.reject(self.todosIngredientes(), function (ingrediente) {
                    return ingrediente.Id() === self.ingredienteId();
                });
                self.todosIngredientes(novaListaIngredientes);
            });

    };


};

// ////////////////////////
//  PizzaVM :: VIEWMODEL
// ////////////////////////
var PizzaVM = function(pizza) {
    var self = this;
    self.Id = ko.observable(0);
    self.Nome = ko.observable("");
    self.Ingredientes = ko.observableArray([]);

    if (!_.isUndefined(pizza)) {
        self.Id = ko.observable(pizza.Id);
        self.Nome = ko.observable(pizza.Nome);
        self.Ingredientes = ko.observableArray();
        _.each(pizza.Ingredientes, function(ing) {
            self.Ingredientes().push(new IngredienteVM(ing));
        });
    }
};

// ////////////////////////
//  IngredienteVM :: VIEWMODEL
// ////////////////////////
var IngredienteVM = function(ingrediente) {
    var self = this;
    self.Id = ko.observable(0);
    self.Nome = ko.observable("");

    if (!_.isUndefined(ingrediente)) {
        self.Id = ko.observable(ingrediente.Id);
        self.Nome = ko.observable(ingrediente.Nome);
    }
};


// ////////////////////////
//  AJAX :: todas pizzas
// ////////////////////////
var getAllPizza = function() {
    chamarAjaxSync(
        "pizza",
        configuradorAjax.METHOD_LIST,
        undefined,
        undefined,
        function(data) {
            pizzasDto = data;
        });
};

// /////////////////////////////
//  AJAX :: todos ingredientes
// /////////////////////////////
var getAllIngredientes = function() {
    chamarAjaxSync(
        "ingrediente",
        configuradorAjax.METHOD_LIST,
        undefined,
        undefined,
        function(data) {
            ingredientesDto = data;
        });
};