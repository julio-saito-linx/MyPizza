/// <reference path="~/Scripts/knockout.debug.js" />
/// <reference path="~/Scripts/underscore/underscore-min.js" />
/// <reference path="~/Scripts/jquery-1.7.1.js" />
/// <reference path="~/Scripts/helpers.js" />
/// <reference path="~/Scripts/ajaxRestHelper/ajaxRestHelper.js" />

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
var inicializar = function () {
// configura o caminho das APIs
//  e ainda possui "enums" para definir
//  qual método será chamado
    var configuracoesAjax = {
        callBackErrorsTo: tratarErrorCSharp,
        exibirNoty: true
    };
    var configuradorAjax = new ConfiguradorAjax(configuracoesAjax, undefined);

// Banco de dados local
// base de dados retornados do servidor
    var pizzasDto;
    var ingredientesDto;

// Busca dados do banco de dados
//  como são duas chamas assincronas
//  a função chamarInicializarViewModel
//  verifica se o doneContador já zerou para continuar
    var doneContador = 2; // QUANTIDADE DE CHAMADAS

    chamarAjaxAsync(
        "ingrediente",
        configuradorAjax.METHOD_LIST,
        undefined,
        undefined,
        function(data) {
            ingredientesDto = data;
            sincronizaContinua();
        }
    );
    chamarAjaxAsync(
        "pizza",
        configuradorAjax.METHOD_LIST,
        undefined,
        undefined,
        function(data) {
            pizzasDto = data;
            sincronizaContinua();
        }
    );
    var sincronizaContinua = function() {
        doneContador--;
        if (doneContador === 0) {
// continua o processo principal
            inicializarViewModel(configuradorAjax, pizzasDto, ingredientesDto);
        }
    };
};



// ///////////////////////////////////////////////////
// inicializarViewModel //////////////////////////////
// ---------------------------------------------------
// cria o view model e aplica no knockout
// ---------------------------------------------------
// ///////////////////////////////////////////////////
var inicializarViewModel = function (configuradorAjax, pizzasDto, ingredientesDto) {
// inicializa o viewModel
    var pizzasViewModel = new MainViewModel(configuradorAjax, pizzasDto, ingredientesDto);
    configuradorAjax.viewModel = pizzasViewModel;

// seleciona a primeira pizza logo de cara
    if (pizzasViewModel.pizzaVm.lista().length > 0) {
        pizzasViewModel.pizzaVm.selecionar(pizzasViewModel.pizzaVm.lista()[0]);
    }
// seleciona a primeira pizza logo de cara
    if (pizzasViewModel.todosIngredientes().length > 0) {
        pizzasViewModel.selecionarIngrediente(pizzasViewModel.todosIngredientes()[0]);
    }

// This makes Knockout get to work
    ko.applyBindings(pizzasViewModel);
};



// ///////////////////////////////////////////////////
// ControlerKnockout /////////////////////////////////
// ---------------------------------------------------
// Configura um viewModel knockout de forma automática.
// Expõe um CRUD básico.
// ---------------------------------------------------
// ///////////////////////////////////////////////////
var ControlerKnockout = function (nomeController, dadosDto, ClasseViewModel, configuradorAjax) {
    var self = this;

    self.aplicarViewModel = function (vmKO) {
// em processo de comunicação com o servidor
        vmKO.atualizando = ko.observable(false);
// item selecionado
        vmKO.selecionado = ko.observable();
// somente o id que estiver selecionado
        vmKO.id = ko.observable();
        vmKO.selecionar = function (item) {
// salva o item anterior
            vmKO.salvar();
// define o novo item selecionado
            vmKO.id(item.Id);
            vmKO.selecionado(item);
// guarda o estado inicial do novo item
            jsonItem = ko.toJSON(vmKO.selecionado);
// limpa as seleções dos ingredientes
            vmKO.removerCancelar();
            vmKO.adicionarCancelar();
        };
        var jsonItem = undefined;
// selecionar item
        vmKO.foiAlterado = function () {
            if (!_.isUndefined(jsonItem)) {
                var jsonItemAtual = ko.toJSON(vmKO.selecionado);
                return (jsonItem !== jsonItemAtual);
            }
            return false;
        };


// [GET] 
        vmKO.lista = self.listar();

// [POST/PUT] 
        vmKO.salvar = function () {
            self.salvar(vmKO);
        };
// [POST] 
        vmKO.novo = function () {
            self.novo(vmKO);
            $("#txtPizzaNome").focus();
        };
// [DELETE] 
        vmKO.excluir = function () {
            self.excluir(vmKO);
        };
    };
    
    
    self.listar = function () {
        var viewModelLista = _.map(dadosDto, function (itemDto) {
            return new ClasseViewModel(itemDto);
        });
        return ko.observableArray(viewModelLista);
    };

    self.salvar = function (vmKO) {
        if (_.isUndefined(vmKO.selecionado)) {
// não existe item selecionada
            return;
        }

// somente salva se o JSON foi alterado
        if (!vmKO.foiAlterado()) {
            return;
        }

        vmKO.atualizando(true);

        var vmSerializado = ko.toJSON(vmKO.selecionado);

        var metodoHttp = configuradorAjax.METHOD_PUT;
        if (vmKO.id()() === 0) {
            metodoHttp = configuradorAjax.METHOD_POST;
        }
        chamarAjaxAsync(
            nomeController,
            metodoHttp,
            vmKO.selecionado().Id(),
            vmSerializado,
            function (data) {
                vmKO.atualizando(false);
                vmKO.removerCancelar();
                vmKO.adicionarCancelar();
            });
    };

        self.novo = function (vmKO) {
        var novoVm = new ClasseViewModel();
        vmKO.lista.push(novoVm);
        vmKO.selecionar(novoVm);
    };

    self.excluir = function (vmKO) {

        var novaLista = _.reject(vmKO.lista(), function (item) {
            return item.Id() === vmKO.id()();
        });
        vmKO.lista(novaLista);

        vmKO.atualizando(true);
        chamarAjaxAsync(
            nomeController,
            configuradorAjax.METHOD_DELETE,
            vmKO.selecionado().Id(),
            undefined,
            function (data) {
                vmKO.atualizando(false);
                vmKO.removerCancelar();
                vmKO.adicionarCancelar();
            });
    };


};



// //////////////////////////////////////////////////////////////////////////////
//  MAIN :: VIEWMODEL
//  Define os itens que serão observáveis, ou seja, sicronizados via MVVM
//  
//  esta classe depende das seguintes variáveis 'globais':
//  - pizzasDto;
//  - ingredientesDto;
// //////////////////////////////////////////////////////////////////////////////
var MainViewModel = function (configuradorAjax, pizzasDto, ingredientesDto) {
    var self = this;

// inicializa o configurador de controlers
//todo: passar configuração via objeto para ficar mais claro
    var controlerPizza = new ControlerKnockout("pizza", pizzasDto, PizzaVM, configuradorAjax);
// pizzaVm
    self.pizzaVm = {};
// primeiro viewModel: pizzaVm
    controlerPizza.aplicarViewModel(self.pizzaVm);


// todos ingredientes disponíveis
    self.todosIngredientes = ko.observableArray(_.map(ingredientesDto, function (ingredienteDto) {
        return new IngredienteVM(ingredienteDto);
    }));

// Ingredientes não inseridos da pizza selecionada
    self.ingredientesAindaNaoInseridos = ko.computed(function () {
        var ingNaoInseridosLista = [];
        if (!(_.isUndefined(self.pizzaVm.selecionado()))) {
            var ids = _.map(self.pizzaVm.selecionado().Ingredientes(), function (ingPizza) {
                return ingPizza.Id();
            });

            ingNaoInseridosLista = _.filter(self.todosIngredientes(), function (item) {
                return (ids.indexOf(item.Id()) === -1);
            });
        }
        return ingNaoInseridosLista;
    }, self);







// remover ingredientes
    self.ingredientesToRemove = ko.observableArray();
    self.removerIngredientes = function () {
        self.pizzaVm.selecionado().Ingredientes.removeAll(self.ingredientesToRemove());
        self.ingredientesToRemove([]); // Clear selection
    };
    self.pizzaVm.removerCancelar = function () {
        self.ingredientesToRemove([]); // Clear selection
    };


// inserir novo ingrediente
    self.ingredientesToAdd = ko.observableArray();
    self.incluirIngredientesPizza = function () {
        if (self.ingredientesToAdd() != "") // Prevent blanks
        {
            var ingredientes = self.pizzaVm.selecionado().Ingredientes;
            _.each(self.ingredientesToAdd(), function (ing) {
                ingredientes.push(ing);
            });
        }
    };
    self.pizzaVm.adicionarCancelar = function () {
        self.ingredientesToAdd([]); // Clear selection
    };

    self.exibirDebug = function () {
        $("#divDebug").toggle();
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
        self.pizzaVm.atualizando(true);

        var metodoAjax;
        if (self.ingredienteId() === 0) {
            metodoAjax = configuradorAjax.METHOD_POST;
        } else {
            metodoAjax = configuradorAjax.METHOD_PUT;
        }
        chamarAjaxAsync(
            "ingrediente",
            metodoAjax,
            undefined,
            ko.toJSON(self.ingredienteSelecionado),
            function (data) {
                self.pizzaVm.atualizando(false);
                if (metodoAjax === configuradorAjax.METHOD_POST) {
                    self.ingredienteSelecionado().Id(data);
                }
                self.selecionarIngrediente(self.ingredienteSelecionado());
            });

    };

    self.deletarIngrediente = function () {
        self.pizzaVm.atualizando(true);
        chamarAjaxAsync(
            "ingrediente",
            configuradorAjax.METHOD_DELETE,
            self.ingredienteSelecionado().Id(),
            undefined,
            function (data) {
                self.pizzaVm.atualizando(false);

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

// ///////////////////////////////////////////////
// tratamento de erros especifico para NHibernate
// ///////////////////////////////////////////////
var tratarErrorCSharp = function(jqXHR) {
    var erroCSharp = JSON.parse(jqXHR.responseText, undefined);
    console.info(erroCSharp);

    if (erroCSharp.ExceptionType === "NHibernate.Exceptions.GenericADOException") {
        if (!_.isUndefined(erroCSharp.InnerException)) {
            var inner = erroCSharp.InnerException;
            if (inner.ExceptionType === "System.Data.SqlClient.SqlException") {
// trata pau de SQL
                exibirNotyErro(":: ERRO DE SQL ::" + "<br /><br />"
                    + "> " + erroCSharp.ExceptionType + "<br />"
                    + "> " + inner.ExceptionType + "<br /><br />"
                    + inner.Message);
            }
        }
    } else {
//pau genérico
        exibirNotyErro(":: ERRO C# GENERICO ::" + "<br /><br />"
            + "> " + erroCSharp.ExceptionType + "<br />"
            + erroCSharp.Message);
    }
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