var ConfiguradorAjax = function (configuracaoParametro, viewModelParametro) {
    var self = this;

    self.CallBackErrorsTo = configuracaoParametro.callBackErrorsTo;
    self.configuracao = configuracaoParametro;
    self.viewModel = viewModelParametro;

    // Lista
    self.METHOD_LIST = { type: "GET", url: "../api/__controller__", configuradorAjax: self };

    // Detalhe
    self.METHOD_SHOW = { type: "GET", url: "../api/__controller__/__id__", configuradorAjax: self };

    // Update
    self.METHOD_PUT = { type: "PUT", url: "../api/__controller__/__id__", configuradorAjax: self };

    // Insert
    self.METHOD_POST = { type: "POST", url: "../api/__controller__", configuradorAjax: self };

    // Delete
    self.METHOD_DELETE = { type: "DELETE", url: "../api/__controller__/__id__", configuradorAjax: self };

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
        if (metodo.configuradorAjax.configuracao.exibirNoty) {
            if (metodo.type !== "GET") {
                exibirNotyBaixo(data);
            }
        }
    });

    request.fail(function (jqXHR, textStatus) {
        if (!_.isUndefined(callback_error)) {
            callback_error.call(this, jqXHR);
        }
        if (!_.isUndefined(metodo.configuradorAjax.CallBackErrorsTo)) {
            metodo.configuradorAjax.CallBackErrorsTo.call(this, jqXHR);
        }
        if (!_.isUndefined(metodo.configuradorAjax.viewModel)) {
            metodo.configuradorAjax.viewModel.pizzaVm.atualizando(false);
        }

    });
};
