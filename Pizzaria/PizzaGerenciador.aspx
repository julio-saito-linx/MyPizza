<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="PizzaGerenciador.aspx.cs"
         Inherits="Pizzaria.PizzaGerenciador" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head runat="server">
        <title>Pizza Gerenciador</title>
        <link href="PizzaGerenciador.css" rel="stylesheet" type="text/css" />
        <link href="needim-noty-2481627/css/jquery.noty.css" rel="stylesheet" type="text/css" />
    </head>
    <body>
        <div id="divPizzas" data-bind="foreach: Pizzas">
            <div id="divPizza" class="pizzaEstilo" data-bind="click: exibirDetalhe, 
               css: {pizzaSelecionada: Id === $root.pizzaIdSelecionada() },
               click: $root.selecionarPizza">
                <span data-bind="text: Id"></span>- <span data-bind="text: Nome"></span>
                <div id="divIngredientes" data-bind="foreach: Ingredientes">
                    <div style="display: block">
                        <span data-bind="text: Id"></span>- <span data-bind="text: Nome"></span>
                    </div>
                </div>
            </div>
        </div>
        <div id="divDetalhe" data-bind="with: pizzaSelecionada">
            <br />
            <br />
            <span>Nome da Pizza:</span>
            <br />
            <div class="dado">
                <input data-bind="value: Nome"></input></div>
            <div id="divIngredientesDetalhe">
                <br />
                <span>Ingrediente:</span>
                <br />
                <select multiple="multiple" height="5" data-bind="
                options:Ingredientes, 
                optionsText:'Nome', 
                selectedOptions:$root.ingredientesSelecionados">
                </select>
                <div>
                    <button data-bind="click: $root.removeSelected, enable: $root.ingredientesSelecionados().length > 0">
                        Remove</button>
                </div>
                <form data-bind="submit:$root.addIngrediente">
                    <br />
                    <span>Adicionar novo:</span>
                    <br />
                    <div class="dado">
                        <select data-bind=" options: $root.ingredientesAindaNaoInseridos, 
                                    optionsText: 'Nome', 
                                    value: $root.ingredienteToAdd,
                                    enable: $root.ingredientesAindaNaoInseridos().length > 0">
                    
                        </select>
                    </div>
                    <div>
                        <button type="submit" data-bind="enable: $root.ingredientesAindaNaoInseridos().length > 0">
                            adic.</button>
                    </div>
                </form>
            </div>
        </div>
        <div id="divDebug">
            <button id="buttonDebug">debug</button>
            <h3>debug</h3>
                JSON.stringify(ko.toJS($data), null, 2)
            <div class="itemDebug">
                <pre class="prettyprint" id="preDebug"></pre>
            </div>
        </div>
    </body>
    <link href="Scripts/prettify.css" rel="stylesheet" type="text/css" />
    <script src="Scripts/prettify.js" type="text/javascript"></script>
    <script src="Scripts/jquery-1.6.4.min.js" type="text/javascript"> </script>
    <script src="Scripts/json2.js" type="text/javascript"> </script>
    <script src="needim-noty-2481627/js/jquery.noty.js" type="text/javascript"> </script>
    <script src="Scripts/underscore/underscore-min.js" type="text/javascript"> </script>
    <script src="Scripts/knockout.js" type="text/javascript"> </script>
    <script src="Scripts/helpers.js" type="text/javascript"> </script>
    <script src="PizzaGerenciador.js" type="text/javascript"> </script>
</html>