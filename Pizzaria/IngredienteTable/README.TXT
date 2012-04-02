//VIEWMODEL
self.IsUpdating
self.exibirDebug

//PIZZA
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

	//PIZZA.INGREDIENTES
	self.pizzaSelecionada().Ingredientes
		self.ingredientesToAdd
		self.adicionarCancelar
		self.incluirIngredientesPizza

	self.ingredientesAindaNaoInseridos
		self.ingredientesToRemove
		self.removerCancelar
		self.removerIngredientes

//INGREDIENTE
[GET] self.todosIngredientes
[POST] self.novoIngrediente
[POST/PUT] self.salvarIngrediente
[DELETE] self.deletarIngrediente
self.selecionarIngrediente
	self.ingredienteSelecionado
		self.ingredienteId
