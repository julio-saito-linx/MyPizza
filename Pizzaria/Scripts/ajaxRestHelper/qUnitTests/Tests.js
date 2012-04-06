/// <reference path="../../jquery-1.7.1.js" />
/// <reference path="../../knockout.debug.js" />
/// <reference path="../../underscore/underscore-min.js" />
/// <reference path="qunit.js" />
/// <reference path="jsmockito-1.0.4.js" />
/// <reference path="jshamcrest-0.5.2.js" />
/// <reference path="../ajaxRest.js" />
/// <reference path="../ControllerKnockout.js" />
/// <reference path="../LocalViewModels.js" />

var vmKO;
JsHamcrest.Integration.QUnit();
JsMockito.Integration.QUnit();

var inicializarViewModel = function () {
    // Inicializa o ViewModel
    var pizzaDto = [{ "Id": 1, "Ingredientes": [{ "Id": 3, "Nome": "Molho de Tomate" }, { "Id": 4, "Nome": "Ovo"}], "Nome": "Portuguesa" }, { "Id": 2, "Ingredientes": [{ "Id": 3, "Nome": "Molho de Tomate" }, { "Id": 1, "Nome": "Cebola" }, { "Id": 5, "Nome": "Calabresa"}], "Nome": "Calabresa" }, { "Id": 3, "Ingredientes": [{ "Id": 3, "Nome": "Molho de Tomate" }, { "Id": 2, "Nome": "Mu�arela"}], "Nome": "Mu�arela" }, { "Id": 4, "Ingredientes": [], "Nome": "Pizza de vento"}];

    return inicializarControllerKnockout({
        viewMoldel: vmKO = {},
        nomeController: "pizza",
        dadosDto: pizzaDto,
        ClasseViewModel: PizzaVM
    });

    //ko.applyBindings(vmKO);
};

$(document).ready(function () {
    // verifica se o viewModel ganhou as propriedades
    test("01.inicializarControllerKnockout coloca novas variaveis no viewModel", function () {
        inicializarViewModel();
        equal(!_.isUndefined(vmKO.lista), true, "vmKO.lista");
        equal(!_.isUndefined(vmKO.selecionar), true, "vmKO.selecionar");
        equal(!_.isUndefined(vmKO.selecionado), true, "vmKO.selecionado");
        equal(!_.isUndefined(vmKO.foiAlterado), true, "vmKO.foiAlterado");
        equal(!_.isUndefined(vmKO.excluir), true, "vmKO.excluir");
        equal(!_.isUndefined(vmKO.novo), true, "vmKO.novo");
        equal(!_.isUndefined(vmKO.salvar), true, "vmKO.salvar");
        equal(!_.isUndefined(vmKO.atualizando), true, "vmKO.atualizando");
    });
    test("02.vmKO.lista :: deve possuir 4 pizzas, carregadas corretamente", function () {
        inicializarViewModel();
        equal(vmKO.lista().length, 4, "vmKO.lista().length");
        equal(vmKO.lista()[0].Nome(), "Portuguesa", "vmKO.lista()[0].Nome()");
        equal(vmKO.lista()[0].Id(), 1, "vmKO.lista()[0].Id()");

        //inicia com o primeiro selecionado
        var pizzaPortuguesa = vmKO.lista()[0];
        equal(pizzaPortuguesa.Id(), vmKO.selecionado().Id(), "pizzaPortuguesa.Id() === vmKO.id()()");
    });
    test("03.vmKO.selecionar :: muda o item selecionado", function () {
        inicializarViewModel();

        var pizzaCalabresa = vmKO.lista()[1];
        vmKO.selecionar(pizzaCalabresa);

        equal(pizzaCalabresa.Id(), vmKO.selecionado().Id(), "pizzaPortuguesa.Id() === vmKO.id()()");
    });
    test("04.vmKO.foiAlterado :: detecta mudancas na estrutura do objeto", function () {
        inicializarViewModel();

        // seleciona a primeira pizza
        var pizzaCalabresa = vmKO.lista()[1];
        vmKO.selecionar(pizzaCalabresa);
        // verifica se foi alterada
        equal(false, vmKO.foiAlterado(), "ainda nao alterado");

        // altera dados da pizza
        pizzaCalabresa.Nome("Calabresa 2");

        // verifica se foi alterada
        equal(true, vmKO.foiAlterado(), "foi alterado");
    });
    test("05.vmKO.novo :: inclui novo item na lista", function () {
        inicializarViewModel();

        equal(vmKO.lista().length, 4, "vmKO.lista().length === 4");

        // inclui novo item
        // e seleciona-o
        vmKO.novo();

        equal(vmKO.lista().length, 5, "vmKO.lista().length === 5");
        equal(0, vmKO.selecionado().Id(), "id deve ser zerado");
    });
    test("06.ajaxRest atribui settings corretamente", function () {
        var options = {
            nomeController: "pizza1",
            metodo: METHOD.LIST,
            id: 1,
            dados: { "Id": 1, "Nome": "Portuguesa 2", "Ingredientes": [{ "Id": 3, "Nome": "Molho de Tomate" }, { "Id": 4, "Nome": "Ovo"}] },
            callback_done: undefined,
            callback_error: undefined,
            assincrono: true
        };

        var ajax_config = new ajaxRest(options);

        equal(ajax_config.settings.nomeController, options.nomeController, "nomeController");
        equal(ajax_config.settings.metodo, options.metodo, "metodo");
        equal(ajax_config.settings.id, options.id, "id");
        equal(ajax_config.settings.dados, options.dados, "dados");
        equal(ajax_config.settings.callback_done, options.callback_done, "callback_done ");
        equal(ajax_config.settings.callback_error, options.callback_error, "callback_error");
        equal(ajax_config.settings.assincrono, options.assincrono, "assincrono");
    });
    test("07.1.vmKO.salvar :: salvar OK", function () {
        // inicializa o VM
        var controller = inicializarViewModel();
        controller.simularResposta = "sucesso";

        // altera a primeira pizza
        var itemAtual = vmKO.selecionado;
        itemAtual().Nome("Portuguesa 2");

        vmKO.ajax_done = function () {
            equal(false, vmKO.atualizando(), "vmKO.ajax_done :: vmKO.atualizando() === false");
        };

        vmKO.salvar();

    });
    test("07.2.vmKO.salvar :: salvar ERRO", function () {
        // inicializa o VM
        var controller = inicializarViewModel();
        controller.simularResposta = "erro";

        // altera a primeira pizza
        var itemAtual = vmKO.selecionado;
        itemAtual().Nome("Portuguesa 2");

        vmKO.ajax_error = function () {
            equal(false, vmKO.atualizando(), "vmKO.ajax_error :: vmKO.atualizando() === false");
        };

        vmKO.salvar();
    });
});