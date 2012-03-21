<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="Ingrediente_Editar.aspx.cs" Inherits="Pizzaria.Ingrediente_Editar"%>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    Id: <asp:Literal runat="server" ID="litId"></asp:Literal>
    <br/>
    Ingrediente: <asp:TextBox runat="server" ID="txtIngrediente"></asp:TextBox>
    <br/>
    <br/>
    <input type="submit" value="salvar"/>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="JavascriptAqui" runat="server">
</asp:Content>