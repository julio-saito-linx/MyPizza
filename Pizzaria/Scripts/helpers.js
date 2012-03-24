var primeiroMaiusculo = function (texto) {
    texto = texto.toLowerCase();
    var primeiraLetra = texto.substring(0, 1).toUpperCase();
    return primeiraLetra + texto.substring(1);
};
var exibirNoty = function (mensagem, tipoAlert) {
    noty({
        "text": mensagem,
        "layout": "top",
        "type": tipoAlert,
        "textAlign": "center",
        "easing": "swing",
        "animateOpen": { "height": "toggle" },
        "animateClose": { "height": "toggle" },
        "speed": "500",
        "timeout": "500",
        "closable": true,
        "closeOnSelfClick": true
    });
};