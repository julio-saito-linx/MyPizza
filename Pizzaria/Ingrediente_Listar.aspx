<%@ Page Title="" Language="C#" MasterPageFile="~/Site.Master" AutoEventWireup="true"
    CodeBehind="Ingrediente_Listar.aspx.cs" Inherits="Pizzaria.Ingrediente_Listar" %>

<asp:Content ID="Content1" ContentPlaceHolderID="HeadContent" runat="server">
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="MainContent" runat="server">
    <a href="Ingrediente_Editar.aspx">Incluir novo</a>
    <br />
    <br />
    <ul>
        <asp:Repeater runat="server" ID="RepeaterIngredientes">
            <ItemTemplate>
                <li><a href="Ingrediente_Editar.aspx?id=<%#DataBinder.Eval(Container.DataItem, "id")%>">
                    [<%#DataBinder.Eval(Container.DataItem, "Id")%>]
                    
                    <%#DataBinder.Eval(Container.DataItem, "Nome")%>
                </a></li>
            </ItemTemplate>
        </asp:Repeater>
    </ul>
    <asp:GridView ID="GridViewIngredientes" runat="server">
    </asp:GridView>
</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="JavascriptAqui" runat="server">
</asp:Content>
