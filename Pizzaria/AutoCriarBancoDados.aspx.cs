using System;
using System.Web.UI;
using Castle.Windsor;
using NHibernate;
using Pizzaria.Dominio.Entidades;
using Pizzaria.Dominio.Repositorios;
using Pizzaria.NHibernate.Helpers;

namespace Pizzaria
{
    public partial class AutoCriarBancoDados : Page
    {
        private IPizzaServico _pizzaServico;
        private IIngredienteServico _ingredienteServico;

        protected void Page_Load(object sender, EventArgs e)
        {
            WindsorContainer container = FabricaContainer.InicializarContainer();
            _pizzaServico = container.Resolve<IPizzaServico>();
            _ingredienteServico = container.Resolve<IIngredienteServico>();

            var autenticado = false;

            if (Request.QueryString["senha"] != null && Request.QueryString["senha"] == "eu sei o que estou fazendo")
            {
                autenticado = true;
            }
            if (Request["txtSenha"] == "eu sei o que estou fazendo")
            {
                autenticado = true;
            }

            if(!autenticado)
            {
                litMensagem.Text = "senha incorreta!";
            }
            else
            {
                CriarBancoDeDados(container);
                InserirDadosParaTeste(_pizzaServico);
            }
        }

        private void CriarBancoDeDados(WindsorContainer container)
        {
            var nhCastle = new NhCastle();
            nhCastle.AutoCriarBancoDeDados(container.Resolve<ISession>());
            litMensagem.Text = "banco de dados recriado com sucesso";
        }

        private void InserirDadosParaTeste(IPizzaServico pizzaServico)
        {
            // Insere cada um dos ingredientes
            var cebola = new Ingrediente { Nome = "Cebola" };
            _ingredienteServico.Save(cebola);

            var muçarela = new Ingrediente { Nome = "Muçarela" };
            _ingredienteServico.Save(muçarela);

            var molhoDeTomate = new Ingrediente { Nome = "Molho de Tomate" };
            _ingredienteServico.Save(molhoDeTomate);

            var ovo = new Ingrediente { Nome = "Ovo" };
            _ingredienteServico.Save(ovo);

            var calabreza = new Ingrediente { Nome = "Calabresa" };
            _ingredienteServico.Save(calabreza);


            var pizza = new Pizza { Nome = "Portuguesa" };

            pizza.AcrescentarIngrediente(molhoDeTomate);
            pizza.AcrescentarIngrediente(cebola);
            pizza.AcrescentarIngrediente(ovo);
            pizzaServico.Save(pizza);

            pizza = new Pizza { Nome = "Calabresa" };
            pizza.AcrescentarIngrediente(molhoDeTomate);
            pizza.AcrescentarIngrediente(cebola);
            pizza.AcrescentarIngrediente(calabreza);
            pizzaServico.Save(pizza);

            pizza = new Pizza { Nome = "Muçarela" };
            pizza.AcrescentarIngrediente(molhoDeTomate);
            pizza.AcrescentarIngrediente(muçarela);
            pizzaServico.Save(pizza);

            pizza = new Pizza { Nome = "Pizza de vento" };
            pizzaServico.Save(pizza);
        }
    }
}