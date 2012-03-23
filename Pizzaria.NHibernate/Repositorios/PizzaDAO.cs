using System.Collections.Generic;
using NHibernate;
using Pizzaria.Dominio.Entidades;
using Pizzaria.Dominio.Repositorios;

namespace Pizzaria.NHibernate.Repositorios
{
    public class PizzaDAO : DAO<Pizza>, IPizzaDAO
    {
        public PizzaDAO(ISession session)
            : base(session)
        {
        }

        public IList<Pizza> PesquisarPorNome(string nome)
        {
            return _session.QueryOver<Pizza>()
                .Where(i => i.Nome == nome)
                .List<Pizza>();
        }
    }
}