using FluentNHibernate.Mapping;
using Pizzaria.Dominio.Entidades;

namespace Pizzaria.NHibernate.Mappings
{
    public class ErroMap : ClassMap<Erro>
    {
        public ErroMap()
        {
            Id(x => x.Id).GeneratedBy.Native();

            Map(x => x.Codigo);

            Map(x => x.Mensagem);
        }
    }
}