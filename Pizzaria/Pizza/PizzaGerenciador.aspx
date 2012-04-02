<%@ Page Language="C#" AutoEventWireup="true" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head runat="server">
        <title>Pizza Gerenciador</title>
        <link href="PizzaGerenciador.css" rel="stylesheet" type="text/css" />
        <link href="../needim-noty-2481627/css/jquery.noty.css" rel="stylesheet" type="text/css" />
    </head>
    <body>
        <%--Todas as pizzas--%>
        <div class="bloco">
            <div class="subTitulo">
                Lista de Pizzas
                <div id="divImagemAjax">&nbsp;
                    <img data-bind="visible : pizzaVm.atualizando" src="../IMG/main_black.gif" />
                </div>
            </div>
            <div id="divPizzas" data-bind="foreach: pizzaVm.lista">
                <div id="divPizza" class="pizzaEstilo" data-bind="
                    css: {pizzaSelecionada : Id === $root.pizzaVm.id() },
                    click: $root.pizzaVm.selecionar">
                    <span data-bind="text: Id"></span>- <span data-bind="text: Nome"></span>
                    <div id="divIngredientes" data-bind="foreach: Ingredientes">
                        <div style="display: block">
                            <span data-bind="text: Id"></span>- <span data-bind="text: Nome"></span>
                        </div>
                    </div>
                </div>
            </div>
            <button data-bind="click : pizzaVm.novo">Nova</button>
            <button data-bind="click : pizzaVm.excluir">Excluir</button>
            <button data-bind="click : pizzaVm.salvar">Salvar</button>
        </div>
        <%--Pizza selecionada--%>
        <div class="bloco">
            <div class="subTitulo">
                Detalhe
            </div>
            <div id="divDetalhe" data-bind="with: pizzaVm.selecionado">
                <%--
                Aqui dentro o contexto muda para pizzaVm.selecionado.
                --%>
                <span>Pizza.Nome:</span>
                <br />
                <div class="dado">
                    <input id="txtPizzaNome" data-bind="value: Nome"></input></div>
                <div id="divIngredientesDetalhe">
                    <br />
                    <span>Pizza.Ingredientes:</span>
                    <br />
                    <select multiple="multiple" height="5" data-bind="
                        options:Ingredientes, 
                        optionsText:'Nome', 
                        selectedOptions:$root.pizzaVm.ingredientesToRemove">
                    </select>
                    <div>
                        <button data-bind="
                        click: $root.pizzaVm.removerIngredientes, 
                        enable: $root.pizzaVm.ingredientesToRemove().length > 0">
                            remover</button>
                    </div>
                    <form data-bind="submit:$root.pizzaVm.incluirIngredientesPizza">
                        <br />
                        <span>Ingredientes disponíveis:</span>
                        <br />
                        <div class="dado">
                            <select multiple="multiple" height="5" data-bind="
                            options: $root.pizzaVm.ingredientesAindaNaoInseridos,
                            optionsText: 'Nome',
                            selectedOptions: $root.pizzaVm.ingredientesToAdd,
                            enable: $root.pizzaVm.ingredientesAindaNaoInseridos().length > 0">
                            </select>
                        </div>
                        <div>
                            <button type="submit" data-bind="enable: $root.pizzaVm.ingredientesToAdd().length > 0">
                                adicionar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <button data-bind="click : exibirDebug">debug</button>

        <div class="bloco">
            <div class="subTitulo">
                Ingredientes
            </div>
            <div id="divIngredientesEditor">
                <span>Ingredientes:</span>
                <div class="dado">
                    <div id="listaIngrediente" data-bind="foreach : ingredienteVm.lista">
                        <div data-bind="css: {pizzaSelecionada: Id() === $root.ingredienteVm.id() }">
                            <div id="itemIngredienteId" data-bind="text : Id, click : $root.ingredienteVm.selecionar"></div>
                            <div id="itemIngredienteNome" data-bind="text : Nome, click : $root.ingredienteVm.selecionar"></div>
                        </div>
                    </div>
                </div>
                <span>Ingrediente.Nome:</span>
                <br />
                <div class="dado">
                    <span data-bind="text: ingredienteVm.id()"></span>
                    <input id="txtIngredienteNome" data-bind="value: ingredienteVm.selecionado().Nome"></input>
                </div>
            </div>
            <button data-bind="click: ingredienteVm.novo">
                novo
            </button>
            <button data-bind="click: ingredienteVm.salvar">
                salvar
            </button>
            <button data-bind="click: ingredienteVm.excluir">
                deletar
            </button>
        </div>

        <div id="divDebug">
            <h3>
                debug</h3>
            <div class="itemDebug">
                <pre data-bind="text: JSON.stringify(ko.toJS($data), null, 2)" id="preDebug"></pre>
            </div>
        </div>
    </body>
    <script src="../Scripts/jquery-1.7.1.min.js" type="text/javascript"> </script>
    <script src="../Scripts/json2.js" type="text/javascript"> </script>
    <script src="../needim-noty-2481627/js/jquery.noty.js" type="text/javascript"> </script>
    <script src="../Scripts/underscore/underscore-min.js" type="text/javascript"> </script>
    <script src="../Scripts/knockout.debug.js" type="text/javascript"> </script>
    <script src="../Scripts/helpers.js" type="text/javascript"> </script>
    <script src="../Scripts/ajaxRestHelper/ajaxConfig.js" type="text/javascript"> </script>
    <script src="../Scripts/ajaxRestHelper/ControllerKnockout.js" type="text/javascript"></script>
    <script src="../Scripts/ajaxRestHelper/LocalViewModels.js" type="text/javascript"></script>
    <script src="PizzaGerenciador.js" type="text/javascript"> </script>
</html>