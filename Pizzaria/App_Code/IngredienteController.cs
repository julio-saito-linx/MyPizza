using System.Collections.Generic;
using System.Web.Http;
using AutoMapper;
using Castle.Windsor;
using Pizzaria.AJAX.DTO;
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
        public void Post(IngredienteDto IngredienteDto)
        {
            var IngredienteIncluir = new Ingrediente();
            IngredienteIncluir.Nome = IngredienteDto.Nome;
            _IngredienteServico.Save(IngredienteIncluir);
        }

        // PUT /api/<controller>/5
        public void Put(int id, IngredienteDto IngredienteDto)
        {
            var IngredienteAlterar = _IngredienteServico.PesquisarID(id);
            _IngredienteServico.Save(IngredienteAlterar);
        }

        // DELETE /api/<controller>/5
        public void Delete(int id)
        {
            _IngredienteServico.Delete(id);
        }
    }
}