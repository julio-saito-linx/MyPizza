var configControllerKnockout = {
    viewMoldel: {},
    nomeController: "",
    dadosDto: [],
    ClasseViewModel: undefined
};

// ///////////////////////////////////////////////////
// inicializarControllerKnockout /////////////////////////////////
// ---------------------------------------------------
// Configura um viewModel knockout de forma automática.
// Expõe um CRUD básico.
// ---------------------------------------------------
// ///////////////////////////////////////////////////
var inicializarControllerKnockout = function (config) {
    var controller = {};
    controller.nomeController = config.nomeController;
    controller.ClasseViewModel = config.ClasseViewModel;
    controller.dadosDto = undefined;
    var viewModelLista;
    
    var vmKO = config.viewMoldel;

    // ///////////////////////////////////////////////////
    // CALL BACKS
    // ///////////////////////////////////////////////////
    vmKO.ajax_done = undefined;
    vmKO.ajax_salvar = undefined;
    vmKO.ajax_excluir = undefined;
    vmKO.ajax_error = undefined;

    // em processo de comunicação com o servidor
    vmKO.atualizando = ko.observable(false);

    vmKO.jsonItem = ko.toJSON(vmKO.selecionado);

    // somente o id que estiver selecionado
    vmKO.selecionar = function (item) {
        // salva o item anterior
        vmKO.salvar();
        // define o novo ITEM selecionado
        vmKO.selecionado(item);
        // guarda o estado inicial do novo item
        vmKO.jsonItem = ko.toJSON(vmKO.selecionado);
    };

    // selecionar item
    vmKO.foiAlterado = function () {
        if (!_.isUndefined(vmKO.jsonItem)) {
            var jsonItemAtual = ko.toJSON(vmKO.selecionado);
            return (vmKO.jsonItem !== jsonItemAtual);
        }
        return false;
    };



    // ///////////////////////////////////////////////////
    // REST
    // ///////////////////////////////////////////////////

    // [POST] 
    vmKO.novo = function () {
        var novoVm = new controller.ClasseViewModel();
        vmKO.lista.push(novoVm);
        vmKO.selecionar(novoVm);
    };

    // [POST/PUT] 
    vmKO.salvar = function () {

        // não existe item selecionado, cai fora
        if (_.isUndefined(vmKO.selecionado)) {
            return;
        }

        // somente salva se o JSON foi alterado
        if (!vmKO.foiAlterado()) {
            return;
        }

        // marca como em processo de atualização, fazendo alguma forma de comunicação
        // visual com o usuário informar que o processo está em execução.
        // Geralmente utilizamos uma animação GIF com a bolinha rodando
        vmKO.atualizando(true);

        // guarda o novo objeto em JSON, para posteriores comparações
        var vmSerializado = ko.toJSON(vmKO.selecionado);

        var metodoHttp = METHOD.PUT;
        if (vmKO.selecionado().Id() === 0) {
            // se o Id estiver zerado, significa que é um item novo.
            metodoHttp = METHOD.POST;
        }


        // chamada callAjax
        chamarAjax({
            nomeController: controller.nomeController,
            metodo: metodoHttp,
            id: vmKO.selecionado().Id(),
            dados: vmSerializado,
            callback_done: function (data) {
                vmKO.atualizando(false);
                if (!_.isUndefined(vmKO.ajax_done)) {
                    vmKO.ajax_done(data);
                }
                if (!_.isUndefined(vmKO.ajax_salvar)) {
                    vmKO.ajax_salvar(data);
                }
                // se foi inclusão, pega o novo ID
                if(metodoHttp === METHOD.POST){
                	vmKO.selecionado().Id(data);
                }
            },
            callback_error: function (jqXHR) {
                vmKO.atualizando(false);
                if (!_.isUndefined(vmKO.ajax_error)) {
                    vmKO.ajax_error(jqXHR);
                }
            }
        });
    };

    // [DELETE] 
    vmKO.excluir = function () {
        vmKO.atualizando(true);

        chamarAjax({
            nomeController: controller.nomeController,
            metodo: METHOD.DELETE,
            id: vmKO.selecionado().Id(),
            callback_done: function (data) {
                //guarda indice atual
                var indiceAtual = _.indexOf(vmKO.lista(), vmKO.selecionado())
                
                // se conseguiu excluir no servidor
                // retira o item da lista atual
                var novaLista = _.reject(vmKO.lista(), function (item) {
                    return item.Id() === vmKO.selecionado().Id();
                });
                vmKO.lista(novaLista);
                vmKO.atualizando(false);
                
                //seleciona próximo da lista
                var ultimoItem = vmKO.lista().length - 1;
                var selecionarIndice = (indiceAtual <= ultimoItem) ? indiceAtual : ultimoItem;
        		vmKO.selecionar(vmKO.lista()[selecionarIndice]);

                if (!_.isUndefined(vmKO.ajax_done)) {
                    vmKO.ajax_done(data);
                }
                if (!_.isUndefined(vmKO.ajax_excluir)) {
                    vmKO.ajax_excluir(data);
                }
            },
            callback_error: function (jqXHR) {
                vmKO.atualizando(false);
                if (!_.isUndefined(vmKO.ajax_error)) {
                    vmKO.ajax_error(jqXHR);
                }
            }
        });
    };

    controller.VmKO = vmKO;

    // Os dados já vieram preenchidos
    if (!_.isUndefined(config.dadosDto)) {
        controller.dadosDto = config.dadosDto;
    }
    else {
        chamarAjax({
            nomeController: controller.nomeController,
            callback_done: function (data) {
                controller.dadosDto = data;
            },
            assincrono: false
        });
    }

    // cria viewModel para cada Dto
    viewModelLista = _.map(controller.dadosDto, function (itemDto) {
        return new controller.ClasseViewModel(itemDto);
    });

    // item selecionado, inicia com o primeiro
    vmKO.selecionado = ko.observable(viewModelLista[0]);

    // [GET] 
    vmKO.lista = ko.observableArray(viewModelLista);

    return controller;
};