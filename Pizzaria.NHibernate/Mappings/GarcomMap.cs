using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using FluentNHibernate.Mapping;
using Pizzaria.Dominio.Entidades;

namespace Pizzaria.NHibernate.Mappings
{
    public class GarcomMap : ClassMap<Garcom>
    {
        public GarcomMap()
        {
            Id(x => x.Id).GeneratedBy.Native();

            Map(x => x.Nome);

            HasManyToMany(x => x.Periodos);
        }
    }
}
