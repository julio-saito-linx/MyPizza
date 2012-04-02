/// <reference path="~/Scripts/knockout.debug.js" />
/// <reference path="~/Scripts/underscore/underscore-min.js" />
/// <reference path="~/Scripts/jquery-1.7.1.js" />
/// <reference path="~/Scripts/helpers.js" />
/// <reference path="~/Scripts/ajaxRestHelper/ajaxConfig.js" />
/// <reference path="~/Scripts/ajaxRestHelper/ControllerKnockout.js" />
/// <reference path="~/Scripts/ajaxRestHelper/LocalViewModels.js" />

$().ready(function() {
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
        callBackErrorsTo: function (jqXHR) {
            exibirNotyErro(tratarErrorCSharp(jqXHR));
        }
    };
    var ajax = new ajaxConfig(configuracoesAjax);

    // Banco de dados local
    // base de dados retornados do servidor
    var ingredientesDto;

    // Busca dados do banco de dados
    ajax.ajaxAsync(
        "ingrediente",
        METHOD.LIST,
        undefined,
        undefined,
        function (data) {
            ingredientesDto = data;
            inicializarViewModelKnockout(ajax, ingredientesDto);
        }
    );
};


// ///////////////////////////////////////////////////
// inicializarViewModelKnockoutKnockout //////////////////////////////
// ---------------------------------------------------
// cria o view model e aplica no knockout
// ---------------------------------------------------
// ///////////////////////////////////////////////////
var inicializarViewModelKnockout = function(configuradorAjax, ingredientesDto) {
// inicializa o viewModel
    var pizzasViewModel = new MainViewModel(configuradorAjax, ingredientesDto);

// This makes Knockout get to work
    ko.applyBindings(pizzasViewModel);
};


// //////////////////////////////////////////////////////////////////////////////
//  MAIN :: VIEWMODEL
//  Define os itens que serão observáveis, ou seja, sicronizados via MVVM
//  
//  esta classe depende das seguintes variáveis 'globais':
//  - ingredientesDto;
// //////////////////////////////////////////////////////////////////////////////
var MainViewModel = function(configuradorAjax, ingredientesDto) {
    var self = this;

// inicializa o configurador de controlers
//todo: passar configuração via objeto para ficar mais claro

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

// Controller ingredienteVm
    configControllerKnockout.viewMoldel = self.ingredienteVm = { };
    configControllerKnockout.nomeController = "ingrediente";
    configControllerKnockout.dadosDto = ingredientesDto;
    configControllerKnockout.ClasseViewModel = IngredienteVM;
    configControllerKnockout.configuradorAjax = configuradorAjax;
    new ControllerKnockout(configControllerKnockout);
};
