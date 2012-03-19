using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Script.Services;
using AutoMapper;
using Castle.MicroKernel.Registration;
using Castle.Windsor;
using Pizzaria.AJAX.DTO;
using Pizzaria.Dominio.Entidades;
using Pizzaria.Dominio.Repositorios;
using Pizzaria.Dominio.Servicos;
using Pizzaria.NHibernate.Helpers;
using Pizzaria.NHibernate.Repositorios;
using NHibernate.Criterion;

namespace Pizzaria.AJAX
{
    [ScriptService]
    public partial class Pizzas : System.Web.UI.Page
    {
        private static WindsorContainer _container;

        public Pizzas()
        {
            CriarMapeamentosDto();
            InicializarContainer();
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
            Mapper.CreateMap<Pizza, PizzaDto>();
            Mapper.CreateMap<Ingrediente, IngredienteDto>();
        }

        
        protected void Page_Load(object sender, EventArgs e)
        {
            InicializarContainer();
        }


        [System.Web.Services.WebMethod]
        public static string ExcluirPizza(int id)
        {
            var pizzaServico = _container.Resolve<IPizzaServico>();

            Pizza pizza = pizzaServico.PesquisarID(id);

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
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
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
        public static string SavePizza(PizzaDto pizzaDto)
        {
            Pizza pizzaIncluir;

            var provider = new SessionFactoryProvider();
            var sessionProvider = new SessionProvider(provider);
            var sessaoAtual = sessionProvider.GetCurrentSession();

            if (pizzaDto.Id == 0)
            {
                // nova pizza
                pizzaIncluir = new Pizza();
            }
            else
            {
                // pesquisa para UPDATE
                pizzaIncluir = sessaoAtual.Get<Pizza>(pizzaDto.Id);
            }

            pizzaIncluir.Nome = pizzaDto.Nome;

            for (int i = 0; i < pizzaDto.Ingredientes.Count; i++)
            {
                pizzaIncluir.Ingredientes[i].Nome = pizzaDto.Ingredientes[i].Nome;
            }

            sessaoAtual.Save(pizzaIncluir);
            sessaoAtual.Flush();

            return String.Format("Pizza salva com sucesso!");
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
