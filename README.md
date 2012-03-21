## Como configurar o NHibernate, FluentNhibernate e Castle para funcionar com o Asp.Net WebForms?
### Simples. Não, não é. É um saco.

Seguem os passos:

### referenciar as DLLs
Primeiro você precisa das referencias corretas. Essa parte é muito dificil. 
Não se pode baixar a última versão do NHibernate. Baixe o Fluent com suas dependências.

* Castle.Windsor                 2.5.3
* FluentNHibernate               1.2.0.712
* Iesi.Collections               3.1.0.4000
* NHibernate                     3.1.0.4000
* NHibernate.Castle              3.1.0.4000
	
	
### Repositório: FluentNHibernate Mapping
O mapeamento utilizado no exemplo é o manual.
Para começar é mais dificil, porém a longo prazo vai te salvar.
O Automapping é bom pra criar o banco pela primeira vez.
Manter o Automapping, porém, é algo complicado.

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


### Visualização/Aplicação: Castle Windsor Component Register
Coloque o registro dos componentes Castle Windsor numa fábrica na própria visualização.
Observe que o Mapeamento NHibernate, a parte mais pesada, fica como `Singleton`.
Observe que estamos registrando o NHibernate com apenas uma sessão por request.
Isso é muito importante, pois sanão o NHibernate sempre vai voltar o mesmo objeto na memória.

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


### Visualização/Aplicação: `Global.asax`
Não queremos que o container seja carregado a todo momento e sim apenas uma única vez.
Para isso temos que colocá-lo no `Global.asax` que é o único lugar webforms que isso é possível.
Primeiro fazemos o `Global.asax.cs` implementar a interface `IContainerAccessor`.
Observe no exemplo anterior como o container é chamado no `WindsorContainer InicializarContainer()`

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

### Visualização/Aplicação: Colocar a aplicação no IIS 7 e no Web.Config

```
  <system.webServer>
    <modules runAllManagedModulesForAllRequests="true" >
      <add name="PerRequestLifestyle" type="Castle.MicroKernel.Lifestyle.PerWebRequestLifestyleModule, Castle.Windsor" />
    </modules>
  </system.webServer>
```

