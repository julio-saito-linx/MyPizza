<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true" CodeBehind="CriarDados.aspx.cs" Inherits="Pizzaria.CriarDados" %>
<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <asp:Button ID="btCriarDB" runat="server" Text="Criar DB" 
        onclick="btCriarDB_Click" />
</asp:Content>
