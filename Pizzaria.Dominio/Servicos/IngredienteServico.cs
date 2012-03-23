using System.Collections.Generic;
using System.Linq;
using Pizzaria.Dominio.Entidades;
using Pizzaria.Dominio.Repositorios;

namespace Pizzaria.Dominio.Servicos
{
    public class IngredienteServico : IIngredienteServico
    {
        private readonly IIngredienteDAO _ingredienteDao;
        private readonly IPizzaServico _pizzaServico;

        public IngredienteServico(IIngredienteDAO ingredienteDAO, IPizzaServico pizzaServico)
        {
            _ingredienteDao = ingredienteDAO;
            _pizzaServico = pizzaServico;
        }

        #region IIngredienteServico Members

        public IList<Ingrediente> PesquisarTodos()
        {
            return _ingredienteDao.GetAll();
        }

        public Ingrediente PesquisarID(int id)
        {
            return _ingredienteDao.Get(id);
        }

        public void Save(Ingrediente ingrediente)
        {
            _ingredienteDao.Save(ingrediente);
        }

        public void Delete(int id)
        {
            // apaga as dependencias
            var pizzas = _pizzaServico.PesquisarPorIngrediente(id);

            foreach (var pizza in pizzas)
            {
                var ingredientes = pizza.Ingredientes.Where(i => i.Id == id).ToList();
                foreach (var ingrediente in ingredientes)
                {
                    pizza.Ingredientes.Remove(ingrediente);
                    _pizzaServico.Save(pizza);
                }
            }

            // apaga o ingrediente solitário
            _ingredienteDao.Delete(id);
        }

        #endregion
    }
}