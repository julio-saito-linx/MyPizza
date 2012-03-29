using System.Collections.Generic;
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
            pizzaAlterar.Ingredientes.Clear();
            pizzaAlterar.Nome = pizzaDto.Nome;
            _pizzaServico.Save(pizzaAlterar);

            // pesquisa cada um dos ingredientes no banco
            // insere na lista
            // e salva de novo...
            if (pizzaDto.Ingredientes != null)
            {
                foreach (var ingredienteDto in pizzaDto.Ingredientes)
                {
                    var ingrediente = _ingredienteServico.PesquisarID(ingredienteDto.Id);
                    pizzaAlterar.AcrescentarIngrediente(ingrediente);
                }
            }

            _pizzaServico.Save(pizzaAlterar);

            return "Pizza [" + pizzaAlterar.Id + "] salva com sucesso!";
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