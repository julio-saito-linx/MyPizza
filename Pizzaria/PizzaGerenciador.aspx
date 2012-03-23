<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="PizzaGerenciador.aspx.cs"
    Inherits="Pizzaria.PizzaGerenciador" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Pizza Gerenciador</title>
    <link href="PizzaGerenciador.css" rel="stylesheet" type="text/css" />
</head>

<body>
    <div id="divPizzas" data-bind="foreach: Pizzas">
        <div id="divPizza">
            <span data-bind="text: Id"></span> - <span data-bind="text: Nome"></span>
            <div id="divIngredientes" data-bind="foreach: Ingredientes">
                <div style="display: block">
                    <span data-bind="text: Id"></span> - <span data-bind="text: Nome"></span>
                </div>
            </div>
        </div>
    </div>
</body>

<script src="Scripts/jquery-1.6.4.min.js" type="text/javascript"> </script>
<script src="Scripts/json2.js" type="text/javascript"> </script>
<script src="needim-noty-2481627/js/jquery.noty.js" type="text/javascript"> </script>
<script src="Scripts/underscore/underscore-min.js" type="text/javascript"> </script>
<script src="Scripts/knockout.js" type="text/javascript"></script>
<script src="PizzaGerenciador.js" type="text/javascript"></script>
</html>
