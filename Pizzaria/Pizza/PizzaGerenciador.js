/// <reference path="~/Scripts/knockout.debug.js" />
/// <reference path="~/Scripts/underscore/underscore-min.js" />
/// <reference path="~/Scripts/jquery-1.7.1.js" />
/// <reference path="~/Scripts/helpers.js" />
/// <reference path="~/Scripts/ajaxRestHelper/RepositorioAjax.js" />
/// <reference path="~/Scripts/ajaxRestHelper/ajaxRest.js" />
/// <reference path="~/Scripts/ajaxRestHelper/ControllerKnockout.js" />
/// <reference path="~/Scripts/ajaxRestHelper/LocalViewModels.js" />

$().ready(function() {
    criarFadeVisible();

// busca do banco de dados
    inicializar();
});


// ///////////////////////////////////////////////////
// inicializar ///////////////////////////////////////
// ---------------------------------------------------
// Baixa os dados do servidor e sicroniza
// Chama a criação do viewModel knockout.js
// ---------------------------------------------------
// ///////////////////////////////////////////////////
var inicializar = function() {
// configura o caminho das APIs
//  e ainda possui "enums" para definir
//  qual método será chamado
    var configuracoesAjax = {
        callBackErrorsTo: tratarErrorCSharp,
        exibirNoty: true
    };
    var ajax = new ajaxRest(configuracoesAjax);

// Banco de dados local
// base de dados retornados do servidor
    var pizzasDto;
    var ingredientesDto;

// Busca dados do banco de dados
//  como são duas chamas assincronas
//  a função chamarInicializarViewModel
//  verifica se o doneContador já zerou para continuar
    var doneContador = 2; // QUANTIDADE DE CHAMADAS

    chamarAjax({
        nomeController: "ingrediente",
        callback_done: function (data) {
            ingredientesDto = data;
            sincronizaContinua();
        }
    });

    chamarAjax({
        nomeController: "pizza",
        callback_done: function (data) {
            pizzasDto = data;
            sincronizaContinua();
        }
    });

    var sincronizaContinua = function() {
        doneContador--;
        if (doneContador === 0) {
// continua o processo principal
            inicializarViewModelKnockout(ajax, pizzasDto, ingredientesDto);
        }
    };
};


// ///////////////////////////////////////////////////
// inicializarViewModelKnockoutKnockout //////////////////////////////
// ---------------------------------------------------
// cria o view model e aplica no knockout
// ---------------------------------------------------
// ///////////////////////////////////////////////////
var inicializarViewModelKnockout = function(configuradorAjax, pizzasDto, ingredientesDto) {
// inicializa o viewModel
    var pizzasViewModel = new MainViewModel(configuradorAjax, pizzasDto, ingredientesDto);

// seleciona a primeira pizza logo de cara
    if (pizzasViewModel.pizzaVm.lista().length > 0) {
        pizzasViewModel.pizzaVm.selecionar(pizzasViewModel.pizzaVm.lista()[0]);
    }
// seleciona a primeira pizza logo de cara
    if (pizzasViewModel.ingredienteVm.lista().length > 0) {
        pizzasViewModel.ingredienteVm.selecionar(pizzasViewModel.ingredienteVm.lista()[0]);
    }

// This makes Knockout get to work
    ko.applyBindings(pizzasViewModel);
};


// //////////////////////////////////////////////////////////////////////////////
//  MAIN :: VIEWMODEL
//  Define os itens que serão observáveis, ou seja, sicronizados via MVVM
//  
//  esta classe depende das seguintes variáveis 'globais':
//  - pizzasDto;
//  - ingredientesDto;
// //////////////////////////////////////////////////////////////////////////////
var MainViewModel = function(configuradorAjax, pizzasDto, ingredientesDto) {
    var self = this;

    self.exibirDebug = function() {
        $("#divDebug").toggle();
    };


//  vmKO.lista
//  vmKO.selecionar
//  vmKO.id
//  vmKO.selecionado
//  vmKO.foiAlterado
//  vmKO.excluir
//  vmKO.novo
//  vmKO.adicionarCancelar
//  vmKO.salvar
//  vmKO.atualizando
//  vmKO.removerCancelar

//todo: Utilizar padrão do Test. Chamar com objeto.
// Controller pizzaVm
    configControllerKnockout.viewMoldel = self.pizzaVm = { };
    configControllerKnockout.nomeController = "pizza";
    configControllerKnockout.dadosDto = pizzasDto;
    configControllerKnockout.ClasseViewModel = PizzaVM;
    configControllerKnockout.configuradorAjax = configuradorAjax;
    new inicializarControllerKnockout(configControllerKnockout);


// Controller ingredienteVm
    configControllerKnockout.viewMoldel = self.ingredienteVm = { };
    configControllerKnockout.nomeController = "ingrediente";
    configControllerKnockout.dadosDto = ingredientesDto;
    configControllerKnockout.ClasseViewModel = IngredienteVM;
    configControllerKnockout.configuradorAjax = configuradorAjax;
    new inicializarControllerKnockout(configControllerKnockout);


// ///////////////////////////////
// EXTRA - Ingredientes nas PIZZAS
// ///////////////////////////////

// Ingredientes não inseridos da pizza selecionada
    self.pizzaVm.ingredientesAindaNaoInseridos = ko.computed(function() {
        var ingNaoInseridosLista = [];
        if (!(_.isUndefined(self.pizzaVm.selecionado()))) {
            var ids = _.map(self.pizzaVm.selecionado().Ingredientes(), function(ingPizza) {
                return ingPizza.Id();
            });

            ingNaoInseridosLista = _.filter(self.ingredienteVm.lista(), function(item) {
                return (ids.indexOf(item.Id()) === -1);
            });
        }
        return ingNaoInseridosLista;
    }, self);


// remover ingredientes
    self.pizzaVm.ingredientesToRemove = ko.observableArray();
    self.pizzaVm.removerIngredientes = function() {
        self.pizzaVm.selecionado().Ingredientes.removeAll(self.pizzaVm.ingredientesToRemove());
        self.pizzaVm.ingredientesToRemove([]); // Clear selection
    };
    self.pizzaVm.removerCancelar = function() {
        self.pizzaVm.ingredientesToRemove([]); // Clear selection
    };


// inserir novo ingrediente
    self.pizzaVm.ingredientesToAdd = ko.observableArray();
    self.pizzaVm.incluirIngredientesPizza = function() {
        if (self.pizzaVm.ingredientesToAdd() != "") // Prevent blanks
        {
            var ingredientes = self.pizzaVm.selecionado().Ingredientes;
            _.each(self.pizzaVm.ingredientesToAdd(), function(ing) {
                ingredientes.push(ing);
            });
        }
    };
    self.pizzaVm.adicionarCancelar = function() {
        self.pizzaVm.ingredientesToAdd([]); // Clear selection
    };
};


var criarFadeVisible = function() {
// extendendo os bindings
    ko.bindingHandlers.fadeVisible = {
        init: function(element, valueAccessor) {
// start visible/invisible according to initial value
            var shouldDisplay = valueAccessor();
            $(element).toggle(shouldDisplay);
        },
        update: function(element, valueAccessor) {
// on update, fade in/out
            var shouldDisplay = valueAccessor();
            shouldDisplay ? $(element).fadeIn() : $(element).fadeOut();
        }
    };
};