using System;
using Castle.MicroKernel.Registration;
using Castle.Windsor;
using Pizzaria.Dominio.Entidades;
using Pizzaria.Dominio.Repositorios;
using Pizzaria.Dominio.Servicos;
using Pizzaria.NHibernate.Helpers;
using Pizzaria.NHibernate.Repositorios;

namespace Pizzaria
{
    public class Global : System.Web.HttpApplication
    {

        void Application_Start(object sender, EventArgs e)
        {
            // Code that runs on application startup
            
        }

        void Application_End(object sender, EventArgs e)
        {
            //  Code that runs on application shutdown

        }

        void Application_Error(object sender, EventArgs e)
        {
            InicializarContainer();
            // Code that runs when an unhandled error occurs
            var erro = new Erro();

            Exception ex = Server.GetLastError();

            erro.Codigo = 0;
            erro.Mensagem = ex.Message;

            var erroServico = _container.Resolve<IErroServico>();
            erroServico.Save(erro);
        }

        void Session_Start(object sender, EventArgs e)
        {
            // Code that runs when a new session is started
            
        }

        void Session_End(object sender, EventArgs e)
        {
            // Code that runs when a session ends. 
            // Note: The Session_End event is raised only when the sessionstate mode
            // is set to InProc in the Web.config file. If session mode is set to StateServer 
            // or SQLServer, the event is not raised.

        }

        private WindsorContainer _container;
        private WindsorContainer InicializarContainer()
        {
            if (_container == null)
            {
                _container = new WindsorContainer();

                var sessionFactoryProvider = new SessionFactoryProvider();
                _container.Register(
                    Component.For<SessionProvider>().LifeStyle.Singleton.Instance(
                        new SessionProvider(sessionFactoryProvider)));
                
                _container.Register(Component.For<IErroServico>().ImplementedBy<ErroServico>());
                _container.Register(Component.For<IErroDAO>().ImplementedBy<ErroDAO>());
                _container.Register(Component.For<IPizzaServico>().ImplementedBy<PizzaServico>());
                _container.Register(Component.For<IIngredienteServico>().ImplementedBy<IngredienteServico>());
                _container.Register(Component.For<IPizzaDAO>().ImplementedBy<PizzaDAO>());
                _container.Register(Component.For<IIngredienteDAO>().ImplementedBy<IngredienteDAO>());
            
            }
            return _container;
        }

        public WindsorContainer Container
        {
            get
            {
                InicializarContainer();
                return _container; 
            }
        }
    }
}
