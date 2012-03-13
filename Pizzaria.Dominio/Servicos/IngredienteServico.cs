using System.Collections.Generic;
using Pizzaria.Dominio.Entidades;
using Pizzaria.Dominio.Repositorios;

namespace Pizzaria.Dominio.Servicos
{
    public class IngredienteServico : IIngredienteServico
    {
        private readonly IIngredienteDAO _ingredienteDao;
        public IngredienteServico(IIngredienteDAO ingredienteDAO)
        {
            _ingredienteDao = ingredienteDAO;
        }

        public IList<Ingrediente> PesquisarTodos()
        {
            return _ingredienteDao.GetAll();
        }

        public Ingrediente PesquisarID(int Id)
        {
            return _ingredienteDao.Get(Id);
        }

        public void Save(Ingrediente ingrediente)
        {
            _ingredienteDao.Save(ingrediente);
        }
    }
}
