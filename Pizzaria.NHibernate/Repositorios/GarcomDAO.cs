using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Pizzaria.Dominio.Entidades;
using Pizzaria.Dominio.Repositorios;
using Pizzaria.NHibernate.Helpers;

namespace Pizzaria.NHibernate.Repositorios
{
    public class GarcomDAO : DAO<Garcom>, IGarcomDAO
    {
        public GarcomDAO(SessionProvider sessionProvider)
            : base(sessionProvider)
        {
        }
    }
}
