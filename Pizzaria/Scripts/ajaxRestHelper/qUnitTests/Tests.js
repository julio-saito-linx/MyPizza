/// <reference path="../../jquery-1.7.1.js" />
/// <reference path="../../knockout.debug.js" />
/// <reference path="../../underscore/underscore-min.js" />
/// <reference path="qunit.js" />
/// <reference path="jsmockito-1.0.4.js" />
/// <reference path="jshamcrest-0.5.2.js" />
/// <reference path="../ajaxRest.js" />
/// <reference path="../ControllerKnockout.js" />
/// <reference path="../LocalViewModels.js" />

JsHamcrest.Integration.QUnit();
JsMockito.Integration.QUnit();

var inicializarViewModel = function () {
    // Inicializa o ViewModel
    var vmKO;
    var pizzaDto = [{ "Id": 1, "Ingredientes": [{ "Id": 3, "Nome": "Molho de Tomate" }, { "Id": 4, "Nome": "Ovo"}], "Nome": "Portuguesa" }, { "Id": 2, "Ingredientes": [{ "Id": 3, "Nome": "Molho de Tomate" }, { "Id": 1, "Nome": "Cebola" }, { "Id": 5, "Nome": "Calabresa"}], "Nome": "Calabresa" }, { "Id": 3, "Ingredientes": [{ "Id": 3, "Nome": "Molho de Tomate" }, { "Id": 2, "Nome": "Mu�arela"}], "Nome": "Mu�arela" }, { "Id": 4, "Ingredientes": [], "Nome": "Pizza de vento"}];
    var controller = inicializarControllerKnockout({
        viewMoldel: vmKO = {},
        nomeController: "pizza",
        dadosDto: pizzaDto,
        ClasseViewModel: PizzaVM
    });

    return controller;
};

$(document).ready(function () {
    // verifica se o viewModel ganhou as propriedades
    test("01.inicializarControllerKnockout coloca novas variaveis no viewModel", function () {
        var vmKO = inicializarViewModel().VmKO;
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
        var vmKO = inicializarViewModel().VmKO;
        equal(vmKO.lista().length, 4, "vmKO.lista().length");
        equal(vmKO.lista()[0].Nome(), "Portuguesa", "vmKO.lista()[0].Nome()");
        equal(vmKO.lista()[0].Id(), 1, "vmKO.lista()[0].Id()");

        //inicia com o primeiro selecionado
        var pizzaPortuguesa = vmKO.lista()[0];
        equal(pizzaPortuguesa.Id(), vmKO.selecionado().Id(), "pizzaPortuguesa.Id() === vmKO.id()()");
    });
    test("02.vmKO.lista :: chama ajax se lista nao estiver preenchida", function () {
        var controller = inicializarControllerKnockout({
            viewMoldel: vmKO = {},
            nomeController: "pizza",
            ClasseViewModel: PizzaVM
        });

        vmKO.ajax_done = function () {
            equal(false, vmKO.atualizando(),
                "vmKO.ajax_done :: vmKO.atualizando() === false");
        };
    });
    test("03.vmKO.selecionar :: muda o item selecionado", function () {
        var vmKO = inicializarViewModel().VmKO;

        var pizzaCalabresa = vmKO.lista()[1];
        vmKO.selecionar(pizzaCalabresa);

        equal(pizzaCalabresa.Id(), vmKO.selecionado().Id(), "pizzaPortuguesa.Id() === vmKO.id()()");
    });
    test("04.vmKO.foiAlterado :: detecta mudancas na estrutura do objeto", function () {
        var vmKO = inicializarViewModel().VmKO;

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
        var vmKO = inicializarViewModel().VmKO;

        var quantidadeInicial = vmKO.lista().length;

        // inclui novo item
        // e seleciona-o
        vmKO.novo();

        equal(vmKO.lista().length, quantidadeInicial + 1,
            "inclui novo item na lista");

        equal(0, vmKO.selecionado().Id(),
            "seleciona o item novo logo de cara");
    });
    test("06.1.ajaxRest atribui settings corretamente", function () {
        var options = {
            nomeController: "pizza1",
            metodo: METHOD.LIST,
            id: 1,
            dados: { "Id": 1, "Nome": "Portuguesa 2", "Ingredientes": [{ "Id": 3, "Nome": "Molho de Tomate" }, { "Id": 4, "Nome": "Ovo"}] },
            callback_done: { objeto: 1 },
            callback_error: { objeto: 2 },
            assincrono: false
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
    test("06.2.ajaxRest atribui settings padroes corretamente", function () {
        var options = {
            nomeController: "pizza2"
        };

        var ajax_config = new ajaxRest(options);

        equal(ajax_config.settings.nomeController, options.nomeController, "nomeController");
        equal(ajax_config.settings.metodo, METHOD.LIST, "metodo");
        equal(ajax_config.settings.id, undefined, "id");
        equal(ajax_config.settings.dados, undefined, "dados");
        equal(ajax_config.settings.callback_done, undefined, "callback_done ");
        equal(ajax_config.settings.callback_error, undefined, "callback_error");
        equal(ajax_config.settings.assincrono, true, "assincrono");
    });
    test("07.1.vmKO.salvar :: salvar OK", function () {
        // inicializa o VM
        var controller = inicializarViewModel();
        controller.nomeController = "simular_sucesso";
        var vmKO = controller.VmKO;

        // altera a primeira pizza
        var itemAtual = vmKO.selecionado;
        itemAtual().Nome("Portuguesa 2");

        vmKO.ajax_done = function () {
            equal(false, vmKO.atualizando(),
                "vmKO.ajax_done :: vmKO.atualizando() === false");
        };

        vmKO.salvar();

    });
    test("07.2.vmKO.salvar :: salvar ERRO", function () {
        // inicializa o VM
        var controller = inicializarViewModel();
        controller.nomeController = "simular_erro";
        var vmKO = controller.VmKO;

        // altera a primeira pizza
        var itemAtual = vmKO.selecionado;
        itemAtual().Nome("Portuguesa 2");

        vmKO.ajax_error = function () {
            equal(false, vmKO.atualizando(),
                "vmKO.ajax_error :: vmKO.atualizando() === false");
        };

        vmKO.salvar();
    });

    test("08.1.vmKO.excluir :: excluir OK", function () {
        // inicializa o VM
        var controller = inicializarViewModel();
        controller.nomeController = "simular_sucesso";
        var vmKO = controller.VmKO;

        var quantidadeInicialItens = vmKO.lista().length;

        vmKO.ajax_done = function () {
            equal(false, vmKO.atualizando(),
                "vmKO.ajax_done :: vmKO.atualizando() === false");
        };

        vmKO.excluir();

        equal(vmKO.lista().length, quantidadeInicialItens - 1,
        "deve retirar um item da lista");

    });
    test("08.2.vmKO.excluir :: excluir ERRO", function () {
        // inicializa o VM
        var controller = inicializarViewModel();
        controller.nomeController = "simular_erro";
        var vmKO = controller.VmKO;

        var quantidadeInicialItens = vmKO.lista().length;

        vmKO.ajax_error = function () {
            equal(false, vmKO.atualizando(),
                "vmKO.ajax_error :: vmKO.atualizando() === false");
        };

        vmKO.excluir();

        equal(vmKO.lista().length, quantidadeInicialItens,
        "não deve alterar a quantidade pois deu erro");
    });

});