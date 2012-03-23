using System.Collections.Generic;
using Pizzaria.Dominio.Entidades;

namespace Pizzaria.Dominio.Repositorios
{
    public interface IPizzaDAO : IRepositorio<Pizza>
    {
        IList<Pizza> PesquisarPorNome(string nome);
    }
}