/// <reference path="RepositorioAjax.js" />

// tipo um "enumerador"
var METHOD = {
    LIST: { type: "GET", url: "../api/__controller__"},
    SHOW: { type: "GET", url: "../api/__controller__/__id__"},
    PUT: { type: "PUT", url: "../api/__controller__/__id__"},
    POST: { type: "POST", url: "../api/__controller__"},
    DELETE: { type: "DELETE", url: "../api/__controller__/__id__"}
};

var ajaxRest = function (options) {
    var self = this;

    // Force options to be an object
    options = options || {};

    // padrão
    self.settings = {};
    self.settings.nomeController = "";
    self.settings.metodo = METHOD.LIST;
    self.settings.id = undefined;
    self.settings.dados = undefined;
    self.settings.callback_done = undefined;
    self.settings.callback_error = undefined;
    self.settings.assincrono = true;

    //self.settings = ajaxRestSettings;
    if (!_.isUndefined(options.nomeController)) {
        self.settings.nomeController = options.nomeController;
    }
    if (!_.isUndefined(options.metodo)) {
        self.settings.metodo = options.metodo;
    }
    if (!_.isUndefined(options.id)) {
        self.settings.id = options.id;
    }
    if (!_.isUndefined(options.dados)) {
        self.settings.dados = options.dados;
    }
    if (!_.isUndefined(options.callback_done)) {
        self.settings.callback_done = options.callback_done;
    }
    if (!_.isUndefined(options.callback_error)) {
        self.settings.callback_error = options.callback_error;
    }
    if (!_.isUndefined(options.assincrono)) {
        self.settings.assincrono = options.assincrono;
    }

    self.callAjax = function () {
        // prepara URL
        var uri;
        uri = self.settings.metodo.url.replace(/__controller__/, self.settings.nomeController);
        if (!_.isUndefined(self.settings.id)) {
            uri = uri.replace(/__id__/, self.settings.id);
        }

        // prepara jQueryAjax
        var chamadaAjax = {
            type: self.settings.metodo.type,
            url: uri,
            contentType: "application/json",
            async: self.settings.assincrono
        };
        chamadaAjax.data = self.settings.dados;

        var request = ajaxJQuery(chamadaAjax);

        request.done(function (data) {
            if (!_.isUndefined(self.settings.callback_done)) {
                self.settings.callback_done.call(self, data);
            }
        });

        request.fail(function (jqXHR, textStatus) {
            // dá prioridade para o tratamento especifico
            if (!_.isUndefined(self.settings.callback_error)) {
                self.settings.callback_error.call(self, jqXHR);
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
