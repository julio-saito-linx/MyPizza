// tipo um "enumerador"
var METHOD = {
    LIST: { type: "GET", url: "../api/__controller__"},
    SHOW: { type: "GET", url: "../api/__controller__/__id__"},
    PUT: { type: "PUT", url: "../api/__controller__/__id__"},
    POST: { type: "POST", url: "../api/__controller__"},
    DELETE: { type: "DELETE", url: "../api/__controller__/__id__"}
};

var ajaxConfig = function (configuracaoParametro) {
    var self = this;
    self.callBackErrorsTo = configuracaoParametro.callBackErrorsTo;

    self.ajaxSync = function (nomeController, metodo, id, dados, callback_done, callback_error) {
        self.ajax(nomeController, metodo, id, dados, callback_done, callback_error, false);
    };
    
    self.ajaxAsync = function (nomeController, metodo, id, dados, callback_done, callback_error) {
        self.ajax(nomeController, metodo, id, dados, callback_done, callback_error, true);
    };
    
    self.ajax = function (nomeController, metodo, id, dados, callback_done, callback_error, assincrono) {
// prepara URL
        var uri;
        uri = metodo.url.replace(/__controller__/, nomeController);
        if (!_.isUndefined(id)) {
            uri = uri.replace(/__id__/, id);
        }

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
            callback_done.call(self, data);
        });

        request.fail(function (jqXHR, textStatus) {
// dá prioridade para o tratamento especifico
            if (!_.isUndefined(callback_error)) {
                callback_error.call(self, jqXHR);
            }
// senão chama o genérico
            else if (!_.isUndefined(self.callBackErrorsTo)) {
                self.callBackErrorsTo.call(this, jqXHR);
            }
        });
    };
};



// ///////////////////////////////////////////////
// tratamento de erros especifico para NHibernate
// ///////////////////////////////////////////////
var tratarErrorCSharp = function (jqXHR) {
    var erroCSharp = JSON.parse(jqXHR.responseText, undefined);

    if (erroCSharp.ExceptionType === "NHibernate.Exceptions.GenericADOException") {
        if (!_.isUndefined(erroCSharp.InnerException)) {
            var inner = erroCSharp.InnerException;
// trata pau de SQL
            if (inner.ExceptionType === "System.Data.SqlClient.SqlException") {
                return (":: ERRO DE SQL ::" + "<br /><br />"
                    + "> " + erroCSharp.ExceptionType + "<br />"
                    + "> " + inner.ExceptionType + "<br /><br />"
                    + inner.Message);
            }
        }
    } else {
//pau genérico C#
        return (":: ERRO C# GENERICO ::" + "<br /><br />"
            + "> " + erroCSharp.ExceptionType + "<br />"
            + erroCSharp.Message);
    }
//pau genérico
    return (erroCSharp);
};
