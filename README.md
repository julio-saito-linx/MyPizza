Como configurar o NHibernate, FluentNhibernate e Castle para funcionar com o Asp.Net WebForms?

Simples. Não, não é. É um saco.

Seguem os passos:

Fluent NHibernate Mapping
```
    public static class NhCastle
    {
        public static ISessionFactory InitSessionFactory()
        {
            FluentConfiguration cfg = Fluently.Configure()
                .Mappings
                (m => m.FluentMappings.AddFromAssemblyOf<PizzaMap>())
                .Database(MsSqlConfiguration.MsSql2008.ShowSql()
                              .IsolationLevel("ReadCommitted")
                              .ConnectionString(c => c.FromConnectionStringWithKey("ConnectionString")).ShowSql()
                );
            return cfg.BuildSessionFactory();
        }
    }
```

Castle Windsor Component Register
```
    public static class FabricaContainer
    {
        public static WindsorContainer InicializarContainer()
        {
            var containerAccessor = HttpContext.Current.ApplicationInstance as IContainerAccessor;
            return (WindsorContainer)containerAccessor.Container;
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
```


Global.asax
```
    public class Global : HttpApplication, IContainerAccessor
    {
        private static IWindsorContainer _container;
        public IWindsorContainer Container
        {
            get { return _container; }
            set { _container = value; }
        }

        public override void Init()
        {
            base.Init();
            InitializeIoC();
        }

        private void InitializeIoC()
        {
            if (_container == null)
            {
                _container = new WindsorContainer();
                FabricaContainer.Registrar(_container);
            }
        }
```

Colocar a plicação no IIS 7 e no Web.Config
```
  <system.webServer>
    <modules runAllManagedModulesForAllRequests="true" >
      <add name="PerRequestLifestyle" type="Castle.MicroKernel.Lifestyle.PerWebRequestLifestyleModule, Castle.Windsor" />
    </modules>
  </system.webServer>
```
