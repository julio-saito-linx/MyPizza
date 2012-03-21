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
        public static string ExcluirPizza(int id)
        {
            var pizzaServico = _container.Resolve<IPizzaServico>();

            Pizza pizza = pizzaServico.PesquisarID(id);

            pizzaServico.Delete(pizza.Id);

            return "Pizza excluida com sucesso!";
        }

        [WebMethod]
        public static Pizza PizzaByName(string nome)
        {
            var sessaoAtual = _container.Resolve<ISession>();

            Pizza pizza = sessaoAtual.QueryOver<Pizza>().Where(Restrictions.On<Pizza>(p => p.Nome).IsLike(nome, MatchMode.Start)).OrderBy(p => p.Nome).Asc.List<Pizza>().FirstOrDefault<Pizza>() ?? new Pizza();

            return pizza;
        }

        [WebMethod]
        public static PizzaDto PizzaById(int id)
        {
            var sessaoAtual = _container.Resolve<ISession>();

            Pizza pizza = sessaoAtual.QueryOver<Pizza>().Where(p => p.Id == id).List<Pizza>()[0];

            return Mapper.Map<Pizza, PizzaDto>(pizza);
        }

        [WebMethod]
        public static IList<IngredienteDto> Ingredientes(int id)
        {
            var sessaoAtual = _container.Resolve<ISession>();

            IList<Ingrediente> ingredientes = sessaoAtual.QueryOver<Ingrediente>().Where(i => i.Pizza.Id == id).List<Ingrediente>();

            return Mapper.Map<IList<Ingrediente>, IList<IngredienteDto>>(ingredientes);
        }

        [WebMethod]
        [ScriptMethod(ResponseFormat = ResponseFormat.Json)]
        public static IList<PizzaDto> PizzasLista(string nome)
        {
            var sessaoAtual = _container.Resolve<ISession>();

            IList<Pizza> pizzas = sessaoAtual.QueryOver<Pizza>().Where(Restrictions.On<Pizza>(p => p.Nome).IsLike(nome, MatchMode.Start)).OrderBy(p => p.Id).Asc().List<Pizza>();

            IList<PizzaDto> pizzaDtos = Mapper.Map<IList<Pizza>, IList<PizzaDto>>(pizzas);

            return pizzaDtos;
        }

        [WebMethod]
        public static string SavePizza(PizzaDto pizzaDto)
        {
            Pizza pizzaIncluir;

            var sessaoAtual = _container.Resolve<ISession>();

            if (pizzaDto.Id == 0)
            {
                // nova pizza
                pizzaIncluir = new Pizza();
                pizzaIncluir.Ingredientes = new List<Ingrediente>();
                pizzaIncluir.AcrescentarIngrediente(new Ingrediente());
                pizzaIncluir.AcrescentarIngrediente(new Ingrediente());
                pizzaIncluir.AcrescentarIngrediente(new Ingrediente());
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
    }
}