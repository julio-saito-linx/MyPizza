using System.Collections.Generic;
using System.Web.Http;
using AutoMapper;
using Castle.Windsor;
using Pizzaria.AJAX.DTO;
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


        // GET /api/<controller>
        public IList<PizzaDto> Get()
        {
            var pizzas = _pizzaServico.PesquisarTodos();

            IList<PizzaDto> pizzaDtos = Mapper.Map<IList<Pizza>, IList<PizzaDto>>(pizzas);

            return pizzaDtos;
        }

        // GET /api/<controller>/5
        public PizzaDto Get(int id)
        {
            var pizza = _pizzaServico.PesquisarID(id);

            var pizzaDto = Mapper.Map<Pizza, PizzaDto>(pizza);

            return pizzaDto;
        }

        // POST /api/<controller>
        public void Post(PizzaDto pizzaDto)
        {
            var pizzaIncluir = new Pizza();
            pizzaIncluir.Nome = pizzaDto.Nome;
            pizzaIncluir.Ingredientes = new List<Ingrediente>();
            _pizzaServico.Save(pizzaIncluir);

            if (pizzaDto.Ingredientes != null)
            {
                foreach (var ingredienteDto in pizzaDto.Ingredientes)
                {
                    var ingrediente = new Ingrediente();
                    ingrediente.Nome = ingredienteDto.Nome;
                    pizzaIncluir.AcrescentarIngrediente(ingrediente);
                }
            }

            _pizzaServico.Save(pizzaIncluir);
        }

        // PUT /api/<controller>/5
        public void Put(int id, PizzaDto pizzaDto)
        {
            // pesquisa a pizza no banco de dados
            // limpa seus filhos
            // e salva...
            var pizzaAlterar = _pizzaServico.PesquisarID(id);
            pizzaAlterar.Ingredientes.Clear();
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
        }

        // DELETE /api/<controller>/5
        public void Delete(int id)
        {
            _pizzaServico.Delete(id);
        }
    }
}