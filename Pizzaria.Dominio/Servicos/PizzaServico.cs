using System.Collections.Generic;
using Pizzaria.Dominio.Entidades;
using Pizzaria.Dominio.Repositorios;

namespace Pizzaria.Dominio.Servicos
{
    public class PizzaServico : IPizzaServico
    {
        private readonly IPizzaDAO _pizzaDAO;

        public PizzaServico(IPizzaDAO pizzaDAO)
        {
            _pizzaDAO = pizzaDAO;
        }
        
        public Pizza PesquisarID(int id)
        {
            return _pizzaDAO.Get(id);
        }

        public IList<Pizza> PesquisarTodos()
        {
            return _pizzaDAO.GetAll();
        }

        public void Save(Pizza pizza)
        {
            _pizzaDAO.Save(pizza);
        }
    }
}
