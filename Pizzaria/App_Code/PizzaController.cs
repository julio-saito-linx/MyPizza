using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using AutoMapper;
using Castle.Windsor;
using Pizzaria.DTOs;
using Pizzaria.Dominio.Entidades;
using Pizzaria.Dominio.Repositorios;

namespace Pizzaria
{
    public class PizzaController : ApiController
    {
        private readonly WindsorContainer _container;
        private readonly IPizzaServico _pizzaServico;
        private readonly IIngredienteServico _ingredienteServico;

        public PizzaController()
        {
            CriarMapeamentosDto();
            _container = FabricaContainer.InicializarContainer();
            _ingredienteServico = _container.Resolve<IIngredienteServico>();
            _pizzaServico = _container.Resolve<IPizzaServico>();
        }
        private static void CriarMapeamentosDto()
        {
            Mapper.CreateMap<Pizza, PizzaDto>();
            Mapper.CreateMap<Ingrediente, IngredienteDto>();
        }


        // GET /api/pizza
        public IList<PizzaDto> Get()
        {
            var pizzas = _pizzaServico.PesquisarTodos();

            IList<PizzaDto> pizzaDtos = Mapper.Map<IList<Pizza>, IList<PizzaDto>>(pizzas);

            return pizzaDtos;
        }

        // GET /api/pizza/5
        public PizzaDto Get(int id)
        {
            var pizza = _pizzaServico.PesquisarID(id);

            var pizzaDto = Mapper.Map<Pizza, PizzaDto>(pizza);

            return pizzaDto;
        }

        // POST /api/pizza
        public string Post(PizzaDto pizzaDto)
        {
            var pizzaIncluir = new Pizza();
            pizzaIncluir.Nome = pizzaDto.Nome;
            pizzaIncluir.Ingredientes = new List<Ingrediente>();
            _pizzaServico.Save(pizzaIncluir);

            if (pizzaDto.Ingredientes != null)
            {
                foreach (var ingredienteDto in pizzaDto.Ingredientes)
                {
                    var ingrediente = _ingredienteServico.PesquisarID(ingredienteDto.Id);
                    pizzaIncluir.AcrescentarIngrediente(ingrediente);
                }
            }

            _pizzaServico.Save(pizzaIncluir);
            return "Pizza [" + pizzaIncluir.Id + "] incluída com sucesso!";
        }

        // PUT /api/pizza/5
        public string Put(int id, PizzaDto pizzaDto)
        {
            // pesquisa a pizza no banco de dados
            // limpa seus filhos
            // e salva...
            var pizzaAlterar = _pizzaServico.PesquisarID(id);
            pizzaAlterar.Nome = pizzaDto.Nome;

            var ingredientesJaExistiam = pizzaAlterar.Ingredientes;
            var ingredienteChegando = pizzaDto.Ingredientes;

            AlterarListaManyToMany(ingredienteChegando, ingredientesJaExistiam);

            _pizzaServico.Save(pizzaAlterar);

            return "Pizza [" + pizzaAlterar.Id + "] salva com sucesso!";
        }

        private void AlterarListaManyToMany(IList<IngredienteDto> ingredienteChegando, IList<Ingrediente> ingredientesJaExistiam)
        {
            if (ingredienteChegando != null)
            {
                // incluir itens novos
                foreach (var ingChegando in ingredienteChegando)
                {
                    // o item é novo
                    if (!ingredientesJaExistiam.Any(x => x.Id == ingChegando.Id))
                    {
                        // temos que adicionar o novo
                        var ingDoBanco = _ingredienteServico.PesquisarID(ingChegando.Id);
                        ingredientesJaExistiam.Add(ingDoBanco);
                    }
                }
                // excluir os que foram retirados
                for (int i = ingredientesJaExistiam.Count - 1; i >= 0; i--)
                {
                    var ingJaExistia = ingredientesJaExistiam[i];
                    // o item foi removido
                    if (!ingredienteChegando.Any(x => x.Id == ingJaExistia.Id))
                    {
                        // retira da lista do banco
                        ingredientesJaExistiam.RemoveAt(i);
                    }
                }
            }
            else
            {
                // a nova lista não possuia nenhum item
                ingredientesJaExistiam.Clear();
            }
        }

        // DELETE /api/pizza/5
        public string Delete(int id)
        {
            var pizzaExcluir = _pizzaServico.PesquisarID(id);
            pizzaExcluir.Ingredientes.Clear();
            _pizzaServico.Save(pizzaExcluir);

            _pizzaServico.Delete(id);
            return "Pizza [" + id + "] apagada com sucesso!";
        }
    }
}