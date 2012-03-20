using System;
using FluentNHibernate.Cfg;
using FluentNHibernate.Cfg.Db;
using FluentNHibernate.Conventions;
using NHibernate;
using Pizzaria.NHibernate.Mappings;

namespace Pizzaria.NHibernate.Helpers
{
    public static class NhCastle
    {
        public static ISessionFactory InitSessionFactory()
        {
            FluentConfiguration cfg = Fluently.Configure()
                .Mappings
                (m => m.FluentMappings.AddFromAssemblyOf<PizzaMap>()
                          .Conventions.Setup(GetConventions()))
                .Database(MsSqlConfiguration.MsSql2008.ShowSql()
                              .IsolationLevel("ReadCommitted")
                              .ConnectionString(c => c.FromConnectionStringWithKey("ConnectionString")).ShowSql()
                );
            return cfg.BuildSessionFactory();
        }

        private static Action<IConventionFinder> GetConventions()
        {
            return c =>
                       {
                           c.Add<CascadeConvention>();
                           c.Add<EnumConvention>();
                       };
        }
    }
}