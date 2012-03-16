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

        public Pizza PesquisarNome(string nome)
        {
            //FIXME: Cria uma nova pizza só para retornar valor teste.
            return new Pizza{Id = 0, Nome = nome};
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
    }
}
