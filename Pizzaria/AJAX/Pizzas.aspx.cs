using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Script.Services;
using System.Web.Services;
using System.Web.UI;
using AutoMapper;
using Castle.Windsor;
using NHibernate;
using NHibernate.Criterion;
using Pizzaria.AJAX.DTO;
using Pizzaria.Dominio.Entidades;
using Pizzaria.Dominio.Repositorios;
using Pizzaria.NHibernate.Helpers;

namespace Pizzaria.AJAX
{
    [ScriptService]
    public partial class Pizzas : Page
    {
        private static WindsorContainer _container;

        public Pizzas()
        {
            CriarMapeamentosDto();
            _container = FabricaContainer.InicializarContainer();
        }

        private static void CriarMapeamentosDto()
        {
            Mapper.CreateMap<Pizza, PizzaDto>();
            Mapper.CreateMap<Ingrediente, IngredienteDto>();
        }

        [WebMethod]
        public static IList<IngredienteDto> Ingredientes()
        {
            var sessaoAtual = _container.Resolve<ISession>();

            IList<Ingrediente> ingredientes = 
                sessaoAtual
                .QueryOver<Ingrediente>()
                .List<Ingrediente>();

            return Mapper.Map<IList<Ingrediente>, IList<IngredienteDto>>(ingredientes);
        }
    }
}