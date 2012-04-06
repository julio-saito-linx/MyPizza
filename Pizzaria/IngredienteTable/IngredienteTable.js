/// <reference path="~/Scripts/knockout.debug.js" />
/// <reference path="~/Scripts/underscore/underscore-min.js" />
/// <reference path="~/Scripts/jquery-1.7.1.js" />
/// <reference path="~/Scripts/helpers.js" />
/// <reference path="~/Scripts/ajaxRestHelper/RepositorioAjax.js" />
/// <reference path="~/Scripts/ajaxRestHelper/ajaxRest.js" />
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

    // "Banco de dados local"
    var ingredientesDto;

    // Busca dados do banco de dados
    chamarAjax({
        controller: "ingrediente",
        callback_done: function(data) {
            ingredientesDto = data;
            inicializarViewModelKnockout(ingredientesDto);
        },
        assincrono: true
    });
};


// ///////////////////////////////////////////////////
// inicializarViewModelKnockoutKnockout //////////////////////////////
// ---------------------------------------------------
// cria o view model e aplica no knockout
// ---------------------------------------------------
// ///////////////////////////////////////////////////
var inicializarViewModelKnockout = function(ingredientesDto) {
// inicializa o viewModel
    var pizzasViewModel = new MainViewModel(ingredientesDto);

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
var MainViewModel = function(ingredientesDto) {
    var self = this;

// inicializa o configurador de controlers

//  vmKO.lista
//  vmKO.selecionar
//  vmKO.id
//  vmKO.selecionado
//  vmKO.foiAlterado
//  vmKO.excluir
//  vmKO.novo
//  vmKO.salvar
//  vmKO.atualizando

//todo: Utilizar padrão do Test. Chamar com objeto.
// Controller ingredienteVm
    var controllerIngrediente = new inicializarControllerKnockout({
        viewMoldel: self.ingredienteVm = { },
        nomeController: "ingrediente",
        dadosDto: ingredientesDto,
        ClasseViewModel: IngredienteVM
    });
};
