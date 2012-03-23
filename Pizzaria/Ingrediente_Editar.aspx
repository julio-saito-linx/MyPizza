<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Ingrediente_Editar.aspx.cs" Inherits="Pizzaria.Ingrediente_Editar"%>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    Id: <span id="spanId"><asp:Literal runat="server" ID="litId"></asp:Literal></span>
    <br/>
    Ingrediente: <asp:TextBox runat="server" ID="txtIngrediente"></asp:TextBox>
    <br/>
    <br/>
    <input type="submit" value="salvar"/>
    <input type="button" value="excluir" id="buttonExcluir"/>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="JavascriptAqui" runat="server">
    <script>
        $().ready(function () {
            $("#buttonExcluir").click(function () {
                document.location = "Ingrediente_Editar.aspx?id=" + $("#spanId").html() + "&excluir=1";
            });
        });
    </script>
</asp:Content>