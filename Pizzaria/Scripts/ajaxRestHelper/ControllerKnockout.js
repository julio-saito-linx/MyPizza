var configControllerKnockout = {
    viewMoldel: {},
    nomeController: "",
    dadosDto: [],
    ClasseViewModel: undefined,
    configuradorAjax: undefined
};

// ///////////////////////////////////////////////////
// ControllerKnockout /////////////////////////////////
// ---------------------------------------------------
// Configura um viewModel knockout de forma automática.
// Expõe um CRUD básico.
// ---------------------------------------------------
// ///////////////////////////////////////////////////
var ControllerKnockout = function (config) {
    var vmKO = config.viewMoldel;
    var nomeController = config.nomeController;
    var dadosDto = config.dadosDto;
    var ClasseViewModel = config.ClasseViewModel;
    var configuradorAjax = config.configuradorAjax;

    var self = this;

    var viewModelLista = _.map(dadosDto, function (itemDto) {
        return new ClasseViewModel(itemDto);
    });

// em processo de comunicação com o servidor
    vmKO.atualizando = ko.observable(false);
// item selecionado
    vmKO.selecionado = ko.observable();
// somente o id que estiver selecionado
    vmKO.id = ko.observable();
    vmKO.selecionar = function (item) {
// salva o item anterior
        vmKO.salvar();
// define o novo item selecionado
        vmKO.id(item.Id);
        vmKO.selecionado(item);
// guarda o estado inicial do novo item
        jsonItem = ko.toJSON(vmKO.selecionado);
    };
    var jsonItem = undefined;
// selecionar item
    vmKO.foiAlterado = function () {
        if (!_.isUndefined(jsonItem)) {
            var jsonItemAtual = ko.toJSON(vmKO.selecionado);
            return (jsonItem !== jsonItemAtual);
        }
        return false;
    };

// [GET] 
    vmKO.lista = ko.observableArray(viewModelLista);

// [POST/PUT] 
    vmKO.salvar = function () {
        self.salvar(vmKO);
    };
// [POST] 
    vmKO.novo = function () {
        self.novo(vmKO);
        $("#txtPizzaNome").focus();
    };
// [DELETE] 
    vmKO.excluir = function () {
        self.excluir(vmKO);
    };

    self.salvar = function (vmKO) {
        if (_.isUndefined(vmKO.selecionado)) {
// não existe item selecionada
            return;
        }

// somente salva se o JSON foi alterado
        if (!vmKO.foiAlterado()) {
            return;
        }

        vmKO.atualizando(true);

        var vmSerializado = ko.toJSON(vmKO.selecionado);

        var metodoHttp = METHOD.PUT;
        if (vmKO.id()() === 0) {
            metodoHttp = METHOD.POST;
        }
        configuradorAjax.ajaxAsync(
            nomeController,
            metodoHttp,
            vmKO.selecionado().Id(),
            vmSerializado,
            function (data) {
                vmKO.atualizando(false);
            });
    };

    self.novo = function (vmKO) {
        var novoVm = new ClasseViewModel();
        vmKO.lista.push(novoVm);
        vmKO.selecionar(novoVm);
    };

    self.excluir = function (vmKO) {

        var novaLista = _.reject(vmKO.lista(), function (item) {
            return item.Id() === vmKO.id()();
        });
        vmKO.lista(novaLista);

        vmKO.atualizando(true);
        configuradorAjax.ajaxAsync(
            nomeController,
            METHOD.DELETE,
            vmKO.selecionado().Id(),
            undefined,
            function (data) {
                vmKO.atualizando(false);
            });
    };
};