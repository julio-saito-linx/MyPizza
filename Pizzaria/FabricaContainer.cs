using Castle.Core;
using Castle.Facilities.FactorySupport;
using Castle.MicroKernel.Registration;
using Castle.Windsor;
using NHibernate;
using Pizzaria.Dominio.Repositorios;
using Pizzaria.Dominio.Servicos;
using Pizzaria.NHibernate.Helpers;
using Pizzaria.NHibernate.Repositorios;

namespace Pizzaria
{
    public static class FabricaContainer
    {
        public static WindsorContainer InicializarContainer()
        {
            return (WindsorContainer)Ioc.Container;
        }

        public static void Registrar(IWindsorContainer container)
        {
            // REGISTRA O FLUENT NHIBERNATE
            container.AddFacility<FactorySupportFacility>();
            container.Register(Component.For<ISessionFactory>().LifeStyle.Singleton.UsingFactoryMethod(NhCastle.InitSessionFactory));

            // REGISTRA TODOS OS COMPONENTES COMO PERWEBREQUEST
            container.Kernel.ComponentModelCreated += Kernel_ComponentModelCreated_PerWebRequest;
            container.Register(Component.For<ISession>().LifeStyle.PerWebRequest.UsingFactoryMethod(kernel => kernel.Resolve<ISessionFactory>().OpenSession()));
            container.Register(Component.For<IStatelessSession>().LifeStyle.PerWebRequest.UsingFactoryMethod(kernel => kernel.Resolve<ISessionFactory>().OpenStatelessSession()));

            container.Register(Component.For<IPizzaServico>().ImplementedBy<PizzaServico>());
            container.Register(Component.For<IIngredienteServico>().ImplementedBy<IngredienteServico>());
            container.Register(Component.For<IPizzaDAO>().ImplementedBy<PizzaDAO>());
            container.Register(Component.For<IIngredienteDAO>().ImplementedBy<IngredienteDAO>());
            container.Register(Component.For<IPeriodoDAO>().ImplementedBy<PeriodoDAO>());
            container.Register(Component.For<IPeriodoServico>().ImplementedBy<PeriodoServico>());
        }

        public static void Kernel_ComponentModelCreated_PerWebRequest(ComponentModel model)
        {
            if (model.LifestyleType == LifestyleType.Undefined)
            {
                model.LifestyleType = LifestyleType.PerWebRequest;
            }
        }

    }
}