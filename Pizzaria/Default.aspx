<%@ Page Title="Home Page" Language="C#" MasterPageFile="~/Site.master" AutoEventWireup="true"
    CodeBehind="Default.aspx.cs" Inherits="Pizzaria._Default" ViewStateMode="Disabled" ClientIDMode="Static" %>

<asp:Content ID="HeaderContent" runat="server" ContentPlaceHolderID="HeadContent">
    <link rel="stylesheet" href="http://yui.yahooapis.com/3.4.1/build/cssgrids/grids-min.css">
    <link href="needim-noty-2481627/css/jquery.noty.css" rel="stylesheet" type="text/css" />
</asp:Content>
<asp:Content runat="server" ContentPlaceHolderID="JavascriptAqui">
    <script src="AJAX/Default.js" type="text/javascript"> </script>
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
                <p>
                    <p>
                        <b>Detalhe da Pizza:</b></p>
                    <input type="hidden" id="txtId" value="0" />
                    <asp:TextBox ID="txtNome" runat="server"></asp:TextBox>
                </p>
                <p>
                    Ingredientes:</p>
                <p>
                    <asp:TextBox ID="txtIngrediente1" runat="server"></asp:TextBox></p>
                <p>
                    <asp:TextBox ID="txtIngrediente2" runat="server"></asp:TextBox></p>
                <p>
                    <asp:TextBox ID="txtIngrediente3" runat="server"></asp:TextBox></p>
                <div>
                    <input id="btIncluir" type="button" value="Salvar AJAX" />
                    <input id="btExcluir" type="button" value="Excluir AJAX" />
                </div>
            </div>
    </div>
</asp:Content>
