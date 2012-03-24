﻿using FluentNHibernate.Mapping;
using Pizzaria.Dominio.Entidades;

namespace Pizzaria.NHibernate.Mappings
{
    public class IngredienteMap : ClassMap<Ingrediente>
    {
        public IngredienteMap()
        {
            Id(x => x.Id).Column("Id").GeneratedBy.Native();
            Map(x => x.Nome);
            HasManyToMany(x => x.ContidoEmPizzas)
                .Table("Pizza_Ingredientes")
                .ParentKeyColumn("Ingredientes_id")
                .ChildKeyColumn("Pizza_id");
        }
    }
}