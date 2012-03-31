<%@ Page Title="" Language="C#" AutoEventWireup="true" CodeBehind="AutoCriarBancoDados.aspx.cs" Inherits="Pizzaria.AutoCriarBancoDados" %>

    <style type="text/css">
        body {
            margin: 30px;
            font-family: Arial;
            font-size: 1.5em;
        }
        div {
            margin: 20px;
        }
        input {
            font-size: 0.9em;
            width: 360px;
        }
        button {
            font-size: 0.8em;
        }
    </style>

<form  method="post">
    <div>
        <label>Senha:</label>
        <input id="txtSenha" name="txtSenha" />
        <button type="submit">Enviar</button>
    </div>
</form>
<div>
    <asp:Literal id="litMensagem" runat="server" />
</div>
<div>
    <a href="Pizza/PizzaGerenciador.aspx">PizzaGerenciador</a>
</div>
