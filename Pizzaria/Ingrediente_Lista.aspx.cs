using System;
using System.Collections.Generic;
using System.Web.UI;
using Castle.Windsor;
using Pizzaria.Dominio.Entidades;
using Pizzaria.Dominio.Repositorios;

namespace Pizzaria
{
    public partial class Ingrediente_Lista : Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            WindsorContainer container = FabricaContainer.InicializarContainer();
            var ingredienteServico = container.Resolve<IIngredienteServico>();
            IList<Ingrediente> ingredientes = ingredienteServico.PesquisarTodos();
            GridViewIngredientes.DataSource = ingredientes;
            GridViewIngredientes.DataBind();
        }
    }
}