<%@ Page Title="Home Page" Language="C#" MasterPageFile="~/Site.master" AutoEventWireup="true"
         CodeBehind="Default.aspx.cs" Inherits="Pizzaria._Default" ViewStateMode="Disabled"
         ClientIDMode="Static" %>

<asp:Content ID="HeaderContent" runat="server" ContentPlaceHolderID="HeadContent">
</asp:Content>
<asp:Content ID="BodyContent" runat="server" ContentPlaceHolderID="MainContent"> 
    
    <div id="PizzaPanel" 
    style="padding: 10px; background-color:White; border-color:Red; border-style:dashed;">
        <p>
        <b>Nome da Pizza:</b>
        <br />
        <input type="hidden" ID="txtId" value="0"/>
        <asp:TextBox ID="txtNome" runat="server"></asp:TextBox>
        </p>
        <p>Ingredientes:</p>
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
    
    <b>Consulta:</b>
        <asp:TextBox ID="txtConsulta" runat="server"></asp:TextBox>
    &nbsp;<input id="btConsulta" type="button" value="Buscar" />
    &nbsp;<input id="btPizzaAdd" type="button" value="+Pizza" />
    <div id="pizzaview" class="yui3-skin-sam dt-example">
    </div>

    <b>Garcom:</b>
        <asp:TextBox ID="txtGarcom" runat="server"></asp:TextBox>
    <asp:DropDownList ID="ddlPeriodo" runat="server" DataValueField="Id" DataTextField="Nome">
        </asp:DropDownList>
    <br/>
    <input id="btGarcom" type="button" value="Gravar" /> 
    <div id="garcomview" class="yui3-skin-sam dt-example"></div>
    
    <script src="Scripts/jquery-1.6.4.min.js" type="text/javascript"> </script> 

    <script src="http://yui.yahooapis.com/3.4.1/build/yui/yui-min.js"></script>     
    <link rel="stylesheet" href="http://yui.yahooapis.com/3.4.1/build/cssgrids/grids-min.css"> 
    
    <script src="needim-noty-2481627/js/jquery.noty.js" type="text/javascript"></script>
    <link href="needim-noty-2481627/css/jquery.noty.css" rel="stylesheet" type="text/css" />
        
    <script src="AJAX/Default.js" type="text/javascript"></script>

    </asp:Content>