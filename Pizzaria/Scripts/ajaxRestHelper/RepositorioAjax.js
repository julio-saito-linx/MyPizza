/// <reference path="../jquery-1.7.1.js" />
/// <reference path="ajaxRest.js" />

var ajaxJQuery = $.ajax;

var chamarAjax = function (options) {
    (new ajaxRest(options)).callAjax();
}