using NHibernate;
using Pizzaria.Dominio.Entidades;
using Pizzaria.Dominio.Repositorios;
using Pizzaria.NHibernate.Helpers;

namespace Pizzaria.NHibernate.Repositorios
{
    public class PeriodoDAO : DAO<Periodo>, IPeriodoDAO
    {
        public PeriodoDAO(ISession session) : base(session)
        {
        }
    }
}