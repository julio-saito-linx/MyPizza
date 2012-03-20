using NHibernate;
using Pizzaria.Dominio.Entidades;
using Pizzaria.Dominio.Repositorios;
using Pizzaria.NHibernate.Helpers;

namespace Pizzaria.NHibernate.Repositorios
{
    public class ErroDAO : DAO<Erro>, IErroDAO
    {
        public ErroDAO(ISession session)
            : base(session)
        {
        }
    }
}