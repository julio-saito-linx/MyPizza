<%@ Page Title="Home Page" Language="C#" MasterPageFile="~/Site.master" AutoEventWireup="true"
         CodeBehind="Default.aspx.cs" Inherits="Pizzaria._Default" ViewStateMode="Disabled"
         ClientIDMode="Static" %>

<asp:Content ID="HeaderContent" runat="server" ContentPlaceHolderID="HeadContent">
</asp:Content>
<asp:Content ID="BodyContent" runat="server" ContentPlaceHolderID="MainContent">
    <h2>Pizzaria!</h2>
    <p>
        <b>Nome da Pizza:</b>
        <br />
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
        <!--<asp:Button ID="btIncluir" runat="server" Text="Inclui com AJAX" />-->
        <input id="btIncluir" type="button" value="Inclui com AJAX" />
    </div>
    <div id="divResultado1">
    </div>
    <div id="divResultado2">
    </div>
    <p>
    <b>Consulta:</b>
        <asp:TextBox ID="txtConsulta" runat="server"></asp:TextBox>
    </p>
        <!--<asp:Button ID="btConsulta" runat="server" Text="Buscar" />-->
        <input id="btConsulta" type="button" value="Buscar" />

    <asp:GridView ID="GridView1" runat="server">
    </asp:GridView>
    
    <script src="Scripts/jquery-1.6.4.min.js" type="text/javascript"> </script>
    <script type="text/javascript">
        $("#btIncluir").click(function() {
            var dados = {
                Nome: $("#txtNome").val(),
                I1: $("#txtIngrediente1").val(),
                I2: $("#txtIngrediente2").val(),
                I3: $("#txtIngrediente3").val()
            };

            var request = $.ajax({
                    type: "POST",
                    url: "Default.aspx?new=1",
                    data: dados
                });

            request.done(function(data) {
                $("#divResultado1").html(data);
            });

            request.fail(function(jqXHR, textStatus) {
                alert("Request failed: " + textStatus);
            });
        });

        $("#btConsulta").click(function() {
            var dados = {
                Nome: $("#txtConsulta").val()
            };

            var request = $.ajax({
                    type: "POST",
                    url: "Default.aspx?sel=1",
                    data: dados
                });

            request.done(function(data) {
                $("#divResultado2").html(data);
            });

            request.fail(function(jqXHR, textStatus) {
                alert("Request failed: " + textStatus);
            });
        });
    </script>
</asp:Content>