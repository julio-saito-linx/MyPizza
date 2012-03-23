using System;
using System.Web;
using System.Web.Http;
using System.Web.Routing;
using Castle.Windsor;

namespace Pizzaria
{
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

        private void Application_Start(object sender, EventArgs e)
        {
            RouteTable.Routes.MapHttpRoute(
                name: "ValuesController1",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
        }

        private void Application_End(object sender, EventArgs e)
        {
            //  Code that runs on application shutdown
        }

        private void Application_Error(object sender, EventArgs e)
        {
            // Code that runs when an unhandled error occurs
        }

        private void Session_Start(object sender, EventArgs e)
        {
            // Code that runs when a new session is started
        }

        private void Session_End(object sender, EventArgs e)
        {
            // Code that runs when a session ends. 
            // Note: The Session_End event is raised only when the sessionstate mode
            // is set to InProc in the Web.config file. If session mode is set to StateServer 
            // or SQLServer, the event is not raised.
        }

    }
}