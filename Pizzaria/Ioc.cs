using System.Web;
using Castle.Windsor;

namespace Pizzaria
{
    public static class Ioc
    {
        public static IWindsorContainer Container
        {
            get
            {
                var containerAccessor = HttpContext.Current.ApplicationInstance as IContainerAccessor;
                return containerAccessor.Container;
            }
        }
    }
}