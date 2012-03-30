//VIEWMODEL
self.IsUpdating
self.exibirDebug

//CONTROLLER PIZZA
[GET] self.Pizzas
[POST] self.novaPizza
[POST/PUT] self.salvar
[DELETE] self.excluirPizza
self.selecionarPizza
	self.pizzaSelecionada
		self.pizzaIdSelecionada
//extra!! verifica se foi alterado antes de gravar.
self.pizzaSelecionadaEstadoInicialJSON
self.foiAlterada

//PIZZA.INGREDIENTE
self.incluirIngredientesPizza
self.adicionarCancelar
self.ingredientesToAdd
self.ingredientesAindaNaoInseridos
self.removerIngredientes
self.ingredientesToRemove
self.removerCancelar

//CONTROLLER INGREDIENTE
[GET] self.todosIngredientes
[POST] self.novoIngrediente
[POST/PUT] self.salvarIngrediente
[DELETE] self.deletarIngrediente
self.selecionarIngrediente
	self.ingredienteSelecionado
		self.ingredienteId
