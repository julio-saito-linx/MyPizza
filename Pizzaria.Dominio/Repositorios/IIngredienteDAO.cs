using System.Collections.Generic;
using Pizzaria.Dominio.Entidades;

namespace Pizzaria.Dominio.Repositorios
{
    public interface IIngredienteDAO : IRepositorio<Ingrediente>
    {
        IList<Ingrediente> PesquisarApimentados();
    }
}
