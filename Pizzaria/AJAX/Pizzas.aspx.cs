using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using Castle.MicroKernel.Registration;
using Castle.Windsor;
using Pizzaria.Dominio.Entidades;
using Pizzaria.Dominio.Repositorios;
using Pizzaria.Dominio.Servicos;
using Pizzaria.NHibernate.Helpers;
using Pizzaria.NHibernate.Repositorios;
using NHibernate.Criterion;

namespace Pizzaria.AJAX
{
    public partial class Pizzas : System.Web.UI.Page
    {
        private static WindsorContainer _container;

        public Pizzas()
        {
            CriarMapeamentosDto();
        }

        private static WindsorContainer InicializarContainer()
        {
            if (_container == null)
            {
                _container = new WindsorContainer();

                var sessionFactoryProvider = new SessionFactoryProvider();
                _container.Register(
                    Component.For<SessionProvider>().LifeStyle.Singleton.Instance(
                        new SessionProvider(sessionFactoryProvider)));

                _container.Register(Component.For<IPizzaServico>().ImplementedBy<PizzaServico>());
                _container.Register(Component.For<IIngredienteServico>().ImplementedBy<IngredienteServico>());
                _container.Register(Component.For<IPizzaDAO>().ImplementedBy<PizzaDAO>());
                _container.Register(Component.For<IIngredienteDAO>().ImplementedBy<IngredienteDAO>());
                _container.Register(Component.For<IGarcomDAO>().ImplementedBy<GarcomDAO>());
                _container.Register(Component.For<IGarcomServico>().ImplementedBy<GarcomServico>());
                _container.Register(Component.For<IPeriodoDAO>().ImplementedBy<PeriodoDAO>());
                _container.Register(Component.For<IPeriodoServico>().ImplementedBy<PeriodoServico>());
            }
            return _container;
        }

        private static void CriarMapeamentosDto()
        {
            Mapper.CreateMap<Pizza, DTO.PizzaDto>();
            Mapper.CreateMap<Ingrediente, DTO.IngredienteDto>();
        }

        
        protected void Page_Load(object sender, EventArgs e)
        {
            InicializarContainer();
        }


        [System.Web.Services.WebMethod]
        public static string ExcluirPizza(int id)
        {
            IPizzaServico pizzaServico = _container.Resolve<IPizzaServico>();
            Pizza pizza = pizzaServico.PesquisarID(id);

            IIngredienteServico ingredienteServico =
                _container.Resolve<IIngredienteServico>();
            foreach (Ingrediente ingrediente in pizza.Ingredientes)
            {
                //ingredienteServico.Delete(ingrediente.Id);
            }

            pizzaServico.Delete(pizza.Id);

            return "Pizza excluida com sucesso!";
        }

        [System.Web.Services.WebMethod]
        public static Pizza PizzaByName(string nome)
        {
            var provider = new SessionFactoryProvider();
            var sessionProvider = new SessionProvider(provider);
            var sessaoAtual = sessionProvider.GetCurrentSession();

            Pizza pizza = sessaoAtual.QueryOver<Pizza>()
                              .Where(Restrictions.On<Pizza>(p => p.Nome).IsLike(nome, MatchMode.Start))
                              .OrderBy(p => p.Nome).Asc
                              .List<Pizza>().FirstOrDefault<Pizza>()
                          ?? new Pizza();

            return pizza;
        }

        [System.Web.Services.WebMethod]
        public static DTO.PizzaDto PizzaById(int id)
        {
            var provider = new SessionFactoryProvider();
            var sessionProvider = new SessionProvider(provider);
            var sessaoAtual = sessionProvider.GetCurrentSession();

            Pizza pizza = sessaoAtual.QueryOver<Pizza>()
                .Where(p => p.Id == id).List<Pizza>()[0];

            return Mapper.Map<Pizza, DTO.PizzaDto>(pizza);
        }
        
        [System.Web.Services.WebMethod]
        public static IList<DTO.IngredienteDto> Ingredientes(int id)
        {
            var provider = new SessionFactoryProvider();
            var sessionProvider = new SessionProvider(provider);
            var sessaoAtual = sessionProvider.GetCurrentSession();

            IList<Ingrediente> ingredientes = sessaoAtual.QueryOver<Ingrediente>()
                .Where(i => i.Pizza.Id == id)
                .List<Ingrediente>();

            return Mapper.Map<IList<Ingrediente>, IList<DTO.IngredienteDto>>(ingredientes);
        }

        [System.Web.Services.WebMethod]
        public static IList<DTO.PizzaDto> PizzasLista(string nome)
        {
            var provider = new SessionFactoryProvider();
            var sessionProvider = new SessionProvider(provider);
            var sessaoAtual = sessionProvider.GetCurrentSession();

            IList<Pizza> pizzas = sessaoAtual.QueryOver<Pizza>()
                .Where(Restrictions.On<Pizza>(p => p.Nome).IsLike(nome, MatchMode.Start))
                .OrderBy(p => p.Id).Asc()
                .List<Pizza>();

            var pizzaDtos = Mapper.Map<IList<Pizza>, IList<DTO.PizzaDto>>(pizzas);

            return pizzaDtos;
        }


        [System.Web.Services.WebMethod]
        public static string GarcomSave(string nome, int id)
        {
            IPeriodoServico periodoServico = _container.Resolve<IPeriodoServico>();
            var periodo = periodoServico.PesquisarID(id);
            
            IGarcomServico garcomServico = _container.Resolve<IGarcomServico>();
            var garcom = new Garcom {Nome = nome};
            garcom.SalvarPeriodo(periodo);
            garcomServico.Save(garcom);

            return String.Format("Garcom inserido com sucesso! Codigo: {0}", garcom.Id);
        }
    }
}
