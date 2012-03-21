<%@ Page Title="Home Page" Language="C#" MasterPageFile="~/Site.master" AutoEventWireup="true"
    CodeBehind="Default.aspx.cs" Inherits="Pizzaria._Default" ViewStateMode="Disabled" %>

<asp:Content ID="HeaderContent" runat="server" ContentPlaceHolderID="HeadContent">
    <link rel="stylesheet" href="http://yui.yahooapis.com/3.4.1/build/cssgrids/grids-min.css">
    <link href="needim-noty-2481627/css/jquery.noty.css" rel="stylesheet" type="text/css" />
</asp:Content>
<asp:Content runat="server" ContentPlaceHolderID="JavascriptAqui">
    <script src="Default.js" type="text/javascript"> </script>
</asp:Content>
<asp:Content ID="BodyContent" runat="server" ContentPlaceHolderID="MainContent">
    <div style="width: 980px">
        <div style="float: left; width: 460px">
            <b>Consulta:</b>
            <asp:TextBox ID="txtConsulta" runat="server"></asp:TextBox>
            &nbsp;<input id="btConsulta" type="button" value="Buscar" />
            &nbsp;<input id="btPizzaAdd" type="button" value="+Pizza" />
            <div id="pizzaview" class="yui3-skin-sam dt-example">
            </div>
        </div>
        <div style="float: left; width: 460px">
            <b>Detalhe da Pizza:</b>
            <br />
            txtId :
            <input type="text" id="txtId" value="0" />
            <br />
            txtNome:
            <input type="text" id="txtNome" />
            <br />
            Ingredientes :
            <div id="divIngredientes">
            </div>
            <br />
            <br />
            <div>
                <input id="btIncluir" type="button" value="Salvar AJAX" />
                <input id="btExcluir" type="button" value="Excluir AJAX" />
            </div>
        </div>
    </div>
</asp:Content>
