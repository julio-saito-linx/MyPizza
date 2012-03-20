using System.Collections.Generic;
using NHibernate;
using Pizzaria.Dominio.Entidades;
using Pizzaria.Dominio.Repositorios;
using Pizzaria.NHibernate.Helpers;

namespace Pizzaria.NHibernate.Repositorios
{
    public class IngredienteDAO : DAO<Ingrediente>, IIngredienteDAO
    {
        public IngredienteDAO(ISession session) : base(session)
        {
        }

        #region IIngredienteDAO Members

        public IList<Ingrediente> PesquisarApimentados()
        {
            return GetAll();
        }

        #endregion
    }
}