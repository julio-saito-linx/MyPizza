/// <reference path="~/Scripts/knockout.debug.js" />
/// <reference path="~/Scripts/underscore/underscore-min.js" />
/// <reference path="~/Scripts/jquery-1.7.1.js" />
/// <reference path="~/Scripts/helpers.js" />
/// <reference path="~/Scripts/ajaxRestHelper/RepositorioAjax.js" />
/// <reference path="~/Scripts/ajaxRestHelper/ajaxRest.js" />
/// <reference path="~/Scripts/ajaxRestHelper/ControllerKnockout.js" />
/// <reference path="~/Scripts/ajaxRestHelper/LocalViewModels.js" />



// //////////////////////////////////////////////////////////////////////////////
//  MAIN :: VIEWMODEL
//  Define os itens que serão observáveis, ou seja, sicronizados via M,V,VM
//  controller.VmKO:
//   - lista, selecionar, id, selecionado, foiAlterado, excluir, novo, salvar, atualizando
// //////////////////////////////////////////////////////////////////////////////
var MainViewModel = function (ingredientesDto) {
	var self = this;
	var controllerIngrediente = new inicializarControllerKnockout({
		viewMoldel: self.ingredienteVm = {},
		nomeController: "ingrediente",
		dadosDto: ingredientesDto,
		ClasseViewModel: IngredienteVM
	});

    // Em caso de erro no ajax, exibe noty
    self.ingredienteVm.ajax_error = function (jqXHR) {
        exibirNotyErro(tratarErrorCSharp(jqXHR));
    };
}

// //////////////////////////////////////////////////////////////////////////////
//  READY: Inicializa o knockout
// //////////////////////////////////////////////////////////////////////////////
$().ready(function() {
    ko.applyBindings(new MainViewModel()); // This makes Knockout get to work
});

