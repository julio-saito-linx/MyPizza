$(document).ready(function () {
    test("1.ControllerKnockout coloca novas variaveis no viewModel", function () {

        var ingredientesDto = [];
        var configuradorAjax = { };
        configControllerKnockout.viewMoldel = self.ingredienteVm = {};
        configControllerKnockout.nomeController = "ingrediente";
        configControllerKnockout.dadosDto = ingredientesDto;
        configControllerKnockout.ClasseViewModel = IngredienteVM;
        configControllerKnockout.configuradorAjax = configuradorAjax;
        var cont = new ControllerKnockout(configControllerKnockout);
        equal();
    });
});