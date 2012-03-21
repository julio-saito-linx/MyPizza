using FluentNHibernate.Mapping;
using Pizzaria.Dominio.Entidades;

namespace Pizzaria.NHibernate.Mappings
{
    public class PizzaMap : ClassMap<Pizza>
    {
        public PizzaMap()
        {
            Id(x => x.Id).GeneratedBy.Native();

            Map(x => x.Nome);

            HasManyToMany(x => x.Ingredientes)
                .Table("Pizza_Ingredientes")
                .ParentKeyColumn("Pizza_id")
                .ChildKeyColumn("Ingredientes_id");
        }
    }
}