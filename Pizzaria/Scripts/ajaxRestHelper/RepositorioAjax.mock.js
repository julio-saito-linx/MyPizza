var ajaxJQuery = function() {
    var self = this;
    self.done = function() {
    };
    self.fail = function() {
    };
    return self;
};

var chamarAjax = function (options) {

    if (!_.isUndefined(options.callback_done) && options.nomeController == "simular_sucesso") {
        options.callback_done();
    }
    if (!_.isUndefined(options.callback_done) && options.nomeController == "POST_sucesso") {
        options.callback_done(11);
    }
    if (!_.isUndefined(options.callback_error) && options.nomeController == "simular_erro") {
        options.callback_error();
    }
};