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
        protected void Page_Load(object sender, EventArgs e)
        {
            WindsorContainer container = FabricaContainer.InicializarContainer();
            var pizzaServico = container.Resolve<IPizzaServico>();

            if (Request.QueryString["senha"] != null &&
                Request.QueryString["senha"] == "eu sei o que estou fazendo")
            {
                CriarBancoDeDados(container);
                InserirDadosParaTeste(pizzaServico);
            }
            else
            {
                litMensagem.Text = "senha incorreta!";
            }
        }

        private void CriarBancoDeDados(WindsorContainer container)
        {
            var nhCastle = new NhCastle();
            nhCastle.AutoCriarBancoDeDados(container.Resolve<ISession>());
            litMensagem.Text = "banco de dados recriado com sucesso";
        }

        private static void InserirDadosParaTeste(IPizzaServico pizzaServico)
        {
            var pizza = new Pizza {Nome = "Portuguesa"};
            
            var cebola = new Ingrediente {Nome = "Cebola"};
            var muçarela = new Ingrediente { Nome = "Muçarela" };
            var molhoDeTomate = new Ingrediente { Nome = "Molho de Tomate" };

            pizza.AcrescentarIngrediente(molhoDeTomate);
            pizza.AcrescentarIngrediente(cebola);
            pizza.AcrescentarIngrediente(new Ingrediente { Nome = "Ovo" });
            pizzaServico.Save(pizza);

            pizza = new Pizza { Nome = "Calabresa" };
            pizza.AcrescentarIngrediente(molhoDeTomate);
            pizza.AcrescentarIngrediente(cebola);
            pizza.AcrescentarIngrediente(new Ingrediente { Nome = "Calabresa" });
            pizzaServico.Save(pizza);

            pizza = new Pizza { Nome = "Muçarela" };
            pizza.AcrescentarIngrediente(molhoDeTomate);
            pizza.AcrescentarIngrediente(muçarela);
            pizzaServico.Save(pizza);
        }
    }
}