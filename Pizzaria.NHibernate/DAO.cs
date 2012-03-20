using System.Collections.Generic;
using NHibernate;
using Pizzaria.Dominio.Repositorios;
using Pizzaria.NHibernate.Helpers;

namespace Pizzaria.NHibernate
{
    public class DAO<T> : IRepositorio<T>
    {
        private readonly ISession _session;

        public DAO(ISession session)
        {
            _session = session;
        }

        protected ISession Session
        {
            get { return _session; }
        }

        #region IRepositorio<T> Members

        public void Save(T entidade)
        {
            Session.SaveOrUpdate(entidade);
            Session.Flush();
        }

        public T Get(int id)
        {
            return Session.Load<T>(id);
        }

        public void Delete(int id)
        {
            T entidade = Get(id);
            Delete(entidade);
        }

        public void Delete(T entidade)
        {
            Session.Delete(entidade);
            Session.Flush();
        }

        public IList<T> GetAll()
        {
            ICriteria criteria = Session.CreateCriteria(typeof (T));
            return criteria.List<T>();
        }

        #endregion
    }
}