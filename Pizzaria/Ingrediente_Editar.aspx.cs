using System;
using System.Collections.Generic;
using System.Web.UI;
using Castle.Windsor;
using Pizzaria.Dominio.Entidades;
using Pizzaria.Dominio.Repositorios;

namespace Pizzaria
{
    public partial class Ingrediente_Editar : Page
    {
        private WindsorContainer _container;
        private IIngredienteServico _ingredienteServico;
        private int _id;

        protected void Page_Load(object sender, EventArgs e)
        {
            // DI : Castle Windsor
            _container = FabricaContainer.InicializarContainer();

            // Inicializa Serviços
            _ingredienteServico = _container.Resolve<IIngredienteServico>();

            // ID da QueryString
            var queryString = Request["Id"];
            _id = Convert.ToInt32(queryString);
            litId.Text = _id.ToString();

            // Trata POST
            if (!IsPostBack)
            {
                // Pesquisar
                var ingrediente = PesquisarIngrediente();
                txtIngrediente.Text = ingrediente.Nome;
            }
            else
            {
                var ingrediente = PesquisarIngrediente();
                // Seta novos valores
                ingrediente.Nome = txtIngrediente.Text;
                // Salva no Banco de Dados
                _ingredienteServico.Save(ingrediente);
                // Redireciona para Lista
                Response.Redirect("Ingrediente_Listar.aspx");
            }
        }

        private Ingrediente PesquisarIngrediente()
        {
            Ingrediente ingrediente;
            if (_id != 0)
            {
                ingrediente = _ingredienteServico.PesquisarID(_id);
            }
            else
            {
                ingrediente = new Ingrediente();
            }
            return ingrediente;
        }
    }
}