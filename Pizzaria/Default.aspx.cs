using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Script.Serialization;
using System.Web.UI.WebControls;
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
                int p = InsertNewPizza2();

                Response.Write(String.Format("Pizza inserida com sucesso! Codigo {0}", p.ToString()));
                Response.End();
            }

            if (Request.QueryString["sel"] != null)
            {
                int p = SelectAllPizza();

                Response.Write(String.Format("Foram encontradas {0} pizzas!", p.ToString()));
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

        private int SelectAllPizza()
        {
            IPizzaServico pizzaServico = _container.Resolve<IPizzaServico>();
            return pizzaServico.PesquisarTodos().Count;
        }

        private int InsertNewPizza()
        {
            var provider = new SessionFactoryProvider();
            var sessionProvider = new SessionProvider(provider);
            var sessaoAtual = sessionProvider.GetCurrentSession();

            if (Request.Form["Nome"] != null)
            {
                string nome = Request.Form["Nome"].ToString();

                var pizza = new Pizza {Nome = nome};
                sessaoAtual.Save(pizza);

                var ingrediente1 = new Ingrediente {Nome = Request.Form["I1"].ToString()};
                var ingrediente2 = new Ingrediente {Nome = Request.Form["I2"].ToString()};
                var ingrediente3 = new Ingrediente {Nome = Request.Form["I3"].ToString()};

                pizza.AcrescentarIngrediente(ingrediente1);
                pizza.AcrescentarIngrediente(ingrediente2);
                pizza.AcrescentarIngrediente(ingrediente3);

                sessaoAtual.Save(ingrediente1);
                sessaoAtual.Save(ingrediente2);
                sessaoAtual.Save(ingrediente3);

                sessaoAtual.Clear();

                Pizza p = sessaoAtual.Get<Pizza>(pizza.Id);

                return p.Id;
            }
            else
            {
                return 0;
            }
        }

        private int InsertNewPizza2()
        {
            //var pizzaServico = _container.Resolve<IPizzaServico>();
            var global = new Global();
            var pizzaServico = global.Container.Resolve<IPizzaServico>();

            string nome = Request.Form["Nome"].ToString();
            int id = Convert.ToInt32(Request.Form["Id"].ToString()??"0");
            Pizza pizza;
            if (id == 0)
            {
                pizza = new Pizza {Nome = nome};
                pizzaServico.Save(pizza);
            }
            else
            {
                pizza = new Pizza {Id = id, Nome = nome};
                pizzaServico.Save(pizza);
            }
            return pizza.Id;
        }

        [System.Web.Services.WebMethod]
        public static Pizza Pizza(string nome) 
        {
            //IPizzaServico pizzaServico = _container.Resolve<IPizzaServico>();
            //Pizza pizza = pizzaServico.PesquisarNome(nome);

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

            //JavaScriptSerializer jss = new JavaScriptSerializer();
            //string s = jss.Serialize(pizza);
            //pizza = jss.Deserialize<Pizza>(s);

            return pizza;
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
