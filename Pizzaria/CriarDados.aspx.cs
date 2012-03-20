using System;
using System.Web.UI;
using Pizzaria.NHibernate.Helpers;

namespace Pizzaria
{
    public partial class CriarDados : Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
        }

        protected void btCriarDB_Click(object sender, EventArgs e)
        {
            var dbc = new BancoDadosCreator();
            dbc.AutoCriarBancoDeDados();
        }
    }
}