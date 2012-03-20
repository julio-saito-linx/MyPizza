using Pizzaria.Dominio.Entidades;
using Pizzaria.Dominio.Repositorios;
using Pizzaria.NHibernate.Helpers;

namespace Pizzaria.NHibernate.Repositorios
{
    public class PeriodoDAO : DAO<Periodo>, IPeriodoDAO
    {
        public PeriodoDAO(SessionProvider sessionProvider) : base(sessionProvider)
        {
        }
    }
}