using System;
using System.Collections.Generic;
using System.Linq;
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

            GetPeriodo();
        }

        private void GetPeriodo()
        {
            IPeriodoServico periodoServico = _container.Resolve<IPeriodoServico>();
            ddlPeriodo.DataSource = periodoServico.PesquisarTodos();
            ddlPeriodo.DataBind();
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
            IPizzaServico pizzaServico = _container.Resolve<IPizzaServico>();

            int id = Convert.ToInt32(Request.Form["Id"].ToString() ?? "0");
            string nome = Request.Form["Nome"].ToString();
            string[] ingredientes = {
                                        Request.Form["I1"].ToString(), 
                                        Request.Form["I2"].ToString(),
                                        Request.Form["I3"].ToString()
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
                //sessaoAtual.Save(pizza);
                //sessaoAtual.Save(pizza.Ingredientes[0]);
                //sessaoAtual.Save(pizza.Ingredientes[1]);
                //sessaoAtual.Save(pizza.Ingredientes[2]);

                response = "Pizza atualizada com sucesso! Codigo {0}";
            }
            sessaoAtual.Clear();

            return String.Format(response, pizza.Id);
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
        public static Pizza PizzaById(int id)
        {
            var provider = new SessionFactoryProvider();
            var sessionProvider = new SessionProvider(provider);
            var sessaoAtual = sessionProvider.GetCurrentSession();

            Pizza pizza = sessaoAtual.QueryOver<Pizza>()
                .Where(p => p.Id == id).List<Pizza>()[0];

            return pizza;
        }
        
        [System.Web.Services.WebMethod]
        public static IList<Ingrediente> Ingredientes(int id)
        {
            var provider = new SessionFactoryProvider();
            var sessionProvider = new SessionProvider(provider);
            var sessaoAtual = sessionProvider.GetCurrentSession();

            IList<Ingrediente> ingredientes = sessaoAtual.QueryOver<Ingrediente>()
                .Where(i => i.Pizza.Id == id)
                .List<Ingrediente>();

            var pizza = PizzaById(id);

            ingredientes = pizza.Ingredientes;

            return ingredientes;
        }

        [System.Web.Services.WebMethod]
        public static IList<Pizza> Pizzas(string nome)
        {
            var provider = new SessionFactoryProvider();
            var sessionProvider = new SessionProvider(provider);
            var sessaoAtual = sessionProvider.GetCurrentSession();

            IList<Pizza> pizzas = sessaoAtual.QueryOver<Pizza>()
                .Where(Restrictions.On<Pizza>(p => p.Nome).IsLike(nome, MatchMode.Start))
                .OrderBy(p => p.Id).Asc()
                .List<Pizza>();

            return pizzas;
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
