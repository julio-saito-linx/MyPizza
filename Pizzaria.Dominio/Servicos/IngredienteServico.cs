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
            _ingredienteDao.Delete(id);
        }

        #endregion
    }
}