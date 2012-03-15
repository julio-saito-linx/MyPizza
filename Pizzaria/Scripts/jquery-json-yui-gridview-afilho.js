//Dependencias : 
//<script src="http://yui.yahooapis.com/3.4.1/build/yui/yui-min.js"></script>
//<link rel="stylesheet" href="http://yui.yahooapis.com/3.4.1/build/cssgrids/grids-min.css">

function JsonGrid(obj, cols, rows, caption) {
    $("#"+obj).html("");

    YUI().use('datatable', function (Y) {
        // Creates a DataTable with 3 columns and 3 rows
        var table = new Y.DataTable.Base({
            columnset: cols,
            recordset: rows,
            caption: caption,
            plugins: Y.Plugin.DataTableSort
        }).render("#"+obj);
    });
}

$(".yui3-datatable-data tr td div").css("background-color", "Red");