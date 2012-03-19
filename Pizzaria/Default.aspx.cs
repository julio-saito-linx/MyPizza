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

namespace Pizzaria
{
    public partial class _Default : System.Web.UI.Page
    {
        private static WindsorContainer _container;

        protected void Page_Load(object sender, EventArgs e)
        {
            InicializarContainer();

            if (Request.QueryString["new"] != null)
            {
                Response.Write(InsertNewPizza());
                Response.End();
            }

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

        private string InsertNewPizza()
        {
            var provider = new SessionFactoryProvider();
            var sessionProvider = new SessionProvider(provider);
            var sessaoAtual = sessionProvider.GetCurrentSession();
            var pizzaServico = _container.Resolve<IPizzaServico>();

            int id = Convert.ToInt32(Request.Form["Id"] ?? "0");
            string nome = Request.Form["Nome"];
            string[] ingredientes = {
                                        Request.Form["I1"], 
                                        Request.Form["I2"],
                                        Request.Form["I3"]
                                    };

            Pizza pizza;
            string response;
            if (id == 0)
            {
                pizza = new Pizza {Nome = nome};

                sessaoAtual.Save(pizza);

                Ingrediente ingrediente1 = new Ingrediente { Nome = ingredientes[0] };
                Ingrediente ingrediente2 = new Ingrediente { Nome = ingredientes[1] };
                Ingrediente ingrediente3 = new Ingrediente { Nome = ingredientes[2] };

                pizza.AcrescentarIngrediente(ingrediente1);
                pizza.AcrescentarIngrediente(ingrediente2);
                pizza.AcrescentarIngrediente(ingrediente3);

                sessaoAtual.Save(ingrediente1);
                sessaoAtual.Save(ingrediente2);
                sessaoAtual.Save(ingrediente3);

                response = "Pizza inserida com sucesso! Codigo {0}";
            }
            else
            {
                pizza = pizzaServico.PesquisarID(id);
                
                pizza.Nome = nome;

                pizza.Ingredientes[0].Nome = ingredientes[0];
                pizza.Ingredientes[1].Nome = ingredientes[1];
                pizza.Ingredientes[2].Nome = ingredientes[2];

                pizzaServico.Save(pizza);

                response = "Pizza atualizada com sucesso! Codigo {0}";
            }
            sessaoAtual.Clear();

            return String.Format(response, pizza.Id);
        }
    }
}
