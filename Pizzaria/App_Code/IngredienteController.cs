using System.Collections.Generic;
using System.Web.Http;
using AutoMapper;
using Castle.Windsor;
using Pizzaria.DTOs;
using Pizzaria.Dominio.Entidades;
using Pizzaria.Dominio.Repositorios;

namespace Pizzaria
{
    public class IngredienteController : ApiController
    {
        private readonly WindsorContainer _container;
        private readonly IIngredienteServico _IngredienteServico;

        public IngredienteController()
        {
            CriarMapeamentosDto();
            _container = FabricaContainer.InicializarContainer();
            _IngredienteServico = _container.Resolve<IIngredienteServico>();
        }

        private static void CriarMapeamentosDto()
        {
            Mapper.CreateMap<Ingrediente, IngredienteDto>();
            Mapper.CreateMap<Ingrediente, IngredienteDto>();
        }


        // GET /api/<controller>
        public IList<IngredienteDto> Get()
        {
            var Ingredientes = _IngredienteServico.PesquisarTodos();

            IList<IngredienteDto> IngredienteDtos = Mapper.Map<IList<Ingrediente>, IList<IngredienteDto>>(Ingredientes);

            return IngredienteDtos;
        }

        // GET /api/<controller>/5
        public IngredienteDto Get(int id)
        {
            var Ingrediente = _IngredienteServico.PesquisarID(id);

            var IngredienteDto = Mapper.Map<Ingrediente, IngredienteDto>(Ingrediente);

            return IngredienteDto;
        }

        // POST /api/<controller>
        public int Post(IngredienteDto IngredienteDto)
        {
            var IngredienteIncluir = new Ingrediente();
            IngredienteIncluir.Nome = IngredienteDto.Nome;
            _IngredienteServico.Save(IngredienteIncluir);
            return IngredienteIncluir.Id;

        }

        // PUT /api/<controller>/5
        public string Put(int id, IngredienteDto IngredienteDto)
        {
            var ingredienteAlterar = _IngredienteServico.PesquisarID(id);
            ingredienteAlterar.Nome = IngredienteDto.Nome;
            _IngredienteServico.Save(ingredienteAlterar);
            return "Ingrediente [" + ingredienteAlterar.Id + "] alterado com sucesso!";
        }

        // DELETE /api/<controller>/5
        public string Delete(int id)
        {
            _IngredienteServico.Delete(id);
            return "Ingrediente [" + id + "] apagado com sucesso!";
        }
    }
}