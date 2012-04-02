## Knockout controller helper + Asp.Net Web.API
### 1. dependências externas
  * jquery      : http://jquery.com/
  * json2.js    : https://github.com/douglascrockford/JSON-js
  * noty        : http://needim.github.com/noty/
  * underscore  : http://documentcloud.github.com/underscore
  * knockout.js : http://knockoutjs.com/

### 2. bibliotecas
#### helpers.js
Classes
  * primeiroMaiusculo
  * exibirNoty


#### ajaxConfig.js
  * METHOD.(LIST|SHOW|PUT|POST|DELETE)
  * ajaxConfig
    * helper para facilitar chamadas REST ao Asp.Net Web.API
  * tratarErrorCSharp
    * classe para tratar os erros mais comuns do C#, retornados via JSON.

#### ControllerKnockout.js
Cria automaticamente um view model padrão:
  * lista
  * selecionar
  * id
  * selecionado
  * foiAlterado
  * excluir
  * novo
  * adicionarCancelar
  * salvar
  * atualizando
  * removerCancelar

Exemplo:

```
    // Controller ingredienteVm
    configControllerKnockout.viewMoldel = self.ingredienteVm = { };
    configControllerKnockout.nomeController = "ingrediente";
    configControllerKnockout.dadosDto = ingredientesDto;
    configControllerKnockout.ClasseViewModel = IngredienteVM;
    configControllerKnockout.configuradorAjax = configuradorAjax;
    new ControllerKnockout(configControllerKnockout);
```
#### LocalViewModels.js
Entidades com as propriedades de mesmo nome e tipo do servidor.
  * propriedades são observáveis


## 5 passos para configurar um projeto Asp.Net Web Application com FluentNhibernate e Castle Windsor

### 1. referenciar as DLLs
Primeiro precisamos referenciar corretamente. 
Essa parte é muito chata. Não se pode baixar a última versão do NHibernate. 
Baixe o **FluentNHibernate** com suas dependências para *amenizar o sofrimento*.

* Castle.Windsor                 2.5.3
* FluentNHibernate               1.2.0.712
* Iesi.Collections               3.1.0.4000
* NHibernate                     3.1.0.4000
* NHibernate.Castle              3.1.0.4000
	
	
### 2. Repositório: FluentNHibernate Mapping
O mapeamento utilizado no exemplo é o *manual*.
Dica: O Automapping é bom pra criar o banco pela primeira vez. 
A longo prazo deixar o banco só baseado em convenções é bem
complicado. Recomendo mudar para o mapeamento manual.

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


### 3. Visualização/Aplicação: Castle Windsor Component Register

##### NHibernate + Windsor #####
Coloque o registro dos componentes Castle Windsor numa fábrica na própria 
visualização.
Observe que o Mapeamento NHibernate, a parte mais pesada, fica como **Singleton**.
`container.Register(Component.For<ISessionFactory>().LifeStyle.Singleton.UsingFactoryMethod(NhCastle.InitSessionFactory));`

##### PerWebRequest #####
Estamos registrando o NHibernate para que tenha apenas **uma sessão por request**.
Isso é muito importante, pois senão o NHibernate sempre vai voltar o mesmo objeto da memória.


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


### 4. Visualização/Aplicação: `Global.asax`
Não queremos que o container seja carregado a todo momento e sim apenas uma 
única vez. Por isso temos que instanciar no **Global.asax.cs**.
Primeiro fazemos o *Global.asax.cs* implementar a interface *IContainerAccessor*.
Observe no exemplo anterior como o container é chamado pelo **WindsorContainer InicializarContainer()**

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

### 5. Visualização/Aplicação: Colocar a aplicação no IIS 7 e no Web.Config
Para utilizar o **PerWebRequestLifestyleModule** é necessário colocar 
o código abaixo no **web.config**.

```
  <system.webServer>
    <modules runAllManagedModulesForAllRequests="true" >
      <add name="PerRequestLifestyle" type="Castle.MicroKernel.Lifestyle.PerWebRequestLifestyleModule, Castle.Windsor" />
    </modules>
  </system.webServer>
```

