using System;
using System.Web.UI;
using Castle.Windsor;
using NHibernate;
using Pizzaria.NHibernate.Helpers;

namespace Pizzaria
{
    public partial class AutoCriarBancoDados : Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (Request.QueryString["senha"] != null &&
                Request.QueryString["senha"] == "eu sei o que estou fazendo")
            {
                WindsorContainer container = FabricaContainer.InicializarContainer();
                var nhCastle = new NhCastle();
                nhCastle.AutoCriarBancoDeDados(container.Resolve<ISession>());
                litMensagem.Text = "banco de dados recriado com sucesso";
            }
            else
            {
                litMensagem.Text = "senha incorreta!";
            }
        }
    }
}