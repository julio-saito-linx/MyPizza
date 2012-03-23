using System.Collections.Generic;
using Pizzaria.Dominio.Entidades;
using Pizzaria.Dominio.Repositorios;

namespace Pizzaria.Dominio.Servicos
{
    public class PizzaServico : IPizzaServico
    {
        private readonly IPizzaDAO _pizzaDAO;
        private readonly IIngredienteDAO _ingredienteDAO;

        public PizzaServico(IPizzaDAO pizzaDAO, IIngredienteDAO ingredienteDAO)
        {
            _pizzaDAO = pizzaDAO;
            _ingredienteDAO = ingredienteDAO;
        }

        #region IPizzaServico Members

        public Pizza PesquisarID(int id)
        {
            return _pizzaDAO.Get(id);
        }

        public IList<Pizza> PesquisarPorNome(string nome)
        {
            return _pizzaDAO.PesquisarPorNome(nome);
        }

        public IList<Pizza> PesquisarPorIngrediente(int ingredienteId)
        {
            var ingrediente = _ingredienteDAO.Get(ingredienteId);
            return ingrediente.ContidoEmPizzas;
        }

        public IList<Pizza> PesquisarTodos()
        {
            return _pizzaDAO.GetAll();
        }

        public void Save(Pizza pizza)
        {
            _pizzaDAO.Save(pizza);
        }

        public void Delete(int id)
        {
            _pizzaDAO.Delete(id);
        }

        #endregion
    }
}