var ConfiguradorAjax = function () {
    var self = this;
    
    // Lista
    self.METHOD_LIST = { type: "GET", url: "api/__controller__" };

    // Detalhe
    self.METHOD_SHOW = { type: "GET", url: "api/__controller__/__id__" };

    // Update
    self.METHOD_PUT = { type: "PUT", url: "api/__controller__/__id__" };

    // Insert
    self.METHOD_POST = { type: "POST", url: "api/__controller__" };

    // Delete
    self.METHOD_DELETE = { type: "DELETE", url: "api/__controller__/__id__" };

    self.toString = function () {
        return "[object Foo]";
    };
};

var chamarAjaxSync = function(nomeController, metodo, id, dados, callback_done, callback_error) {
    chamarAjax(nomeController, metodo, id, dados, callback_done, callback_error, false);
};
var chamarAjaxAsync = function(nomeController, metodo, id, dados, callback_done, callback_error) {
    chamarAjax(nomeController, metodo, id, dados, callback_done, callback_error, true);
};
var chamarAjax = function (nomeController, metodo, id, dados, callback_done, callback_error, assincrono) {
    // prepara URL
    var uri;
    uri = metodo.url.replace(/__controller__/, nomeController);
    if (!_.isUndefined(id)) {
        uri = uri.replace(/__id__/, id);
    }

    // <DEBUG INFO> //////////////////////////
    console.debug('chamarAjax(%d) :: %d', nomeController, metodo.toString());
    console.debug(metodo);
    if (!_.isUndefined(id)) {
        console.debug(id);
    }
    if (!_.isUndefined(id)) {
        console.debug(dados);
    }
    console.debug(" >uri = %s", uri);
    // </DEBUG INFO> //////////////////////////

    // prepara jQueryAjax
    var chamadaAjax = {
        type: metodo.type,
        url: uri,
        contentType: "application/json",
        async: assincrono
    };
    chamadaAjax.data = dados;

    var request = $.ajax(chamadaAjax);

    request.done(function (data) {
        callback_done.call(this, data);
    });

    request.fail(function (jqXHR, textStatus) {
        console.debug(textStatus);
        console.error(jqXHR.statusText);
        exibirNoty("Request failed: " + textStatus, "error");
    });
};
