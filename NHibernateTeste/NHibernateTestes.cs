using NUnit.Framework;
using Pizzaria.Dominio.Entidades;
using Pizzaria.NHibernate.Helpers;

namespace NHibernateTeste
{
    [TestFixture]
    public class NhibernateTeste
    {
        [Test] 
        public void inserirPizza()
        {
            var provider = new SessionFactoryProvider();
            var sessionProvider = new SessionProvider(provider);
            var sessaoAtual = sessionProvider.GetCurrentSession();

            var pizza = new Pizza {Nome = "Muçarela"};
            sessaoAtual.Save(pizza);

            var ingrediente1 = new Ingrediente {Nome = "Queijo"};
            var ingrediente2 = new Ingrediente {Nome = "Oregano"};
            var ingrediente3 = new Ingrediente {Nome = "Tomate"};

            pizza.AcrescentarIngrediente(ingrediente1);
            pizza.AcrescentarIngrediente(ingrediente2);
            pizza.AcrescentarIngrediente(ingrediente3);

            sessaoAtual.Save(ingrediente1);
            sessaoAtual.Save(ingrediente2);
            sessaoAtual.Save(ingrediente3);
            sessaoAtual.Clear();

            Assert.AreEqual("Muçarela", sessaoAtual.Get<Pizza>(pizza.Id).Nome);

            Assert.AreEqual(3, sessaoAtual.Get<Pizza>(pizza.Id).Ingredientes.Count);
        }
    }
}