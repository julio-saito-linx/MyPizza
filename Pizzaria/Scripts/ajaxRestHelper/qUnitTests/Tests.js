var vmKO;

var inicializarViewModel = function (configuradorAjax) {

    if (_.isUndefined(configuradorAjax)) {
        configuradorAjax = { };
    }

    // Inicializa o ViewModel
    var pizzaDto = [{ "Id": 1, "Ingredientes": [{ "Id": 3, "Nome": "Molho de Tomate" }, { "Id": 4, "Nome": "Ovo"}], "Nome": "Portuguesa" }, { "Id": 2, "Ingredientes": [{ "Id": 3, "Nome": "Molho de Tomate" }, { "Id": 1, "Nome": "Cebola" }, { "Id": 5, "Nome": "Calabresa"}], "Nome": "Calabresa" }, { "Id": 3, "Ingredientes": [{ "Id": 3, "Nome": "Molho de Tomate" }, { "Id": 2, "Nome": "Muçarela"}], "Nome": "Muçarela" }, { "Id": 4, "Ingredientes": [], "Nome": "Pizza de vento"}];
    configControllerKnockout.viewMoldel = vmKO = {};
    configControllerKnockout.nomeController = "ingrediente";
    configControllerKnockout.dadosDto = pizzaDto;
    configControllerKnockout.ClasseViewModel = PizzaVM;
    configControllerKnockout.configuradorAjax = configuradorAjax;
    new ControllerKnockout(configControllerKnockout);
    ko.applyBindings(vmKO);
};

$(document).ready(function () {
    // verifica se o viewModel ganhou as propriedades
    test("01.ControllerKnockout coloca novas variaveis no viewModel", function () {
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
    test("04.vmKO.novo :: inclui novo item na lista", function () {
        inicializarViewModel();

        equal(vmKO.lista().length, 4, "vmKO.lista().length === 4");

        // inclui novo item
        // e seleciona-o
        vmKO.novo();

        equal(vmKO.lista().length, 5, "vmKO.lista().length === 5");
        equal(0, vmKO.selecionado().Id(), "id deve ser zerado");
    });
    test("05.vmKO.salvar :: salva no banco de dados via jQuery Ajax", function () {
        // mocka a dependencia de chamada do ajax
        var confAjax = { };
        confAjax.ajaxAsync = function (nomeController, metodo, id, dados, callback_done, callback_error) {
            equal(nomeController, "pizz a");
            equal(metodo, METHOD.PUT);
            equal(id, 1);
            equal(dados, '{ "Id": 1, "Ingredientes": [{ "Id": 3, "Nome": "Molho de Tomate" }, { "Id": 4, "Nome": "Ovo"}], "Nome": "Portuguesa 2" }');
            equal(callback_done, undefined);
            equal(callback_error, undefined);
        };

        // inicializa o VM
        inicializarViewModel(confAjax);

        var itemAtual = vmKO.selecionado;
        itemAtual().Nome("Portuguesa 2");


        vmKO.salvar();
    });
});