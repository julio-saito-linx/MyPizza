using FluentNHibernate.Mapping;
using Pizzaria.Dominio.Entidades;

namespace Pizzaria.NHibernate.Mappings
{
    public class PeriodoMap : ClassMap<Periodo>
    {
        public PeriodoMap()
        {
            Id(x => x.Id).GeneratedBy.Native();

            Map(x => x.Nome);
        }
    }
}