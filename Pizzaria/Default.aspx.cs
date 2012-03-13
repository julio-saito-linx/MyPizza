using System;
using System.Collections.Generic;
using Castle.MicroKernel.Registration;
using Castle.Windsor;
using Pizzaria.Dominio.Entidades;
using Pizzaria.Dominio.Repositorios;
using Pizzaria.Dominio.Servicos;
using Pizzaria.NHibernate.Helpers;
using Pizzaria.NHibernate.Repositorios;

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
                int p = InsertNewPizza();

                Response.Write(String.Format("Pizza inserida com sucesso! Codigo {0}", p.ToString()));
                Response.End();
            }

            if (Request.QueryString["sel"] != null)
            {
                int p = SelectAllPizza();

                Response.Write(String.Format("Foram encontradas {0} pizzas!", p.ToString()));
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
            }
            return _container;
        }

        private int SelectAllPizza()
        {
            IPizzaServico pizzaServico = _container.Resolve<IPizzaServico>();
            return pizzaServico.PesquisarTodos().Count;
        }
        
        private int InsertNewPizza2()
        {
            var pizzaServico = _container.Resolve<IPizzaServico>();
            
            string nome = Request.Form["Nome"].ToString();

            var pizza = new Pizza { Nome = nome };
            pizzaServico.Save(pizza);

            return pizza.Id;
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

                var ingrediente1 = new Ingrediente { Nome = Request.Form["I1"].ToString() };
                var ingrediente2 = new Ingrediente { Nome = Request.Form["I2"].ToString() };
                var ingrediente3 = new Ingrediente { Nome = Request.Form["I3"].ToString() };

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
    }
}
