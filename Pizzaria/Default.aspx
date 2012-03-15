<%@ Page Title="Home Page" Language="C#" MasterPageFile="~/Site.master" AutoEventWireup="true"
         CodeBehind="Default.aspx.cs" Inherits="Pizzaria._Default" ViewStateMode="Disabled"
         ClientIDMode="Static" %>

<asp:Content ID="HeaderContent" runat="server" ContentPlaceHolderID="HeadContent">
</asp:Content>
<asp:Content ID="BodyContent" runat="server" ContentPlaceHolderID="MainContent">
    <h2>Pizzaria!</h2>
    
    <script src="http://yui.yahooapis.com/3.4.1/build/yui/yui-min.js"></script>
    <link rel="stylesheet" href="http://yui.yahooapis.com/3.4.1/build/cssgrids/grids-min.css">
    <script type="text/javascript">
        //Panel
        YUI().use('datatable-base', 'panel', 'dd-plugin', function (Y) {
            panel = new Y.Panel({
                srcNode: '#PizzaPanel',
                headerContent: 'Adicionar nova pizza',
                width: 250,
                zIndex: 5,
                centered: true,
                modal: true,
                visible: false,
                render: true,
                plugins: [Y.Plugin.Drag]
            });

            panel.addButton({
                value: 'X',
                section: Y.WidgetStdMod.HEADER,
                action: function (e) {
                    panel.hide();
                }
            });

            /*
            panel.addButton({
            value: 'Add Item',
            section: Y.WidgetStdMod.FOOTER,
            action: function (e) {
            e.preventDefault();
            //addItem();
            }
            });
            */

            Y.one("#btPizzaAdd").on("click", function () {
                panel.show();
            });
        });
    </script>

    <div id="PizzaPanel" 
    style="padding: 5px; background-color:White; border-color:Red; border-style:dashed;">
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
    </div>
    
    
    <b>Consulta:</b>
        <asp:TextBox ID="txtConsulta" runat="server"></asp:TextBox>
    &nbsp;<input id="btConsulta" type="button" value="Buscar" />
    &nbsp;<input id="btPizzaAdd" type="button" value="+Pizza" />
    <div id="pizzaview" class="yui3-skin-sam dt-example">
    </div>        
    <div id="divResultado1">
    </div>

    <b>Garcom:</b>
        <asp:TextBox ID="txtGarcom" runat="server"></asp:TextBox>
    <asp:DropDownList ID="ddlPeriodo" runat="server" DataValueField="Id" DataTextField="Nome">
        </asp:DropDownList>
    <br/>
    <input id="btGarcom" type="button" value="Gravar" /> 
    <div id="garcomview" class="yui3-skin-sam dt-example"></div>  
    <div id="divResultado2">
    </div>
    

    <script src="Scripts/jquery-1.6.4.min.js" type="text/javascript"> </script>
    <script type="text/javascript">
        //Inclui uma  nova pizza
        $("#btIncluir").click(function () {
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

            request.done(function (data) {
                panel.hide();
                $("#divResultado1").html(data);
                $("#btConsulta").click();
            });

            request.fail(function (jqXHR, textStatus) {
                alert("Request failed: " + textStatus);
            });
        });
        //Consulta pizzas
        $("#btConsulta").click(function () {
            var nome = $("#txtConsulta").val();

            var request = $.ajax({
                type: "POST",
                url: "Default.aspx/Pizzas",
                contentType: "application/json",
                data: "{nome:'" + nome + "'}"
            });

            request.done(function (data) {
                //$("#divResultado2").html("");
                //$.each(data.d, function (index) {
                //    $("#divResultado2").append("<p>ID: " + data.d[index].Id + "</p><p>Nome: " + data.d[index].Nome + "</p>");
                //});
                pizzaGrid(data);
            });

            request.fail(function (jqXHR, textStatus) {
                alert("Request failed: " + textStatus);
            });
        });
        //Salva o garcom
        $("#btGarcom").click(function () {
            var nome = $("#txtGarcom").val();
            var id = $("#ddlPeriodo").val();

            var dados = "{nome:'" + nome + "',id :" + id + "}";

            var request = $.ajax({
                type: "POST",
                dataType: "json",
                url: "Default.aspx/GarcomSave",
                contentType: "application/json",
                data: dados
            });

            request.done(function (data) {
                $("#divResultado2").html(data.d);
            });

            request.fail(function (jqXHR, textStatus) {
                alert("Request failed: " + textStatus);
            });
        });

        //Monta e carrega o grid
        function pizzaGrid(d) {
            $("#pizzaview").html("");
            
            YUI().use('datatable', function (Y) {
                // Creates a Columnset with 3 Columns. "cost" is not rendered.
                //var cols = ["id","name","price"];
                var cols = [
                    { key: "Id", sortable: true }
                , { key: "Nome", sortable: true}];

                // Columns must match data parameter names
                //var data = [
                //    { id: "ga-3475", name: "gadget", price: "$6.99", cost: "$5.99" },
                //    { id: "sp-9980", name: "sprocket", price: "$3.75", cost: "$3.25" },
                //    { id: "wi-0650", name: "widget", price: "$4.25", cost: "$3.75" }
                //];
                var data = d.d;

                // Creates a DataTable with 3 columns and 3 rows
                var table = new Y.DataTable.Base({
                    columnset: cols,
                    recordset: data,
                    caption: "Pizzas",
                    plugins: Y.Plugin.DataTableSort
                }).render("#pizzaview");
            });
        }
    </script>
</asp:Content>