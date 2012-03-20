using Castle.MicroKernel.Registration;
using Castle.Windsor;
using Pizzaria.Dominio.Repositorios;
using Pizzaria.Dominio.Servicos;
using Pizzaria.NHibernate.Helpers;
using Pizzaria.NHibernate.Repositorios;

namespace Pizzaria
{
    public class FabricaContainer
    {
        private static WindsorContainer _container;

        public FabricaContainer()
        {
            var _container = new WindsorContainer();
        }

        public static WindsorContainer InicializarContainer()
        {
            if (_container == null)
            {
                _container = new WindsorContainer();

                var sessionFactoryProvider = new SessionFactoryProvider();
                _container.Register(Component.For<SessionProvider>().LifeStyle.PerWebRequest.Instance(new SessionProvider(sessionFactoryProvider)));

                _container.Register(Component.For<IPizzaServico>().ImplementedBy<PizzaServico>());
                _container.Register(Component.For<IIngredienteServico>().ImplementedBy<IngredienteServico>());
                _container.Register(Component.For<IPizzaDAO>().ImplementedBy<PizzaDAO>());
                _container.Register(Component.For<IIngredienteDAO>().ImplementedBy<IngredienteDAO>());
                _container.Register(Component.For<IPeriodoDAO>().ImplementedBy<PeriodoDAO>());
                _container.Register(Component.For<IPeriodoServico>().ImplementedBy<PeriodoServico>());
            }
            return _container;
        }
    }
}