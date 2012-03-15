using System;
using Pizzaria.NHibernate.Helpers;

namespace Pizzaria
{
    public partial class CriarDados : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        protected void btCriarDB_Click(object sender, EventArgs e)
        {
            BancoDadosCreator dbc = new BancoDadosCreator();
            dbc.AutoCriarBancoDeDados();
        }
    }
}