var vmKO;
var inicializarViewModel = function () {
    // Inicializa o ViewModel
    var pizzaDto = [{ "Id": 1, "Ingredientes": [{ "Id": 3, "Nome": "Molho de Tomate" }, { "Id": 4, "Nome": "Ovo"}], "Nome": "Portuguesa" }, { "Id": 2, "Ingredientes": [{ "Id": 3, "Nome": "Molho de Tomate" }, { "Id": 1, "Nome": "Cebola" }, { "Id": 5, "Nome": "Calabresa"}], "Nome": "Calabresa" }, { "Id": 3, "Ingredientes": [{ "Id": 3, "Nome": "Molho de Tomate" }, { "Id": 2, "Nome": "Muçarela"}], "Nome": "Muçarela" }, { "Id": 4, "Ingredientes": [], "Nome": "Pizza de vento"}];
    var configuradorAjax = {};

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
});