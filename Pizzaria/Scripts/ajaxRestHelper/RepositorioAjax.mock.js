var ajaxJQuery = function() {
    var self = this;
    self.done = function() {
    };
    self.fail = function() {
    };
    return self;
};

var chamarAjax = function (options) {
    
    if (!_.isUndefined(options.callback_done) && options.simularResposta == "sucesso") {
        options.callback_done();
    }
    if (!_.isUndefined(options.callback_error) && options.simularResposta == "erro") {
        options.callback_error();
    }

    //(new ajaxRest(options)).callAjax();
};